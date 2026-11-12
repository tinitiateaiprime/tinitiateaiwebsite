export function bridgeScript(config) {
  return '(' + studentBridge.toString() + ')(' + JSON.stringify(config).replaceAll('<','\\u003c') + ');'
}
function studentBridge(config) {
  const emit = (type, value) => parent.postMessage({ academy: config.channel, type, value }, '*')
  const values = { 'tinitiate.python.core.progress.v2': JSON.stringify(config.progress || {}) }
  const storage = {
    getItem: key => values[key] ?? null,
    setItem: (key, value) => { values[key] = String(value); if (key === 'tinitiate.python.core.progress.v2') { try { emit('progress',JSON.parse(value)) } catch {} } },
    removeItem: key => { delete values[key] }, clear: () => { Object.keys(values).forEach(key => delete values[key]) }, key: index => Object.keys(values)[index] || null,
    get length() { return Object.keys(values).length },
  }
  try { Object.defineProperty(window,'localStorage',{value:storage}) } catch {}
  const nativeFetch = window.fetch.bind(window)
  window.fetch = (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href)
    if (url.origin === config.origin) {
      if (!url.pathname.startsWith(config.prefix) && !url.pathname.startsWith('/api/academy/video/')) return Promise.reject(Error('Application API access is not available inside lessons'))
      url.searchParams.set('t',config.ticket)
    }
    return nativeFetch(url.href,{ ...options,credentials:'omit' })
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]')
    if (!anchor || anchor.getAttribute('href').startsWith('#')) return
    event.preventDefault(); event.stopImmediatePropagation()
    const url = new URL(anchor.getAttribute('href'), location.href)
    if (url.origin === config.origin && url.pathname.startsWith(config.prefix)) emit('navigate',decodeURIComponent(url.pathname.slice(config.prefix.length)))
    else emit('home',null)
  },true)
  document.addEventListener('submit',event => event.preventDefault(),true)
  addEventListener('DOMContentLoaded',() => {
    // Other standalone dashboards can explicitly signal completion without a second player.
    if (!document.querySelector('[data-py-page]')) {
      const button=document.createElement('button');button.textContent='Mark lesson complete';button.style.cssText='position:fixed;bottom:12px;right:12px;z-index:10000;background:#2563eb;color:white;border:0;border-radius:12px;padding:12px;cursor:pointer'
      button.onclick=()=>{emit('progress',{[config.deck]:[0]});button.textContent='Progress saved'};document.body.append(button)
    }
  })
}
