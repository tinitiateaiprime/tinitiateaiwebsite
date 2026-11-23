import { CosmosClient } from '@azure/cosmos';
import { randomUUID } from 'node:crypto';
import { mailConfig, sendEnquiryEmail, type Enquiry } from '@/lib/enquiryEmail';
export const runtime='nodejs';

const field=(o:Record<string,unknown>,name:string,max:number,required=false):string=>{
  const v=o[name]; if(v===undefined||v===null) {if(required)throw Error(`Missing ${name}`);return '';}
  if(typeof v!=='string'||v.trim().length>max||(required&&!v.trim()))throw Error(`Invalid ${name}`);
  return v.trim();
};

/** Optional backup copy in Cosmos DB, when it is configured. */
async function saveToCosmos(item:Enquiry){
  const endpoint=process.env.COSMOS_ENDPOINT,key=process.env.COSMOS_KEY;
  if(!endpoint||!key)return false;
  const client=new CosmosClient({endpoint,key});
  await client.database(process.env.COSMOS_DATABASE||'tinitiate').container(process.env.COSMOS_CONTAINER||'items').items.create({...item,pk:'enquiry',type:'enquiry'});
  return true;
}

/**
 * Request Callback + Contact forms. Every enquiry is emailed to
 * contact@tinitiateai.com (SMTP settings in the server environment) and, if
 * Cosmos DB is configured, also saved there as a backup.
 */
export async function POST(request:Request){
  if(!request.headers.get('content-type')?.toLowerCase().includes('application/json'))return Response.json({ok:false,error:'Expected JSON.'},{status:415});
  try{
    const bodyText=await request.text();if(bodyText.length>12000)return Response.json({ok:false,error:'Enquiry is too long.'},{status:413});
    const input:unknown=JSON.parse(bodyText);if(!input||typeof input!=='object'||Array.isArray(input))return Response.json({ok:false,error:'Invalid enquiry.'},{status:400});
    const data=input as Record<string,unknown>;
    let name:string,email:string,phone:string,preferredTime:string,course:string,message:string;
    try{
      name=field(data,'name',120,true);email=field(data,'email',254,true);phone=field(data,'phone',40,true);
      preferredTime=field(data,'preferredTime',120)||'Any time';course=field(data,'course',180);message=field(data,'message',4000);
    }catch{return Response.json({ok:false,error:'Please check the form fields.'},{status:400});}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^[+\d\s().-]{7,40}$/.test(phone))return Response.json({ok:false,error:'Enter a valid email and phone number.'},{status:400});

    const item:Enquiry={id:randomUUID(),name,email,phone,preferredTime,course,message,createdAt:new Date().toISOString()};
    const emailOn=Boolean(mailConfig());
    const [mailed,saved]=await Promise.allSettled([emailOn?sendEnquiryEmail(item):Promise.reject(new Error('not configured')),saveToCosmos(item)]);
    const delivered=mailed.status==='fulfilled';
    const stored=saved.status==='fulfilled'&&saved.value;
    if(mailed.status==='rejected'&&emailOn)console.error('Enquiry email failed:',mailed.reason instanceof Error?mailed.reason.message:'unknown');
    if(saved.status==='rejected')console.error('Enquiry Cosmos save failed:',saved.reason instanceof Error?saved.reason.name:'unknown');
    if(!delivered&&!stored)return Response.json({ok:false,error:emailOn?'Unable to send your enquiry right now. Please email contact@tinitiateai.com.':'Enquiry service is not configured.'},{status:emailOn?502:503});
    return Response.json({ok:true,id:item.id,emailed:delivered},{status:201});
  }catch(e){console.error('Enquiry submission error:', e instanceof Error?e.name:'unknown');return Response.json({ok:false,error:'Unable to send your enquiry right now.'},{status:500});}
}
