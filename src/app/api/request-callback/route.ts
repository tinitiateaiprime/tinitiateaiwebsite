import { CosmosClient } from '@azure/cosmos';
import { randomUUID } from 'node:crypto';
export const runtime='nodejs';

const field=(o:Record<string,unknown>,name:string,max:number,required=false):string=>{
  const v=o[name]; if(v===undefined||v===null) {if(required)throw Error(`Missing ${name}`);return '';}
  if(typeof v!=='string'||v.trim().length>max||(required&&!v.trim()))throw Error(`Invalid ${name}`);
  return v.trim();
};

export async function POST(request:Request){
  if(!request.headers.get('content-type')?.toLowerCase().includes('application/json'))return Response.json({ok:false,error:'Expected JSON.'},{status:415});
  try{
    const bodyText=await request.text();if(bodyText.length>12000)return Response.json({ok:false,error:'Enquiry is too long.'},{status:413});
    const input:unknown=JSON.parse(bodyText);if(!input||typeof input!=='object'||Array.isArray(input))return Response.json({ok:false,error:'Invalid enquiry.'},{status:400});
    const data=input as Record<string,unknown>;
    let name:string,email:string,phone:string,preferredTime:string,course:string,message:string;
    try{
      name=field(data,'name',120,true);email=field(data,'email',254,true);phone=field(data,'phone',40,true);
      preferredTime=field(data,'preferredTime',120,true);course=field(data,'course',180);message=field(data,'message',4000);
    }catch{return Response.json({ok:false,error:'Please check the form fields.'},{status:400});}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^[+\d\s().-]{7,40}$/.test(phone))return Response.json({ok:false,error:'Enter a valid email and phone number.'},{status:400});
    const endpoint=process.env.COSMOS_ENDPOINT,key=process.env.COSMOS_KEY;
    if(!endpoint||!key)return Response.json({ok:false,error:'Enquiry service is not configured.'},{status:503});
    const item={id:randomUUID(),pk:'enquiry',type:'enquiry',name,email,phone,preferredTime,course,message,createdAt:new Date().toISOString()};
    const client=new CosmosClient({endpoint,key});
    await client.database(process.env.COSMOS_DATABASE||'tinitiate').container(process.env.COSMOS_CONTAINER||'items').items.create(item);
    return Response.json({ok:true,id:item.id},{status:201});
  }catch(e){console.error('Enquiry submission error:', e instanceof Error?e.name:'unknown');return Response.json({ok:false,error:'Unable to save your enquiry right now.'},{status:500});}
}
