#!/usr/bin/env node
'use strict';
const {path,repoRoot,generatedDir,argsFrom,safePage,fs}=require('./lib/common');
const {scan}=require('./lib/scanner');
const {server}=require('./lib/server');
const {recordDashboard}=require('./lib/recorder');
async function main(){const [cmd,...a]=process.argv.slice(2);const args=argsFrom(a);
 if(cmd==='scan'){const data=scan();console.log(`Scanned ${data.totalHtml} HTML files; discovered ${data.detected} candidate dashboards. Report: dashboard-tutor/manifests/registry.json`);console.log(data.entries.filter(x=>x.matched).slice(0,35).map(x=>`${x.adapter.padEnd(10)} ${String(x.score).padStart(3)} ${x.path}`).join('\n'));}
 else if(cmd==='install'){console.log('No installation into HTML pages is needed. Start the local server: node cli.js serve');}
 else if(cmd==='serve'){const port=Number(args.port||process.env.PORT||4173);server({port}).listen(port,'127.0.0.1',()=>console.log(`Dashboard Tutor running on http://127.0.0.1:${port}/ (localhost authoring mode)`));}
 else if(cmd==='record'){const p=safePage(args._[0]);const port=Number(args.port||4173);const result=await recordDashboard({page:p,baseUrl:`http://127.0.0.1:${port}/`,silent:!!args.silent,limit:Number(args.limit||0),progress:x=>console.log(JSON.stringify(x))});console.log('RECORDED',JSON.stringify(result,null,2));}
 else if(cmd==='check'){console.log('repo root:',repoRoot,'\nvideo output:',generatedDir);console.log('ffmpeg:',require('node:child_process').spawnSync('ffmpeg',['-version']).status===0?'available':'missing');console.log('elevenlabs key:',process.env.ELEVENLABS_API_KEY?'configured':'not configured');console.log('elevenlabs voice:',process.env.ELEVENLABS_VOICE_ID?'configured':'not configured');console.log('playwright:',(()=>{try{return require.resolve('playwright')}catch{return 'not installed'}})());}
 else console.log('Usage: node dashboard-tutor/cli.js scan|serve [--port 4173]|record <relative-page.html> [--silent] [--limit 3]|check');
}
main().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
