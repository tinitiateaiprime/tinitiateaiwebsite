import { isCMSStaff } from '../lib/academy/access'
import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { sendDemoBookingEmail } from '../lib/demoBookingEmail'

export const DemoBookings: CollectionConfig = {
  slug: 'demo-bookings',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'slot', 'status', 'createdAt'],
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
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
    },
    {
      name: 'slot',
      type: 'relationship',
      relationTo: 'demo-slots',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation !== 'create') return data

        if (!isCMSStaff(req.user)) data.status = 'pending'

        const slotId = typeof data.slot === 'object' ? data.slot.id : data.slot

        const slot = await req.payload.findByID({
          collection: 'demo-slots',
          id: slotId,
        })

        if (!slot || !slot.isActive || Date.parse(slot.startsAt) <= Date.now()) {
          throw new APIError('This demo slot is no longer available.', 400)
        }

        const existingBookings = await req.payload.count({
          collection: 'demo-bookings',
          where: {
            slot: { equals: slotId },
            status: { not_equals: 'cancelled' },
          },
        })

        if (existingBookings.totalDocs >= slot.capacity) {
          throw new APIError('This demo slot is fully booked. Please choose another time.', 400)
        }

        return data
      },
    ],

      afterChange: [
    async ({ doc, req, operation }) => {
      if (operation !== 'create') return doc

      try {
        const slotId =
          typeof doc.slot === 'object' ? doc.slot.id : doc.slot

        const courseId = doc.course
          ? typeof doc.course === 'object'
            ? doc.course.id
            : doc.course
          : null

        const slot = await req.payload.findByID({
          collection: 'demo-slots',
          id: slotId,
        })

        let courseTitle: string | null = null

        if (courseId) {
          const course = await req.payload.findByID({
            collection: 'courses',
            id: courseId,
          })

          courseTitle = course?.title ?? null
        } else if (
          slot.course &&
          typeof slot.course === 'object'
        ) {
          courseTitle = slot.course.title ?? null
        }

        await sendDemoBookingEmail({
          name: doc.name,
          email: doc.email,
          phone: doc.phone,
          message: doc.message,
          courseTitle,
          slotStartsAt: slot.startsAt,
        })
      } catch (error) {
        req.payload.logger.error({
          err: error,
          msg: 'Failed to send demo booking notification email',
        })
      }

      return doc
    },
  ],
  },
}
