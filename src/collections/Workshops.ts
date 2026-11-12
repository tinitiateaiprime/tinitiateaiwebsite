import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'

export const Workshops: CollectionConfig = {
  slug: 'workshops',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    create: ({ req: { user } }) => isCMSStaff(user),
    update: ({ req: { user } }) => isCMSStaff(user),
    delete: ({ req: { user } }) => isCMSStaff(user),
    read: () => true,
  },
  fields: [
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
      name: 'shortDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'duration',
      type: 'text',
    },
    {
      name: 'mode',
      type: 'select',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Classroom', value: 'classroom' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    {
      name: 'scheduledAt',
      type: 'date',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}