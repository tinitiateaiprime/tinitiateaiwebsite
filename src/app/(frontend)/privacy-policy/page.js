import LegalPolicyPage from '../components/LegalPolicyPage'

export const metadata = {
  title: 'Privacy Policy | Tinitiate AI Solutions',
  description:
    'Privacy Policy for Tinitiate AI Solutions covering collection, use, storage, cookies, placement services, and data rights.',
}

const sections = [
  {
    id: 'information-we-collect',
    title: '1. Information We Collect',
    blocks: [
      { text: 'We may collect the following information from students, visitors, job seekers, and business partners.' },
      { type: 'subheading', text: 'Personal Information' },
      {
        type: 'list',
        items: [
          'Full Name',
          'Email Address',
          'Mobile Number',
          'Date of Birth (if required)',
          'Educational Qualification',
          'Resume/CV',
          'Professional Experience',
          'LinkedIn Profile (optional)',
          'Payment Information',
          'Billing Address',
        ],
      },
      { type: 'subheading', text: 'Technical Information' },
      { text: 'We automatically collect certain technical information, including:' },
      {
        type: 'list',
        items: [
          'IP Address',
          'Browser Type',
          'Operating System',
          'Device Information',
          'Website Usage Statistics',
          'Cookies',
          'Session Information',
        ],
      },
    ],
  },
  {
    id: 'how-we-use-your-information',
    title: '2. How We Use Your Information',
    blocks: [
      { text: 'We use your information to:' },
      {
        type: 'list',
        items: [
          'Register you for training programs',
          'Provide access to course materials',
          'Conduct online or classroom training',
          'Process payments and invoices',
          'Share class schedules and updates',
          'Provide internship opportunities',
          'Support placement assistance',
          'Respond to your enquiries',
          'Improve our training programs',
          'Improve website performance',
          'Send newsletters or promotional offers (only where permitted)',
        ],
      },
    ],
  },
  {
    id: 'training-placement-services',
    title: '3. Training & Placement Services',
    blocks: [
      { text: 'If you enroll in one of our training or internship programs, we may use your information to:' },
      {
        type: 'list',
        items: [
          'Build your student profile',
          'Evaluate assignments and projects',
          'Issue certificates',
          'Prepare resumes',
          'Conduct mock interviews',
          'Share your resume with recruiting companies (only with your consent where required)',
          'Track placement outcomes',
        ],
      },
    ],
  },
  {
    id: 'payment-information',
    title: '4. Payment Information',
    blocks: [
      { text: 'Payments made through our website may be processed using trusted third-party payment gateways.' },
      { text: 'Tinitiate AI Solutions does not store your complete debit card, credit card, or banking credentials on our servers.' },
    ],
  },
  {
    id: 'sharing-of-information',
    title: '5. Sharing of Information',
    blocks: [
      { text: 'We respect your privacy.' },
      { text: 'We do not sell your personal information.' },
      { text: 'Information may be shared only with:' },
      {
        type: 'list',
        items: [
          'Payment gateway providers',
          'Cloud service providers',
          'Training mentors',
          'Internship partners',
          'Placement partners',
          'Government or legal authorities where required by law',
        ],
      },
    ],
  },
  {
    id: 'cookies',
    title: '6. Cookies',
    blocks: [
      { text: 'Our website may use cookies to:' },
      {
        type: 'list',
        items: [
          'Improve user experience',
          'Remember login sessions',
          'Analyze website traffic',
          'Understand visitor behavior',
          'Improve website performance',
        ],
      },
      { text: 'You may disable cookies through your browser settings.' },
    ],
  },
  {
    id: 'data-security',
    title: '7. Data Security',
    blocks: [
      { text: 'We implement appropriate technical and organizational security measures to protect your information, including:' },
      {
        type: 'list',
        items: [
          'Secure cloud hosting',
          'Encrypted communication (HTTPS)',
          'Role-based access control',
          'Regular backups',
          'Limited access to student information',
        ],
      },
      { text: 'Although we strive to protect your data, no system can guarantee absolute security.' },
    ],
  },
  {
    id: 'data-retention',
    title: '8. Data Retention',
    blocks: [
      { text: 'We retain personal information only for as long as necessary to:' },
      {
        type: 'list',
        items: [
          'Deliver training services',
          'Meet legal obligations',
          'Support placement activities',
          'Maintain academic records',
          'Resolve disputes',
        ],
      },
    ],
  },
  {
    id: 'your-rights',
    title: '9. Your Rights',
    blocks: [
      { text: 'Depending on applicable laws, you may request to:' },
      {
        type: 'list',
        items: [
          'Access your personal information',
          'Correct inaccurate information',
          'Update your details',
          'Delete your information (subject to legal obligations)',
          'Withdraw consent for marketing communications',
          'Request a copy of your stored information',
        ],
      },
    ],
  },
  {
    id: 'third-party-links',
    title: '10. Third-Party Links',
    blocks: [
      { text: 'Our website may contain links to third-party websites including:' },
      { type: 'list', items: ['LinkedIn', 'GitHub', 'YouTube', 'Google', 'Payment Gateways'] },
      { text: 'We are not responsible for the privacy practices of third-party websites.' },
    ],
  },
  {
    id: 'childrens-privacy',
    title: "11. Children's Privacy",
    blocks: [
      { text: 'Our services are intended for students, graduates, and working professionals.' },
      { text: 'We do not knowingly collect personal information from children below the age required by applicable law without appropriate consent.' },
    ],
  },
  {
    id: 'updates',
    title: '12. Updates to this Privacy Policy',
    blocks: [
      { text: 'We may update this Privacy Policy periodically to reflect changes in:' },
      { type: 'list', items: ['Legal requirements', 'Business operations', 'Technology', 'Training services'] },
      { text: 'The latest version will always be available on this page with the updated effective date.' },
    ],
  },
  {
    id: 'contact-us',
    title: '13. Contact Us',
    blocks: [
      { text: 'If you have any questions regarding this Privacy Policy, please contact us.' },
      { text: 'Tinitiate AI Solutions' },
      { text: 'Email: contact@tinitiateai.com' },
      { text: 'Phone: +91 6309123485' },
      { text: 'Website: www.tinitiateai.com' },
      { text: 'Address: 13-16-58, Road No 4, Kamala Nagar, P&T Colony, Chaitanyapuri, Hyderabad, 500060, Telangana, India' },
    ],
  },
]

export default function PrivacyPolicy() {
  return (
    <LegalPolicyPage
      currentHref="/privacy-policy"
      eyebrow="Privacy & Data Handling"
      title="Privacy Policy"
      supportEmail="contact@tinitiateai.com"
      intro={[
        'Welcome to Tinitiate AI Solutions. Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website, enroll in our training programs, or use any of our services.',
        'By using our website or services, you agree to the practices described in this Privacy Policy.',
      ]}
      sections={sections}
    />
  )
}

