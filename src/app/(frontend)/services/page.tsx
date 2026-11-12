import ServiceCard from '@/components/azure/ServiceCard'
import DatabaseServices from '@/components/azure/DatabaseServices'
import { Container } from '@/components/ui/Container'
export const metadata = { title: 'AI, IT & Database Services | Tinitiate AI' }
export default function ServicesPage() { return <><section className="bg-slate-950 py-20 text-white"><Container><h1 className="text-4xl font-bold">AI & IT solutions for your business</h1><p className="mt-5 max-w-2xl text-slate-300">Software development, cloud engineering, data services, and technical expertise tailored to your team.</p></Container></section><section className="py-16"><ServiceCard /></section><DatabaseServices /></> }
