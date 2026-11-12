'use strict';
const {fs,path,run,mkdir}=require('./common');
const FFMPEG=()=>process.env.FFMPEG_BIN||'ffmpeg';
const TARGET_LUFS=-16,TRUE_PEAK=-1.5,LOUDNESS_RANGE=7;
async function duration(filename){const {out}=await run(process.env.FFPROBE_BIN||'ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',filename]);return Number(out.trim());}
function statsOf(stderr){
 const json=[...stderr.matchAll(/\{[\s\S]*?"input_i"[\s\S]*?\}/g)].at(-1);
 if(!json)return null;
 try{const data=JSON.parse(json[0]);
  const fields=['input_i','input_tp','input_lra','input_thresh','target_offset'];
  if(!fields.every(k=>Number.isFinite(Number(data[k]))))return null;
  return data;
 }catch{return null;}
}
// Two-pass loudnorm eliminates per-clip gain drift. The master mix MUST use
// amix:normalize=0 to avoid increasing gain as earlier streams end.
async function normalizeVoice(src,dst,{target=TARGET_LUFS}={}){
 const base=`loudnorm=I=${target}:TP=${TRUE_PEAK}:LRA=${LOUDNESS_RANGE}`;
 const scan=await run(FFMPEG(),['-hide_banner','-nostats','-i',src,'-af',base+':print_format=json','-f','null','-']);
 const st=statsOf(scan.err);
 const measured=st?`:measured_I=${st.input_i}:measured_TP=${st.input_tp}:measured_LRA=${st.input_lra}:measured_thresh=${st.input_thresh}:offset=${st.target_offset}:linear=true`:'';
 await run(FFMPEG(),['-y','-hide_banner','-loglevel','error','-i',src,'-vn','-af',`${base}${measured}:print_format=summary,aresample=48000,alimiter=limit=0.84:level=false`,'-ac','1','-ar','48000','-c:a','pcm_s16le',dst]);
 return {file:dst,duration:await duration(dst),targetLufs:target,measuredInputLufs:st?Number(st.input_i):null};
}
async function prepareAudio(scenes,dir,{silent=false}={}){
 mkdir(dir);
 if(silent)return scenes.map(()=>({file:null,duration:4.2}));
 const key=process.env.ELEVENLABS_API_KEY,voice=process.env.ELEVENLABS_VOICE_ID;
 if(!key||!voice)throw Error('Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID, or run with --silent to test without voice.');
 const clips=[];
 for(let i=0;i<scenes.length;i++){
   const number=String(i+1).padStart(2,'0');const raw=path.join(dir,number+'.mp3');const file=path.join(dir,number+'-normalized.wav');
   const response=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}/with-timestamps`,{
    method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json'},
    body:JSON.stringify({text:scenes[i].narration,model_id:process.env.ELEVENLABS_MODEL_ID||'eleven_multilingual_v2',output_format:'mp3_44100_128',voice_settings:{stability:0.55,similarity_boost:0.75}})
   });
   if(!response.ok)throw Error(`ElevenLabs narration failed for scene ${i+1}: HTTP ${response.status}: ${(await response.text()).slice(0,300)}`);
   const data=await response.json();if(!data.audio_base64)throw Error('ElevenLabs response did not contain audio_base64');
   fs.writeFileSync(raw,Buffer.from(data.audio_base64,'base64'));
   fs.writeFileSync(path.join(dir,number+'.alignment.json'),JSON.stringify(data.alignment||{},null,2));
   clips.push(await normalizeVoice(raw,file));
 }
 return clips;
}
module.exports={prepareAudio,duration,normalizeVoice,statsOf,TARGET_LUFS};
