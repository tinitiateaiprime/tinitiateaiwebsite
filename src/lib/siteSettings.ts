import { getPayload } from '@/lib/getPayload'

export async function getSiteSettings() {
  const payload = await getPayload()
  return payload.findGlobal({
  slug: 'site-settings',
  depth: 1,
})
}
