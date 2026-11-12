'use strict';
const http=require('node:http');
const {fs,path,repoRoot,assertInside,safePage,idFor}=require('./common');
const {getManifest}=require('./scanner');
const autoTutor=require('./auto'); // AUTO_TUTOR_V1
const {recordDashboard}=require('./recorder');
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.mp4':'video/mp4','.webm':'video/webm','.svg':'image/svg+xml','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2'};
function server({port=4173,host='127.0.0.1'}={}){
 const jobs=new Map();let active=false;
 const api=(res,status,obj)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj));};
 return http.createServer(async(req,res)=>{
  try{
   const u=new URL(req.url,'http://localhost');
   if(u.pathname==='/__tutor/api/record'&&req.method==='POST'){
    if(active)return api(res,409,{error:'A recording is already running'});
    let body='';for await(const chunk of req){body+=chunk;if(body.length>20000)throw Error('Request too large');}
    const parsed=JSON.parse(body);const page=safePage(parsed.page);const m=getManifest(page);
    if(!m.matched)return api(res,400,{error:'Page does not contain a supported dashboard'});
    const key=String(Date.now())+'-'+Math.random().toString(36).slice(2,7);const job={id:key,state:'queued',page,startedAt:new Date().toISOString()};jobs.set(key,job);active=true;
    api(res,202,{id:key,state:'queued'});
    const hostBase=`http://127.0.0.1:${port}/`;
    recordDashboard({page,baseUrl:hostBase,silent:process.env.TUTOR_SILENT==='1',progress:next=>Object.assign(job,next)})
     .then(result=>{Object.assign(job,{state:'complete',result});}).catch(err=>{Object.assign(job,{state:'failed',error:String(err.message||err)});console.error('[TUTOR]',err);}).finally(()=>{active=false;});
    return;
   }
   if(u.pathname.startsWith('/__tutor/api/jobs/')&&req.method==='GET'){const id=u.pathname.slice('/__tutor/api/jobs/'.length);return jobs.has(id)?api(res,200,jobs.get(id)):api(res,404,{error:'Job not found'});}
   if(req.method!=='GET'&&req.method!=='HEAD')return api(res,405,{error:'Method not allowed'});
   let decoded;try{decoded=decodeURIComponent(u.pathname)}catch{return api(res,400,{error:'Bad URL'})}
   // Recover from Markdown copy/paste URLs ending in '**', which otherwise 404.
   // Only normalize a literal .html** suffix; never rewrite real lesson routes.
   if (req.method === 'GET' && /\.html\*\*$/.test(decoded)) {
     const canonical=decoded.slice(0,-2);
     res.writeHead(308,{'Location':encodeURI(canonical)+u.search,'Cache-Control':'no-store'});
     return res.end();
   }
   const requested=decoded.endsWith('/')?decoded+'index.html':decoded;
   let f=assertInside('.'+requested);let stat;try{stat=fs.statSync(f)}catch{return api(res,404,{error:'Not found'})}
   if(!stat.isFile())return api(res,404,{error:'Not a file'});
   // Prevent serving sensitive files, including secrets and recording intermediates.
   const relative=path.relative(repoRoot,f).split(path.sep).join('/');
   if(/(^|\/)(\.git|node_modules|work|manifests)(\/|$)/.test(relative)||/(^|\/)(\.env[^/]*|keys\.config|package-lock\.json)$/.test(relative)||relative.includes('..'))return api(res,403,{error:'Forbidden'});
   const type=MIME[path.extname(f)]||'application/octet-stream';
   const headers={'Content-Type':type,'Accept-Ranges':'bytes','Cache-Control':'no-cache'};
   const range=req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
   if(range){const start=range[1]?+range[1]:0;const end=range[2]?Math.min(stat.size-1,+range[2]):stat.size-1;
    if(start>end||end>=stat.size){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});return res.end();}
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});
    if(req.method==='HEAD')return res.end();return fs.createReadStream(f,{start,end}).pipe(res);
   }
   // AUTO_TUTOR_V1: detect and connect new lesson HTML at request time.
   // Do not write/replace the original HTML file or inject UI into a recorded video.
   if(type.startsWith('text/html') && req.method==='GET' && !u.searchParams.has('__tutor_capture')){
     const original=fs.readFileSync(f,'utf8');
     const injected=autoTutor.inject(original,relative);
     if(injected.enabled){
       const payload=Buffer.from(injected.html,'utf8');
       res.writeHead(200,{...headers,'Content-Length':payload.length});
       return res.end(payload);
     }
   }
   res.writeHead(200,{...headers,'Content-Length':stat.size});if(req.method==='HEAD')return res.end();fs.createReadStream(f).pipe(res);
  }catch(e){if(!res.headersSent)api(res,400,{error:String(e.message||e)});else res.end();}
 });
}
module.exports={server};
