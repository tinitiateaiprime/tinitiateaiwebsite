import {getPayload} from 'payload'
import config from '../../src/payload.config'
import manifest from '../../src/integrations/academy/manifest.json'
import mappings from '../../src/integrations/academy/course-mapping.json'
import {writeFile} from 'node:fs/promises'
if(process.env.INTEGRATION_TARGET!=='local'||process.env.DB_PROVIDER!=='sqlite'||!process.env.DATABASE_URI?.replaceAll('\\','/').endsWith('/.phase2-local/site.db'))throw Error('Academy import requires the isolated Phase 2 database')
const payload=await getPayload({config});let created=0,updated=0;const mapRows:string[]=[]
try{
 const courses=(await payload.find({collection:'courses',pagination:false,depth:0})).docs
 for(const row of manifest.lessons){
  if(['obsolete-duplicate','separate-material'].includes(row.kind))continue
  const prefix=Object.keys(mappings).sort((a,b)=>b.length-a.length).find(p=>row.sourcePath.startsWith(p+'/'))
  const candidates=prefix?(mappings as Record<string,string[]>)[prefix]:[]
  const course=candidates.map(slug=>courses.find(c=>c.slug===slug)).find(Boolean)
  mapRows.push(`| ${row.sourcePath} | ${course?`${course.id} / ${course.slug}`:'Unmapped — no record published'} |`)
  if(!course)continue
  const existing=(await payload.find({collection:'academy-lessons',where:{key:{equals:row.key}},limit:1,depth:0})).docs[0]
  const data={key:row.key,title:row.title,course:course.id,sourcePath:row.sourcePath,fingerprint:row.fingerprint,kind:row.kind as 'lesson'|'demo'|'course-hub'}
  const lesson=existing?existing:await payload.create({collection:'academy-lessons',data})
  if(!existing)created++
  else if(existing.fingerprint!==row.fingerprint||existing.course!==course.id){
   await payload.update({collection:'academy-lessons',id:existing.id,data});updated++
   await payload.update({collection:'lesson-recordings',where:{lesson:{equals:existing.id}},data:{reviewRequired:true}})
  }
  const original=manifest.recordings.find(recording=>recording.lessonKey===row.key)
  if(original){
   const key=`${row.key}:${original.sha256}:${row.fingerprint}`
   const exists=(await payload.find({collection:'lesson-recordings',where:{key:{equals:key}},limit:1})).docs[0]
   if(!exists)await payload.create({collection:'lesson-recordings',data:{key,lesson:lesson.id,fingerprint:row.fingerprint,blob:original.blob,sha256:original.sha256,bytes:original.bytes,duration:original.duration,status:'pending-review',metadata:{...original.metadata,versionProvenance:'Imported baseline: upstream metadata does not include a source fingerprint; administrator review required.'}}})
  }
 }
 await writeFile('docs/PHASE2_COURSE_MAPPING.md','# Canonical course mapping\n\nNo new course records are created. IDs are resolved from the isolated Payload database using reviewed slug candidates in `src/integrations/academy/course-mapping.json`. These mappings are specific to the current local snapshot; rerun and review them for another environment. Licenses grant explicit canonical course IDs, not course-name substrings. Unmapped aggregate hubs remain inventory-only.\n\n| Source | Existing course ID / slug |\n| --- | --- |\n'+mapRows.join('\n')+'\n')
 console.log(JSON.stringify({created,updated,mapped:mapRows.filter(r=>!r.includes('Unmapped')).length,unmapped:mapRows.filter(r=>r.includes('Unmapped')).length,recordings:6,productionWrites:0}))
}finally{await payload.destroy()}
