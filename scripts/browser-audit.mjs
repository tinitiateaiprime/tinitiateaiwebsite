import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const base = process.env.UI_PREVIEW_URL || 'http://localhost:3001';
const quick = process.argv.includes('--quick');
const courses = JSON.parse(await readFile('src/data/courses.json', 'utf8'));
const lessons = JSON.parse(await readFile('src/data/masterclasses.json', 'utf8'));
const site = ['/', '/courses', '/masterclasses', '/training', '/services', '/company', '/contact', '/request-callback'];
const urls = [...site, ...(quick ? [] : courses.map(row => '/courses/' + encodeURIComponent(row.slug))), ...lessons.map(row => row.url)];
const widths = quick ? [320] : [320, 375, 390, 768, 1024, 1440];
const browser = await chromium.launch();
const results = [], errors = [], failedRequests = [], consoleErrors = [], missingFragments = [], navigationErrors = [];
let cursor = 0;
await mkdir('.ui-review/screenshots', { recursive: true });
try {
  await Promise.all(Array.from({ length: 4 }, async () => {
    const context = await browser.newContext({ viewport: { width: 320, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    let current = '';
    page.on('pageerror', error => errors.push({ page: current, message: error.message }));
    page.on('console', message => {if(message.type()==='error') consoleErrors.push({page:current,message:message.text()});});
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(base)) failedRequests.push({ page: current, url: response.url().split('?')[0], status: response.status() }); });
    // No enquiry may reach any backend during an audit.
    await context.route('**/api/request-callback', route => route.abort());
    while (cursor < urls.length) {
      current = urls[cursor++];
      try {
        const response = await page.goto(base + current, { waitUntil: 'domcontentloaded', timeout: 90000 });
        await page.waitForTimeout(400);
        await page.waitForLoadState('domcontentloaded');
        const navigation = await page.evaluate(() => ({
          fragments:[...document.querySelectorAll('a[href*="#"]')].filter(a=>{const u=new URL(a.href);return u.origin===location.origin && u.pathname===location.pathname && u.hash.length>1 && !document.getElementById(decodeURIComponent(u.hash.slice(1)));}).map(a=>a.getAttribute('href')),
          exits:[...document.querySelectorAll('.master-brand-wrap, .master-menu-links > a')].filter(a=>a.matches('.master-brand-wrap')||a.textContent.trim()==='Home').filter(a=>a.getAttribute('href')!=='/').map(a=>a.getAttribute('href')),
        }));
        if(navigation.fragments.length) missingFragments.push({page:current,hrefs:[...new Set(navigation.fragments)]});
        if(navigation.exits.length) navigationErrors.push({page:current,hrefs:navigation.exits});
        for (const width of widths) {
          await page.setViewportSize({ width, height: 900 }); await page.waitForTimeout(70);
          const data = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
            offenders: [...document.querySelectorAll('body *')].filter(node => { const style = getComputedStyle(node); if (style.display === 'none' || style.visibility === 'hidden') return false; const r = node.getBoundingClientRect(); return r.width && (r.right > innerWidth + 2 || r.left < -2) && !node.closest('pre, [style*="overflow"]'); }).slice(0, 9).map(node => ({ tag: node.tagName, cls: String(node.className).slice(0, 130), right: Math.round(node.getBoundingClientRect().right), left: Math.round(node.getBoundingClientRect().left) })) }));
          results.push({ page: current, width, status: response?.status(), ...data });
        }
      } catch (error) { errors.push({ page: current, message: error.message }); }
      console.log('Audited ' + current);
    }
    await context.close();
  }));
} finally { await browser.close(); }
const overflow = results.filter(row => row.scrollWidth > row.width + 1);
const report = { uniquePages: urls.length, widths, measurements: results.length, overflow, errors, consoleErrors, failedRequests, missingFragments, navigationErrors, results };
await writeFile('.ui-review/' + (quick ? 'quick-audit' : 'browser-matrix') + '.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: urls.length, measurements: results.length, overflow: overflow.map(row => ({ page: row.page, width: row.width, scrollWidth: row.scrollWidth, offenders: row.offenders })), errors, consoleErrors, failedRequests, missingFragments, navigationErrors }, null, 2));
if (overflow.length || errors.length || failedRequests.length || consoleErrors.length || missingFragments.length || navigationErrors.length) process.exitCode = 1;
