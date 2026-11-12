import {vendorExternal} from './vendor-external.mjs'
import { readdir, readFile, mkdir, copyFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { runInNewContext } from 'node:vm'
import { load } from 'cheerio'
const reference = path.resolve(process.argv[2] || '')
if (!process.argv[2]) throw Error('Pass the separately cloned Academy reference directory')
const destination = path.resolve('.academy-private/source')
await mkdir(destination, { recursive: true }); await writeFile('.academy-private/import-reference.txt',reference); await mkdir('.academy-private/blobs', { recursive: true })
const walk = async dir => (await Promise.all((await readdir(dir, { withFileTypes: true })).filter(e => !['.git', 'node_modules', '.venv'].includes(e.name)).map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat()
const files = await walk(reference)
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const hashes = {}; const inventory = []; const recordings = []
for (const f of files) {
  const relative = path.relative(reference, f).replaceAll('\\', '/')
  if (relative.startsWith('dashboard-tutor/') || relative.startsWith('Final-videos/') || relative.startsWith('assets/dashboard-tutorials/')) continue
  if (!/\.(html|css|js|json|svg|png|jpe?g|webp|ico|woff2?|ttf|py)$/i.test(relative) || relative === 'package.json') continue
  const bytes = await readFile(f); hashes[relative] = hash(bytes)
  const target = path.join(destination, relative); await mkdir(path.dirname(target), { recursive: true }); await copyFile(f, target)
  if (relative.endsWith('.html')) {
    const text = bytes.toString('utf8')
    const title = (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || relative).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')
    const kind = /(?:-old|-v\d+)\.html$/.test(relative) ? 'obsolete-duplicate' : /^(index.html|why-tinitiate.html|test-fixtures\/|sales-pitch\/|pdfs\/|communication-skill-prep\/)/.test(relative) ? 'separate-material' : relative.endsWith('/demo.html') ? 'demo' : relative.endsWith('/index.html') ? 'course-hub' : 'lesson'
    inventory.push({ key: relative.replace(/\.html$/, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase(), sourcePath: relative, title, kind, publicDemo: false })
  }
}
const vendored=await vendorExternal(reference,files.filter(f=>f.endsWith('.html')),destination)
// Inspect the trusted original curriculum constants during offline preparation,
// never execute lesson source in an application request.
const pythonSource=await readFile(path.join(reference,'foundational/python/python-course.js'),'utf8')
const boundary=pythonSource.indexOf('  const ORDER =')
if(boundary<0)throw Error('Review changed Python curriculum structure before importing')
const slideCounts=runInNewContext(pythonSource.slice(0,boundary)+'return Object.fromEntries(Object.entries(DECKS).map(([key,deck])=>[key,deck.slides.length]));})(); PyCourse;',{}, {timeout:1000,contextCodeGeneration:{strings:false,wasm:false}})
await writeFile('src/integrations/academy/progress-config.json',JSON.stringify({source:'foundational/python/python-course.js',sha256:hash(pythonSource),slides:slideCounts},null,2)+'\n')
Object.assign(hashes,vendored.files)
const narrationProfile=hash(JSON.stringify({model:process.env.ELEVENLABS_MODEL_ID||'eleven_multilingual_v2',voice:process.env.ELEVENLABS_VOICE_ID||'unconfigured',language:'en'}))
const engineFiles = files.filter(f => path.relative(reference, f).replaceAll('\\', '/').startsWith('dashboard-tutor/') && /\.(js|json)$/.test(f) && !f.endsWith('package-lock.json'))
const engineFingerprint = hash(Buffer.concat(await Promise.all(engineFiles.sort().map(f => readFile(f)))))
for (const row of inventory) {
  const folder = path.posix.dirname(row.sourcePath)
  row.assets = Object.keys(hashes).filter(f => !f.endsWith('.html') && (f.startsWith(folder + '/') || f.startsWith('assets/') || f.startsWith(row.sourcePath.split('/')[0]+'/shared/') || (!f.includes('/') && /\.(png|svg|ico|jpe?g|webp|woff2?)$/i.test(f))))
  const $=load(await readFile(path.join(destination,row.sourcePath),'utf8'));const required=new Set()
  $('script[src],link[rel="stylesheet"][href],img[src],audio[src]').each((_,node)=>{
    const value=$(node).attr(node.tagName==='link'?'href':'src');if(!value||/master-global-nav|auto-tour/.test(value))return
    const frozen=vendored.external[value];if(frozen){required.add(frozen.path);return}
    if(/^(https?:|data:|blob:|#|\/\/)/.test(value))return
    const relative=path.posix.normalize(path.posix.join(folder,value.split(/[?#]/)[0]));if(row.assets.includes(relative))required.add(relative)
  })
  for(const asset of required){if(!asset.endsWith('.css'))continue;const css=await readFile(path.join(destination,asset),'utf8');for(const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)/g)){if(/^(https?:|data:|blob:|#)/.test(match[1]))continue;const relative=path.posix.normalize(path.posix.join(path.posix.dirname(asset),match[1]));if(row.assets.includes(relative))required.add(relative)}}
  row.previewAssets=[...required].sort()
  row.fingerprint = hash(JSON.stringify(['academy-isolation-v1', narrationProfile, engineFingerprint, row.sourcePath, hashes[row.sourcePath], ...row.assets.sort().map(f => [f, hashes[f]])]))
}
for (const f of files.filter(f => /assets[\\/]dashboard-tutorials[\\/].*\.json$/.test(f))) {
  const metadata = JSON.parse(await readFile(f, 'utf8'))
  const video = path.join(reference, metadata.video)
  const bytes = await readFile(video); const sha256 = hash(bytes); const blob = sha256 + '.mp4'
  try { await stat(path.join('.academy-private/blobs', blob)) } catch { await copyFile(video, path.join('.academy-private/blobs', blob)) }
  const duration = Number(execFileSync(process.env.FFPROBE_BIN || 'ffprobe', ['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',video], { encoding: 'utf8' }).trim())
  if (!(duration > 0) || Math.abs(duration - metadata.duration) > 2) throw Error('Invalid upstream recording: ' + metadata.id)
  recordings.push({ lessonKey: metadata.id, blob, sha256, bytes: bytes.length, duration, metadata })
}
const manifest = { repository: 'https://github.com/AkhilaThorpunuri/masterclass-interactive-web-training-center', commit: execFileSync('git', ['-C', reference, 'rev-parse', 'HEAD'], { encoding:'utf8' }).trim(), engineFingerprint, narrationProfile, external:vendored.external, lessons: inventory, files: hashes, recordings }
await writeFile('src/integrations/academy/manifest.json', JSON.stringify(manifest, null, 2))
const summary = inventory.reduce((counts, row) => ({ ...counts, [row.kind]: (counts[row.kind] || 0) + 1 }), {})
await writeFile('docs/PHASE2_ACADEMY_INVENTORY.md', '# Academy inventory\n\nSource: ' + manifest.repository + ' at `' + manifest.commit + '`.\n\n' + JSON.stringify(summary, null, 2) + '\n\nAll 133 source pages are classified below. Demo filenames do not grant public access; only an administrator can approve a demo in Payload. Obsolete and separate material are retained privately for provenance, not exposed as second homepages or public routes. The six MP4s were verified with ffprobe and deduplicated by SHA-256; duplicate Final-videos copies are not imported.\n\n| Source | Stable ID | Classification |\n| --- | --- | --- |\n' + inventory.map(r => `| ${r.sourcePath} | ${r.key} | ${r.kind} |`).join('\n') + '\n')
// Preserve and reuse the CJS recording engine; no original authoring HTTP server is exposed.
for (const f of engineFiles) {
  const rel = path.relative(path.join(reference,'dashboard-tutor'), f)
  const target = path.join('vendor/dashboard-tutor', rel); await mkdir(path.dirname(target), { recursive: true }); await copyFile(f, target)
}
await writeFile('vendor/dashboard-tutor/package.json', JSON.stringify({ name: 'tinitiate-dashboard-tutor-vendored', private: true, type: 'commonjs', upstream: manifest.commit }, null, 2))
const common = 'vendor/dashboard-tutor/lib/common.js'
await writeFile(common, (await readFile(common,'utf8'))
  .replace("const repoRoot = path.resolve(tutorDir, '..');", "const repoRoot = process.env.ACADEMY_CAPTURE_ROOT || path.resolve(tutorDir, '..');")
  .replace("const generatedDir = path.join(repoRoot, 'assets', 'dashboard-tutorials');", "const generatedDir = process.env.ACADEMY_GENERATED_DIR || path.join(repoRoot, 'assets', 'dashboard-tutorials');")
  .replace("const manifestsDir = path.join(tutorDir,'manifests');", "const manifestsDir = process.env.ACADEMY_MANIFESTS_DIR || path.join(tutorDir,'manifests');")
  .replace("const workDir = path.join(tutorDir,'work');", "const workDir = process.env.ACADEMY_WORK_DIR || path.join(tutorDir,'work');"))
console.log(JSON.stringify({ pages: inventory.length, summary, uniqueVideos: recordings.length, privateFiles: Object.keys(hashes).length }))
