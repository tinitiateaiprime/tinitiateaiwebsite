import {APIError} from 'payload'
import {getPayload} from '@/lib/getPayload'
import {currentUser,lessonByKey,assigned,apiFailure,idOf} from '@/lib/academy/authorization'
import {readSmallJSON,takeRequest} from '@/lib/requestLimits'
export async function POST(request:Request){try{
 const user=await currentUser(request.headers);const input=await readSmallJSON(request) as {lesson?:string;mode?:string}
 const lesson=await lessonByKey(input.lesson||'');if(!user||!lesson||!await assigned(user,idOf(lesson.course)))throw new APIError('Recording requires a trainer assignment for this course',403)
 const payload=await getPayload()
 if(lesson.publishedRecording){const recording=await payload.findByID({collection:'lesson-recordings',id:idOf(lesson.publishedRecording),depth:0});if(recording.status==='approved'&&recording.fingerprint===lesson.fingerprint&&!recording.reviewRequired)return Response.json({reused:true,recording:recording.id})}
 const mode=input.mode==='silent-preview'?'silent-preview':'narrated'
 if(mode==='silent-preview'&&process.env.INTEGRATION_TARGET!=='local')throw new APIError('Preview recording is restricted to local verification',403)
 if(mode==='narrated'&&process.env.ALLOW_PAID_RECORDING!=='true')throw new APIError('Narrated recording is not enabled by the administrator',503)
 if(!takeRequest(`recording:${user.id}`,10))throw new APIError('Recording requests are rate limited',429)
 const key=`${lesson.key}:${lesson.fingerprint}`
 const previous=(await payload.find({collection:'recording-jobs',where:{key:{equals:key}},limit:1,depth:0})).docs[0]
 if(previous){
  const expired=previous.status==='processing'&&previous.leaseExpiresAt&&Date.parse(previous.leaseExpiresAt)<Date.now()
  if(previous.status==='failed'||expired||(previous.status==='complete'&&previous.mode==='silent-preview'&&mode==='narrated')){
   const updated=await payload.update({collection:'recording-jobs',id:previous.id,data:{status:'queued',trainer:user.id,mode,error:null,progress:{state:'queued'}}});return Response.json({job:updated.id,retry:true},{status:202})
  }
  return Response.json({job:previous.id,reused:true,status:previous.status})
 }
 try{const job=await payload.create({collection:'recording-jobs',data:{key,lesson:lesson.id,trainer:user.id,fingerprint:lesson.fingerprint,status:'queued',mode,progress:{state:'queued'}}});return Response.json({job:job.id},{status:202})}
 catch(error){const concurrent=(await payload.find({collection:'recording-jobs',where:{key:{equals:key}},limit:1})).docs[0];if(concurrent)return Response.json({job:concurrent.id,reused:true});throw error}
}catch(error){return apiFailure(error)}}
