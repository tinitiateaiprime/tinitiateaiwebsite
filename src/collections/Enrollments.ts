import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['student', 'course', 'status', 'enrolledAt'],
  },
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => {
      if (isCMSStaff(user)) return true
      if (user?.collection === 'students') {
        return { student: { equals: user.id } }
      }
      return false
    },
    update: ({ req: { user } }) => isCMSStaff(user),
    delete: ({ req: { user } }) => isCMSStaff(user),
  },
  hooks: {
    beforeValidate: [({ data, req, operation }) => {
      if (operation === 'create' && req.user?.collection === 'students') {
        if (data?.student && String(typeof data.student === 'object' ? data.student.id : data.student) !== String(req.user.id)) throw new APIError('You can only enroll yourself.', 403)
        return { ...data, student: req.user.id, status: 'pending', enrolledAt: new Date().toISOString() }
      }
      return data
    }],
  },
  fields: [
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      required: true,
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
      ],
    },
    {
      name: 'enrolledAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
