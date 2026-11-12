import Link from 'next/link'
import { Container } from '@/components/ui/Container'
export default function ComingSoonPage() {
  return <Container className="py-20"><h1 className="text-3xl font-bold">Looking for a course?</h1><p className="mt-4 text-slate-600">Explore our current catalog or ask our team about a program you have in mind.</p><Link className="mt-6 inline-block font-semibold text-blue-600" href="/courses">View available courses →</Link><br /><Link className="mt-4 inline-block font-semibold text-blue-600" href="/request-callback">Request a callback →</Link></Container>
}
