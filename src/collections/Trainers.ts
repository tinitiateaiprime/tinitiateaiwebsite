import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'

export const Trainers: CollectionConfig = {
  slug: 'trainers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'yearsExperience'],
  },
  access: {
    create: ({ req: { user } }) => isCMSStaff(user),
    update: ({ req: { user } }) => isCMSStaff(user),
    delete: ({ req: { user } }) => isCMSStaff(user),
    read: () => true,
  },
  fields: [
    {
      name: 'name',
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Senior Machine Learning Engineer"',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'yearsExperience',
      type: 'number',
      required: true,
    },
    {
      name: 'expertise',
      type: 'array',
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'bio',
      type: 'richText',
    },
    {
      name: 'linkedIn',
      type: 'text',
    },
  ],
}
