import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch();
const page = await browser.newPage({reducedMotion:'reduce'});
await mkdir('.ui-review/screenshots',{recursive:true});
for (const [name,path,width] of [
 ['masterclasses-desktop','/masterclasses',1440], ['masterclasses-mobile','/masterclasses',320],
 ['homepage-mobile','/',390], ['courses-mobile','/courses',375],
 ['dotnet-mobile','/courses/dotnet-beginner-course',320],
 ['lesson-ai-mobile','/masterclasses/ai/langgraph/index.html',320],
 ['lesson-pyspark-mobile','/masterclasses/pyspark/shuffle-partitioning.html',320],
 ['lesson-python-mobile','/masterclasses/foundational/python/variables.html',375],
]) {
 await page.setViewportSize({width,height:950}); await page.goto('http://localhost:3001'+path,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(1500);
 await page.screenshot({path:'.ui-review/screenshots/'+name+'.png',fullPage:false});
}
await page.goto('http://localhost:3001/masterclasses'); await page.setViewportSize({width:320,height:700});
await page.getByRole('button',{name:'Open navigation menu'}).click();
await page.screenshot({path:'.ui-review/screenshots/mobile-menu.png'});
await browser.close();
