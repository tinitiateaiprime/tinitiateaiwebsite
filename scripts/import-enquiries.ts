import { appendFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { assertLocalImport, enquiryData } from '../src/integrations/azure/import-utils.mjs'

assertLocalImport(process.env)
if (!process.env.COSMOS_EXPORT_PATH || !process.env.COSMOS_EXPORT_SOURCE) throw new Error('Set COSMOS_EXPORT_PATH and COSMOS_EXPORT_SOURCE (stable database/container namespace)')
const exported = JSON.parse((await readFile(process.env.COSMOS_EXPORT_PATH, 'utf8')).replace(/^\uFEFF/, ''))
const records = Array.isArray(exported) ? exported : exported.items || exported.Documents
if (!Array.isArray(records)) throw new Error('Expected an array, { items: [] }, or { Documents: [] }')
const data = records.map(record => enquiryData(record, process.env.COSMOS_EXPORT_SOURCE))
if (new Set(data.map(record => record.subject)).size !== data.length) throw new Error('Duplicate IDs in export; reconcile before import')
const apply = process.env.INTEGRATION_APPLY === 'true'
const payload = await getPayload({ config })
await mkdir('.integration-private', { recursive: true })
const journal = path.resolve('.integration-private', `enquiries-${Date.now()}.jsonl`)
let created = 0
let skipped = 0
try {
  for (const record of data) {
    const existing = (await payload.find({ collection: 'contact-messages', where: { subject: { equals: record.subject } }, limit: 1 })).docs[0]
    if (existing) {
      if (existing.message !== record.message || existing.email !== record.email || existing.name !== record.name || existing.phone !== record.phone) throw new Error(`Changed exported record ${record.subject}; reconcile manually`)
      skipped++; continue
    }
    if (apply) {
      await appendFile(journal, JSON.stringify({ operation: 'create-intent', subject: record.subject }) + '\n', { mode: 0o600 })
      const doc = await payload.create({ collection: 'contact-messages', data: record })
      await appendFile(journal, JSON.stringify({ operation: 'created', collection: 'contact-messages', id: doc.id, subject: record.subject }) + '\n', { mode: 0o600 })
    }
    created++
  }
  console.log(JSON.stringify({ apply, exported: data.length, [apply ? 'created' : 'wouldCreate']: created, skipped, journal: apply ? journal : null }))
} finally { await payload.destroy() }
