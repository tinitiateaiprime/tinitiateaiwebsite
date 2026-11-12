import { isCMSStaff } from '../lib/academy/access'
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    update: ({ req: { user } }) => isCMSStaff(user),
    read: () => true,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'TinitiateAI',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Practical AI & Data Training for Real Careers',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: ['LinkedIn', 'Instagram', 'YouTube', 'Facebook', 'X'],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'studentsPlaced',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'coursesOffered',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'hiringPartners',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
