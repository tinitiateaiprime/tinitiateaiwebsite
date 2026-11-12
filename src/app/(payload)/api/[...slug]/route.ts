import config from '@payload-config'
import { scopedREST } from '@/lib/auth/rest'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = scopedREST(REST_GET(config))
export const POST = scopedREST(REST_POST(config))
export const DELETE = scopedREST(REST_DELETE(config))
export const PATCH = scopedREST(REST_PATCH(config))
export const PUT = scopedREST(REST_PUT(config))
export const OPTIONS = REST_OPTIONS(config)
