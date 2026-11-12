import test from 'node:test'
import assert from 'node:assert/strict'
import { assertLocalImport, enquiryData, groupSources, loadSources, matchCourse, mergeCurriculum } from '../src/integrations/azure/import-utils.mjs'
import { readFile } from 'node:fs/promises'

test('all usable Azure datasets load and duplicate identifiers form one group', async () => {
  const sources = await loadSources(new URL('../src/integrations/azure/data/', import.meta.url))
  const aliases = JSON.parse(await readFile(new URL('../src/integrations/azure/course-aliases.json', import.meta.url)))
  const groups = groupSources(sources, aliases)
  assert.ok(sources.length > 99)
  assert.equal(groups.filter(group => group.slug === 'html-course').length, 1)
  assert.ok(groups.find(group => group.slug === 'html-course').sources.length >= 2)
  assert.ok(groups.find(group => group.slug === 'python-language-course').aliases.has('python-language-course'))
})

test('existing course IDs/slugs win and ambiguous matches stop import', () => {
  const group = groupSources([{ source: 'test', record: { slug: 'python-language-course', title: 'Python Language Course' } }], {})[0]
  assert.equal(matchCourse(group, [{ id: 2, slug: 'Python', title: 'Python' }]).id, 2)
  assert.throws(() => matchCourse(group, [{ slug: 'one', title: 'Python' }, { slug: 'two', title: 'Python Course' }]), /Ambiguous/)
  assert.equal(matchCourse(group, [{ slug: 'python-full-stack', title: 'Python Full Stack' }]), undefined)
})

test('curriculum merge preserves existing IDs and is idempotent', () => {
  const original = [{ id: 'module-1', moduleTitle: 'Basics', topics: [{ id: 'topic-1', topic: 'Variables' }] }]
  const incoming = [{ title: 'Basics', topics: ['Variables', 'Loops'] }, { title: 'Project', topics: ['Build an app'] }]
  const result = mergeCurriculum(original, incoming)
  assert.equal(result[0].id, 'module-1')
  assert.equal(result[0].topics[0].id, 'topic-1')
  assert.deepEqual(mergeCurriculum(result, incoming), result)
  assert.equal(original[0].topics.length, 1)
})

test('Cosmos mapping preserves original content, timestamp, and namespaced identity', () => {
  const source = { id: 'original-123', name: 'Learner', email: 'learner@example.test', phone: '1234567890', preferredTime: 'Evening', course: 'Python', message: 'Original enquiry', createdAt: '2025-12-30T12:00:00.000Z' }
  const record = enquiryData(source, 'training-enquiries')
  assert.equal(record.createdAt, source.createdAt)
  assert.equal(record.subject, 'Cosmos training-enquiries:original-123')
  assert.match(record.message, /Original enquiry/)
  assert.match(record.message, /Evening/)
  assert.throws(() => enquiryData({ ...source, id: '' }, 'training-enquiries'))
})

test('production and PostgreSQL imports are refused before initialization', () => {
  const local = { NODE_ENV: 'development', INTEGRATION_TARGET: 'local', DB_PROVIDER: 'sqlite', DATABASE_URI: 'file:local.db' }
  assert.doesNotThrow(() => assertLocalImport(local))
  for (const changes of [{ NODE_ENV: 'production' }, { DB_PROVIDER: 'postgres' }, { INTEGRATION_TARGET: '' }, { DATABASE_URI: 'https://remote' }]) assert.throws(() => assertLocalImport({ ...local, ...changes }))
})
