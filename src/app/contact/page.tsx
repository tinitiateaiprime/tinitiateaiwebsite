import { EnquiryForm } from '@/components/EnquiryForm';
export const metadata={title:'Contact'};
export default function ContactPage(){return <div className="mx-auto max-w-6xl px-6 py-14"><p className="font-bold uppercase tracking-widest text-blue-600">Contact Tinitiate AI</p><h1 className="mt-2 text-4xl font-bold">Get in touch</h1><p className="mt-4 max-w-2xl text-slate-600">Have a question about a course, MasterClass or partnership? Send an enquiry.</p><EnquiryForm/></div>}
