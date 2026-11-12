'use strict';
// Only adds durable selectors to DOM in isolated authoring browser.
async function decorate(page){return page.evaluate(()=>{
 const main=document.querySelector('main')||document.body;
 const labelOf=e=>(e.getAttribute('aria-label')||e.getAttribute('title')||e.innerText||e.getAttribute('placeholder')||e.value||'').replace(/\s+/g,' ').trim().slice(0,100);
 const cssId=id=>'#'+CSS.escape(id);
 function annotate(){
  const items=[...main.querySelectorAll('button,input,select,textarea,[role="button"],a[role="button"]')];
  for(let i=0;i<items.length;i++)items[i].setAttribute('data-tutor-element',String(i));
  return items;
 }
 if(!window.__tutorObserved){
  const observer=new MutationObserver(()=>{if(!window.__tutorAnnotating){window.__tutorAnnotating=true;try{annotate();}finally{window.__tutorAnnotating=false;}}});
  observer.observe(main,{childList:true,subtree:true});window.__tutorObserved=observer;
 }
 return annotate().map((el,i)=>({selector:el.id?cssId(el.id):`[data-tutor-element="${i}"]`,label:labelOf(el),tag:el.tagName.toLowerCase(),disabled:el.disabled===true})).filter(x=>x.label);
});}
async function discoverDetailed(chromium,url,launchOptions={}){
 const browser=await chromium.launch(launchOptions);
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(1600);
  const controls=await decorate(page);
  const slides=await page.evaluate(()=>{
   const key=document.querySelector('[data-py-page]')?.dataset.pyPage;
   const course=(typeof PyCourse!=='undefined')?PyCourse:window.PyCourse;
   const deck=course?.DECKS?.[key];
   if(!deck)return [];
   const asText=html=>{const div=document.createElement('div');div.innerHTML=String(html||'');return (div.textContent||'').replace(/\s+/g,' ').trim();};
   return deck.slides.map((s,i)=>({index:i,title:s.title,idea:asText(s.idea).slice(0,300),analogy:asText(s.analogy).slice(0,260),explain:asText(s.explain).slice(0,400),tip:asText(s.tip).slice(0,200),code:typeof s.code==='string'?s.code.slice(0,240):'',output:typeof s.out==='string'?s.out.slice(0,160):'',controls:(s.controls||[]).map(c=>({label:c.label,type:c.type})).slice(0,12)}));
  });
  const pageOverview=await page.evaluate(()=>{
   const main=document.querySelector('main')||document.body;
   const h=[...main.querySelectorAll('h1,h2,h3')].filter(el=>el.offsetWidth&&el.offsetHeight);
   return {headings:h.map(el=>el.textContent.replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,20)};
  });
  return {controls,slides,pageOverview};
 }finally{await browser.close();}
}
async function discover(chromium,url,launchOptions={}){return (await discoverDetailed(chromium,url,launchOptions)).controls;}
module.exports={decorate,discover,discoverDetailed};
