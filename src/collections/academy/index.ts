import type { CollectionConfig, Field } from 'payload'
import { adminOnly, isAdmin, lessonMetadataAccess } from '../../lib/academy/access'
const key: Field = { name: 'key', type: 'text', required: true, unique: true }
const relation = (name: string, relationTo: 'courses' | 'students' | 'users' | 'academy-lessons', required = true): Field => ({ name, type: 'relationship', relationTo, required })
const privateAccess = { create: adminOnly, read: adminOnly, update: adminOnly, delete: adminOnly }

export const AcademyLessons: CollectionConfig = {
  slug: 'academy-lessons', admin: { useAsTitle: 'title', group: 'Academy' },
  access: { ...privateAccess, read: lessonMetadataAccess },
  hooks: { afterChange: [async ({doc,previousDoc,req}) => { if(previousDoc?.fingerprint && previousDoc.fingerprint!==doc.fingerprint) await req.payload.update({collection:'lesson-recordings',where:{lesson:{equals:doc.id}},data:{reviewRequired:true},req}); return doc }] },
  fields: [key, { name: 'title', type: 'text', required: true }, relation('course', 'courses'),
    { name: 'sourcePath', type: 'text', required: true }, { name: 'fingerprint', type: 'text', required: true },
    { name: 'kind', type: 'select', options: ['lesson', 'course-hub', 'demo'], required: true },
    { name: 'publicDemo', type: 'checkbox', defaultValue: false, admin: { description: 'Only administrators can explicitly approve public demo access. A demo filename alone grants no access.' } },
    { name: 'publishedRecording', type: 'relationship', relationTo: 'lesson-recordings' },
  ],
}
export const CourseLicenses: CollectionConfig = {
  slug: 'course-licenses', admin: { useAsTitle: 'key', group: 'Academy' },
  access: { ...privateAccess, read: ({ req }) => isAdmin(req.user) ? true : req.user?.collection === 'students' ? { student: { equals: req.user.id } } : false },
  fields: [key, relation('student', 'students'), { name: 'courses', type: 'relationship', relationTo: 'courses', hasMany: true, required: true },
    { name: 'status', type: 'select', options: ['active', 'revoked'], required: true, defaultValue: 'active' },
    { name: 'startsAt', type: 'date' }, { name: 'expiresAt', type: 'date' },
    { name: 'grantReason', type: 'textarea', required: true, admin: { description: 'Manual administrator grant or verified purchase reference. Enrollment is not proof of payment.' } },
  ],
}
export const TrainerAssignments: CollectionConfig = {
  slug: 'trainer-assignments', admin: { useAsTitle: 'key', group: 'Academy' }, access: privateAccess,
  fields: [key, relation('trainer', 'users'), relation('course', 'courses'), { name: 'active', type: 'checkbox', defaultValue: true }],
}
export const LessonProgress: CollectionConfig = {
  slug: 'lesson-progress', admin: { useAsTitle: 'key', group: 'Academy' },
  access: { create: () => false, update: () => false, delete: adminOnly, read: ({ req }) => isAdmin(req.user) ? true : req.user?.collection === 'students' ? { student: { equals: req.user.id } } : false },
  fields: [key, relation('student', 'students'), relation('lesson', 'academy-lessons'), { name: 'state', type: 'json', required: true }],
}
export const LessonRecordings: CollectionConfig = {
  slug: 'lesson-recordings', admin: { useAsTitle: 'key', group: 'Academy' },
  access: { ...privateAccess, create: () => false, update: () => false },
  fields: [key, relation('lesson', 'academy-lessons'), { name: 'fingerprint', type: 'text', required: true },
    { name: 'blob', type: 'text', required: true }, { name: 'sha256', type: 'text', required: true },
    { name: 'bytes', type: 'number', required: true }, { name: 'duration', type: 'number', required: true },
    { name: 'status', type: 'select', options: ['pending-review', 'approved', 'rejected'], required: true },
    { name: 'reviewRequired', type: 'checkbox', defaultValue: false }, { name: 'metadata', type: 'json' },
  ],
}
export const RecordingJobs: CollectionConfig = {
  slug: 'recording-jobs', admin: { useAsTitle: 'key', group: 'Academy' },
  access: { create: () => false, update: () => false, delete: () => false, read: ({ req }) => isAdmin(req.user) ? true : req.user?.collection === 'users' && req.user.role === 'trainer' ? { trainer: { equals: req.user.id } } : false },
  fields: [key, relation('lesson', 'academy-lessons'), relation('trainer', 'users'),
    { name: 'fingerprint', type: 'text', required: true },
    { name: 'status', type: 'select', options: ['queued', 'processing', 'awaiting-review', 'complete', 'failed'], required: true },
    { name: 'mode', type: 'select', options: ['narrated', 'silent-preview'], required: true },
    { name: 'progress', type: 'json' }, { name: 'leaseExpiresAt', type: 'date' }, { name: 'error', type: 'text' },
    { name: 'recording', type: 'relationship', relationTo: 'lesson-recordings' },
  ],
}
export const academyCollections = [AcademyLessons, CourseLicenses, TrainerAssignments, LessonProgress, LessonRecordings, RecordingJobs]
