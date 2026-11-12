import {getPayload} from 'payload'
import config from '../../src/payload.config'
if(process.env.INTEGRATION_TARGET!=='local'||process.env.DB_PROVIDER!=='sqlite'||!process.env.DATABASE_URI?.replaceAll('\\','/').endsWith('/.phase2-local/site.db'))throw Error('Fixtures require isolated Phase 2 SQLite')
const payload=await getPayload({config})
const password='Phase1-Local-Verification-Only!'
try{
 for(const [email,role]of [['phase1-admin@example.test','admin'],['academy-trainer@example.test','trainer'],['academy-unassigned@example.test','trainer']] as const){
  const old=(await payload.find({collection:'users',where:{email:{equals:email}},limit:1})).docs[0]
  const data={email,password,name:'Local Academy Verification',role}
  if(old)await payload.update({collection:'users',id:old.id,data});else await payload.create({collection:'users',data})
 }
 for(const email of ['phase1-student@example.test','academy-unlicensed@example.test','academy-other@example.test']){
  const old=(await payload.find({collection:'students',where:{email:{equals:email}},limit:1})).docs[0]
  if(old)await payload.update({collection:'students',id:old.id,data:{password}});else await payload.create({collection:'students',data:{email,password,name:'Local Academy Learner'}})
 }
 const python=(await payload.find({collection:'academy-lessons',where:{key:{equals:'foundational-python-print'}},limit:1,depth:0})).docs[0];if(!python)throw Error('Import lessons first')
 const student=(await payload.find({collection:'students',where:{email:{equals:'phase1-student@example.test'}},limit:1})).docs[0]
 if(!(await payload.count({collection:'course-licenses',where:{key:{equals:'fixture-python-license'}}})).totalDocs)await payload.create({collection:'course-licenses',data:{key:'fixture-python-license',student:student.id,courses:[typeof python.course==='object'?python.course.id:python.course],status:'active',grantReason:'Administrator-controlled isolated local verification; not proof of payment'}})
 const otherCourses=(await payload.find({collection:'courses',where:{id:{not_equals:typeof python.course==='object'?python.course.id:python.course}},limit:2,depth:0})).docs
 for(const [index,status]of ['expired','revoked'].entries()){
  const key=`fixture-history-${status}`
  if(otherCourses[index]&&!(await payload.count({collection:'course-licenses',where:{key:{equals:key}}})).totalDocs)await payload.create({collection:'course-licenses',data:{key,student:student.id,courses:[otherCourses[index].id],status:status==='revoked'?'revoked':'active',...(status==='expired'?{expiresAt:'2020-01-01T00:00:00.000Z'}:{}),grantReason:'Isolated dashboard license-history verification; not a purchase'}})
 }
 for(const email of ['academy-trainer@example.test','phase1-admin@example.test']){
  const trainer=(await payload.find({collection:'users',where:{email:{equals:email}},limit:1})).docs[0]
  const key=`fixture:${trainer.id}:python`;if(!(await payload.count({collection:'trainer-assignments',where:{key:{equals:key}}})).totalDocs)await payload.create({collection:'trainer-assignments',data:{key,trainer:trainer.id,course:typeof python.course==='object'?python.course.id:python.course,active:true}})
 }
 const demo=(await payload.find({collection:'academy-lessons',where:{key:{equals:'foundational-data-structures-demo'}},limit:1})).docs[0];if(demo)await payload.update({collection:'academy-lessons',id:demo.id,data:{publicDemo:true}})
 console.log('Local fixture licenses, assigned/unassigned trainer accounts and one administrator-approved demo are ready. Recordings remain pending administrator approval.')
}finally{await payload.destroy()}
