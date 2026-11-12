import {APIError} from 'payload'
import {getPayload} from '@/lib/getPayload'
import {currentUser,assigned,idOf,apiFailure} from '@/lib/academy/authorization'
import {isAdmin} from '@/lib/academy/access'
import {videoResponse} from '@/lib/academy/storage'
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){try{
 const user=await currentUser(request.headers);if(!user||user.collection!=='users')throw new APIError('Trainer review access required',403)
 const id=Number((await params).id);if(!Number.isSafeInteger(id))throw new APIError('Not found',404)
 const payload=await getPayload();const recording=await payload.findByID({collection:'lesson-recordings',id,depth:0});const lesson=await payload.findByID({collection:'academy-lessons',id:idOf(recording.lesson),depth:0})
 if(!isAdmin(user)&&!await assigned(user,idOf(lesson.course)))throw new APIError('This recording is outside your course assignments',403)
 return videoResponse(request,recording.blob)
}catch(error){return apiFailure(error)}}
export const HEAD=GET
