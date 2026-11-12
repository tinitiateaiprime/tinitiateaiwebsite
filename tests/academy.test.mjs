import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile,stat} from 'node:fs/promises'
import path from 'node:path'
import {load} from 'cheerio'
import {signTicket,verifyTicket,parseRange,safeRelative,progressState} from '../src/lib/academy/primitives.mjs'
import {activeCollection,collectionHeaders,cookieValues} from '../src/lib/auth/cookies.ts'
const secret='verification-secret-longer-than-twenty-four-characters'

test('student and CMS cookies select independent credentials without losing CSRF context',()=>{
 const headers=new Headers({cookie:'tinitiate-users-token=staff; tinitiate-students-token=learner; tinitiate-audience=students',origin:'https://example.test'})
 assert.equal(activeCollection(headers),'students')
 assert.equal(cookieValues(collectionHeaders(headers,'students')).get('tinitiate-users-token'),'learner')
 assert.equal(cookieValues(collectionHeaders(headers,'users')).get('tinitiate-users-token'),'staff')
 assert.equal(collectionHeaders(headers,'students').get('origin'),'https://example.test')
 assert.equal(cookieValues(headers).get('tinitiate-users-token'),'staff')
})

test('an absent student or CMS session never falls back to the other collection cookie',()=>{
 const onlyStaff=new Headers({cookie:'tinitiate-users-token=staff'})
 const onlyStudent=new Headers({cookie:'tinitiate-students-token=learner'})
 assert.equal(cookieValues(collectionHeaders(onlyStaff,'students')).has('tinitiate-users-token'),false)
 assert.equal(cookieValues(collectionHeaders(onlyStudent,'users')).has('tinitiate-users-token'),false)
})
test('scoped capabilities reject forgery, expiry, truncation and missing secrets',()=>{
 const value={lesson:'foundational-python-print',version:'v1',collection:'students',userID:1,expires:Date.now()+10000}
 const token=signTicket(value,secret);assert.deepEqual(verifyTicket(token,secret),value)
 assert.equal(verifyTicket(token+'x',secret),null);assert.equal(verifyTicket(token,secret,Date.now()+20000),null);assert.equal(verifyTicket(token,'wrong'),null);assert.throws(()=>signTicket(value,''))
})
test('HTTP byte ranges include suffix, open-ended, clamped and invalid ranges',()=>{
 assert.deepEqual(parseRange('bytes=0-9',100),{start:0,end:9,partial:true});assert.deepEqual(parseRange('bytes=-10',100),{start:90,end:99,partial:true});assert.deepEqual(parseRange('bytes=90-',100),{start:90,end:99,partial:true});assert.deepEqual(parseRange('bytes=90-999',100),{start:90,end:99,partial:true})
 for(const value of ['bytes=100-','bytes=30-20','bytes=0-1,4-5','bytes=-0','items=0-1','bytes=-'])assert.equal(parseRange(value,100),null,value)
})
test('asset paths cannot escape private distribution or expose worker files',()=>{
 assert.ok(safeRelative('foundational/python/python-course.js'))
 for(const value of ['../secret','/root','a/../b','a\\b','a//b','dashboard-tutor/client/auto-tour.js','Final-videos/file.mp4','assets/dashboard-tutorials/file.mp4'])assert.equal(safeRelative(value),false)
})
test('progress accepts only the current lesson deck and bounded integer slides',()=>{
 assert.deepEqual(progressState({print:[3,1,1],variables:[50]},'print'),{print:[1,3]})
 for(const input of [{print:['1']},{print:[-1]},{print:[1000]},null])assert.throws(()=>progressState(input,'print'))
})
test('all 133 pages are classified and original six recordings are content-addressed',async()=>{
 const manifest=JSON.parse(await readFile('src/integrations/academy/manifest.json','utf8'))
 assert.equal(manifest.lessons.length,133);assert.equal(new Set(manifest.lessons.map(l=>l.key)).size,133);assert.equal(manifest.recordings.length,6);assert.equal(new Set(manifest.recordings.map(r=>r.blob)).size,6)
 for(const lesson of manifest.lessons){assert.ok(['lesson','demo','course-hub','obsolete-duplicate','separate-material'].includes(lesson.kind));assert.match(lesson.fingerprint,/^[a-f0-9]{64}$/);assert.equal(lesson.publicDemo,false);assert.ok(!lesson.assets.some(asset=>asset.startsWith('dashboard-tutor/')||asset.endsWith('.mp4')))}
 for(const recording of manifest.recordings){assert.equal((await stat('.academy-private/blobs/'+recording.blob)).size,recording.bytes);assert.equal(recording.metadata.status,'complete');assert.ok(recording.duration>400)}
})

test('original HTML dependencies remain reachable through each protected lesson allowlist',async()=>{
 const manifest=JSON.parse(await readFile('src/integrations/academy/manifest.json','utf8'))
 for(const lesson of manifest.lessons.filter(row=>!['obsolete-duplicate','separate-material'].includes(row.kind))){
  const $=load(await readFile('.academy-private/source/'+lesson.sourcePath,'utf8'))
  $('script[src],link[rel="stylesheet"][href],img[src],audio[src]').each((_,node)=>{
   const value=$(node).attr(node.tagName==='link'?'href':'src')
   if(!value||/^(https?:|data:|blob:|#|\/\/)/.test(value)||/master-global-nav|auto-tour/.test(value))return
   const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(lesson.sourcePath),value.split(/[?#]/)[0]))
   assert.ok(lesson.assets.includes(resolved),`${lesson.key}: ${value} must resolve to an authorized dependency`)
   assert.ok(manifest.files[resolved],`${resolved} must exist in the private source manifest`)
  })
 }
})
