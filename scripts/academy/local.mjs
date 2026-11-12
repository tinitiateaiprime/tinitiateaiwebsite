import {spawn} from 'node:child_process'
const child=spawn(process.execPath,['scripts/local.mjs',...process.argv.slice(2)],{stdio:'inherit',env:{...process.env,PHASE2_LOCAL:'true'}})
child.on('exit',code=>{process.exitCode=code??1})
