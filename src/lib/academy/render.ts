import { load } from 'cheerio'
import path from 'node:path'
import { bridgeScript } from './bridge.mjs'
import manifest from '@/integrations/academy/manifest.json'
export function assetURL(relative: string, key: string, ticket: string) {
  return `/api/academy/content/${encodeURIComponent(key)}/${relative.split('/').map(encodeURIComponent).join('/')}?t=${encodeURIComponent(ticket)}`
}
export function renderLesson(html: string, options: { key: string; ticket: string; channel: string; origin: string; sourcePath: string; progress: object; hasVideo: boolean; preview?: boolean }) {
  const $ = load(html)
  $('header.master-top-nav, footer.site-footer').remove()
  $('script[src*="master-global-nav"],script[src*="auto-tour"],link[href*="auto-tour"]').remove()
  const rewrite = (value: string) => {
    const library=(manifest.external as Record<string,{path:string}>)[value]
    if(library)return assetURL(library.path,options.key,options.ticket)
    if (!value || value.startsWith('#') || /^(https?:|data:|blob:|mailto:)/i.test(value)) return value
    const relative = path.posix.normalize(path.posix.join(path.posix.dirname(options.sourcePath),value.split('?')[0]))
    return assetURL(relative,options.key,options.ticket)
  }
  $('script[src],link[href],img[src],source[src],video[src],audio[src]').each((_, el) => {
    const attribute = ['link'].includes(el.tagName) ? 'href' : 'src'
    const value=$(el).attr(attribute); if(value) $(el).attr(attribute,rewrite(value))
  })
  const video = $('#lesson-video video').first()
  if (video.length) {
    video.removeAttr('autoplay').attr('preload','metadata'); video.find('source').remove()
    if (options.preview) { video.remove(); $('#lesson-video').append('<p>The tutorial video is included with a course subscription. You can explore the complete interactive preview below. Use Request Subscription above to request full access.</p>') }
    else if (options.hasVideo) video.attr('src',`/api/academy/video/${options.key}?t=${encodeURIComponent(options.ticket)}`)
    else { video.removeAttr('src'); $('#lesson-video').append('<p>Tutorial recording is awaiting review. The interactive lesson is available below.</p>') }
  }
  $('head').prepend($('<script>').text(bridgeScript({ ...options, deck: path.posix.basename(options.sourcePath,'.html'), prefix:`/api/academy/content/${options.key}/` })))
  $('head').append('<style>.master-top-nav,.site-footer,[data-dashboard-tutor],#dashboard-tutor-launcher{display:none!important}body{margin:0!important;padding-top:0!important}</style>')
  return $.html()
}
export function rewriteCSS(css: string, sourcePath: string, key: string, ticket: string) {
  return css.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(full,quote,value) => /^(https?:|data:|blob:|#)/.test(value) ? full : `url("${assetURL(path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath),value)),key,ticket)}")`)
}
export function lessonCSP(origin: string) {
  const libraries='https://unpkg.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://d3js.org'
  return `sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' ${origin} ${libraries} blob:; style-src 'unsafe-inline' ${origin} https://fonts.googleapis.com ${libraries}; connect-src ${origin} ${libraries}; worker-src blob:; img-src ${origin} data: blob:; font-src ${origin} https://fonts.gstatic.com data:; media-src ${origin} blob:; frame-ancestors 'self'; base-uri 'none'; form-action 'none'`
}
export function sourceEntry(key: string) { return manifest.lessons.find(lesson=>lesson.key===key) }
