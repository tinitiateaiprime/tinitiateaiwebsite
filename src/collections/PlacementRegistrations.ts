import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'

export const PlacementRegistrations: CollectionConfig = {
  slug: 'placement-registrations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'currentStatus', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => isCMSStaff(user),
    update: ({ req: { user } }) => isCMSStaff(user),
    delete: ({ req: { user } }) => isCMSStaff(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'courseCompleted',
      type: 'relationship',
      relationTo: 'courses',
    },
    {
      name: 'currentStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Student', value: 'student' },
        { label: 'Fresher', value: 'fresher' },
        { label: 'Working Professional', value: 'working' },
        { label: 'Career Break', value: 'career-break' },
      ],
    },
    {
      name: 'resumeLink',
      type: 'text',
      admin: {
        description: 'Link to resume (Google Drive, LinkedIn, etc.)',
      },
    },
    {
      name: 'message',
      type: 'textarea',
    },
  ],
}
