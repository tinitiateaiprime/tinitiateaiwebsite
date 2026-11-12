import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { objectStoreConfig } from './lib/academy/object-store'
import { assertStagingEnvironment } from './lib/staging/environment.mjs'
import { adminMail } from './lib/mail'

import { academyCollections } from './collections/academy'
import { Users } from './collections/Users'
import { Students } from './collections/Students'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Trainers } from './collections/Trainers'
import { Courses } from './collections/Courses'
import { Testimonials } from './collections/Testimonials'
import { BlogPosts } from './collections/BlogPosts'
import { Enrollments } from './collections/Enrollments'
import { DemoSlots } from './collections/DemoSlots'
import { DemoBookings } from './collections/DemoBookings'
import { ContactMessages } from './collections/ContactMessages'
import { Batches } from './collections/Batches'
import { PlacementRegistrations } from './collections/PlacementRegistrations'
import { SiteSettings } from './globals/SiteSettings'
import { Workshops } from './collections/Workshops'
import { RealTimeProjects } from './collections/RealTimeProjects'
import { USERS_COOKIE_PREFIX } from './lib/auth/cookies'
import { CourseSubscriptionRequests, CourseRequestNotifications } from './collections/CourseSubscriptionRequests'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
if (process.env.INTEGRATION_TARGET === 'staging' || process.env.NETLIFY === 'true') assertStagingEnvironment()

export default buildConfig({
  serverURL: process.env.APP_URL,
  email: process.env.SMTP_HOST ? nodemailerAdapter({ ...(() => { const mail = adminMail('course-request'); return { transport: mail.transport, defaultFromAddress: mail.fromAddress, defaultFromName: 'Tinitiate AI' } })(), skipVerify: true }) : undefined,
  plugins: process.env.STORAGE_PROVIDER === 's3' ? [s3Storage({ bucket: process.env.PRIVATE_STORAGE_MEDIA_BUCKET!, collections: { media: { generateFileURL: ({ filename }) => `/api/media/file/${encodeURIComponent(filename)}` } }, config: objectStoreConfig(), signedDownloads: false, disableLocalStorage: true })] : [],
  cookiePrefix: USERS_COOKIE_PREFIX,
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    components: {
      actions: ['/components/auth/AdminLogout#AdminLogout'],
      logout: { Button: '/components/auth/AdminLogout#HiddenLogout' },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    CourseSubscriptionRequests,
    CourseRequestNotifications,
    ...academyCollections,
    Users,
    Students,
    Media,
    Categories,
    Trainers,
    Courses,
    Workshops,
    RealTimeProjects,
    Testimonials,
    BlogPosts,
    Enrollments,
    DemoSlots,
    DemoBookings,
    ContactMessages,
    Batches,
    PlacementRegistrations,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  db:
  process.env.DB_PROVIDER === 'postgres'
    ? postgresAdapter({
        push: process.env.INTEGRATION_TARGET !== 'staging' && process.env.PAYLOAD_SCHEMA_PUSH === 'true',
        allowIDOnCreate: process.env.INTEGRATION_TARGET === 'staging',
        pool: {
          connectionString:
            (process.env.INTEGRATION_TARGET === 'staging' ? process.env.DATABASE_URL : process.env.DATABASE_URL_UNPOOLED) ||
            process.env.DATABASE_URL ||
            '',
          max: 5,
          idleTimeoutMillis: 10000,
        },
      })
    : sqliteAdapter({
        transactionOptions: { behavior: 'immediate' },
        busyTimeout: 10000,
        wal: true,
        push: process.env.PAYLOAD_SCHEMA_PUSH === 'true',
        client: {
          url: process.env.DATABASE_URI || 'file:./tinitiateai.db',
        },
      }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
})
