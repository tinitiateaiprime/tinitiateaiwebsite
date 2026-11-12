/* Universal Dashboard Tutor loader — injected into HTML by local authoring server. */
(() => {
  'use strict';
  // Suppress the recorder itself while Playwright captures the teaching dashboard.
  if (new URLSearchParams(location.search).has('__tutor_capture')) return;
  const script = document.currentScript || document.querySelector('script[data-tutor-auto]');
  if (!script || window.__tinitiateAutoTutorLoaded) return;
  window.__tinitiateAutoTutorLoaded = true;
  const root = new URL('../../', script.src);
  const path = decodeURIComponent(location.pathname);
  const rel = path.startsWith(root.pathname) ? path.slice(root.pathname.length).replace(/^\/+/, '') : '';
  if (!rel.endsWith('.html')) return;
  const slug = rel.replace(/\.html$/, '').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\]|::1)$/i.test(location.hostname);
  const url = (p) => new URL(p, root);
  const videoUrl = url('assets/dashboard-tutorials/' + slug + '.mp4');
  const metadataUrl = url('assets/dashboard-tutorials/' + slug + '.json');
  const recordUrl = url('__tutor/api/record');
  const cssUrl = url('dashboard-tutor/client/auto-tour.css');
  const css = document.createElement('link'); css.rel='stylesheet'; css.href=cssUrl.href;document.head.append(css);
  const el = (tag, className, text) => {const e=document.createElement(tag); if(className)e.className=className;if(text)e.textContent=text;return e;};
  const getJson=async(address,opts) => {const r=await fetch(address,opts);if(!r.ok){let d={};try{d=await r.json();}catch{}throw new Error(d.error||`HTTP ${r.status}`);}return r.json();};

  function boot(){
    // Do not interfere with hand-integrated V2 tutorials or the previous loader.
    if (document.querySelector('#v2-record-tutorial,#tutor-video-panel,#auto-tutor-shell')) return;
    const main=document.querySelector('main') || document.body;
    let frame=document.querySelector('#lesson-video [data-youtube-video-placeholder], #lesson-video [data-tutor-slot], [data-tutor-video-placeholder]');
    if (frame && frame.querySelector('iframe,video')) frame=null; // Never delete a real embedded lesson.
    const section=frame?.closest('#lesson-video') || null;
    const anchor=document.querySelector('main #dashboard,main #player,main #workflow,main #sec-dag-simulator,main section') || main.firstElementChild;
    let panel;
    if (section && frame) {
      panel=el('div','auto-tutor-panel');
      // Reuse the empty placeholder, keeping original page layout and header.
      // Replace the empty 16:9 frame itself, not its children: the button
      // and status must not get clipped by that frame's overflow:hidden.
      frame.replaceWith(panel);
    } else {
      panel=el('section','auto-tutor-panel auto-tutor-standalone');
      if (main.matches('.py-wrap') && document.querySelector('main #py-player')) panel.classList.add('auto-tutor-python');
      panel.setAttribute('aria-label','Recorded interactive tutorial');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(panel,anchor);
      else main.prepend(panel);
    }
    const heading=el('div','auto-tutor-head');
    const caption=el('div','auto-tutor-copy');
    caption.append(el('strong','','Dashboard Walkthrough'),el('small','','Watch the instructor demonstrate this interactive lesson.'));
    const button=el('button','auto-tutor-button','● Record Tutorial');button.type='button';button.setAttribute('data-tutor-ignore','');
    if(!isLocal){button.hidden=true;}
    heading.append(caption,button);
    const shell=el('div','auto-tutor-shell');shell.id='auto-tutor-shell';
    const empty=el('div','auto-tutor-empty','Recorded tutorial will appear here after the first successful recording.');
    const video=el('video','auto-tutor-video');video.controls=true;video.playsInline=true;video.preload='metadata';video.hidden=true;
    shell.append(empty,video);
    const status=el('p','auto-tutor-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    status.textContent=isLocal?'Ready to record. Narration runs only when you click Record Tutorial.':'Recorded tutorials can be watched here; recording requires the local authoring server.';
    panel.append(heading,shell,status);
    function showVideo(){video.src=videoUrl.href+'?v='+Date.now();video.hidden=false;empty.hidden=true;button.textContent='● Re-record Tutorial';status.textContent='Recording ready. Watch above, then practice below.';}
    fetch(metadataUrl.href,{cache:'no-store'}).then(async r=>{if(r.ok){const m=await r.json();if(m.status==='complete'&&m.video&&m.video.endsWith(slug+'.mp4'))showVideo();}}).catch(()=>{});
    button.addEventListener('click', async()=>{
      if(!isLocal || button.disabled)return;
      button.disabled=true;button.textContent='Preparing recorder…';status.textContent='Starting the local Dashboard Tutor recording.';
      try{
        const job=await getJson(recordUrl.href,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page:rel})});
        if(!job.id)throw Error('Recorder returned no job ID');
        const pollUrl=url('__tutor/api/jobs/'+encodeURIComponent(job.id));
        let done=false;
        for(let n=0;n<3600;n++){
          await new Promise(r=>setTimeout(r,1200));
          const p=await getJson(pollUrl.href,{cache:'no-store'});
          if(p.state==='failed')throw Error(p.error||'Recording failed');
          if(p.state==='complete'){
            if(p.result?.preview || !p.result?.video)throw Error('A preview, not a publishable video, was created');
            showVideo();done=true;break;
          }
          status.textContent=p.state==='recording'?`Recording ${Number(p.completed||0)+1}/${p.total||'?'}: ${p.step||'lesson'}`:p.state==='narrating'?'Generating instructor narration…':p.state==='rendering'?'Encoding narrated Full HD tutorial…':`Recorder: ${p.state||'processing'}`;
        }
        if(!done)throw Error('Recording timed out; see server console.');
      }catch(e){status.textContent='Recording unavailable: '+(e.message||String(e))+' — inspect the Dashboard Tutor server.';status.dataset.error='true';}
      finally{button.disabled=false;if(video.hidden)button.textContent='● Record Tutorial';}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
