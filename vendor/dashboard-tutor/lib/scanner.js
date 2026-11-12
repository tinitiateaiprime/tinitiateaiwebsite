'use strict';
const {fs,path,repoRoot,manifestsDir,idFor,mkdir,writeJson}=require('./common');
const SKIP=new Set(['node_modules','.git','dashboard-tutor','.venv','dist','assets','test-fixtures']);
function walk(dir=repoRoot,sub=''){let output=[];for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(ent.isDirectory()&&!SKIP.has(ent.name))output.push(...walk(path.join(dir,ent.name),path.posix.join(sub,ent.name)));else if(ent.isFile()&&ent.name.endsWith('.html'))output.push(path.posix.join(sub,ent.name));}return output;}
function cleanHtml(html){return html.replace(/<header\b[\s\S]*?<\/header>/gi,'').replace(/<footer\b[\s\S]*?<\/footer>/gi,'').replace(/<nav\b[\s\S]*?<\/nav>/gi,'');}
function titleOf(html){const m=html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);return (m?m[1]:'Interactive Dashboard').replace(/<[^>]+>/g,'').replace(/&[^;]+;/g,' ').replace(/\s+/g,' ').trim().slice(0,140);}
function analyze(p){const html=fs.readFileSync(path.join(repoRoot,p),'utf8');const main=(html.match(/<main\b[\s\S]*?<\/main>/i)||[])[0]||html;
 const body=cleanHtml(main);const buttonCount=(body.match(/<button\b/gi)||[]).length;const inputCount=(body.match(/<(input|select|textarea)\b/gi)||[]).length;const onclickCount=(body.match(/\bon(?:click|change|input)\s*=/gi)||[]).length;
 const python=/data-py-page=["'](?:print|variables|datatypes|operators|strings|lists)["']/.test(html)&&/id=["']py-player["']/.test(html);
 const react=/<script[^>]*type=["']text\/babel["']/i.test(html)||/react(?:dom)?[^"']*\.js/i.test(html);
 const simulator=/id=["']btn-(?:run|step)["']/.test(html)||/id=["']btn-dag-(?:step|play)["']/.test(html);
 const diagram=/joint(?:\.min)?\.js|d3(?:\.min)?\.js|<svg\b/i.test(body)&&/(?:simulator|diagram|workflow|lineage)/i.test(body);
 const scores=buttonCount*2+inputCount*2+onclickCount*3+(python?24:0)+(react?9:0)+(simulator?12:0)+(diagram?5:0);
 const supported=python||simulator||(react&&/id=["\']root["\']/.test(html))||scores>=12;
 const adapter=python?'pycourse':simulator?'simulator':react?'react':diagram?'diagram':'generic';
 const anchor=python?'#dashboard':/id=["']sec-dag-simulator["']/.test(html)?'#sec-dag-simulator':/id=["']workflow["']/.test(html)?'#workflow':simulator? '#btn-run':react?'#root':'main';
 const selectors=[...body.matchAll(/<(?:button|input|select|textarea)[^>]*\bid=["']([^"']+)["']/gi)].map(m=>`#${m[1]}`).slice(0,60);
 return {id:idFor(p),path:p,title:titleOf(html),adapter,anchor,score:scores,matched:supported,status:supported?'discovered':'not-interactive',elements:{buttons:buttonCount,inputs:inputCount,handlers:onclickCount},candidateControls:selectors};}
function scan(){const entries=walk().map(analyze);const registry={generatedAt:new Date().toISOString(),totalHtml:entries.length,detected:entries.filter(x=>x.matched).length,entries};mkdir(manifestsDir);writeJson(path.join(manifestsDir,'registry.json'),registry);return registry;}
function getManifest(page){return analyze(page);}
module.exports={walk,analyze,scan,getManifest};
