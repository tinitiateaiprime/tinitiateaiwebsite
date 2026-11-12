'use strict';
// Each narrated scene is grounded in content discovered on the real page, not
// an LLM guess about what a button might do. Page-specific adapters can extend
// this neutral, repeatable plan.
const strip = value => String(value || '').replace(/\s+/g, ' ').trim();
const brief = (value, limit=210) => {
  const text=strip(value);
  if(text.length<=limit)return text;
  const part=text.slice(0,limit);
  return part.slice(0,Math.max(part.lastIndexOf('. ')+1,part.lastIndexOf('; ')+1,Math.floor(limit*.7))) || part;
};
function overview(slides=[],name='this lesson'){
  const names=slides.map(s=>s.title).filter(Boolean);
  if(!names.length)return `This is ${name}. Explore the explanation, change a value, and compare the resulting output.`;
  const sample=names.slice(0,5).join(', ');
  return `This module covers ${names.length} topics, including ${sample}${names.length>5?', and more':''}. We will briefly explain each concept and demonstrate the actual controls.`;
}
function teachSlide(s,opts={}){
  const name=strip(s.title)||'this topic';
  const key=brief(s.idea,210);
  const analogy=brief(s.analogy,170);
  const explain=brief(s.explain,210);
  const out=brief(s.output,120);
  const example=brief(s.code,100);
  let lines=[`${name}.`,key];
  if(analogy && analogy.toLowerCase()!==key.toLowerCase())lines.push(analogy);
  if(explain && !key.includes(explain))lines.push(explain);
  if(example && opts.code)lines.push(`The example uses ${example}.`);
  if(out && opts.output)lines.push(`The expected output is ${out}.`);
  const tip=brief(s.tip,150);
  if(tip && opts.tip)lines.push(tip);
  return lines.filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
}
function sequence(page,manifest){
 const scenes=[];
 const push=(title,target,action,narration,stage=null,opts={})=>scenes.push({title,target,action,narration,stage:stage||manifest.anchor,holdMs:900,...opts});
 const heading=manifest.title||'this interactive dashboard';
 if(manifest.adapter==='pycourse'){
  const slides=Array.isArray(manifest.slides)?manifest.slides:[];
  push('Welcome to the dashboard','#dashboard','show',`Welcome to ${heading}. ${overview(slides,heading)} The progress dashboard helps you choose a topic, review useful terms and see which slides you have opened.`,'#dashboard');
  push('What this dashboard contains','#py-learn','show',`These are the topics in the lesson. ${brief(slides.slice(0,4).map(s=>s.title).join(', '),160)}. Select a topic to jump to its interactive example. The glossary explains unfamiliar words.`,'#dashboard');
  push('Your progress','#py-stat-progress','show','The completion meter tracks the slides you have opened, and your progress is saved in this browser. It does not measure a graded exam.','#dashboard');
  push('Start learning','#py-continue','click','Let us open the lesson. On each slide, we will explain the idea, inspect the example, and see what the program does.','#dashboard');
  push('Return to slide one','#py-first','click','This button takes us back to the beginning of the course. We will introduce each topic in order.','#player');
  if(slides[0])push('Understand the first topic','#py-stage','show',teachSlide(slides[0],{code:true,output:true}),'#player',{conceptIndex:0});
  push('The code editor','#py-editor','show','This is the editable Python program. The syntax uses real Python. You can change it, run it and compare the result with the visual explanation.','#player');
  push('Run the code','#py-run','click','Click Run to execute the current Python example. The output panel shows the result.','#player',{verify:'#py-term'});
  push('Read the output','#py-term','show',`This panel displays what the program produces. ${slides[0]?.output?`For our first example the expected result is ${brief(slides[0].output,100)}.`:'Compare it with the example above to understand what the code does.'}`,'#player');
  if(/\/print(?:-v\d+)?\.html$/.test('/'+page)){ /* AUTO_TUTOR_V1 */
   push('Edit an example','#py-editor','edit','Let us change the printed message. Anything between quotation marks is text, and changing it will change the displayed result.','#player',{value:'print("I can use Python!")'});
   push('Run the edited example','#py-run','click','Run the modified program. We should see the new message, I can use Python, because print displays the text we supplied.','#player',{verify:'#py-term',expectContains:'I can use Python!'});
   push('Reset the example','#py-reset-code','click','Reset restores the original example, so you can experiment safely and begin again.','#player');
  }
  push('Open the next topic','#py-next','click',slides[1]?`The next lesson is ${slides[1].title}. Watch how the explanation and the sample code change together.`:'Use Next to move forward through the course.','#player');
  if(slides[1])push('Learn topic 2','#py-stage','show',teachSlide(slides[1],{code:true,output:true}),'#player',{conceptIndex:1});
  push('The slide outline','#py-outline','show','The outline lists all available lessons. You can come back to any topic without losing your progress.','#player');
  // Every discovered lesson is explained, not just the first few UI controls.
  for(let i=2;i<slides.length;i++){
    const s=slides[i];
    push(`Open slide ${i+1}: ${s.title}`,'#py-next','click',`Next, ${s.title}. We will explore what this concept means and where it is useful.`,'#player',{conceptIndex:i});
    push(`Teach slide ${i+1}: ${s.title}`,'#py-stage','show',teachSlide(s,{code:true,output:true,tip:true}),'#player',{conceptIndex:i});
  }
  if(slides.length)push('Finish the walkthrough','#py-outline','show',`You have now seen all ${slides.length} topics in this module. Revisit a slide, change its examples, and use Run and Reset to check your understanding.`,'#player');
 }else{
  const anchor=manifest.anchor==='main'?'main':manifest.anchor;
  const facts=manifest.pageOverview || {};
  const headings=(facts.headings||[]).filter(Boolean).slice(0,5);
  const intro=headings.length?`The dashboard includes ${headings.join(', ')}.`:'We will identify the major components and see how the visualization changes.';
  push('Introducing the dashboard',anchor,'show',`Welcome to ${heading}. ${brief(intro,360)} This tour explains both the purpose of the content and how its controls work.`,anchor);
  const controls=(manifest.liveControls||[]).filter(x=>!x.disabled&&x.tag==='button');
  const oldControls=(manifest.candidateControls||[]).map(selector=>({selector,label:selector}));
  const usable=controls.length?controls:oldControls;
  const find=(pattern)=>usable.find(c=>pattern.test(c.label+' '+c.selector))?.selector||null;
  const run=find(/(?:run|play|execute|kick|start)/i),step=find(/(?:step|next)/i),reset=find(/reset/i);
  if(run){
   const desc=/pyspark|dag/i.test(page)?'This is a Spark execution graph. A job is divided into stages, and each stage runs tasks. Watch what changes when an operation reaches a shuffle boundary.':/\/apis\//i.test(page)?'This architecture demonstrates how an API request moves through processing stages. Observe the request, the response and the log output.':/full-stack/i.test(page)?'This demonstrates how application components process a request. Watch the flow from the client to the services and back.':'Run the demonstration to see the flow change. Pay attention to the intermediate steps, not just the final result.';
   push('Understand and run the simulation',run,'click',desc,anchor);
  }
  if(step&&step!==run)push('Understand one step',step,'click',/pyspark|dag/i.test(page)?'Stepping forward shows how the next DAG operation activates. Each stage depends on the results of earlier tasks.':'Step through one operation at a time and observe which component becomes active.',anchor);
  if(reset)push('Restore the starting state',reset,'click','Reset returns the simulator to its starting state so you can experiment with a different sequence.',anchor);
  if(!run&&!step){const b=usable.find(x=>!/(delete|remove|clear|logout|submit|pay|transfer|send|publish|install|purchase)/i.test(x.label));if(b)push('Explore a control',b.selector,'click',`This is the ${b.label.replace(/[<>]/g,'')} control. Notice which part of the dashboard responds when it is selected.`,anchor);}
  if(headings.length)push('What you learned',anchor,'show',`Review the main concepts: ${headings.join(', ')}. These pieces work together to explain the dashboard's subject.`,anchor);
  push('Try it yourself',anchor,'show','Now explore at your own pace. Change one input at a time, observe its effect, and use Reset where available.',anchor);
 }

 return scenes;
}
module.exports={sequence,teachSlide,overview,brief};
