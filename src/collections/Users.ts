import { isAdmin, isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
  },
  auth: { useSessions: true, cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' && process.env.INTEGRATION_TARGET !== 'local' } },
  access: {
    admin: ({ req }) => isCMSStaff(req.user),
    create: ({ req }) => isAdmin(req.user),
    read: ({ req }) => isCMSStaff(req.user) ? true : req.user?.collection === 'users' ? { id: { equals: req.user.id } } : false,
    update: ({ req }) => isAdmin(req.user) ? true : req.user?.collection === 'users' ? { id: { equals: req.user.id } } : false,
    delete: ({ req }) => isAdmin(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      access: { create: ({ req }) => isAdmin(req.user), update: ({ req }) => isAdmin(req.user) },
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Trainer', value: 'trainer' },
      ],
    },
  ],
}
