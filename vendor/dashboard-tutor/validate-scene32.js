'use strict';
// One-off local capture-layout stress test. Does not send requests to ElevenLabs
// and does not modify the source Python lesson or publish a recorded video.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const stage = require('./lib/stage');

async function main() {
  const browser = await chromium.launch({
    headless: process.env.TUTOR_VISIBLE !== '1',
    ...(process.env.TUTOR_CHROMIUM ? { executablePath: process.env.TUTOR_CHROMIUM } : {})
  });
  const out = path.join(__dirname, 'work', 'scene32-layout-check.png');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  try {
    const page = await browser.newPage({viewport: {width: 1920, height: 1080}, deviceScaleFactor: 1});
    page.on('pageerror', e => console.error('Browser:', e.message));
    await page.goto('http://127.0.0.1:4173/foundational/python/print.html?__tutor_capture=1',
      {waitUntil: 'domcontentloaded', timeout: 20000});
    await page.locator('#py-stage .py-slide').waitFor({state: 'attached', timeout: 20000});
    await page.waitForTimeout(750);
    await stage.setup(page);
    await page.evaluate(() => PyCourse.go(9)); // Slide 10, immediately before the failed scene.
    await page.waitForTimeout(900); // Let the lesson finish its own slide transition.
    // Stress the exact failure mechanism: a tall editor + multiple output lines.
    // These modifications affect only the temporary Chromium test tab.
    await page.addStyleTag({content: '#player .py-code-col .py-editor{min-height:650px!important;}'});
    await page.evaluate(() => {
      const terminal = document.querySelector('#py-term');
      if(!terminal)throw new Error('The Python output panel is missing');
      terminal.textContent=Array.from({length: 16}, (_, i) =>
        `Python output line ${i+1}: a longer result or diagnostic message.`).join('\n');
    });
    const layout = await stage.focus(page, '#player', '#py-next');
    await page.screenshot({path: out});
    const overflow = await page.locator('#py-term').evaluate(el => ({
      scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,
      bottom:el.getBoundingClientRect().bottom
    }));
    if(layout.invalid.length)throw new Error('Still clipped: '+JSON.stringify(layout.invalid));
    if(!layout.refit)throw new Error('The layout did not need refitting; stress test may not have run correctly.');
    const longOutput = await page.evaluate(() => document.documentElement.classList.contains('tutor-capture-long-output'));
    if(!longOutput)throw new Error('Long-output fallback was not activated.');
    if(overflow.scrollHeight<=overflow.clientHeight)throw new Error('Long output was not kept in a scrollable panel.');
    if(overflow.bottom>974)throw new Error('The terminal still extends beyond the subtitle-safe area.');
    console.log('PASS: Scene 32 stress check; long editor/output fit within the capture frame.');
    console.log('Output is scrollable; no text was deleted. Screenshot:',out);
  } finally {
    await browser.close();
  }
}
main().catch(err => {
  console.error('Scene 32 validation FAILED:',err.message);
  console.error('Run "node cli.js serve" in a separate CMD window, then retry.');
  process.exitCode=1;
});
