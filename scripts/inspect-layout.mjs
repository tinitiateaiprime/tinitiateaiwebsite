import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({viewport:{width:Number(process.env.UI_WIDTH)||320,height:900}});
page.on('pageerror', e => console.log(e.stack));
for (const path of process.argv.slice(2)) {
 await page.setViewportSize({width:320,height:900});
 await page.goto('http://localhost:3001/masterclasses/'+path,{waitUntil:'domcontentloaded'}); await page.waitForTimeout(400);
 for(const width of [320,375,390,768,1024,1440].filter(w=>w<=(Number(process.env.UI_WIDTH)||320))){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);}
 console.log('size',await page.evaluate(()=>[innerWidth,document.documentElement.scrollWidth]));
 console.log(path, JSON.stringify(await page.evaluate(() => {
   const contained = n => { let p=n.parentElement; while(p) { if(['auto','scroll','hidden','clip'].includes(getComputedStyle(p).overflowX)) return true; p=p.parentElement; } return false; };
   return [...document.querySelectorAll('body *')].filter(n=>{const r=n.getBoundingClientRect(); const s=getComputedStyle(n);return r.right>innerWidth+2 && s.visibility!=='hidden' && s.display!=='none' && !n.closest('pre') && !contained(n)}).slice(0,6).map(n=>({html:n.outerHTML.slice(0,280),ancestors:[n,n.parentElement,n.parentElement?.parentElement].filter(Boolean).map(p=>{const s=getComputedStyle(p);return {cls:p.className,id:p.id,width:s.width,min:s.minWidth,display:s.display,grid:s.gridTemplateColumns,overflow:s.overflowX,position:s.position}})}));
 }),null,2));
 console.log('hidden extremes',await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(n=>n.getBoundingClientRect().right>innerWidth+2).sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right).slice(0,3).map(n=>({html:n.outerHTML.slice(0,200),visibility:getComputedStyle(n).visibility,overflow:getComputedStyle(n).overflowX,right:n.getBoundingClientRect().right,parent:n.parentElement.outerHTML.slice(0,120)}))));
}
await browser.close();
