'use strict';
/** Server-side auto discovery/injection: never writes to course HTML. */
const path = require('node:path');
const {analyze} = require('./scanner');

function isExistingIntegration(html) {
  return /data-tutor-loader|data-tutor-auto|dashboard-tutor\/client\/(?:tour|auto-tour|print-v2-integration)\.js/i.test(html);
}
function inject(html, page) {
  if (typeof html !== 'string' || !/<\/body\s*>/i.test(html)) return {html, enabled: false, reason: 'not-html'};
  if (isExistingIntegration(html)) return {html, enabled: false, reason: 'already-integrated'};
  // Runs for the requested page only: no saved registry and no scan prerequisite.
  const manifest = analyze(page);
  if (!manifest.matched) return {html, enabled: false, reason: 'no-interactive-dashboard'};
  const relative = path.posix.relative(path.posix.dirname(page), 'dashboard-tutor/client/auto-tour.js');
  const src = (relative.startsWith('.') ? relative : './' + relative);
  const tag = `\n<script defer data-tutor-auto src="${src}"></script>\n`;
  return {html: html.replace(/<\/body\s*>/i, tag + '</body>'), enabled: true, manifest};
}
module.exports={inject, isExistingIntegration};
