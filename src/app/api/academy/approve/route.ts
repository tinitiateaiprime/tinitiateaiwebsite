import {APIError} from 'payload'
import {getPayload} from '@/lib/getPayload'
import {currentUser,apiFailure,idOf} from '@/lib/academy/authorization'
import {isAdmin} from '@/lib/academy/access'
import {verifiedDuration} from '@/lib/academy/verify-recording'
import {readSmallJSON} from '@/lib/requestLimits'
export async function POST(request:Request){try{
 const user=await currentUser(request.headers);if(!isAdmin(user))throw new APIError('Administrator approval required',403)
 const input=await readSmallJSON(request) as {recording?:number};if(!Number.isSafeInteger(input.recording))throw new APIError('Recording is required',400)
 const payload=await getPayload();const recording=await payload.findByID({collection:'lesson-recordings',id:input.recording!,depth:0});const lesson=await payload.findByID({collection:'academy-lessons',id:idOf(recording.lesson),depth:0})
 if(recording.fingerprint!==lesson.fingerprint)throw new APIError('The lesson changed; review a recording of the current version',409)
 const meta=recording.metadata as {silent?:boolean;status?:string}|null;if(meta?.silent||meta?.status==='preview')throw new APIError('Silent previews cannot be published',400)
 const duration=await verifiedDuration(recording)
 if(!Number.isFinite(duration)||duration<=0||!Number.isFinite(recording.duration)||recording.duration<=0||Math.abs(duration-recording.duration)>2)throw new APIError('Recording validation failed',409)
 await payload.update({collection:'lesson-recordings',id:recording.id,data:{status:'approved',reviewRequired:false}})
 await payload.update({collection:'academy-lessons',id:lesson.id,data:{publishedRecording:recording.id}})
 await payload.update({collection:'recording-jobs',where:{recording:{equals:recording.id}},data:{status:'complete'}})
 return Response.json({ok:true,recording:recording.id})
}catch(error){return apiFailure(error)}}
