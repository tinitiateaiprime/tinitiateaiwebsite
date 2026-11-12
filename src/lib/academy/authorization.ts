import { APIError } from 'payload'
import { getPayload } from '@/lib/getPayload'
import { isAdmin, trainerOrAdmin } from './access'
import { signTicket, verifyTicket } from './primitives.mjs'
import type { AcademyLesson } from '@/payload-types'
import { authenticatedUser } from '@/lib/auth/session'
import { isStudentPreview } from './previews'
export const idOf = (value: number | { id: number }) => typeof value === 'object' ? value.id : value
export const currentUser = authenticatedUser
export async function lessonByKey(key: string) {
  return (await (await getPayload()).find({ collection: 'academy-lessons', where: { key: { equals: key } }, limit: 1, depth: 1 })).docs[0]
}
export async function assigned(user: Awaited<ReturnType<typeof currentUser>>, course: number) {
  if (!trainerOrAdmin(user) || !user) return false
  return (await (await getPayload()).count({ collection: 'trainer-assignments', where: { and: [{ trainer: { equals: user.id } }, { course: { equals: course } }, { active: { equals: true } }] } })).totalDocs > 0
}
export async function fullLessonAccess(user: Awaited<ReturnType<typeof currentUser>>, lesson: AcademyLesson) {
  if (lesson.publicDemo && lesson.kind === 'demo') return true
  if (isAdmin(user)) return true
  if (user?.collection === 'users') return assigned(user, idOf(lesson.course))
  if (user?.collection !== 'students') return false
  const now = new Date().toISOString()
  return (await (await getPayload()).count({ collection: 'course-licenses', where: { and: [
    { student: { equals: user.id } }, { courses: { in: [idOf(lesson.course)] } }, { status: { equals: 'active' } },
    { or: [{ startsAt: { exists: false } }, { startsAt: { less_than_equal: now } }] },
    { or: [{ expiresAt: { exists: false } }, { expiresAt: { greater_than: now } }] },
  ] } })).totalDocs > 0
}
export async function permitted(user: Awaited<ReturnType<typeof currentUser>>, lesson: AcademyLesson) {
  return await fullLessonAccess(user, lesson) || user?.collection === 'students' && await isStudentPreview(lesson)
}
export function issueTicket(user: Awaited<ReturnType<typeof currentUser>>, lesson: AcademyLesson) {
  return signTicket({ lesson: lesson.key, version: lesson.fingerprint, collection: user?.collection || 'public', userID: user?.id || 0, sessionID: user?._sid, expires: Date.now() + 30*60_000 }, process.env.PAYLOAD_SECRET)
}
export async function authorizeContent(request: Request, lesson: AcademyLesson, video = false) {
  const token = new URL(request.url).searchParams.get('t')
  let user: Awaited<ReturnType<typeof currentUser>> = null
  if (token) {
    const ticket = verifyTicket(token, process.env.PAYLOAD_SECRET)
    if (!ticket || ticket.lesson !== lesson.key || ticket.version !== lesson.fingerprint) throw new APIError('Access expired or invalid',403)
    if (ticket.collection !== 'public') {
      if (!['students','users'].includes(ticket.collection) || !Number.isSafeInteger(ticket.userID)) throw new APIError('Invalid access',403)
      if(ticket.collection==='students'){const record=await(await getPayload()).findByID({collection:'students',id:ticket.userID,depth:0});user={...record,collection:'students'}}
      else{const record=await(await getPayload()).findByID({collection:'users',id:ticket.userID,depth:0});user={...record,collection:'users'}}
      if(!ticket.sessionID || !user.sessions?.some(session=>session.id===ticket.sessionID && Date.parse(session.expiresAt)>Date.now()))throw new APIError('This session has ended. Please log in again.',403)
    }
  } else user = await currentUser(request.headers)
  if (!await (video ? fullLessonAccess(user, lesson) : permitted(user, lesson))) throw new APIError('An active course license is required',403)
  return user
}
export function apiFailure(error: unknown) {
  return Response.json({ error: error instanceof APIError && error.status < 500 ? error.message : 'Academy request failed' }, { status: error instanceof APIError ? error.status : 500, headers: { 'Cache-Control': 'no-store' } })
}
