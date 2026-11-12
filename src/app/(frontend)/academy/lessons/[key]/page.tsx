import Link from 'next/link'
import {headers} from 'next/headers'
import {notFound,redirect} from 'next/navigation'
import {randomUUID} from 'node:crypto'
import {getPayload} from '@/lib/getPayload'
import {lessonByKey,currentUser,permitted,issueTicket,fullLessonAccess} from '@/lib/academy/authorization'
import {sourceEntry,assetURL} from '@/lib/academy/render'
import {LessonFrame} from '@/components/academy/LessonFrame'
import {SessionBoundary} from '@/components/auth/AuthProvider'
import {identity} from '@/lib/auth/session'
import {CoursePaywall} from '@/components/commerce/CoursePaywall'
export default async function LessonPage({params}:{params:Promise<{key:string}>}){
 const key=(await params).key;const lesson=await lessonByKey(key);const entry=sourceEntry(key);if(!lesson||!entry)notFound()
 const user=await currentUser(await headers())
 if(!await permitted(user,lesson)){
  const slug=typeof lesson.course==='object'?lesson.course.slug:String(lesson.course)
  if(!user)redirect(`/login?redirect=${encodeURIComponent(`/academy/lessons/${key}`)}`)
  if(user.collection==='students'){
   const course=typeof lesson.course==='object'?lesson.course:await(await getPayload()).findByID({collection:'courses',id:lesson.course,depth:0})
   return <SessionBoundary account={identity(user)!}><CoursePaywall lesson={lesson} course={course} student={user.id}/></SessionBoundary>
  }
  redirect(`/courses/${slug}?access=license-required`)
 }
 const ticket=issueTicket(user,lesson);const channel=randomUUID()
 const publicDemo=lesson.publicDemo&&lesson.kind==='demo'
 const preview=user?.collection==='students'&&!await fullLessonAccess(user,lesson)
 const courseID=typeof lesson.course==='object'?lesson.course.id:lesson.course
 const home=user?.collection==='students'?'/learning':user?.collection==='users'?user.role==='trainer'?'/trainer':'/admin':'/demos'
 const siblings=await(await getPayload()).find({collection:'academy-lessons',pagination:false,depth:0,where:publicDemo?{and:[{kind:{equals:'demo'}},{publicDemo:{equals:true}}]}:{or:[{course:{equals:typeof lesson.course==='object'?lesson.course.id:lesson.course}},{and:[{kind:{equals:'demo'}},{publicDemo:{equals:true}}]}]}})
 const navigation=Object.fromEntries(siblings.docs.map(item=>[item.sourcePath,item.key]))
 const source=assetURL(entry.sourcePath,key,ticket)+`&channel=${channel}`
 const next=siblings.docs.filter(row=>row.kind==='lesson'&&row.id!==lesson.id).sort((a,b)=>a.sourcePath.localeCompare(b.sourcePath)).find(row=>row.key.endsWith('-variables'))||siblings.docs.find(row=>row.kind==='lesson'&&row.id!==lesson.id)
 const content=<><div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-5 py-4"><Link className="text-sm font-semibold text-blue-700" href={publicDemo?'/demos':home}>← {publicDemo?'Free Demos':user?.collection==='students'?'My Learning':'Dashboard'}</Link><h1 className="text-lg font-semibold">{lesson.title.replace(/\s*\|.*$/,'')}</h1></div>{preview&&<div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-100 bg-brand-50 px-5 py-5"><div><p className="font-semibold text-brand-900">Your Free MasterClass Preview</p><p className="mt-1 text-sm text-slate-600">Try the original interactive lesson. Full modules and tutorial videos require a course license.</p></div><div className="flex flex-wrap gap-4 text-sm font-semibold"><Link href={`/checkout?add=${courseID}`} className="rounded-full bg-brand-600 px-5 py-3 text-white">Request Subscription</Link>{next&&<Link href={`/academy/lessons/${next.key}`} className="py-3 text-brand-700">Continue to Next Module →</Link>}</div></div>}<LessonFrame source={source} keyID={key} channel={channel} studentID={user?.collection==='students'?user.id:null} navigation={navigation} home={publicDemo?'/demos':home}/></>
 return user&&!publicDemo?<SessionBoundary account={identity(user)!}>{content}</SessionBoundary>:content
}
