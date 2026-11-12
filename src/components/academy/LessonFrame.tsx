'use client'
import { useEffect,useRef,useState } from 'react'
import { useRouter } from 'next/navigation'
export function LessonFrame({source,keyID,channel,studentID,navigation,home}:{source:string;keyID:string;channel:string;studentID:number|null;navigation:Record<string,string>;home:string}) {
 const progressQueue=useRef<Promise<unknown>>(Promise.resolve())
 const frame=useRef<HTMLIFrameElement>(null);const router=useRouter();const[ready,setReady]=useState(false);const[error,setError]=useState('')
 useEffect(()=>{
  let mounted=true
  async function prepare(){
   if(studentID){
    const saved=await fetch(`/api/academy/progress?lesson=${encodeURIComponent(keyID)}`).then(r=>r.json())
    const localKey=`academy-progress:${studentID}:${keyID}`
    try {
      const legacy=JSON.parse(localStorage.getItem(localKey)||localStorage.getItem('tinitiate.python.core.progress.v2')||'{}')
      const deck=source.split('/').pop()!.split('.html')[0]
      if(!saved.state?.[deck]&&Array.isArray(legacy[deck]))await fetch('/api/academy/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lesson:keyID,state:{[deck]:legacy[deck]}})})
    }catch{ /* Storage may be disabled; server persistence remains available. */ }
   }
   if(mounted)setReady(true)
  }
  void prepare().catch(()=>{if(mounted)setError('Unable to load learning progress. Please reload this lesson.')})
  function message(event:MessageEvent){
   if(event.source!==frame.current?.contentWindow||event.origin!=='null'||event.data?.academy!==channel)return
   if(event.data.type==='navigate'){
    const destination=navigation[event.data.value];router.push(destination?`/academy/lessons/${destination}`:home)
   }else if(event.data.type==='home')router.push(home)
   else if(event.data.type==='progress'&&studentID){
    progressQueue.current=progressQueue.current.then(()=>fetch('/api/academy/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lesson:keyID,state:event.data.value})})).then(async r=>{
     if(!r.ok){setError('Progress could not be saved. Check your access and reload.');return}
     const body=await r.json();try{localStorage.setItem(`academy-progress:${studentID}:${keyID}`,JSON.stringify(body.state))}catch{}
    }).catch(()=>setError('Progress could not be saved. Please check your connection.'))
   }
  }
  window.addEventListener('message',message)
  return()=>{mounted=false;window.removeEventListener('message',message)}
 },[keyID,channel,source,studentID,navigation,router,home])
 return <>{error&&<p role="alert" className="p-4 text-red-700">{error}</p>}{ready?<iframe ref={frame} title="Interactive Academy lesson" src={source} sandbox="allow-scripts" allow="fullscreen" allowFullScreen referrerPolicy="no-referrer" className="h-[85vh] min-h-[600px] w-full border-0 bg-slate-950"/>:<p className="p-8">Loading your lesson…</p>}</>
}
