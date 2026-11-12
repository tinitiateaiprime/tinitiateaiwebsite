import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'
import { projectPythonPreview } from '../src/lib/academy/preview-projection.mjs'

test('the original Python adapter preserves the active deck and removes every other paid deck', async () => {
  const source = await readFile('.academy-private/source/foundational/python/python-course.js', 'utf8')
  for (const deck of ['print', 'variables', 'datatypes', 'operators', 'strings', 'lists']) {
    const projected = projectPythonPreview(source, deck)
    const boundary = projected.indexOf('  // ---------- State + persistence')
    assert.ok(boundary > 0)
    const prefix = projected.slice(0, boundary) + 'return {keys:Object.keys(DECKS),order:ORDER,slides:DECKS[ORDER[0]].slides.length};})(); PyCourse;'
    const value = runInNewContext(prefix, {}, { timeout: 1000, contextCodeGeneration: { strings: false, wasm: false } })
    assert.equal(JSON.stringify(value.keys), JSON.stringify([deck])); assert.equal(JSON.stringify(value.order), JSON.stringify([deck])); assert.ok(value.slides >= 10)
  }
  assert.throws(() => projectPythonPreview(source, 'nonexistent'))
})
