#!/usr/bin/env node
/**
 * Sync the MasterClass content (home + every MasterClass) from its source repo
 * into public/masterclasses, then re-apply the website's own additions.
 *
 *   node scripts/sync-masterclasses.mjs                 # clone the repo and sync
 *   node scripts/sync-masterclasses.mjs --source <dir>  # sync from a local checkout
 *
 * Runs in the deploy workflow before every build, so the live site always
 * serves the latest MasterClass content.
 *
 * What it does:
 * - copies every public file from the repo (adds new pages, updates changed ones);
 * - skips internal material (notes, tools, sales and operations folders);
 * - never deletes website-only files (recorded videos, vendor files, site nav);
 * - in every HTML page: pins the Lucide CDN version and injects the website
 *   navigation (link back to tinitiateai.com) and the tutor-widget hide rule;
 * - leaves foundational/python/ alone: the website owns the Python course
 *   (14 lessons, recorded videos and python-course.js are maintained here).
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const REPO = 'https://github.com/jaykumsi/masterclass-interactive-web-training-center.git';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const TARGET = path.join(ROOT, 'public', 'masterclasses');

// Internal material in the content repo that must not be published.
const SKIP_DIRS = new Set(['.git', '.github', 'tools', 'ramesh-operations', 'sales-pitch']);
const SKIP_EXT = new Set(['.md', '.py', '.zip', '.docx']);
// Content the website maintains itself; never overwritten by the sync.
const WEBSITE_OWNED = ['foundational/python/'];

const SITE_HEAD = [
  '<link rel="stylesheet" href="/masterclasses/assets/css/site-navigation.css">',
  '<script src="/masterclasses/assets/js/site-navigation.js" defer></script>',
  '<style>#dashboard-tutor-launcher,[data-dashboard-tutor],.dashboard-tutor-controls{display:none!important}</style>',
].join('\n');

function insertBeforeHeadEnd(html, snippet) {
  const i = html.search(/<\/head>/i);
  return i < 0 ? html : html.slice(0, i) + snippet + '\n' + html.slice(i);
}

/** Apply the website's additions to one HTML page. */
function transformHtml(rel, html) {
  let out = html.replaceAll('https://unpkg.com/lucide@latest', 'https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js');
  if (!out.includes('/masterclasses/assets/js/site-navigation.js')) out = insertBeforeHeadEnd(out, SITE_HEAD);

  return out;
}

function* walk(dir, base = dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full).split(path.sep).join('/');
    if (WEBSITE_OWNED.some(p => (rel + '/').startsWith(p))) continue;
    if (entry.isDirectory()) { if (!SKIP_DIRS.has(entry.name)) yield* walk(full, base); }
    else if (!SKIP_EXT.has(path.extname(entry.name).toLowerCase())) yield rel;
  }
}

function main() {
  const argIndex = process.argv.indexOf('--source');
  let source = argIndex > -1 ? path.resolve(process.argv[argIndex + 1]) : '';
  let temp = '';
  if (!source) {
    temp = fs.mkdtempSync(path.join(os.tmpdir(), 'masterclass-'));
    console.log(`Cloning ${REPO} …`);
    execFileSync('git', ['clone', '--depth', '1', '--quiet', REPO, temp], { stdio: 'inherit' });
    source = temp;
  }
  try {
    const commit = (() => { try { return execFileSync('git', ['-C', source, 'log', '-1', '--format=%h %cd %s', '--date=short']).toString().trim(); } catch { return 'unknown'; } })();
    console.log(`Source: ${commit}`);
    let added = 0, updated = 0, same = 0;
    for (const rel of walk(source)) {
      const from = path.join(source, rel), to = path.join(TARGET, rel);
      let data = fs.readFileSync(from);
      if (rel.endsWith('.html')) data = Buffer.from(transformHtml(rel, data.toString('utf8')), 'utf8');
      const exists = fs.existsSync(to);
      if (exists && fs.readFileSync(to).equals(data)) { same++; continue; }
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.writeFileSync(to, data);
      exists ? updated++ : added++;
    }
    console.log(`MasterClasses synced: ${added} added, ${updated} updated, ${same} unchanged.`);
  } finally {
    if (temp) fs.rmSync(temp, { recursive: true, force: true });
  }
}

main();
