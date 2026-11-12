import type { Access, PayloadRequest } from 'payload'
import type { Where } from 'payload'
export const isAdmin = (user: PayloadRequest['user']) => user?.collection === 'users' && user.role === 'admin'
export const isCMSStaff = (user: PayloadRequest['user']) => user?.collection === 'users' && (user.role === 'admin' || user.role === 'editor')
export const adminOnly: Access = ({ req }) => isAdmin(req.user)
export const staffOnly: Access = ({ req }) => isCMSStaff(req.user)
export const trainerOrAdmin = (user: PayloadRequest['user']) => user?.collection === 'users' && (user.role === 'trainer' || user.role === 'admin')

export const lessonMetadataAccess: Access = async ({ req }) => {
  if (isCMSStaff(req.user)) return true
  const previews=await req.payload.find({collection:'courses',req,overrideAccess:true,depth:0,pagination:false,where:{previewLesson:{exists:true}},select:{previewLesson:true,previewFingerprint:true}})
  const publicDemos: Where = { or:[{ and: [{ kind: { equals: 'demo' } }, { publicDemo: { equals: true } }] },...previews.docs.filter(course=>course.previewFingerprint&&course.previewLesson).map((course):Where=>({and:[{id:{equals:typeof course.previewLesson==='object'?course.previewLesson!.id:course.previewLesson}},{course:{equals:course.id}},{kind:{equals:'lesson'}},{fingerprint:{equals:course.previewFingerprint}}]}))] }
  if (!req.user) return publicDemos
  let courseIDs: number[] = []
  if (req.user.collection === 'students') {
    const now = new Date().toISOString()
    const licenses = await req.payload.find({ collection: 'course-licenses', req, overrideAccess: true, pagination: false, depth: 0, where: { and: [
      { student: { equals: req.user.id } }, { status: { equals: 'active' } },
      { or: [{ startsAt: { exists: false } }, { startsAt: { less_than_equal: now } }] },
      { or: [{ expiresAt: { exists: false } }, { expiresAt: { greater_than: now } }] },
    ] } })
    courseIDs = licenses.docs.flatMap(license => license.courses.map(course => typeof course === 'object' ? course.id : course))
  } else if (req.user.role === 'trainer') {
    const assignments = await req.payload.find({ collection: 'trainer-assignments', req, overrideAccess: true, pagination: false, depth: 0, where: { and: [{ trainer: { equals: req.user.id } }, { active: { equals: true } }] } })
    courseIDs = assignments.docs.map(row => typeof row.course === 'object' ? row.course.id : row.course)
  }
  return courseIDs.length ? { or: [publicDemos, { course: { in: [...new Set(courseIDs)] } }] } : publicDemos
}
