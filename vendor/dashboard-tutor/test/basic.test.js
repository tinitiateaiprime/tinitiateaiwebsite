'use strict';
const test=require('node:test');const assert=require('node:assert/strict');const path=require('node:path');const fs=require('node:fs');
const {safePage,idFor}=require('../lib/common');const {analyze}=require('../lib/scanner');const {sequence}=require('../lib/plan');
test('sanitizes HTML paths',()=>{assert.equal(safePage('foundational/python/print.html'),'foundational/python/print.html');for(const bad of ['../../secret.html','.env','/../test.html','page.js'])assert.throws(()=>safePage(bad));});
test('generates stable dashboard IDs',()=>{assert.equal(idFor('foundational/python/print.html'),'foundational-python-print');});
test('detects fixture and its controls',()=>{const m=analyze('test-fixtures/fixture.html');assert.equal(m.adapter,'simulator');assert.equal(m.matched,true);assert.ok(m.candidateControls.includes('#btn-run'));});
test('builds Python lesson scenes with real selectors',()=>{const m={adapter:'pycourse',title:'Python Print',anchor:'#dashboard'};const result=sequence('foundational/python/print.html',m);assert.ok(result.length>=10);assert.deepEqual(result.filter(x=>x.action==='edit').map(x=>x.target),['#py-editor']);assert.ok(result.find(x=>x.target==='#py-run'));});
test('generic simulator plan is safe and action based',()=>{const m=analyze('test-fixtures/fixture.html');const result=sequence(m.path,m);assert.ok(result.some(x=>x.action==='click'&&x.target==='#btn-run'));assert.ok(result.some(x=>x.target==='#btn-reset'));});
test('Python curriculum walkthrough visits all 17 slides in order',()=>{
 const slides=Array.from({length:17},(_,i)=>({index:i,title:`Topic ${i+1}`,idea:`Concept ${i+1}`,tip:'Try the example'}));
 const result=sequence('foundational/python/print.html',{adapter:'pycourse',anchor:'#dashboard',title:'Python Print',slides});
 assert.ok(result.some(x=>x.target==='#py-first'&&x.action==='click'));
 assert.equal(result.filter(x=>x.target==='#py-next'&&x.action==='click').length,16);
 assert.ok(result.some(x=>x.title.includes('slide 17: Topic 17')));
});
test('capture CSS never stretches or translates an active dashboard beyond the viewport',()=>{
 const css=require('../lib/stage').css;
 assert.match(css,/\.tutor-active-stage\s*\{/);
 assert.match(css,/transform:none!important/);
 assert.doesNotMatch(css,/calc\(100vw\s*\+\s*\d+/);
});
