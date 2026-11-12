import {headers} from 'next/headers'
import {redirect} from 'next/navigation'
import Link from 'next/link'
import {Container} from '@/components/ui/Container'
import {getPayload} from '@/lib/getPayload'
import {currentUser,idOf} from '@/lib/academy/authorization'
import {isAdmin,trainerOrAdmin} from '@/lib/academy/access'
import {TrainerControls} from '@/components/academy/TrainerControls'
import {SessionBoundary} from '@/components/auth/AuthProvider'
import {identity} from '@/lib/auth/session'
export const metadata={title:'Trainer Studio | Tinitiate AI'}
export default async function TrainerPage(){
 const user=await currentUser(await headers());if(!user)redirect('/login?mode=trainer&redirect=/trainer');if(!trainerOrAdmin(user))redirect('/dashboard')
 const payload=await getPayload();const assignments=await payload.find({collection:'trainer-assignments',where:{and:[{trainer:{equals:user.id}},{active:{equals:true}}]},pagination:false,depth:0})
 const courses=assignments.docs.map(a=>idOf(a.course));const lessons=courses.length?(await payload.find({collection:'academy-lessons',where:{course:{in:courses}},pagination:false,depth:0,sort:'sourcePath'})).docs:[]
 const jobs=await payload.find({collection:'recording-jobs',where:isAdmin(user)?{}:{trainer:{equals:user.id}},limit:50,sort:'-updatedAt',depth:0})
 const pending=isAdmin(user)?(await payload.find({collection:'lesson-recordings',where:{or:[{status:{equals:'pending-review'}},{reviewRequired:{equals:true}}]},pagination:false,depth:1})).docs:[]
 return <SessionBoundary account={identity(user)!}><Container className="py-16"><h1 className="text-4xl font-bold">Trainer studio</h1><p className="mt-4 text-slate-600">Record only assigned courses. Existing approved recordings are reused until the lesson version changes. The restricted worker runs separately.</p><Link href="/demos" className="mt-4 inline-block text-blue-700">View Free Demos →</Link>{!courses.length&&<p className="mt-8">No active course assignments. Ask an administrator to assign your courses.</p>}<section id="assigned-courses" className="mt-10 scroll-mt-36"><h2 className="mb-5 text-2xl font-bold">Assigned Courses</h2><TrainerControls lessons={lessons.map(l=>({key:l.key,title:l.title}))} pending={pending.map(r=>({id:r.id,title:typeof r.lesson==='object'?r.lesson.title:r.key,stale:typeof r.lesson==='object'&&r.fingerprint!==r.lesson.fingerprint}))} isAdmin={isAdmin(user)}/></section><section id="recordings" className="mt-12 scroll-mt-36"><h2 className="text-2xl font-bold">Recording jobs</h2><ul className="mt-5 space-y-3">{jobs.docs.map(job=><li key={job.id} className="rounded-xl border p-4"><p className="font-semibold">Job {job.id}: {job.status}</p><p className="text-sm text-slate-600">{job.mode}{job.error?` — ${job.error}`:''}</p><pre className="mt-2 overflow-x-auto text-xs">{JSON.stringify(job.progress)}</pre></li>)}</ul></section></Container></SessionBoundary>
}
