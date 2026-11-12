'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path');
const {repoRoot}=require('../lib/common');const {inject}=require('../lib/auto');const {getManifest}=require('../lib/scanner');
const {server}=require('../lib/server');
const sourceFile=path.join(repoRoot,'foundational/python/print.html');
test('original Academy Python Print is discovered automatically, but not rewritten',()=>{
 const original=fs.readFileSync(sourceFile,'utf8');const m=getManifest('foundational/python/print.html');
 assert.equal(m.matched,true);assert.equal(m.adapter,'pycourse');
 const r=inject(original,'foundational/python/print.html');assert.equal(r.enabled,true);
 assert.match(r.html,/data-tutor-auto/);assert.equal(fs.readFileSync(sourceFile,'utf8'),original);
});
test('root homepage and Python modules retain original links',()=>{
 assert.ok(fs.readFileSync(path.join(repoRoot,'index.html'),'utf8').includes('foundational/python/print.html'));
 assert.ok(fs.readFileSync(path.join(repoRoot,'foundational/python/index.html'),'utf8').includes('print.html'));
});
test('HTTP server serves actual print lesson, recorder JS, and capture route', async()=>{
 const app=server({port:4173});await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${app.address().port}`;
 try{
  let r=await fetch(base+'/foundational/python/print.html');let html=await r.text();
  assert.equal(r.status,200);assert.match(html,/auto-tour\.js/);assert.match(html,/data-tutor-auto/);
  r=await fetch(base+'/dashboard-tutor/client/auto-tour.js');assert.equal(r.status,200);
  r=await fetch(base+'/foundational/python/print.html?__tutor_capture=1');html=await r.text();
  assert.equal(r.status,200);assert.doesNotMatch(html,/data-tutor-auto/);
  r=await fetch(base+'/foundational/python/print-v2.html');assert.equal(r.status,404,'do not invent V2 routing in this archive');
 }finally{await new Promise(resolve=>app.close(resolve));}
});
