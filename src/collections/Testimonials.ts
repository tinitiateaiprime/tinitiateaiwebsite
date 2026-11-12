import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'studentName',
  },
  access: {
    create: ({ req: { user } }) => isCMSStaff(user),
    update: ({ req: { user } }) => isCMSStaff(user),
    delete: ({ req: { user } }) => isCMSStaff(user),
    read: () => true,
  },
  fields: [
    {
      name: 'studentName',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'placedAt',
      type: 'text',
      admin: {
        description: 'Company the student was placed at, if applicable',
      },
    },
  ],
}
