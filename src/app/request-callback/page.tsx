import { EnquiryForm } from '@/components/EnquiryForm';
export const metadata={title:'Request a Callback'};
export default async function CallbackPage({searchParams}:{searchParams:Promise<{course?:string}>}){const {course}=await searchParams;return <div className="mx-auto max-w-6xl px-6 py-14"><h1 className="text-4xl font-bold">Request a Callback</h1><p className="mt-4 text-slate-600">Send your enquiry to the Tinitiate AI team.</p><EnquiryForm course={typeof course==='string'?course:''}/></div>}
