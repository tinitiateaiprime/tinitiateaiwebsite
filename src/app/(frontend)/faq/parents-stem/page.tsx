import FAQList from '@/components/azure/FAQList'
import faqData from '@/content/faq/parentsFaqStem.json'
import { Container } from '@/components/ui/Container'
export const metadata = { title: "FAQs for Parents \u2014 STEM | Tinitiate AI" }
export default function FAQPage() { return <Container className="py-16"><h1 className="mb-10 text-3xl font-bold">FAQs for Parents — STEM</h1><FAQList faqs={faqData.faqs} /></Container> }
