import {readFile,writeFile,mkdir} from 'node:fs/promises'
import {createHash} from 'node:crypto'
import path from 'node:path'
export async function vendorExternal(reference,htmlFiles,destination){
 const allowed=new Set(['unpkg.com','cdn.jsdelivr.net','cdnjs.cloudflare.com','d3js.org'])
 const urls=new Set()
 for(const file of htmlFiles){const html=await readFile(file,'utf8');for(const match of html.matchAll(/(?:src|href)=["'](https?:\/\/[^"']+)["']/g)){const url=new URL(match[1]);if(allowed.has(url.hostname))urls.add(url.href)}}
 let cached={};try{cached=JSON.parse(await readFile('.academy-private/external-libraries.json','utf8'))}catch{}
 const files={}
 for(const url of [...urls].sort()){
  let item=cached[url]
  if(item){try{const bytes=await readFile(path.join(destination,item.path));if(createHash('sha256').update(bytes).digest('hex')!==item.sha256)item=null}catch{item=null}}
  if(!item){
   const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`External lesson dependency unavailable: ${new URL(url).hostname}, HTTP ${response.status}`)
   const bytes=Buffer.from(await response.arrayBuffer());const sha256=createHash('sha256').update(bytes).digest('hex');const extension=response.headers.get('content-type')?.includes('css')?'.css':'.js';const relative='assets/academy-vendor/'+sha256+extension
   await mkdir(path.join(destination,'assets/academy-vendor'),{recursive:true});await writeFile(path.join(destination,relative),bytes)
   item={path:relative,sha256,resolvedURL:response.url};cached[url]=item
  }
  files[item.path]=item.sha256
 }
 await writeFile('.academy-private/external-libraries.json',JSON.stringify(cached,null,2))
 return {external:cached,files}
}
