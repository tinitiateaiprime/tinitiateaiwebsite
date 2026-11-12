'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const stage=require('../lib/stage');
const recorderText=require('node:fs').readFileSync(require('node:path').join(__dirname,'../lib/recorder.js'),'utf8');

test('live highlight changes size/position when button label changes', {skip:process.env.TUTOR_BROWSER_TEST!=='1'},async()=>{
 const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH||'playwright');
 const browser=await chromium.launch({headless:true,executablePath:process.env.TUTOR_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  await page.setContent(`<!doctype html><html><style>*{box-sizing:border-box}body{margin:0;color:white;background:#121a2a;font:16px Arial}main{height:100vh}section{border-radius:15px}#dashboard{padding:25px}#py-continue{font:16px Arial;position:absolute;right:30px;top:90px;padding:14px 20px;border:0;border-radius:8px;background:#2563eb;color:white;white-space:nowrap}#player{padding:25px}</style><main>
   <section id="dashboard"><h2 class="py-h2">Python Variables</h2><button id="py-continue">Start learning</button></section>
   <section id="player"><h2 class="py-h2">Python Lesson</h2><button id="py-first">First slide</button></section>
   </main><script>document.getElementById('py-continue').addEventListener('click',e=>{e.currentTarget.textContent='Continue at slide 3';e.currentTarget.style.right='98px';e.currentTarget.style.top='120px';})</script></html>`);
  await stage.setup(page);
  let layout=await stage.focus(page,'#dashboard','#py-continue');
  assert.deepEqual(layout.invalid,[]);
  const before=await stage.point(page,'#py-continue');
  assert.equal(before.ok,true,JSON.stringify(before));
  await stage.pulse(page);
  const box=await page.locator('#py-continue').boundingBox();
  await page.locator('#py-continue').click({position:{x:box.width/2,y:box.height/2}});
  await page.waitForTimeout(150);
  const after=await stage.visualAudit(page,'#py-continue');
  assert.equal(after.label,'Continue at slide 3');
  assert.equal(after.ok,true,JSON.stringify(after));
  assert.ok(Math.abs(after.target.width-before.target.width)>10,'Button width must have changed');
  assert.ok(Math.abs(after.target.x-before.target.x)>10,'Button position must have changed');
  assert.ok(after.driftPx<=3 && after.pointerDriftPx<=3,'Effects must track updated box');
  // Initial spotlight must not remain visible after changing recording sections.
  layout=await stage.focus(page,'#player','#py-first');
  assert.deepEqual(layout.invalid,[]);
  const hidden=await page.evaluate(()=>({active:document.getElementById('tutor-spotlight').classList.contains('is-active'),old:window.__tutorFx.audit()}));
  assert.equal(hidden.active,false);
  assert.equal(hidden.old.active,false);
  const start=await stage.point(page,'#py-first');
  assert.equal(start.ok,true);
 }finally{await browser.close()}
});

test('recorder uses center click and audits interactions before and after',()=>{
 assert.match(recorderText,/position:\{x:box\.width\/2,y:box\.height\/2\}/);
 assert.match(recorderText,/interactionAudit=await stage\.visualAudit/);
 assert.match(stage.css,/#tutor-spotlight\.tutor-fx-following/);
});
