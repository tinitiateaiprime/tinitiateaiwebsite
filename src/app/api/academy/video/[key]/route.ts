import { APIError } from 'payload'
import { getPayload } from '@/lib/getPayload'
import { lessonByKey,authorizeContent,apiFailure,idOf } from '@/lib/academy/authorization'
import { videoResponse } from '@/lib/academy/storage'
export const runtime='nodejs'
export async function GET(request:Request,{params}:{params:Promise<{key:string}>}) {
  try {
    const lesson=await lessonByKey((await params).key);if(!lesson)throw new APIError('Not found',404)
    await authorizeContent(request,lesson,true)
    if(!lesson.publishedRecording)throw new APIError('No approved recording',404)
    const recording=await(await getPayload()).findByID({collection:'lesson-recordings',id:idOf(lesson.publishedRecording),depth:0})
    if(recording.status!=='approved'||idOf(recording.lesson)!==lesson.id)throw new APIError('No approved recording',404)
    return videoResponse(request,recording.blob)
  }catch(error){return apiFailure(error)}
}
export const HEAD=GET
