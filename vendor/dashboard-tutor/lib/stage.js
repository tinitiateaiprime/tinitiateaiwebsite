'use strict';
// Recording-only, fixed 16:9 composition. It never stretches, scales, or translates
// a live course section beyond the video viewport to chase a target.
const css = `
html.tutor-capture, html.tutor-capture body {
  width:100%!important;height:100%!important;min-height:100%!important;
  margin:0!important;padding:0!important;overflow:hidden!important;
  background:#080f20!important;scroll-behavior:auto!important;
}
html.tutor-capture body > header,html.tutor-capture body > footer,
html.tutor-capture body > nav { display:none!important; }
html.tutor-capture main,html.tutor-capture .py-wrap {
  width:100vw!important;max-width:none!important;height:100vh!important;
  margin:0!important;padding:0!important;overflow:hidden!important;
  /* The stage must paint above the body-level backdrop, even when the
     Academy theme creates its own stacking context on main/sections. */
  position:relative!important;z-index:1!important;
}
html.tutor-capture main > .tutor-hidden {display:none!important;}
/* The backdrop is a BODY child, BELOW main. Placing it on <html> with
   z-index:99 covers the complete lesson because the Academy body/main form
   independent stacking contexts. That previously produced a blank MP4 with
   only the HUD spotlight visible. */
html.tutor-capture #tutor-backdrop {
  position:fixed!important;inset:0!important;z-index:0!important;
  pointer-events:none!important;
  background:radial-gradient(ellipse at 50% 42%,#172943 0%,#0b162a 61%,#080e1d 100%)!important;
}
/* Center the complete dashboard in the subtitle-safe capture area. Never enlarge
   it to chase a target, and never scale it using zoom or transform:scale. */
html.tutor-capture .tutor-active-stage {
  position:fixed!important;top:calc(50vh - 47px)!important;left:50vw!important;
  width:min(1760px,calc(100vw - 88px))!important;
  height:min(910px,calc(100vh - 124px))!important;
  max-width:none!important;max-height:none!important;
  overflow:hidden!important;margin:0!important;padding:18px!important;
  transform:translate(-50%,-50%)!important;zoom:1!important;box-sizing:border-box!important;
  z-index:100!important;background:#101828!important;border:1px solid #263953!important;
  border-radius:16px!important;box-shadow:0 26px 80px rgba(0,0,0,.43)!important;
}

/* CAPTURE_LAYOUT_FIX_V1: The Academy Python page uses highly specific
   desktop rules (.page-main-wrap.py-wrap > #dashboard and #dashboard #py-learn)
   marked !important. These recording-only selectors must win that cascade:
   otherwise #dashboard stretches from x=0 to 1920 and its one-column topic
   list extends below the subtitle-safe edge. Do not change the live page. */
html.tutor-capture .page-main-wrap.py-wrap > #dashboard.tutor-active-stage,
html.tutor-capture .page-main-wrap.py-wrap > #player.tutor-active-stage {
  grid-column:auto!important;grid-row:auto!important;
  width:min(1760px,calc(100vw - 88px))!important;
  height:min(910px,calc(100vh - 124px))!important;
  max-width:none!important;min-width:0!important;min-height:0!important;
  margin:0!important;
}
html.tutor-capture #dashboard.tutor-active-stage .py-two-col {
  display:grid!important;
  grid-template-columns:minmax(0,1.65fr) minmax(0,.9fr)!important;
  align-items:start!important;gap:16px!important;
}
html.tutor-capture #dashboard.tutor-active-stage .py-two-col > div:first-child {
  display:block!important;min-width:0!important;
}
html.tutor-capture #dashboard.tutor-active-stage #py-learn {
  display:grid!important;
  grid-template-columns:repeat(4,minmax(0,1fr))!important;
  gap:7px!important;
}
html.tutor-capture #dashboard.tutor-active-stage #py-learn > * {
  width:auto!important;min-width:0!important;
}
/* This particular Academy lesson hides the glossary entirely. Let its
   learning grid use the space, instead of reserving an empty right column. */
html.tutor-capture #dashboard.tutor-active-stage .py-two-col:has(#py-glossary[hidden]) {
  grid-template-columns:minmax(0,1fr)!important;
}
html.tutor-capture #dashboard.tutor-active-stage:has(#py-glossary[hidden]) #py-learn {
  grid-template-columns:repeat(5,minmax(0,1fr))!important;
}
/* Bounded, second-pass refit only when the complete dashboard is still tall. */
html.tutor-capture.tutor-capture-refit #dashboard.tutor-active-stage {
  padding:12px!important;
}
html.tutor-capture.tutor-capture-refit #dashboard.tutor-active-stage .py-stats {margin:8px 0!important;gap:7px!important;}
html.tutor-capture.tutor-capture-refit #dashboard.tutor-active-stage .py-stat {padding:7px 10px!important;}
html.tutor-capture.tutor-capture-refit #dashboard.tutor-active-stage #py-learn {grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important;}
html.tutor-capture.tutor-capture-refit #dashboard.tutor-active-stage #py-learn > * {padding:5px 7px!important;}
html.tutor-capture.tutor-capture-refit #dashboard.tutor-active-stage .py-h3 {margin:9px 0 6px!important;}

/* Compact, readable presentation of the Python progress dashboard. */
html.tutor-capture #dashboard.tutor-active-stage .py-stats {margin:12px 0!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:9px!important;}
html.tutor-capture #dashboard.tutor-active-stage .py-stat {padding:9px 12px!important;}
html.tutor-capture #dashboard.tutor-active-stage .py-two-col {grid-template-columns:minmax(0,1.65fr) minmax(0,0.9fr)!important;gap:16px!important;}
html.tutor-capture #dashboard.tutor-active-stage .py-learn-grid {grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important;}
html.tutor-capture #dashboard.tutor-active-stage .py-learn-item {font-size:14px!important;padding:7px 9px!important;line-height:1.35!important;}
html.tutor-capture #dashboard.tutor-active-stage .py-gloss {padding:7px 9px!important;}
html.tutor-capture #dashboard.tutor-active-stage .py-gloss p {margin-top:1px!important;line-height:1.25!important;}
/* Player has its own full screen region, with a real sidebar and transport row. */
html.tutor-capture #player.tutor-active-stage {display:flex!important;flex-direction:column!important;gap:8px!important;}
html.tutor-capture #player.tutor-active-stage > .py-eyebrow {flex:none!important;}
html.tutor-capture #player.tutor-active-stage > .py-h2 {margin:0!important;line-height:1.2!important;font-size:29px!important;flex:none!important;}
html.tutor-capture #player.tutor-active-stage > .py-sub {margin:0!important;font-size:15px!important;line-height:1.3!important;flex:none!important;}
html.tutor-capture #player.tutor-active-stage .py-player-layout {
  display:grid!important;grid-template-columns:minmax(0,1fr) 226px!important;
  gap:12px!important;flex:1!important;min-height:0!important;height:auto!important;max-width:100%!important;
}
html.tutor-capture #player.tutor-active-stage .py-player {min-width:0!important;min-height:0!important;height:100%!important;max-width:100%!important;}
html.tutor-capture #player.tutor-active-stage .py-player-top {flex:none!important;padding:7px 12px!important;min-height:43px!important;}
html.tutor-capture #player.tutor-active-stage .py-progress,
html.tutor-capture #player.tutor-active-stage .py-autobar {flex:none!important;}
html.tutor-capture #player.tutor-active-stage .py-stage {flex:1!important;min-height:0!important;min-width:0!important;height:auto!important;overflow:hidden!important;padding:11px 13px!important;}
html.tutor-capture #player.tutor-active-stage .py-slide {display:grid!important;grid-template-columns:minmax(0,0.98fr) minmax(0,1.02fr)!important;gap:15px!important;min-width:0!important;max-width:100%!important;box-sizing:border-box!important;}
html.tutor-capture #player.tutor-active-stage .py-slide > *,
html.tutor-capture #player.tutor-active-stage .py-code-col > *,
html.tutor-capture #player.tutor-active-stage .py-panel,
html.tutor-capture #player.tutor-active-stage .py-editor,
html.tutor-capture #player.tutor-active-stage .CodeMirror {
 min-width:0!important;max-width:100%!important;box-sizing:border-box!important;
}
html.tutor-capture #player.tutor-active-stage .CodeMirror {width:100%!important;}
/* Applied only if a first pass detects actual clipping. Do not shrink text or hide content. */
html.tutor-capture.tutor-capture-refit #player.tutor-active-stage {
 height:min(938px,calc(100vh - 110px))!important;top:calc(50vh - 43px)!important;
 padding:12px!important;gap:5px!important;
}
html.tutor-capture.tutor-capture-refit #player.tutor-active-stage .py-player-layout {
 grid-template-columns:minmax(0,1fr) 208px!important;gap:9px!important;
}
html.tutor-capture.tutor-capture-refit #player.tutor-active-stage .py-stage {padding:8px 10px!important;}
html.tutor-capture.tutor-capture-refit #player.tutor-active-stage .py-player-controls {padding:5px 10px!important;}
html.tutor-capture.tutor-capture-refit #player.tutor-active-stage .py-player-top {padding:5px 10px!important;}

/* LONG_OUTPUT_REFIT_V1: last-resort frame for long Python source/tracebacks.
   Use an internal, accessible scroll area instead of extending the editor and
   terminal below the 974px subtitle-safe limit. Applied only after normal
   and compact layouts have both genuinely failed; the student page is unchanged. */
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-slide {
  height:100%!important;min-height:0!important;max-height:100%!important;
  align-items:stretch!important;grid-template-columns:minmax(0,.98fr) minmax(0,1.02fr)!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-anim {
  height:100%!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;
  scrollbar-width:thin!important;padding-right:5px!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-code-col {
  height:100%!important;min-height:0!important;max-height:100%!important;
  overflow:hidden!important;gap:8px!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-code-col > .py-panel:first-child {
  display:flex!important;flex-direction:column!important;
  flex:1 1 0%!important;min-height:0!important;max-height:100%!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-code-col > .py-panel:first-child .py-editor {
  flex:1 1 auto!important;min-height:0!important;max-height:100%!important;
  overflow-y:auto!important;overflow-x:hidden!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-code-col .CodeMirror {
  height:100%!important;min-height:0!important;max-height:100%!important;overflow:hidden!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-code-col .CodeMirror-scroll {
  max-height:100%!important;overflow-y:auto!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-code-col .py-code-fallback {
  height:100%!important;max-height:100%!important;resize:none!important;overflow-y:auto!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage .py-code-col > .py-panel:last-child {
  display:flex!important;flex-direction:column!important;
  flex:0 0 auto!important;max-height:35%!important;min-height:0!important;
}
html.tutor-capture.tutor-capture-long-output #player.tutor-active-stage #py-term {
  max-height:min(205px,21vh)!important;min-height:0!important;overflow-y:auto!important;
  overflow-x:hidden!important;scrollbar-width:thin!important;
}

html.tutor-capture #player.tutor-active-stage .py-slide-title {font-size:24px!important;margin:4px 0 8px!important;}
html.tutor-capture #player.tutor-active-stage .py-slide-explain {font-size:15px!important;line-height:1.45!important;}
html.tutor-capture #player.tutor-active-stage .py-idea {padding:9px 12px!important;margin-bottom:9px!important;}
html.tutor-capture #player.tutor-active-stage .py-controls {gap:7px!important;margin:9px 0!important;padding:9px!important;}
html.tutor-capture #player.tutor-active-stage .py-tip {font-size:13.5px!important;line-height:1.35!important;padding:8px 10px!important;}
html.tutor-capture #player.tutor-active-stage .py-code-col {min-width:0!important;gap:9px!important;}
html.tutor-capture #player.tutor-active-stage .py-editor .CodeMirror {font-size:15px!important;line-height:1.4!important;min-height:102px!important;}
html.tutor-capture #player.tutor-active-stage .py-term {font-size:15px!important;line-height:1.4!important;min-height:60px!important;padding:10px!important;}
html.tutor-capture #player.tutor-active-stage .py-panel-head {padding:7px 10px!important;}
html.tutor-capture #player.tutor-active-stage .py-player-controls {flex:none!important;min-height:55px!important;padding:6px 12px!important;gap:9px!important;}
html.tutor-capture #player.tutor-active-stage .py-icon-btn {height:34px!important;width:34px!important;}
html.tutor-capture #player.tutor-active-stage .py-icon-btn.play {height:40px!important;width:40px!important;}
html.tutor-capture #player.tutor-active-stage .py-outline {height:100%!important;max-height:none!important;overflow:hidden!important;padding:8px!important;gap:2px!important;}
html.tutor-capture #player.tutor-active-stage .py-outline-item {padding:5px!important;font-size:12.5px!important;line-height:1.2!important;gap:6px!important;}
html.tutor-capture #player.tutor-active-stage .py-outline-item .num {width:21px!important;height:21px!important;}
html.tutor-capture #player.tutor-active-stage .py-outline-item small {display:none!important;}
/* Reusable simulator layout: render in a fixed frame without moving off-screen. */
html.tutor-capture .tutor-active-stage * {scrollbar-width:none!important;}
html.tutor-capture .tutor-active-stage *::-webkit-scrollbar {display:none!important;}
/* HUD is a child of <html>, not <body>: it stays above transformed application layers. */
html.tutor-capture #tutor-hud {position:fixed!important;inset:0!important;z-index:2147483600!important;pointer-events:none!important;isolation:isolate!important;transform:none!important;}
/* Small cursor with a crisp SVG arrow. No oversized yellow triangle. */
#tutor-pointer {position:absolute;left:0;top:0;z-index:5;pointer-events:none;width:26px;height:30px;
  transform:translate3d(-90px,-90px,0);transition:transform .64s cubic-bezier(.17,.75,.24,1);filter:drop-shadow(0 2px 2px #000c);}
#tutor-pointer:before {content:'';display:block;width:25px;height:29px;
  background-repeat:no-repeat;background-size:contain;
  background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 28 32%22%3E%3Cpath d=%22M3 2v24l6.5-6.1 5.2 10.1 5.1-2.7-5.1-9.6 9-1.1L3 2z%22 fill=%22%23f8fafc%22 stroke=%22%230f172a%22 stroke-width=%222.4%22 stroke-linejoin=%22round%22/%3E%3Cpath d=%22M6 7v14l4.2-4%22 fill=%22none%22 stroke=%22%2367e8f9%22 stroke-width=%221.2%22/%3E%3C/svg%3E');}
#tutor-spotlight {position:absolute;z-index:3;left:-400px;top:-400px;width:0;height:0;
  border:2px solid rgba(103,232,249,.85);border-radius:12px;
  box-shadow:0 0 0 5px rgba(34,211,238,.10),0 0 24px rgba(34,211,238,.20);
  background:rgba(103,232,249,.035);opacity:0;
  transition:left .64s cubic-bezier(.17,.75,.24,1),top .64s cubic-bezier(.17,.75,.24,1),width .64s,height .64s,opacity .2s;
  pointer-events:none;box-sizing:border-box;}
#tutor-spotlight.is-active {opacity:1;}
/* Entering a new target animates. During DOM text/size changes, track exactly
   (no lagging rectangle or old button dimensions). */
#tutor-pointer.tutor-fx-following {transition:none!important;}
#tutor-spotlight.tutor-fx-following {transition:none!important;}
#tutor-spotlight:not(.is-active) {opacity:0!important;}
#tutor-ripple {position:absolute;left:-100px;top:-100px;z-index:4;
  border:2px solid #67e8f9;border-radius:50%;width:16px;height:16px;opacity:0;pointer-events:none;}
#tutor-ripple.tutor-click {animation:tutor-ripple .62s ease-out both;}
@keyframes tutor-ripple {0%{transform:translate(-50%,-50%) scale(.4);opacity:1;box-shadow:0 0 0 0 rgba(103,232,249,.35)}100%{transform:translate(-50%,-50%) scale(4);opacity:0;box-shadow:0 0 0 12px rgba(103,232,249,0)}}
@media (prefers-reduced-motion:reduce){#tutor-pointer,#tutor-spotlight{transition:none!important;}}

#tutor-subtitles {position:absolute;z-index:2;left:6%;bottom:12px;width:88%;min-height:47px;box-sizing:border-box;padding:10px 18px;border-radius:12px;background:rgba(8,16,32,.97);border:1px solid rgba(103,232,249,.2);color:white;font:600 19px/1.3 Arial,sans-serif;text-align:center;box-shadow:0 6px 24px #0009;pointer-events:none;max-height:103px;overflow:hidden;}
#tutor-title {position:absolute;top:3px;right:32px;z-index:2;border-radius:7px;background:#1e293b;padding:4px 13px;color:#facc15;font:600 12px Arial,sans-serif;}
`;
async function setup(page){
 await page.addStyleTag({content:css});
 await page.evaluate(()=>{
  document.documentElement.classList.add('tutor-capture');
  let bg=document.getElementById('tutor-backdrop');
  if(!bg){bg=document.createElement('div');bg.id='tutor-backdrop';bg.setAttribute('aria-hidden','true');}
  // Re-parent an existing backdrop as well; never allow a sibling of <body>
  // to paint over every lesson element in its own stacking context.
  if(bg.parentElement!==document.body)document.body.insertBefore(bg,document.body.firstChild);
  if(!document.getElementById('tutor-hud')){
   const hud=document.createElement('div');hud.id='tutor-hud';hud.setAttribute('aria-hidden','true');
   for(const [id,text] of [['tutor-pointer',''],['tutor-spotlight',''],['tutor-ripple',''],['tutor-subtitles','Preparing the guided demonstration…'],['tutor-title','TINITIATE AI  •  GUIDED DEMONSTRATION']]){
    const el=document.createElement('div');el.id=id;el.textContent=text;hud.appendChild(el);
   }
   document.documentElement.appendChild(hud);
  }
  // Keep the teaching effects attached to LIVE element geometry, not a single
  // bounding-box snapshot. PyCourse changes the label/width of #py-continue
  // when progress changes, and React pages may replace nodes entirely.
  if(!window.__tutorFx){
   const pointer=document.getElementById('tutor-pointer');
   const glow=document.getElementById('tutor-spotlight');
   const ring=document.getElementById('tutor-ripple');
   const fx={selector:null,element:null,frame:0,observer:null,following:false};
   const geometry=el=>{
    const r=el.getBoundingClientRect();
    return {x:r.left,y:r.top,width:r.width,height:r.height,right:r.right,bottom:r.bottom,
      cx:r.left+r.width/2,cy:r.top+r.height/2};
   };
   const visible=el=>!!el&&el.isConnected&&el.getClientRects().length>0&&
      getComputedStyle(el).visibility!=='hidden'&&!!el.closest('.tutor-active-stage');
   function hide(){glow.classList.remove('is-active');glow.classList.remove('tutor-fx-following');
      pointer.classList.remove('tutor-fx-following');pointer.style.transform='translate3d(-90px,-90px,0)';}
   function sync(){
    if(!fx.selector)return null;
    const el=document.querySelector(fx.selector);
    if(!visible(el)){hide();fx.element=null;return null;}
    if(el!==fx.element){
      if(fx.observer)fx.observer.disconnect();
      fx.element=el;
      if(typeof ResizeObserver!=='undefined'){
        fx.observer=new ResizeObserver(()=>{if(fx.selector)sync();});
        fx.observer.observe(el);
      }
    }
    const b=geometry(el);
    if(!Number.isFinite(b.cx)||!Number.isFinite(b.cy)||b.width<1||b.height<1){hide();return null;}
    glow.style.left=(b.x-5)+'px';glow.style.top=(b.y-5)+'px';
    glow.style.width=(b.width+10)+'px';glow.style.height=(b.height+10)+'px';
    pointer.style.transform=`translate3d(${b.cx-3}px,${b.cy-2}px,0)`;
    ring.style.left=b.cx+'px';ring.style.top=b.cy+'px';
    glow.classList.add('is-active');
    return b;
   }
   function loop(){
    if(!fx.selector){fx.frame=0;return;}
    sync();fx.frame=requestAnimationFrame(loop);
   }
   function clear(){
    fx.selector=null;fx.element=null;fx.following=false;
    if(fx.frame){cancelAnimationFrame(fx.frame);fx.frame=0;}
    if(fx.observer){fx.observer.disconnect();fx.observer=null;}
    ring.classList.remove('tutor-click');hide();
   }
   function activate(selector){
    clear();
    fx.selector=selector;
    // Allow one smooth arrival, then attach effects precisely to moving nodes.
    sync();fx.frame=requestAnimationFrame(loop);
   }
   function follow(){
    if(!fx.selector)return;
    fx.following=true;
    glow.classList.add('tutor-fx-following');
    pointer.classList.add('tutor-fx-following');
    sync();
   }
   function audit(){
    if(!fx.selector)return {active:false,ok:true,reason:'no-target'};
    const b=sync();
    if(!b)return {active:false,ok:true,reason:'target-not-visible'};
    const actual=geometry(glow), cursor=geometry(pointer);
    const errors={left:Math.abs(actual.x-(b.x-5)),top:Math.abs(actual.y-(b.y-5)),
      right:Math.abs(actual.right-(b.right+5)),bottom:Math.abs(actual.bottom-(b.bottom+5))};
    const drift=Math.max(...Object.values(errors));
    const pointerOffset=Math.hypot(cursor.x+3-b.cx,cursor.y+2-b.cy);
    const hit=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,b.cx)),Math.max(0,Math.min(innerHeight-1,b.cy)));
    const hitTest=!!hit&&(hit===fx.element||fx.element.contains(hit));
    return {active:true,selector:fx.selector,label:(fx.element.innerText||fx.element.getAttribute('aria-label')||'').trim().slice(0,120),
      target:b,highlight:actual,driftPx:Math.round(drift*100)/100,
      pointerDriftPx:Math.round(pointerOffset*100)/100,hitTest,
      ok:drift<=3&&pointerOffset<=3&&hitTest};
   }
   window.__tutorFx={activate,follow,clear,sync,audit};
   // Text changes are not necessarily resize events (e.g. same-width labels).
   const changes=new MutationObserver(()=>{if(fx.selector)sync();});
   changes.observe(document.body,{childList:true,subtree:true,characterData:true});
   window.addEventListener('resize',()=>{if(fx.selector)sync()});
   document.addEventListener('scroll',()=>{if(fx.selector)sync()},true);
  }
 });
}
// Two-phase geometry inspection: activate, let animations and CodeMirror finish
// resizing, then inspect the actual clip chain. Only retry with a bounded reflow.
// Genuine off-screen or overflow-hidden content remains a hard recording error.
async function measure(page,stageSelector,targetSelector){return page.evaluate(({stageSelector,targetSelector})=>{
 const main=document.querySelector('main')||document.body;
 const stage=document.querySelector('.tutor-active-stage')||main;
 const target=document.querySelector(targetSelector);
 const checks=[stage];
 if(stage.id==='dashboard')for(const selector of ['#py-learn','#py-learn .py-learn-item:last-child','#py-glossary','#py-glossary .py-gloss:last-child','#py-continue']){
  const e=document.querySelector(selector);if(e)checks.push(e);
 }
 if(stage.id==='player')for(const selector of ['#py-player','#py-stage','#py-stage .py-slide','#py-stage .py-code-col','#py-outline','#py-outline .py-outline-item:last-child','#py-player .py-player-controls','#py-run','#py-reset-code','#py-next','#py-term']){
  const e=document.querySelector(selector);if(e)checks.push(e);
 }
 if(target)checks.push(target);
 const rect=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
 const failure=e=>{
  const r=e.getBoundingClientRect();
  if(r.width<1||r.height<1)return {reason:'zero-size',clip:null};
  const bounds={left:8,right:innerWidth-8,top:10,bottom:innerHeight-106};
  if(r.left<bounds.left-2||r.right>bounds.right+2||r.top<bounds.top-2||r.bottom>bounds.bottom+2)
   return {reason:'outside-safe-viewport',clip:bounds};
  for(let a=e.parentElement;a&&a!==document.documentElement;a=a.parentElement){
   const style=getComputedStyle(a);
   // Overflow: clip on one axis also turns the other visible axis into auto.
   const over=[style.overflowX,style.overflowY,style.overflow];
   if(!over.some(v=>/hidden|clip|scroll|auto/.test(v)))continue;
   const p=a.getBoundingClientRect();
   const clipped={left:r.left<p.left-2,right:r.right>p.right+2,top:r.top<p.top-2,bottom:r.bottom>p.bottom+2};
   if(Object.values(clipped).some(Boolean)){
    return {reason:'clipped-by-ancestor',clip:{element:a.id?'#'+a.id:a.className&&typeof a.className==='string'?a.tagName.toLowerCase()+'.'+a.className.trim().split(/\s+/).join('.'):a.tagName.toLowerCase(),rect:rect(a),sides:clipped,overflowX:style.overflowX,overflowY:style.overflowY}};
   }
  }
  return null;
 };
 const invalid=[...new Set(checks)].filter(e=>e.getClientRects().length).map(e=>{
  const issue=failure(e);
  return issue?{element:e.id?'#'+e.id:e.tagName.toLowerCase(),rect:rect(e),...issue}:null;
 }).filter(Boolean);
 // A visible DOM rectangle is not proof of a visible video. Reject the
 // historical overlay failure before generating an otherwise blank MP4.
 const bg=document.getElementById('tutor-backdrop');
 if(bg && (bg.parentElement!==document.body || (main!==document.body && Number.parseFloat(getComputedStyle(bg).zIndex)>=Number.parseFloat(getComputedStyle(main).zIndex)))){
  invalid.push({element:'#tutor-backdrop',reason:'backdrop-obscures-lesson'});
 }
 // The Python course fills these controls dynamically. A page that failed to
 // initialize its lesson JS must fail capture instead of publishing emptiness.
 if(main.hasAttribute('data-py-page') && stage.id==='dashboard'){
  const topics=document.querySelector('#py-learn');
  const count=Number.parseInt(document.querySelector('#py-stat-slides')?.textContent||'0',10);
  if(!topics?.children.length || !Number.isFinite(count) || count<1){
   invalid.push({element:'#py-learn',reason:'python-lesson-content-not-initialized'});
  }
 }
 if(main.hasAttribute('data-py-page') && stage.id==='player' && !document.querySelector('#py-stage .py-slide')){
  invalid.push({element:'#py-stage',reason:'python-slide-content-not-initialized'});
 }
 return {stage:stageSelector,target:targetSelector,stageRect:rect(stage),targetRect:target?rect(target):null,visible:!!target&&!failure(target),invalid,rawHeight:stage.scrollHeight,renderedHeight:stage.getBoundingClientRect().height,refit:document.documentElement.classList.contains('tutor-capture-refit')};
},{stageSelector,targetSelector});}
async function focus(page,stageSelector,targetSelector){
 await page.evaluate(({stageSelector,targetSelector})=>{
  const main=document.querySelector('main')||document.body;
  const src=document.querySelector(stageSelector)||document.querySelector(targetSelector)||main;
  let stage=src;
  if(stage!==main&&!['SECTION','ARTICLE','MAIN'].includes(stage.tagName))stage=stage.closest('section,article')||stage.parentElement;
  if(!main.contains(stage))stage=main;
  if(stage===main&&src===main){
   const interactive=[...main.querySelectorAll('section,article')].filter(e=>e.querySelectorAll('button,input,select,textarea').length>=2);
   stage=interactive.sort((a,b)=>b.querySelectorAll('button,input,select,textarea').length-a.querySelectorAll('button,input,select,textarea').length)[0]||main;
  }
  // Prevent the previous stage's outline from flashing over the new stage.
  window.__tutorFx?.clear();
  const previousStage=document.querySelector('.tutor-active-stage');
  for(const child of main.children)child.classList.toggle('tutor-hidden',child!==stage&&!child.contains(stage));
  for(const el of document.querySelectorAll('.tutor-active-stage'))el.classList.remove('tutor-active-stage');
  stage.classList.add('tutor-active-stage');
  stage.style.removeProperty('width');stage.style.removeProperty('transform');stage.style.removeProperty('zoom');
  // Keep the successfully fitted player layout stable between scenes.
  if(previousStage!==stage){document.documentElement.classList.remove('tutor-capture-refit','tutor-capture-long-output');}
 },{stageSelector,targetSelector});
 // Two rendering frames followed by slide-entry animation completion. Avoids
 // measuring the old dashboard geometry while the player becomes visible.
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 await page.waitForTimeout(550);
 let result=await measure(page,stageSelector,targetSelector);
 if(result.invalid.length&&result.stageRect.width){
  await page.evaluate(()=>document.documentElement.classList.add('tutor-capture-refit'));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  result=await measure(page,stageSelector,targetSelector);
 }
 // The regular compact pass may still overflow when CodeMirror shows many
 // source lines or Python prints a long traceback. Refitting only this player
 // scene is safer than shrinking all Academy fonts or suppressing clipping.
 if(result.invalid.length && (result.stage?.id==='player' || stageSelector==='#player')){
  await page.evaluate(()=>document.documentElement.classList.add('tutor-capture-long-output'));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  result=await measure(page,stageSelector,targetSelector);
 }
 return result;
}
async function point(page,selector){
 const candidate=selector==='#py-stage'?'#py-stage .py-slide-title':selector==='#dashboard'?'#dashboard .py-h2':selector==='#player'?'#player .py-h2':null;
 const effective=candidate&&await page.locator(candidate).count()?candidate:selector;
 await page.locator(effective).first().waitFor({state:'visible',timeout:20000});
 const b=await page.locator(effective).first().boundingBox();
 if(!b)throw Error('Target has no bounding box: '+effective);
 const v=page.viewportSize()||{width:1920,height:1080};
 if(b.x<6||b.y<10||b.x+b.width>v.width-6||b.y+b.height>v.height-103)
   throw Error('Target clipped in capture viewport: '+effective+' '+JSON.stringify(b));
 await page.evaluate(selector=>window.__tutorFx.activate(selector),effective);
 await page.waitForTimeout(670); // finish the intentional arrival animation
 await page.evaluate(()=>window.__tutorFx.follow());
 const result=await page.evaluate(()=>window.__tutorFx.audit());
 if(result.active&&!result.ok)throw Error('Highlight did not align with target: '+JSON.stringify(result));
 return result;
}
// Audit both before and after a click: controls may resize, relabel, move or
// re-render in response to the event. One bounded snap-to-target retry is safe.
async function visualAudit(page,selector,{retry=true}={}){
 await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
 let audit=await page.evaluate(()=>window.__tutorFx.audit());
 if(audit.active&&!audit.ok&&retry){
   await page.evaluate(()=>window.__tutorFx.follow());
   await page.waitForTimeout(85);
   audit=await page.evaluate(()=>window.__tutorFx.audit());
 }
 if(audit.active&&!audit.ok)throw Error('Cursor/spotlight visual mismatch after '+selector+': '+JSON.stringify(audit));
 return audit;
}
function captionChunks(text,max=115){
 const tokens=String(text||'').trim().split(/\s+/).filter(Boolean),chunks=[];let current='';
 for(const token of tokens){
  if(current && (current.length+1+token.length)>max){chunks.push(current);current='';}
  current+=(current?' ':'')+token;
 }
 if(current)chunks.push(current);
 return chunks.length?chunks:[''];
}
async function caption(page,text,seconds=5){
 const chunks=captionChunks(text);
 await page.evaluate(({chunks,seconds})=>{
  if(window.__tutorCaptionTimer)clearInterval(window.__tutorCaptionTimer);
  const el=document.getElementById('tutor-subtitles');
  let index=0;el.textContent=chunks[0];el.style.fontSize='19px';
  if(chunks.length>1){
   const step=Math.max(1000,(seconds*1000)/chunks.length);
   window.__tutorCaptionTimer=setInterval(()=>{
    index++;if(index>=chunks.length){clearInterval(window.__tutorCaptionTimer);window.__tutorCaptionTimer=null;return;}
    el.textContent=chunks[index];
   },step);
  }
 },{chunks,seconds});
}
async function pulse(page){await page.evaluate(()=>{
 const ring=document.getElementById('tutor-ripple');
 ring.classList.remove('tutor-click');void ring.offsetWidth;ring.classList.add('tutor-click');
});await page.waitForTimeout(160);}
module.exports={setup,focus,measure,point,visualAudit,caption,captionChunks,pulse,css};
