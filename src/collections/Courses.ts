import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { isAdmin } from '../lib/academy/access'

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'level', 'featured'],
  },
  access: {
    create: ({ req: { user } }) => isCMSStaff(user),
    update: ({ req: { user } }) => isCMSStaff(user),
    delete: ({ req: { user } }) => isCMSStaff(user),
    read: () => true,
  },
  hooks: { beforeChange: [async ({ data, originalDoc, req }) => {
    if (data.previewLesson === undefined && !data.approvePreviewVersion) return data
    const selected = data.previewLesson === undefined ? originalDoc?.previewLesson : data.previewLesson
    const lessonID = selected && typeof selected === 'object' ? selected.id : selected
    const previous = originalDoc?.previewLesson && typeof originalDoc.previewLesson === 'object' ? originalDoc.previewLesson.id : originalDoc?.previewLesson
    if (lessonID === previous && !data.approvePreviewVersion) return data
    if (!isAdmin(req.user)) throw new APIError('An administrator must approve preview content.', 403)
    data.approvePreviewVersion = false
    if (!lessonID) { data.previewFingerprint = null; return data }
    const lesson = await req.payload.findByID({ collection: 'academy-lessons', id: lessonID, depth: 0, req })
    const courseID = typeof lesson.course === 'object' ? lesson.course.id : lesson.course
    if (!originalDoc?.id || courseID !== originalDoc.id || lesson.kind !== 'lesson') throw new APIError('Choose an original lesson assigned to this same course.', 400)
    data.previewFingerprint = lesson.fingerprint
    return data
  }] },
  fields: [
    { name: 'previewLesson', label: 'Approved student MasterClass preview', type: 'relationship', relationTo: 'academy-lessons', access: { create: ({ req }) => isAdmin(req.user), update: ({ req }) => isAdmin(req.user) }, admin: { description: 'One reviewed original lesson for this course. Students must log in; this does not grant access to paid videos or other modules.' } },
    { name: 'previewFingerprint', type: 'text', access: { create: () => false, update: () => false }, admin: { readOnly: true, description: 'Approval applies to this exact lesson version.' } },
    { name: 'approvePreviewVersion', label: 'Approve the current preview content on Save', type: 'checkbox', defaultValue: false, access: { create: ({ req }) => isAdmin(req.user), update: ({ req }) => isAdmin(req.user) }, admin: { description: 'Use after reviewing changed preview content and its dependencies. Resets after Save.' } },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
  name: 'cardLogo',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: 'Technology logo displayed on the course card',
  },
},
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      maxLength: 200,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      defaultValue: 'beginner',
      options: [
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "8 weeks" or "45 hours"',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'discountedPrice',
      type: 'number',
    },
    {
      name: 'trainer',
      type: 'relationship',
      relationTo: 'trainers',
    },
    {
      name: 'curriculum',
      type: 'array',
      fields: [
        {
          name: 'moduleTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'topics',
          type: 'array',
          fields: [
            {
              name: 'topic',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'keyFeatures',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'tools',
      type: 'array',
      fields: [
        {
          name: 'tool',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'targetAudience',
      type: 'array',
      fields: [
        {
          name: 'audience',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
      admin: {
        description: 'Displayed as a star rating on course cards',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Shows in the "Trending" tab on the courses page',
      },
    },
    {
  name: 'isPremium',
  type: 'checkbox',
  defaultValue: false,
  admin: {
    description: 'Shows the Premium badge on the course card',
  },
},
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Job Placement Assistance Program', value: 'placement-assistance' },
        { label: 'Internship', value: 'internship' },
        { label: 'Certification Course', value: 'certification' },
      ],
      admin: {
        description: 'Controls which tabs this course appears under on the courses page',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        description: 'Next batch start date shown on course cards. Leave blank to show "Batch Starts Soon".',
      },
    },
    {
      name: 'bannerLabel',
      type: 'text',
      admin: {
        description: 'Optional large text shown on the card banner, e.g. "JAVA" or ".NET". Falls back to the course title if left blank.',
      },
    },
    {
      name: 'bannerTag',
      type: 'text',
      admin: {
        description: 'Optional small pill shown under the banner label, e.g. "Full Stack"',
      },
    },
  ],
}
