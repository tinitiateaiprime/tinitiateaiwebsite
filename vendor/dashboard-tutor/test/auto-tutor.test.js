'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {repoRoot}=require('../lib/common');
const {inject}=require('../lib/auto');
const {getManifest}=require('../lib/scanner');
const {server}=require('../lib/server');

const filename=`_auto_tutor_probe_${process.pid}.html`;
const relative=`foundational/python/${filename}`;
const file=path.join(repoRoot,relative);
const newLesson='<!doctype html><html><head><title>New JavaScript Lesson</title></head><body><main><h1>New Lesson</h1><button id="a" onclick="go()">Run</button><button id="b" onclick="go()">Step</button><button id="c" onclick="go()">Reset</button></main></body></html>';
const nonInteractive='<!doctype html><html><head></head><body><main><h1>Ordinary article</h1><p>Not a dashboard</p></main></body></html>';

function create(){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,newLesson,'utf8');}
function cleanup(){try{fs.unlinkSync(file);}catch{}}

test('a newly added interactive page is detected without running scan/install',{concurrency:false},()=>{
  create();try{
    const m=getManifest(relative);
    assert.equal(m.matched,true);
    assert.equal(m.path,relative);
    const wrapped=inject(newLesson,relative);
    assert.equal(wrapped.enabled,true);
    assert.match(wrapped.html, /data-tutor-auto/);
    assert.match(wrapped.html, /dashboard-tutor\/client\/auto-tour\.js/);
    assert.equal(fs.readFileSync(file,'utf8'),newLesson,'original HTML stays unchanged');
    assert.equal(inject(wrapped.html,relative).enabled,false,'no duplicate script on repeat');
  }finally{cleanup();}
});

test('static articles and explicitly integrated V2 pages are never modified',{concurrency:false},()=>{
  create();try{
    fs.writeFileSync(file,nonInteractive,'utf8');
    assert.equal(inject(nonInteractive,relative).enabled,false);
    fs.writeFileSync(file,newLesson,'utf8');
    const custom=newLesson.replace('</body>','<script src="../../dashboard-tutor/client/print-v2-integration.js"></script></body>');
    assert.equal(inject(custom,relative).enabled,false);
    assert.equal(inject(newLesson.replace('</body>','<script data-tutor-loader src="some.js"></script></body>'),relative).enabled,false);
  }finally{cleanup();}
});

test('HTTP server auto-injects on first request and capture URL omits recorder UI',{concurrency:false},async()=>{
  create();const app=server({port:4173});
  try{
    await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
    const base=`http://127.0.0.1:${app.address().port}/`;
    let response=await fetch(base+relative);let html=await response.text();
    assert.equal(response.status,200);assert.match(html,/data-tutor-auto/);
    assert.match(html,/auto-tour\.js/);
    response=await fetch(base+relative+'?__tutor_capture=1');html=await response.text();
    assert.equal(response.status,200);assert.doesNotMatch(html,/data-tutor-auto/);
    fs.writeFileSync(file,nonInteractive,'utf8');
    response=await fetch(base+relative);html=await response.text();
    assert.doesNotMatch(html,/data-tutor-auto/,'same URL is re-evaluated after editing');
    assert.equal(fs.readFileSync(file,'utf8'),nonInteractive);
  }finally{await new Promise(resolve=>app.close(resolve));cleanup();}
});
