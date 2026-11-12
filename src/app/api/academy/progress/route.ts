import { APIError } from 'payload'
import { getPayload } from '@/lib/getPayload'
import { currentUser,lessonByKey,permitted,apiFailure } from '@/lib/academy/authorization'
import { progressState } from '@/lib/academy/primitives.mjs'
import { readSmallJSON } from '@/lib/requestLimits'
async function context(request:Request,key:string){const user=await currentUser(request.headers);const lesson=await lessonByKey(key);if(user?.collection!=='students'||!lesson||!await permitted(user,lesson))throw new APIError('An active student license is required',403);return {user,lesson,payload:await getPayload()}}
export async function GET(request:Request){try{const key=new URL(request.url).searchParams.get('lesson')||'';const{user,lesson,payload}=await context(request,key);const saved=await payload.find({collection:'lesson-progress',where:{key:{equals:`${user.id}:${lesson.key}`}},limit:1,depth:0});return Response.json({state:saved.docs[0]?.state||{}},{headers:{'Cache-Control':'no-store'}})}catch(error){return apiFailure(error)}}
export async function POST(request:Request){try{
 const input=await readSmallJSON(request,16384) as {lesson?:string;state?:object};const{user,lesson,payload}=await context(request,input.lesson||'')
 let state:Record<string,number[]>;try{state=progressState(input.state,lesson.sourcePath.split('/').pop()!.replace('.html',''))}catch{throw new APIError('Invalid progress',400)}
 const key=`${user.id}:${lesson.key}`;const existing=(await payload.find({collection:'lesson-progress',where:{key:{equals:key}},limit:1,depth:0})).docs[0]
 if(existing)await payload.update({collection:'lesson-progress',id:existing.id,data:{state}});else await payload.create({collection:'lesson-progress',data:{key,student:user.id,lesson:lesson.id,state}})
 return Response.json({ok:true,state})
}catch(error){return apiFailure(error)}}
