import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
const courses: {slug:string}[] = JSON.parse(readFileSync('src/data/courses.json','utf8'));
async function visit(page:Page,path:string){await page.goto(path,{waitUntil:'domcontentloaded'});}
const widths = [320, 375, 390, 768, 1024, 1440];
const navigation = [['Home','/'],['Courses','/courses'],['MasterClasses','/masterclasses'],['Training','/training'],['Services','/services'],['Company','/company'],['Contact','/contact'],['Enquire Now','/request-callback']];
test.beforeEach(async ({ context }) => {
  // Every valid test enquiry is mocked. No production service receives a request.
  await context.route('**/api/request-callback', route => route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:'Test service unavailable. Please try again.'})}));
});
for (const width of widths) {
  test(`website navigation at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:800}); await visit(page,'/masterclasses');
    for (const [label,path] of navigation) {
      if (width < 1280) {
        await page.getByRole('button',{name:'Open navigation menu'}).click();
        await expect(page.getByRole('button',{name:'Close navigation menu'})).toHaveAttribute('aria-expanded','true');
        const menu=page.getByRole('navigation',{name:'Mobile navigation'});
        const box=await menu.boundingBox(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x+box!.width).toBeLessThanOrEqual(width);
        await menu.getByRole('link',{name:label,exact:true}).click();
        await expect(page.getByRole('navigation',{name:'Mobile navigation'})).toHaveCount(0);
        await expect(page.getByRole('button',{name:'Open navigation menu'})).toHaveAttribute('aria-expanded','false');
      } else {
        await page.locator('header').getByRole('link',{name:label,exact:true}).filter({visible:true}).click();
      }
      await expect(page).toHaveURL(new RegExp(path==='/'?'/$':path+'$'));
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    }
    await page.getByRole('link',{name:'Tinitiate AI homepage',exact:true}).click(); await expect(page).toHaveURL(/\/$/);
  });
}
test('mobile outside, Escape, focus, keyboard, same route and browser history',async({page})=>{
  await visit(page,'/masterclasses'); const trigger=page.getByRole('button',{name:'Open navigation menu'});
  await trigger.click(); await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  await trigger.click(); await page.mouse.click(380,830); await expect(trigger).toHaveAttribute('aria-expanded','false');
  await trigger.focus(); await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Home',exact:true})).toBeFocused();
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'MasterClasses',exact:true}).click();
  await expect(trigger).toHaveAttribute('aria-expanded','false');
  await trigger.click(); await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Courses',exact:true}).click();
  await expect(page).toHaveURL(/\/courses$/); await page.getByRole('button',{name:'Open navigation menu'}).click();
  await page.goBack(); await expect(page).toHaveURL(/\/masterclasses$/); await expect(trigger).toHaveAttribute('aria-expanded','false');
  await page.goForward(); await expect(page).toHaveURL(/\/courses$/);
  await page.getByRole('button',{name:'Open navigation menu'}).click(); await page.locator('main input').first().focus();
  await expect(page.getByRole('button',{name:'Open navigation menu'})).toHaveAttribute('aria-expanded','false');
});
test('all 13 tracks have honest existing destinations and correct order',async({page})=>{
  const expected=[null,'/masterclasses/ai/langgraph/index.html','/masterclasses/ai/crewai/index.html','/masterclasses/ai/aws-bedrock/index.html','/masterclasses/ai/azure-foundry/index.html','/masterclasses/ai/claude-sdk/index.html','/masterclasses/ai/google-gemini-sdk/index.html','/masterclasses/snowflake-dataengineering/index.html','/masterclasses/aws-dataengineering/index.html','/masterclasses/azure-dataengineering/index.html','/courses/gcp-data-engineering','/masterclasses/databricks-dataengineering/index.html','/masterclasses/pyspark/index.html'];
  await visit(page,'/masterclasses');
  await expect(page.locator('[data-masterclass-track]')).toHaveCount(13);
  await expect(page.locator('main section h2')).toHaveText(['AI','Data Engineering']);
  const rows=page.locator('[data-masterclass-track]');
  await expect(rows.nth(0)).toContainText('Upcoming'); await expect(rows.nth(0).locator('a')).toHaveCount(0);
  await expect(rows.nth(10)).toContainText('Course overview');
  for(let i=1;i<13;i++){
    await visit(page,'/masterclasses'); await expect(page.locator('[data-masterclass-track]').nth(i).locator('[data-track-destination]')).toHaveAttribute('href',expected[i]!);
    await page.locator('[data-masterclass-track]').nth(i).locator('[data-track-destination]').click();
    await expect(page).toHaveURL(new RegExp(expected[i]!.replaceAll('.','\\.')+'$'));
    await expect(page.locator('h1').first()).toBeVisible();
  }
  await visit(page,'/masterclasses'); await page.getByRole('link',{name:'Strands companion'}).click(); await expect(page).toHaveURL(/\/ai\/aws-strands\/index.html$/);
});
test('all 101 course thumbnails decode, including .NET; filters and course links work',async({page})=>{
  await visit(page,'/courses'); await expect(page.locator('main a[href^="/courses/"]')).toHaveCount(101);
  const images=await page.locator('main img').evaluateAll(async nodes=>Promise.all(nodes.map(async node=>{const img=node as HTMLImageElement;img.loading='eager';try{await img.decode();}catch{}return {src:img.getAttribute('src'),width:img.naturalWidth,height:img.naturalHeight};})));
  expect(images).toHaveLength(101); expect(images.filter(i=>!i.width||!i.height)).toEqual([]); expect(images.some(i=>i.src?.includes('dotnet'))).toBeTruthy();
  const actualLinks=await page.locator('main a[href^="/courses/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  expect(new Set(actualLinks)).toEqual(new Set(courses.map(c=>'/courses/'+encodeURIComponent(c.slug))));
  await page.getByRole('textbox',{name:'Search courses'}).fill('.NET');
  await expect(page.locator('main h2')).toHaveText(['.NET Course']);
  await page.locator('main a[href="/courses/dotnet-beginner-course"]').screenshot({path:'.ui-review/screenshots/dotnet-thumbnail.png'});
  await page.locator('main a[href="/courses/dotnet-beginner-course"]').click(); await expect(page.locator('h1')).toHaveText('.NET Course');
  await page.getByRole('link',{name:'All courses',exact:false}).click();
  await page.getByRole('textbox',{name:'Search courses'}).fill('No matching course 999999'); await expect(page.getByText('No matching courses. Try a different search.')).toBeVisible();
  await page.getByRole('textbox',{name:'Search courses'}).fill(''); await page.getByRole('combobox',{name:'Filter by level'}).selectOption({index:1});
  expect(await page.locator('main a[href^="/courses/"]').count()).toBeGreaterThan(0);
  await page.getByRole('combobox',{name:'Filter by level'}).selectOption('all'); await expect(page.locator('main a[href^="/courses/"]')).toHaveCount(101);
});
test('nested HTML logo, Home, all classes, course home, previous/next and history',async({page})=>{
  for(const path of ['/masterclasses/ai/langgraph/index.html','/masterclasses/data-governence/purview-sandbox/lineage.html','/masterclasses/foundational/python/variables.html']){
    await visit(page,path); await page.locator('.master-brand-wrap').click(); await expect(page).toHaveURL(/\/$/);
    await page.goBack(); await expect(page).toHaveURL(new RegExp(path.replaceAll('.','\\.')+'$'));
    await page.locator('.master-menu-links > a').filter({hasText:/^\s*Home\s*$/}).click(); await expect(page).toHaveURL(/\/$/);
    await visit(page,path); await page.locator('#tinitiate-static-nav a[href="/masterclasses"]').click(); await expect(page).toHaveURL(/\/masterclasses$/);
  }
  await visit(page,'/masterclasses/foundational/python/variables.html');
  const moduleLinks=page.locator('#py-modnav a'); const destinations=await moduleLinks.evaluateAll(nodes=>nodes.map(n=>(n as HTMLAnchorElement).pathname));
  expect(destinations).toContain('/masterclasses/foundational/python/print.html'); expect(destinations).toContain('/masterclasses/foundational/python/datatypes.html');
  await moduleLinks.filter({hasText:/Next/}).click(); await expect(page).toHaveURL(/\/python\/datatypes.html$/);
  await page.goBack(); await expect(page).toHaveURL(/\/python\/variables.html$/);
});
test('original Python slide player, six video sources, and repaired simulations',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(const module of ['print','variables','datatypes','operators','strings','lists']){
    await visit(page,`/masterclasses/foundational/python/${module}.html`);
    await expect.poll(()=>page.locator('video').evaluate((video:HTMLVideoElement)=>video.readyState)).toBeGreaterThanOrEqual(1);
    expect(await page.locator('video').evaluate((v:HTMLVideoElement)=>v.duration)).toBeGreaterThan(10);
  }
  const firstSlide=await page.locator('#py-counter').textContent(); await page.locator('#py-next').click(); await expect(page.locator('#py-counter')).not.toHaveText(firstSlide!);
  await visit(page,'/masterclasses/data-engineering/real-time.html');
  await page.getByRole('button',{name:'AWS Tools',exact:true}).click(); await expect(page.locator('.eco-filter-btn.active')).toHaveText('AWS Tools'); await expect(page.locator('#cloud-tools-container')).toContainText('Kinesis');
  await visit(page,'/masterclasses/pyspark/shuffle-partitioning.html');
  await expect(page.locator('#dbWorkerNodesGrid')).not.toBeEmpty();
  await page.locator('#sliderDbSize').fill('200'); await page.locator('#sliderDbSize').dispatchEvent('input');
  await expect(page.locator('#labelDbSize')).toHaveText('200 GB');
  expect(errors).toEqual([]);
});
for(const path of ['/contact','/request-callback?course=.NET%20Course']){
  test(`enquiry validation and recoverable failure without sending: ${path}`,async({page})=>{
    let submissions=0;page.on('request',r=>{if(r.url().includes('/api/request-callback'))submissions++;});
    await visit(page,path); await page.getByRole('button',{name:'Send enquiry'}).click();
    expect(submissions).toBe(0); expect(await page.locator('input[name="name"]').evaluate((n:HTMLInputElement)=>n.validity.valueMissing)).toBeTruthy();
    await page.getByLabel('Name',{exact:true}).fill('Local UI Test'); await page.getByLabel('Email',{exact:true}).fill('invalid-email');
    await page.getByRole('button',{name:'Send enquiry'}).click(); expect(submissions).toBe(0);
    await page.getByLabel('Email',{exact:true}).fill('ui-test@example.invalid');await page.getByLabel('Phone',{exact:true}).fill('+1 555 010 0000');await page.getByLabel('Preferred time',{exact:true}).fill('Local test only');
    await page.getByRole('button',{name:'Send enquiry'}).click(); await expect(page.locator('form').getByRole('alert')).toHaveText('Test service unavailable. Please try again.');
    await expect(page.getByRole('button',{name:'Send enquiry'})).toBeEnabled(); expect(submissions).toBe(1);await expect(page.getByLabel('Name',{exact:true})).toHaveValue('Local UI Test');
    await page.route('**/api/request-callback',route=>route.fulfill({status:201,contentType:'application/json',body:'{"ok":true,"id":"local-mock-only"}'}));
    await page.getByRole('button',{name:'Send enquiry'}).click(); await expect(page.locator('form').getByRole('status')).toHaveText('Your enquiry has been submitted.');
    await expect(page.getByLabel('Name',{exact:true})).toHaveValue(''); expect(submissions).toBe(2);
  });
}
test('touch menu selection and outside tap',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();await visit(page,'http://localhost:3001/masterclasses');
  await page.getByRole('button',{name:'Open navigation menu'}).tap();
  await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Courses',exact:true}).tap();
  await expect(page).toHaveURL(/\/courses$/);await expect(page.getByRole('button',{name:'Open navigation menu'})).toHaveAttribute('aria-expanded','false');
  await page.getByRole('button',{name:'Open navigation menu'}).tap();await page.touchscreen.tap(380,820);
  await expect(page.getByRole('button',{name:'Open navigation menu'})).toHaveAttribute('aria-expanded','false');await context.close();
});
