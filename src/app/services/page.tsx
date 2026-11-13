import ServiceCard from '@/components/azure/ServiceCard';
import DatabaseServices from '@/components/azure/DatabaseServices';
export const metadata={title:'Services'};
export default function ServicesPage(){return <><section className="bg-slate-950 px-6 py-20 text-white"><div className="mx-auto max-w-6xl"><h1 className="text-4xl font-bold">IT, AI & Data Services</h1><p className="mt-5 text-slate-300">Software development, cloud, database and AI solutions.</p></div></section><ServiceCard/><DatabaseServices/></>}
