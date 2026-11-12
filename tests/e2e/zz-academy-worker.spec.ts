import {test,expect,type APIRequestContext} from '@playwright/test'
import {readFile,writeFile} from 'node:fs/promises'
import path from 'node:path'
import {execFile} from 'node:child_process'
import {promisify} from 'node:util'
const run=promisify(execFile)
const password='Phase1-Local-Verification-Only!'
const print='foundational-python-print'
async function command(args:string[],extra:Record<string,string>={}){return run(process.execPath,args,{cwd:process.cwd(),env:{...process.env,...extra},timeout:240000,maxBuffer:2_000_000})}
async function login(request:APIRequestContext,email:string){const response=await request.post('/api/users/login',{data:{email,password}});expect(response.status()).toBe(200);return(await response.json()).user}
test('actual CSS changes invalidate recordings; worker records once, deduplicates jobs, and fails revoked jobs safely',async({request,playwright})=>{
 test.setTimeout(420000)
 await login(request,'phase1-admin@example.test')
 const trainer=await playwright.request.newContext({baseURL:process.env.E2E_BASE_URL||'http://localhost:3100'});await login(trainer,'academy-trainer@example.test')
 const original=(await(await request.get(`/api/academy-lessons?where[key][equals]=${print}&depth=0`)).json()).docs[0]
 const sourceReference=(await readFile('.academy-private/import-reference.txt','utf8')).trim()
 const stylesheet=path.join(sourceReference,'foundational/python/python-course.css');const css=await readFile(stylesheet,'utf8')
 const trainerUser=(await(await trainer.get('/api/users/me')).json()).user
 const assignments=(await(await request.get('/api/trainer-assignments?limit=100&depth=0')).json()).docs
 const assignment=assignments.find((row:{trainer:number;course:number})=>row.trainer===trainerUser.id&&row.course===original.course)
 let needsDrain=false
 try{
  await writeFile(stylesheet,css+`\n/* Actual isolated content-version verification ${Date.now()} */\n`)
  await command(['scripts/academy/prepare.mjs',sourceReference]);await command(['scripts/academy/local.mjs','academy'])
  const changed=(await(await request.get(`/api/academy-lessons/${original.id}?depth=0`)).json())
  expect(changed.fingerprint).not.toBe(original.fingerprint)
  const old=(await(await request.get(`/api/lesson-recordings/${original.publishedRecording}?depth=0`)).json());expect(old.reviewRequired).toBe(true)
  const submissions=await Promise.all(Array.from({length:3},()=>trainer.post('/api/academy/jobs',{data:{lesson:print,mode:'silent-preview'}})))
  const jobs=await Promise.all(submissions.map(async response=>{expect([200,202]).toContain(response.status());return response.json()}));expect(new Set(jobs.map(job=>job.job)).size).toBe(1)
  await command(['scripts/academy/local.mjs','worker'],{ACADEMY_WORKER_ONCE:'true'})
  const result=(await(await trainer.get(`/api/recording-jobs/${jobs[0].job}?depth=0`)).json())
  expect(result.status,JSON.stringify(result)).toBe('complete');expect(result.progress.preview).toBe(true);expect(result.progress.duration).toBeGreaterThan(1)
  const after=(await(await request.get(`/api/academy-lessons/${original.id}?depth=0`)).json());expect(after.publishedRecording).toBe(original.publishedRecording)
  const variables='foundational-python-variables';const failed=await trainer.post('/api/academy/jobs',{data:{lesson:variables,mode:'silent-preview'}});expect(failed.status()).toBe(202);const failedID=(await failed.json()).job
  await request.patch(`/api/trainer-assignments/${assignment.id}`,{data:{active:false}})
  await command(['scripts/academy/local.mjs','worker'],{ACADEMY_WORKER_ONCE:'true'})
  expect((await(await request.get(`/api/recording-jobs/${failedID}`)).json()).status).toBe('failed')
  await request.patch(`/api/trainer-assignments/${assignment.id}`,{data:{active:true}})
  const retry=await trainer.post('/api/academy/jobs',{data:{lesson:variables,mode:'silent-preview'}});expect(retry.status()).toBe(202);expect((await retry.json()).job).toBe(failedID);needsDrain=true
 }finally{
  await request.patch(`/api/trainer-assignments/${assignment.id}`,{data:{active:true}})
  await writeFile(stylesheet,css);await command(['scripts/academy/prepare.mjs',sourceReference]);await command(['scripts/academy/local.mjs','academy'])
  if(needsDrain)await command(['scripts/academy/local.mjs','worker'],{ACADEMY_WORKER_ONCE:'true'})
  const lessons=(await(await request.get('/api/academy-lessons?limit=200&depth=0')).json()).docs
  for(const lesson of lessons.filter((row:{key:string;publishedRecording:number})=>row.key.startsWith('foundational-python-')&&row.publishedRecording))expect((await request.post('/api/academy/approve',{data:{recording:lesson.publishedRecording}})).status()).toBe(200)
  await trainer.dispose()
 }
})
