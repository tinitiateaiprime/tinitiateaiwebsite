'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const stage=require('../lib/stage');
// Run only with TUTOR_BROWSER_TEST=1. Keeps npm test lightweight and offline.
test('real Chromium: two capture regions fit, deliberately clipped element is rejected', {skip:process.env.TUTOR_BROWSER_TEST!=='1'}, async()=>{
 const {chromium}=(()=>{try{return require('playwright')}catch(e){if(process.env.PLAYWRIGHT_CORE_PATH)return require(process.env.PLAYWRIGHT_CORE_PATH);throw e}})();
 const browser=await chromium.launch({headless:true,executablePath:process.env.TUTOR_CHROMIUM||undefined,args:['--no-sandbox','--disable-dev-shm-usage']});
 try{
 const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 const slides=Array.from({length:10},(_,i)=>`<button class="py-outline-item" data-k="${i}"><span class="num">${i+1}</span> Slide ${i+1}</button>`).join('');
 await page.setContent(`<!doctype html><html><head><style>
 *{box-sizing:border-box}body{margin:0;background:white;color:white;font:16px Arial}main{max-width:1400px;margin:auto;padding:30px}
 .py-section{padding:26px;border:1px solid #273e51}.py-stats{display:grid;grid-template-columns:repeat(4,1fr)}.py-stat{padding:18px}
 .py-two-col{display:grid;grid-template-columns:1.2fr 1fr}.py-gloss{padding:10px}.py-learn-grid{display:grid;grid-template-columns:repeat(2,1fr)}
 .py-player-layout{display:grid;grid-template-columns:minmax(0,1fr) 270px;gap:18px}.py-player{display:flex;flex-direction:column;overflow:hidden;min-width:0;background:#101929}
 .py-player-top{padding:14px 18px}.py-progress,.py-autobar{height:4px}.py-stage{position:relative;min-height:520px;padding:24px;overflow:hidden;flex:1}
 .py-slide{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);gap:22px}.py-code-col{display:flex;flex-direction:column;gap:14px;min-width:0}
 .py-panel{background:#0c1527;overflow:hidden}.py-panel-head{padding:8px 12px}.py-editor .CodeMirror{height:130px;min-height:110px}.py-term{min-height:74px;padding:14px}
 .py-player-controls{padding:12px 18px;min-height:65px}.py-outline{max-height:680px;overflow-y:auto;padding:14px}
 </style></head><body><header>Big header</header><main>
 <section id="dashboard" class="py-section"><h2 class="py-h2">Python Variables Progress</h2><button id="py-continue">Start Learning</button><div class="py-stats"><div class="py-stat">Completed</div><div class="py-stat">10 slides</div></div><div class="py-two-col"><div class="py-learn-grid" id="py-learn"><div>What is variable?</div><div class="py-learn-item">Update</div></div><div id="py-glossary"><div class="py-gloss">Variable</div></div></div></section>
 <section id="player" class="py-section"><p class="py-eyebrow">Slide Player</p><h2 class="py-h2">Python Variables</h2><p class="py-sub">Learn what variables do. Read the explanation first, then edit the example and click Run. This is the introduction.</p>
 <div class="py-player-layout"><div class="py-player" id="py-player"><div class="py-player-top">Python Variables</div><div class="py-progress"></div><div class="py-autobar"></div>
 <div class="py-stage" id="py-stage"><div class="py-slide"><div><h3 class="py-slide-title">What is a variable?</h3><div class="py-idea">A variable is like a labeled box.</div><p class="py-slide-explain">Use a name and equals to store a value.</p></div>
 <div class="py-code-col"><div class="py-panel"><div class="py-panel-head"><button id="py-reset-code">Reset</button><button id="py-run">Run</button></div><div class="py-editor"><div class="CodeMirror">age = 25<br>print(age)</div></div></div><div class="py-panel"><div class="py-panel-head">WHAT YOU SEE</div><pre class="py-term" id="py-term">25</pre></div></div></div></div>
 <div class="py-player-controls"><button id="py-first">First</button><button id="py-next">Next</button></div></div><aside class="py-outline" id="py-outline">${slides}</aside></div></section>
 </main><footer>Big footer</footer></body></html>`);
 await stage.setup(page);
 let layout=await stage.focus(page,'#dashboard','#py-continue');
 assert.deepEqual(layout.invalid,[],JSON.stringify(layout.invalid));
 layout=await stage.focus(page,'#player','#py-first');
 assert.deepEqual(layout.invalid,[],JSON.stringify(layout.invalid));
 // Verify actual clipping remains a failure. Make code editor overflow by 400px.
 await page.addStyleTag({content:'html.tutor-capture #py-term { position:relative!important; left:180px!important; }'});
 layout=await stage.focus(page,'#player','#py-term');
 assert.ok(layout.invalid.some(x=>x.element==='#py-term'));
 assert.ok(layout.invalid.find(x=>x.element==='#py-term').clip?.element);
 }finally{await browser.close()}
});
