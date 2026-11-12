'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const stage=require('../lib/stage');
const {sequence,teachSlide}=require('../lib/plan');
const {statsOf,TARGET_LUFS}=require('../lib/narration');
test('caption text is broken into readable pieces',()=>{
 const source='Variables are named containers that store values and can be changed throughout a program, allowing Python code to reuse meaningful pieces of data.';
 const chunks=stage.captionChunks(source,60);
 assert.ok(chunks.length>=2);
 assert.equal(chunks.join(' '),source);
 assert.ok(chunks.every(c=>c.length<=60));
});
test('centered 16:9 capture avoids large cursor and unpainted page backgrounds',()=>{
 assert.match(stage.css, /#tutor-backdrop/);
 assert.match(stage.css, /left:50vw!important/);
 assert.match(stage.css, /translate\(-50%,-50%\)/);
 assert.match(stage.css, /#tutor-spotlight/);
 assert.match(stage.css, /#tutor-ripple/);
 assert.doesNotMatch(stage.css, /content:'➤'/);
 assert.doesNotMatch(stage.css,/transform:scale\(/);
});
test('Python lesson narration describes conceptual content not just controls',()=>{
 const concept=teachSlide({title:'What is a variable?',idea:'A variable stores a value.',analogy:'Think of a labeled box.',explain:'Use a name and equals sign.',code:'age = 25',output:'25'},{code:true,output:true});
 for(const needle of ['stores a value','labeled box','equals sign','age = 25','expected output'])assert.ok(concept.includes(needle),needle);
 const slides=[{title:'What is a variable?',idea:'A variable stores a value.',explain:'It has a name.'},{title:'Change a variable',idea:'Reassign a new value.'},{title:'Delete a variable',idea:'Use del to remove a name.'}];
 const scenes=sequence('foundational/python/variables.html',{title:'Python Variables',adapter:'pycourse',anchor:'#dashboard',slides});
 assert.ok(scenes.some(s=>s.narration.includes('Reassign a new value')));
 assert.ok(scenes.some(s=>s.narration.includes('Use del to remove')));
 assert.equal(scenes.filter(s=>s.target==='#py-next'&&s.action==='click').length,2);
});
test('audio pipeline disables amix progressive volume normalization',()=>{
 const text=fs.readFileSync(path.join(__dirname,'../lib/recorder.js'),'utf8');
 assert.match(text,/normalize=0/);
 assert.match(text,/alimiter=limit=0\.84/);
 assert.equal(TARGET_LUFS,-16);
});
test('two-pass loudnorm parses FFmpeg measurements safely',()=>{
 const log='[Parsed_loudnorm] { "input_i" : "-32.4", "input_tp" : "-9.4", "input_lra" : "3.4", "input_thresh" : "-42.4", "output_i" : "-16.1", "target_offset" : "-0.2" }';
 assert.equal(statsOf(log).input_i,'-32.4');
 assert.equal(statsOf('not a measurement'),null);
});
