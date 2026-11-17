import type { Metadata } from 'next';
import { LegalPage, type PolicySection } from '@/components/legal/LegalPage';

export const metadata: Metadata = {
  title: 'Pricing Policy',
  description: 'Review the Tinitiate AI Solutions pricing policy covering pricing structure, secure payments, updates, refunds, and support.',
};

// Content from the kaushik-branch pricing policy page.
const sections: PolicySection[] = [
  { id: 'pricing-structure', title: 'Pricing Structure', blocks: [{ type: 'list', items: [
    'All prices are listed in INR and USD, excluding applicable taxes and fees.',
    'Pricing may vary with seasonal promotions, discounts, or special offers. Please visit our website for current updates.',
  ] }] },
  { id: 'payment-methods', title: 'Secure Payment Methods', blocks: [{ type: 'list', items: [
    'We support payments through credit/debit cards, UPI, net banking, and verified digital gateways.',
    'All transactions are encrypted and processed securely to protect your personal and financial information.',
  ] }] },
  { id: 'price-adjustments', title: 'Price Adjustments and Updates', blocks: [{ type: 'list', items: [
    'Pricing may be updated based on market conditions, exchange rates, or industry trends. We will communicate major changes where possible.',
    'In case of pricing errors or discrepancies, Tinitiate AI Solutions reserves the right to cancel or modify affected orders with prior notice.',
  ] }] },
  { id: 'refund-policy', title: 'Refund and Return Policy', blocks: [{ type: 'list', items: [
    'Refunds may be available on eligible purchases. Please review our refund policy for conditions and procedures.',
    'Visit our Refund Policy page for full terms and instructions.',
  ] }] },
  { id: 'customer-support', title: 'Customer Support and Assistance', blocks: [{ type: 'list', items: [
    'For any pricing-related queries, please contact us at contact@tinitiateai.com.',
  ] }] },
];

export default function PricingPolicyPage() {
  return <LegalPage
    currentHref="/pricing-policy"
    eyebrow="Transparent Pricing"
    title="Pricing Policy"
    intro={['At Tinitiate AI Solutions, we believe in fair, clear, and competitive pricing for all our IT services and training programs. Below is our pricing policy.']}
    sections={sections}
  />;
}
