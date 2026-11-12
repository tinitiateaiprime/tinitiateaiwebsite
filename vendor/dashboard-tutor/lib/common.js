'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const tutorDir = path.resolve(__dirname,'..');
const repoRoot = process.env.ACADEMY_CAPTURE_ROOT || path.resolve(tutorDir, '..');
const generatedDir = process.env.ACADEMY_GENERATED_DIR || path.join(repoRoot, 'assets', 'dashboard-tutorials');
const manifestsDir = process.env.ACADEMY_MANIFESTS_DIR || path.join(tutorDir,'manifests');
const workDir = process.env.ACADEMY_WORK_DIR || path.join(tutorDir,'work');
function mkdir(p){fs.mkdirSync(p,{recursive:true});}
function assertInside(p){const resolved=path.resolve(repoRoot,p);if(resolved!==repoRoot&&!resolved.startsWith(repoRoot+path.sep))throw Error('Path outside repository');return resolved;}
function safePage(p){p=String(p||'').replaceAll('\\','/').replace(/^\/+/, '');if(!p.endsWith('.html')||p.split('/').includes('..')||p.startsWith('dashboard-tutor/')||p.includes('\0'))throw Error('Invalid dashboard HTML path');assertInside(p);return p;}
function idFor(p){return safePage(p).replace(/\.html$/,'').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-|-$/g,'').toLowerCase();}
function writeJson(p,data){mkdir(path.dirname(p));fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n');}
function argsFrom(rest){const a={_ : []};for(let i=0;i<rest.length;i++){const x=rest[i];if(x.startsWith('--')){const [k,v] = x.slice(2).split('=');a[k]=v===undefined?(rest[i+1]&&!rest[i+1].startsWith('--')?rest[++i]:true):v;}else a._.push(x)}return a;}
function run(bin,args,options={}){return new Promise((resolve,reject)=>{const p=spawn(bin,args,{stdio:options.stdio||'pipe',...options});let out='',err='';p.stdout?.on('data',d=>out+=d);p.stderr?.on('data',d=>err+=d);p.on('error',reject);p.on('close',code=>code===0?resolve({out,err}):reject(Error(`${bin} exited ${code}: ${err.slice(-3000)}`)));});}
module.exports={fs,path,tutorDir,repoRoot,generatedDir,manifestsDir,workDir,mkdir,assertInside,safePage,idFor,writeJson,argsFrom,run};
