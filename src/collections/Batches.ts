import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'

export const Batches: CollectionConfig = {
  slug: 'batches',
  admin: {
    useAsTitle: 'facultyName',
    defaultColumns: ['course', 'facultyName', 'mode', 'startsAt', 'isActive'],
  },
  defaultSort: 'startsAt',
  access: {
    read: ({ req: { user } }) => {
      if (isCMSStaff(user)) return true
      return { isActive: { equals: true } }
    },
    create: ({ req: { user } }) => isCMSStaff(user),
    update: ({ req: { user } }) => isCMSStaff(user),
    delete: ({ req: { user } }) => isCMSStaff(user),
  },
  fields: [
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },
    {
      name: 'facultyName',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Vikram Sharma" or "Real-Time Expert"',
      },
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      options: [
        { label: 'Online Training', value: 'online' },
        { label: 'Classroom Training', value: 'classroom' },
        { label: 'Weekend Training', value: 'weekend' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      name: 'startsAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'meetingLink',
      type: 'text',
      admin: {
        description: 'Join link shown for online sessions',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
