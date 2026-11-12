import { APIError } from 'payload'
import { randomUUID,createHash } from 'node:crypto'
import { getPayload } from '@/lib/getPayload'
import { lessonByKey, authorizeContent, apiFailure, fullLessonAccess } from '@/lib/academy/authorization'
import { projectPythonPreview } from '@/lib/academy/preview-projection.mjs'
import { sourceFile, privateHeaders } from '@/lib/academy/storage'
import { renderLesson, rewriteCSS, lessonCSP, sourceEntry } from '@/lib/academy/render'
import manifest from '@/integrations/academy/manifest.json'
import { safeRelative } from '@/lib/academy/primitives.mjs'
export const runtime='nodejs'
export async function GET(request: Request,{params}:{params:Promise<{key:string;path:string[]}>}) {
  try {
    const {key,path:parts}=await params; const relative=parts.join('/')
    const entry=sourceEntry(key); const lesson=await lessonByKey(key)
    if(!entry||!lesson||!safeRelative(relative)) throw new APIError('Not found',404)
    const user=await authorizeContent(request,lesson)
    const preview=user?.collection==='students'&&!await fullLessonAccess(user,lesson)
    const allowed=preview?entry.previewAssets:entry.assets
    if(relative!==entry.sourcePath&&!allowed?.includes(relative)) throw new APIError('Not found',404)
    const bytes=await sourceFile(relative);if(createHash('sha256').update(bytes).digest('hex')!==(manifest.files as Record<string,string>)[relative])throw new APIError('Lesson content changed; the administrator must reimport and review it',409); const ticket=new URL(request.url).searchParams.get('t')||''
    const mime:Record<string,string>={css:'text/css',js:'text/javascript',json:'application/json',svg:'image/svg+xml',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',ico:'image/x-icon',woff:'font/woff',woff2:'font/woff2',py:'text/plain',ttf:'font/ttf'}
    const extension=relative.split('.').pop()||''
    if(extension==='html') {
      // Content documents require a scoped capability; the application wrapper issues it after authentication.
      if(!ticket) throw new APIError('Open this lesson through the Academy',403)
      const published=lesson.publishedRecording ? await (await getPayload()).findByID({collection:'lesson-recordings',id:typeof lesson.publishedRecording==='object'?lesson.publishedRecording.id:lesson.publishedRecording,depth:0}) : null
      const saved = user?.collection==='students' ? (await (await getPayload()).find({collection:'lesson-progress',where:{key:{equals:`${user.id}:${lesson.key}`}},limit:1,depth:0})).docs[0]?.state : {}
      return new Response(renderLesson(bytes.toString('utf8'),{key,ticket,channel:new URL(request.url).searchParams.get('channel')||randomUUID(),origin:new URL(request.url).origin,sourcePath:relative,progress: saved && typeof saved==='object' ? saved : {},hasVideo:published?.status==='approved',preview}),{headers:{...privateHeaders,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':lessonCSP(new URL(request.url).origin)}})
    }
    const projected=preview&&relative==='foundational/python/python-course.js'?projectPythonPreview(bytes.toString('utf8'),lesson.sourcePath.split('/').pop()!.replace('.html','')):null
    return new Response(projected|| (extension==='css'?rewriteCSS(bytes.toString('utf8'),relative,key,ticket):new Uint8Array(bytes)),{headers:{...privateHeaders,'Content-Type':`${mime[extension]||'application/octet-stream'}${['css','js','json','py'].includes(extension)?'; charset=utf-8':''}`}})
  } catch(error){return apiFailure(error)}
}
