import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'

export const Students: CollectionConfig = {
  slug: 'students',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'phone'],
  },
  auth: { useSessions: true, cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' && process.env.INTEGRATION_TARGET !== 'local' } },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (isCMSStaff(user)) return true
      if (user?.collection === 'students') {
        return { id: { equals: user.id } }
      }
      return false
    },
    update: ({ req: { user } }) => {
      if (isCMSStaff(user)) return true
      if (user?.collection === 'students') {
        return { id: { equals: user.id } }
      }
      return false
    },
    delete: ({ req: { user } }) => isCMSStaff(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
