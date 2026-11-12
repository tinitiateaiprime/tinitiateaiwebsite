import {getPayload} from 'payload'
import config from '../../src/payload.config.ts'
import {DatabaseSync} from 'node:sqlite'
import {createRequire} from 'node:module'
import {createServer} from 'node:http'
import {createHash,randomBytes} from 'node:crypto'
import {readFile,writeFile,copyFile,mkdir,unlink,rm} from 'node:fs/promises'
import path from 'node:path'
import manifest from '../../src/integrations/academy/manifest.json' with {type:'json'}
import {assertStagingEnvironment} from '../../src/lib/staging/environment.mjs'
import {sourceFile} from '../../src/lib/academy/storage.ts'
import {storeRecording} from '../staging/worker-storage.mjs'

const staging=process.env.INTEGRATION_TARGET==='staging'
if(process.env.NETLIFY==='true')throw Error('Run the recording worker separately from Netlify Functions.')
if(staging){assertStagingEnvironment();if(process.env.STORAGE_PROVIDER!=='s3')throw Error('Staging worker requires private object storage')}
else if(process.env.INTEGRATION_TARGET!=='local'||process.env.DB_PROVIDER!=='sqlite'||!process.env.DATABASE_URI?.replaceAll('\\','/').endsWith('/.phase2-local/site.db'))throw Error('Worker requires an isolated queue. No public recording API is started.')
const root=path.resolve(staging?'.staging-private/worker':process.env.ACADEMY_PRIVATE_ROOT||'.academy-private');const require=createRequire(import.meta.url)
process.env.ACADEMY_CAPTURE_ROOT=path.join(root,'source');process.env.ACADEMY_WORK_DIR=path.join(root,'work','worker-'+process.pid+'-'+randomBytes(8).toString('hex'));process.env.ACADEMY_MANIFESTS_DIR=path.join(root,'manifests');process.env.ACADEMY_GENERATED_DIR=path.join(root,'generated','worker-'+process.pid+'-'+randomBytes(8).toString('hex'));process.env.TUTOR_VISIBLE='0'
const {recordDashboard}=require(path.resolve('vendor/dashboard-tutor/lib/recorder.js'))
const chromium=require('playwright').chromium;const originalLaunch=chromium.launch.bind(chromium);let origin='';const browsers=new Set()
const allowed=new Set(['https://unpkg.com','https://cdnjs.cloudflare.com','https://cdn.jsdelivr.net','https://fonts.googleapis.com','https://fonts.gstatic.com','https://d3js.org'])
const network=route=>{const url=new URL(route.request().url());return url.protocol==='data:'||url.protocol==='blob:'||url.origin===origin||allowed.has(url.origin)?route.continue():route.abort()}
chromium.launch=async options=>{const browser=await originalLaunch({...options,args:(options.args||[]).filter(arg=>arg!=='--no-sandbox')});browsers.add(browser);const createContext=browser.newContext.bind(browser);browser.newContext=async options=>{const context=await createContext(options);await context.route('**/*',network);return context};const createPage=browser.newPage.bind(browser);browser.newPage=async options=>{const page=await createPage(options);await page.route('**/*',network);return page};return browser}
const nativeFetch=globalThis.fetch.bind(globalThis);let activeSignal
globalThis.fetch=(input,options={})=>nativeFetch(input,{...options,signal:activeSignal?AbortSignal.any([activeSignal,AbortSignal.timeout(30000)]):AbortSignal.timeout(30000)})
const payload=await getPayload({config})
const idOf=value=>typeof value==='object'?value.id:value
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))
async function processJob(job){
 let server;let heartbeat;let progressWrites=Promise.resolve();const abort=new AbortController();activeSignal=abort.signal;const deadline=setTimeout(()=>{abort.abort();for(const browser of browsers)void browser.close()},30*60_000);const nonce=randomBytes(32).toString('hex');const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2'}
 try{
  const lesson=await payload.findByID({collection:'academy-lessons',id:idOf(job.lesson),depth:0})
  const trainer=await payload.findByID({collection:'users',id:idOf(job.trainer),depth:0})
  const assignment=await payload.count({collection:'trainer-assignments',where:{and:[{trainer:{equals:trainer.id}},{course:{equals:idOf(lesson.course)}},{active:{equals:true}}]}})
  if(!['admin','trainer'].includes(trainer.role)||!assignment.totalDocs||lesson.fingerprint!==job.fingerprint)throw Error('Assignment or lesson version changed')
  if(job.mode==='narrated'&&(process.env.ALLOW_PAID_RECORDING!=='true'||!process.env.ELEVENLABS_API_KEY||!process.env.ELEVENLABS_VOICE_ID))throw Error('Narrated recording is not configured')
  const entry=manifest.lessons.find(l=>l.key===lesson.key);if(!entry||entry.fingerprint!==job.fingerprint)throw Error('Missing or changed lesson source version')
  const permit=new Set([entry.sourcePath,...entry.assets])
  if(staging){const filename=path.join(root,'source',entry.sourcePath);await mkdir(path.dirname(filename),{recursive:true});const bytes=await sourceFile(entry.sourcePath);if(createHash('sha256').update(bytes).digest('hex')!==manifest.files[entry.sourcePath])throw Error('Private source integrity failure');await writeFile(filename,bytes)}
  server=createServer(async(req,res)=>{try{
   const url=new URL(req.url,'http://localhost');if(req.method!=='GET'||!url.pathname.startsWith('/'+nonce+'/')){res.writeHead(403);res.end();return}
   const relative=decodeURIComponent(url.pathname.slice(nonce.length+2));if(!permit.has(relative)){res.writeHead(404);res.end();return}
   let bytes=staging?await sourceFile(relative):await readFile(path.join(root,'source',relative));if(createHash('sha256').update(bytes).digest('hex')!==manifest.files[relative]){res.writeHead(409);res.end();return}if(relative.endsWith('.html')){let html=bytes.toString('utf8');for(const [url,library]of Object.entries(manifest.external||{}))html=html.replaceAll(url,'/'+nonce+'/'+library.path);bytes=Buffer.from(html)}res.writeHead(200,{'Content-Type':mime[path.extname(relative)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes)
  }catch{res.writeHead(404);res.end()}})
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));origin=`http://127.0.0.1:${server.address().port}`
  heartbeat=setInterval(()=>void payload.update({collection:'recording-jobs',id:job.id,data:{leaseExpiresAt:new Date(Date.now()+120_000).toISOString()}}),30_000)
  const result=await recordDashboard({page:lesson.sourcePath,baseUrl:origin+'/'+nonce+'/',silent:job.mode==='silent-preview',limit:job.mode==='silent-preview'?3:0,progress:next=>{const {state,step,completed,total}=next;progressWrites=progressWrites.then(()=>payload.update({collection:'recording-jobs',id:job.id,data:{progress:{state,step,completed,total}}}))}})
  await progressWrites
  const stillAssigned=await payload.count({collection:'trainer-assignments',where:{and:[{trainer:{equals:trainer.id}},{course:{equals:idOf(lesson.course)}},{active:{equals:true}}]}});if(!stillAssigned.totalDocs)throw Error('Trainer assignment was revoked during capture')
  const latest=await payload.findByID({collection:'academy-lessons',id:lesson.id,depth:0})
  if(latest.fingerprint!==job.fingerprint)throw Error('Lesson changed during capture')
  if(job.mode==='silent-preview')await payload.update({collection:'recording-jobs',id:job.id,data:{status:'complete',progress:{state:'complete',preview:true,duration:result.duration}}})
  else{
   const source=path.join(process.env.ACADEMY_GENERATED_DIR,`${result.id}.mp4`);const bytes=await readFile(source);const sha256=createHash('sha256').update(bytes).digest('hex');const blob=sha256+'.mp4';let storageVerification
   if(staging)storageVerification=await storeRecording({filename:source,bytes,blob,sha256,fingerprint:job.fingerprint})
   else{await mkdir(path.join(root,'blobs'),{recursive:true});await copyFile(source,path.join(root,'blobs',blob))}
   const recording=await payload.create({collection:'lesson-recordings',data:{key:`${lesson.key}:${sha256}`,lesson:lesson.id,fingerprint:job.fingerprint,blob,sha256,bytes:bytes.length,duration:result.duration,status:'pending-review',metadata:{...result,...(storageVerification?{storageVerification}:{})}}})
   await payload.update({collection:'recording-jobs',id:job.id,data:{status:'awaiting-review',recording:recording.id,progress:{state:'awaiting-review'}}})
   await unlink(source);const work=path.resolve(process.env.ACADEMY_WORK_DIR);if(!work.startsWith(path.join(root,'work')+path.sep))throw Error('Unsafe capture cleanup path');await rm(work,{recursive:true,force:true})
  }
 }catch(error){console.error('Restricted worker job failed:',job.id,error.message);await payload.update({collection:'recording-jobs',id:job.id,data:{status:'failed',error:String(error.message).includes('configured')?'Narration credentials or administrator enablement are missing.':'Recording failed; review the restricted worker log.',progress:{state:'failed'}}})}
 finally{clearTimeout(deadline);activeSignal=undefined;await progressWrites.catch(()=>{});clearInterval(heartbeat);for(const browser of browsers){await browser.close().catch(()=>{});browsers.delete(browser)}if(server)await new Promise(resolve=>server.close(resolve))}
}
try{
 do{
  const queued=(await payload.find({collection:'recording-jobs',where:{status:{equals:'queued'}},sort:'createdAt',limit:1,depth:0})).docs[0]
  if(queued){
   let claimed
   if(staging)claimed=await payload.db.updateOne({collection:'recording-jobs',where:{and:[{id:{equals:queued.id}},{status:{equals:'queued'}}]},data:{status:'processing',leaseExpiresAt:new Date(Date.now()+120_000).toISOString()},options:{atomic:true}})
   else{const sql=new DatabaseSync(process.env.DATABASE_URI.slice(5));sql.exec('PRAGMA busy_timeout=10000');claimed=sql.prepare("UPDATE recording_jobs SET status='processing', lease_expires_at=? WHERE id=? AND status='queued' RETURNING id").get(new Date(Date.now()+120_000).toISOString(),queued.id);sql.close()}
   if(claimed)await processJob(queued)
  }
  if(process.env.ACADEMY_WORKER_ONCE==='true')break
  await wait(1000)
 }while(true)
}finally{await payload.destroy()}
