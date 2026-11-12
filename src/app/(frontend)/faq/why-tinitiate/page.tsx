import FAQList from '@/components/azure/FAQList'
import faqData from '@/content/faq/whyTinitiate.json'
import { Container } from '@/components/ui/Container'
export const metadata = { title: "Why Tinitiate? | Tinitiate AI" }
export default function FAQPage() { return <Container className="py-16"><h1 className="mb-10 text-3xl font-bold">Why Tinitiate?</h1><FAQList faqs={faqData.faqs} /></Container> }
