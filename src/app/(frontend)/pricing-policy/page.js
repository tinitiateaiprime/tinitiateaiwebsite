import Link from 'next/link'
import {
  FaCreditCard,
  FaDollarSign,
  FaExchangeAlt,
  FaInfoCircle,
  FaLock,
  FaPhone,
  FaRupeeSign,
  FaSyncAlt,
} from 'react-icons/fa'
import PolicyPageShell, {
  policyInlineLinkClassName,
} from '../components/PolicyPageShell'

export const metadata = {
  title: 'Pricing Policy | Tinitiate AI Solutions',
  description:
    'Review the Tinitiate AI Solutions pricing policy covering pricing structure, secure payments, updates, refunds, and support.',
}

const sections = [
  {
    id: 'pricing-structure',
    title: 'Pricing Structure',
    icon: FaDollarSign,
    items: [
      {
        icon: FaRupeeSign,
        iconClassName:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
        content: (
          <>
            All prices are listed in <strong>INR</strong> and{' '}
            <FaDollarSign className="mb-0.5 inline text-blue-500 dark:text-sky-300" />{' '}
            <strong>USD</strong>, excluding applicable taxes and fees.
          </>
        ),
      },
      {
        icon: FaInfoCircle,
        iconClassName:
          'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200',
        content:
          'Pricing may vary with seasonal promotions, discounts, or special offers. Please visit our website for current updates.',
      },
    ],
  },
  {
    id: 'payment-methods',
    title: 'Secure Payment Methods',
    icon: FaCreditCard,
    items: [
      {
        icon: FaCreditCard,
        iconClassName:
          'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-200',
        content:
          'We support payments through credit/debit cards, UPI, net banking, and verified digital gateways.',
      },
      {
        icon: FaLock,
        iconClassName:
          'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
        content:
          'All transactions are encrypted and processed securely to protect your personal and financial information.',
      },
    ],
  },
  {
    id: 'price-adjustments',
    title: 'Price Adjustments and Updates',
    icon: FaExchangeAlt,
    items: [
      {
        icon: FaExchangeAlt,
        iconClassName:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
        content:
          'Pricing may be updated based on market conditions, exchange rates, or industry trends. We will communicate major changes where possible.',
      },
      {
        icon: FaInfoCircle,
        iconClassName:
          'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200',
        content:
          'In case of pricing errors or discrepancies, Tinitiate AI Solutions reserves the right to cancel or modify affected orders with prior notice.',
      },
    ],
  },
  {
    id: 'refund-policy',
    title: 'Refund and Return Policy',
    icon: FaSyncAlt,
    items: [
      {
        icon: FaSyncAlt,
        iconClassName:
          'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200',
        content:
          'Refunds may be available on eligible purchases. Please review our refund policy for conditions and procedures.',
      },
      {
        icon: FaInfoCircle,
        iconClassName:
          'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200',
        content: (
          <>
            Visit our{' '}
            <Link href="/refund-policy" className={policyInlineLinkClassName}>
              Refund Policy
            </Link>{' '}
            page for full terms and instructions.
          </>
        ),
      },
    ],
  },
  {
    id: 'customer-support',
    title: 'Customer Support and Assistance',
    icon: FaPhone,
    items: [
      {
        icon: FaPhone,
        iconClassName:
          'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200',
        content: (
          <>
            For any pricing-related queries, please contact us at{' '}
            <a
              href="mailto:contact@tinitiateai.com"
              className={policyInlineLinkClassName}
            >
              contact@tinitiateai.com
            </a>
            .
          </>
        ),
      },
    ],
  },
]

export default function PricingPolicy() {
  return (
    <PolicyPageShell
      currentHref="/pricing-policy"
      eyebrow="Transparent Pricing"
      title="Pricing Policy"
      intro={
        <>
          At{' '}
          <span className="font-semibold text-[#1a3c6e] dark:text-sky-200">
            Tinitiate AI Solutions
          </span>
          , we believe in fair, clear, and competitive pricing for all our IT
          services and training programs. Below is our pricing policy.
        </>
      }
      highlights={[
        {
          title: 'Clear currency display',
          detail: 'Prices are listed in INR and USD with applicable taxes and fees kept separate.',
        },
        {
          title: 'Secure payment handling',
          detail: 'Transactions are supported through verified gateways and protected with encryption.',
        },
        {
          title: 'Refund guidance available',
          detail: 'Eligible purchases may qualify for refunds under the stated refund policy.',
        },
      ]}
      sections={sections}
      theme="amber"
      supportTitle="Pricing Questions"
      supportDescription={
        <>
          For any pricing-related queries, please contact us at{' '}
          <a href="mailto:contact@tinitiateai.com" className="font-semibold text-white underline decoration-white/30 underline-offset-4">
            contact@tinitiateai.com
          </a>
          .
        </>
      }
      contactEmail="contact@tinitiateai.com"
    />
  )
}
