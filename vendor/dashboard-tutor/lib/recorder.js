'use strict';
const {fs,path,repoRoot,generatedDir,workDir,mkdir,writeJson,run,safePage,idFor}=require('./common');
const {getManifest}=require('./scanner');
const {sequence}=require('./plan');
const {prepareAudio,duration}=require('./narration');
const stage=require('./stage');
const live=require('./live');
function chromiumTool(){try{return require('playwright').chromium}catch(e){if(process.env.PLAYWRIGHT_CORE_PATH)return require(process.env.PLAYWRIGHT_CORE_PATH).chromium;throw Error('Playwright is not installed: run npm install inside dashboard-tutor');}}
async function mux(video,audios,timeline,trim,seconds,out){const hasVoice=audios.some(a=>a.file);const args=['-y','-loglevel','error','-ss',trim.toFixed(3),'-i',video];
 for(const a of audios.filter(x=>x.file))args.push('-i',a.file);
 if(hasVoice){const chains=[];let n=0;
 for(let i=0;i<audios.length;i++){const a=audios[i];if(!a.file)continue;n++;const delay=Math.max(0,Math.round(timeline[i].at*1000));chains.push(`[${n}:a]aresample=48000,adelay=${delay}|${delay}[a${n}]`);}
 chains.push(`${Array.from({length:n},(_,i)=>`[a${i+1}]`).join('')}amix=inputs=${n}:duration=longest:dropout_transition=0:normalize=0,atrim=duration=${seconds.toFixed(3)},alimiter=limit=0.84:level=false[mixed]`);
 args.push('-filter_complex',chains.join(';'),'-map','0:v:0','-map','[mixed]');
 }else args.push('-map','0:v:0','-an');
 args.push('-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p','-r','30','-movflags','+faststart',...(hasVoice?['-c:a','aac','-b:a','160k']:[]),'-t',seconds.toFixed(3),out);
 await run(process.env.FFMPEG_BIN||'ffmpeg',args);
}
async function action(page,scene){const locator=page.locator(scene.target).first();if(scene.action==='show')return;
 if(scene.action==='click'){
   if(!(await locator.isEnabled()))throw Error(`Button disabled: ${scene.target}`);
   // Playwright's physical click must land at the same position as the
   // narrated cursor, even if the control changed its caption since discovery.
   await stage.visualAudit(page,scene.target);
   const box=await locator.boundingBox();
   if(!box)throw Error('Click target has no visible geometry: '+scene.target);
   await stage.pulse(page);
   await locator.click({position:{x:box.width/2,y:box.height/2},timeout:15000});
   if(scene.verify){await page.locator(scene.verify).waitFor({state:'visible',timeout:18000});
     if(scene.expectContains)await page.waitForFunction(({selector,text})=>!!document.querySelector(selector)?.textContent?.includes(text),{selector:scene.verify,text:scene.expectContains},{timeout:30000});
   }
 }else if(scene.action==='edit'){
   const code=page.locator('.CodeMirror').first();
   if(await code.count()){await code.click({timeout:15000});await page.keyboard.press('ControlOrMeta+A');await page.keyboard.type(scene.value,{delay:65});}
   else{const editor=page.locator(`${scene.target} textarea,${scene.target} [contenteditable="true"]`).first();if(!await editor.count())throw Error('Editable element not detected');await editor.fill(scene.value);}
 }else throw Error('Unsupported tutorial action: '+scene.action);
}
async function recordDashboard({page:pagePath,baseUrl, silent=false,limit=0,progress=()=>{}}){
 pagePath=safePage(pagePath);const manifest=getManifest(pagePath);if(!manifest.matched)throw Error(`Not identified as an interactive dashboard: ${pagePath}`);
 const id=idFor(pagePath);const stamp=new Date().toISOString().replace(/[^\d]/g,'').slice(0,14);const work=path.join(workDir,`${id}-${stamp}`);mkdir(work);mkdir(generatedDir);
 const chromium=chromiumTool();const visible=process.env.TUTOR_VISIBLE==='1'||(process.platform==='win32'&&process.env.TUTOR_VISIBLE!=='0');const launchOpts={headless:!visible,args:['--no-sandbox','--disable-dev-shm-usage',...(visible?['--start-fullscreen','--start-maximized']:[])]};if(process.env.TUTOR_CHROMIUM)launchOpts.executablePath=process.env.TUTOR_CHROMIUM;
 const u=new URL(pagePath,baseUrl.endsWith('/')?baseUrl:baseUrl+'/');
 // AUTO_TUTOR_V1: the recorder captures the lesson, without recorder controls.
 u.searchParams.set('__tutor_capture','1');
 progress({state:'inspecting',completed:0,total:0});
 const discovered=await live.discoverDetailed(chromium,u.href,launchOpts);const liveControls=discovered.controls;manifest.liveControls=liveControls;manifest.slides=discovered.slides;manifest.pageOverview=discovered.pageOverview;
  const fullScenes=sequence(pagePath,manifest);
 // AUTO_TUTOR_V1: some Academy Python lessons intentionally hide their outline.
 // Never aim the capture spotlight at a non-visible element.
 if(manifest.adapter==='pycourse') for(const scene of fullScenes){
   if(scene.target==='#py-outline'){
     scene.target='#py-stage';scene.stage='#player';
     scene.narration='The lesson player combines explanations, editable Python code and output. Use the navigation controls to revisit and practise the examples.';
   }
 }
 const scenes=limit>0?fullScenes.slice(0,limit):fullScenes;
 writeJson(path.join(work,'discovery.json'),{page:pagePath,adapter:manifest.adapter,controls:liveControls,slides:discovered.slides,scenes});
 progress({state:'narrating',completed:0,total:scenes.length});
 const clips=await prepareAudio(scenes,path.join(work,'audio'),{silent});
 const browser=await chromium.launch(launchOpts);let rawVideo;let timeline=[];let failures=[];let trim=0;let seconds=0;
 try{
   mkdir(path.join(work,'video'));
   const context=await browser.newContext({viewport:{width:1920,height:1080},deviceScaleFactor:1,recordVideo:{dir:path.join(work,'video'),size:{width:1920,height:1080}}});
   const pageCreate=Date.now();const pw=await context.newPage();
   await pw.goto(u.href,{waitUntil:'domcontentloaded',timeout:45000});
   await pw.locator(manifest.adapter==='pycourse'?'#py-stage':manifest.anchor).first().waitFor({state:'attached',timeout:25000}).catch(()=>{});
   await pw.waitForTimeout(1300);
   await live.decorate(pw);
   await stage.setup(pw);
   const origin=Date.now();trim=(origin-pageCreate)/1000;
   for(let i=0;i<scenes.length;i++){
     const scene=scenes[i];progress({state:'recording',step:scene.title,completed:i,total:scenes.length});
     try{
       const layout=await stage.focus(pw,scene.stage,scene.target);
       if(layout.invalid.length){
         await pw.screenshot({path:path.join(work,`layout-failure-scene-${i+1}.png`),fullPage:false}).catch(()=>{});
         writeJson(path.join(work,`layout-failure-scene-${i+1}.json`),layout);
         throw Error('Capture layout clipped: '+JSON.stringify(layout.invalid));
       }
       if(process.env.TUTOR_DEBUG==='1'){await pw.screenshot({path:path.join(work,`scene-${String(i+1).padStart(2,'0')}.png`),fullPage:false});}
       if(!(await pw.locator(scene.target).count()))throw Error('Missing element: '+scene.target);
       await stage.point(pw,scene.target);
       const at=(Date.now()-origin)/1000;
       const expected=Math.max(2.7,(clips[i]?.duration||4.2)+0.95,scene.holdMs/1000);
       await stage.caption(pw,scene.narration,expected);
       const before=scene.action==='click'?await stage.visualAudit(pw,scene.target):null;
       await action(pw,scene);
       // The target may change from 'Start learning' to 'Continue at slide 3'
       // after opening a lesson. Track both its label AND its new rectangle.
       let interactionAudit=null;
       if(scene.action==='click'){
         await pw.waitForTimeout(150);
         interactionAudit=await stage.visualAudit(pw,scene.target);
       }
       const elapsed=(Date.now()-origin)/1000-at;
       await pw.waitForTimeout(Math.max(0,expected-elapsed)*1000);
       // Last-frame audit catches late content/size mutations during narration,
       // even in non-click teaching scenes. Reflow once; never publish drift.
       const finalFx=await stage.visualAudit(pw,scene.target);
       timeline.push({scene:i+1,title:scene.title,at,seconds:Math.max(expected,elapsed),target:scene.target,action:scene.action,layout,
         finalEffectAudit:{active:finalFx.active,valid:finalFx.ok,driftPx:finalFx.driftPx??null,pointerDriftPx:finalFx.pointerDriftPx??null},
         interactionAudit:interactionAudit?{
         beforeLabel:before?.label||'',afterLabel:interactionAudit.label||'',
         beforeRect:before?.target||null,afterRect:interactionAudit.target||null,
         driftPx:interactionAudit.driftPx??null,pointerDriftPx:interactionAudit.pointerDriftPx??null,
         hitTest:interactionAudit.hitTest??null,valid:interactionAudit.ok}:null});
     }catch(e){
       const issue=String(e.message||e);
       failures.push({scene:i+1,target:scene.target,error:issue});
       if(/Highlight|spotlight|Cursor\/spotlight|visual mismatch/.test(issue)){
         await pw.screenshot({path:path.join(work,`effect-failure-scene-${i+1}.png`),fullPage:false}).catch(()=>{});
         const fx=await pw.evaluate(()=>window.__tutorFx?.audit()).catch(()=>null);
         writeJson(path.join(work,`effect-failure-scene-${i+1}.json`),{scene:i+1,target:scene.target,error:issue,effect:fx});
       }
       throw Error(`Scene ${i+1} failed: ${issue}`);
     }
   }
   seconds=(Date.now()-origin)/1000+0.7;await pw.waitForTimeout(700);rawVideo=await pw.video().path();
   await context.close();
 }catch(e){writeJson(path.join(work,'failure.json'),{page:pagePath,error:String(e),failures,timeline});throw e;}
 finally{await browser.close();}
 progress({state:'rendering',completed:scenes.length,total:scenes.length});
 const target=path.join(generatedDir,`${id}.mp4`),tmp=path.join(work,`${id}.mp4`);
 await mux(rawVideo,clips,timeline,trim,seconds,tmp);
 const actual=await duration(tmp);
 if(actual<Math.max(1,seconds-1.2)||fs.statSync(tmp).size<2000)throw Error(`Invalid output duration or size: ${actual}`);
 // Short/silent test clips never replace a previously published narrated lesson.
 const preview=!!silent||limit>0;
 if(!preview)fs.copyFileSync(tmp,target);
 const metadata={id,page:pagePath,createdAt:new Date().toISOString(),silent:!!silent,video:preview?null:`assets/dashboard-tutorials/${id}.mp4`,previewOutput:preview?tmp:undefined,duration:actual,resolution:'1920x1080',status:preview?'preview':'complete',audioTargetLufs:silent?null:-16,sceneCount:scenes.length,scenes:timeline};
 if(!preview)writeJson(path.join(generatedDir,`${id}.json`),metadata);
 writeJson(path.join(work,'timeline.json'),metadata);
 progress({state:'complete',completed:scenes.length,total:scenes.length,video:metadata.video,preview});
 return metadata;
}
module.exports={recordDashboard,mux};
