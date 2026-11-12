import LegalPolicyPage from '../components/LegalPolicyPage'

export const metadata = {
  title: 'Refund & Cancellation Policy | Tinitiate AI Solutions',
  description:
    'Refund and cancellation terms for Tinitiate AI Solutions training, internships, batch transfers, digital materials, and placement assistance.',
}

const sections = [
  {
    id: 'course-registration',
    title: '1. Course Registration',
    blocks: [
      { text: 'Your enrollment is confirmed only after:' },
      { type: 'list', items: ['Successful submission of the registration form', 'Payment of the applicable course fee', 'Confirmation from Tinitiate AI Solutions'] },
      { text: 'Seats are limited and allocated on a first-come, first-served basis.' },
    ],
  },
  {
    id: 'cancellation-by-student',
    title: '2. Cancellation by Student',
    blocks: [
      { text: 'Students wishing to withdraw from a program must submit a written cancellation request to:' },
      { text: 'Email: contact@tinitiateai.com' },
      { text: 'Refund eligibility will be determined based on the date the written request is received.' },
    ],
  },
  {
    id: 'refund-eligibility',
    title: '3. Refund Eligibility',
    blocks: [
      { type: 'subheading', text: 'Before Course Commencement' },
      { text: 'Students who cancel at least 7 days before the scheduled course start date are eligible for a 100% refund, excluding any payment gateway, transaction, or administrative charges.' },
      { type: 'subheading', text: 'Within 7 Days Before Course Start' },
      { text: 'Students cancelling less than 7 days before the course begins may receive a refund after deducting an administrative fee of 10% of the course fee or Rs.2,000, whichever is higher.' },
      { type: 'subheading', text: 'After Course Commencement' },
      { text: 'Once the training program has started and course materials, recordings, or learning platform access have been provided, course fees are generally non-refundable.' },
      { text: 'Requests for exceptional circumstances (such as medical emergencies) may be reviewed on a case-by-case basis at the sole discretion of Tinitiate AI Solutions.' },
    ],
  },
  {
    id: 'internship-programs',
    title: '4. Internship Programs',
    blocks: [
      { text: 'Internship fees (if applicable) become non-refundable once the internship has commenced, project work has been assigned, or company resources have been allocated.' },
      { text: 'Students are expected to complete the internship according to the published schedule.' },
    ],
  },
  {
    id: 'batch-transfers',
    title: '5. Batch Transfers',
    blocks: [
      { text: 'Students may request to transfer to a future batch, subject to:' },
      { type: 'list', items: ['Seat availability', 'Approval by Tinitiate AI Solutions', 'The request being made before substantial completion of the current program'] },
      { text: 'Additional administrative charges may apply.' },
    ],
  },
  {
    id: 'course-cancellation-by-tinitiate',
    title: '6. Course Cancellation by Tinitiate AI Solutions',
    blocks: [
      { text: 'Tinitiate AI Solutions reserves the right to postpone, reschedule, or cancel any program due to:' },
      { type: 'list', items: ['Insufficient enrollments', 'Faculty availability', 'Technical issues', 'Natural disasters', 'Government restrictions', 'Other unforeseen circumstances'] },
      { text: 'In such cases, students may choose one of the following:' },
      { type: 'list', items: ['Transfer to the next available batch', 'Enroll in an equivalent program', 'Receive a full refund of the amount paid'] },
    ],
  },
  { id: 'payment-gateway-charges', title: '7. Payment Gateway Charges', blocks: [{ text: 'Any payment gateway fees, bank charges, foreign exchange charges, or transaction processing fees incurred during payment or refund processing may be deducted from the refundable amount where applicable.' }] },
  {
    id: 'refund-processing',
    title: '8. Refund Processing',
    blocks: [
      { text: 'Approved refunds will normally be processed within 7-10 business days.' },
      { text: 'Refunds will be made to the original payment method whenever possible.' },
      { text: 'Processing time may vary depending on the payment provider or financial institution.' },
    ],
  },
  {
    id: 'no-refund-situations',
    title: '9. No Refund Situations',
    blocks: [
      { text: 'Refunds will generally not be provided in the following situations:' },
      { type: 'list', items: ['Failure to attend classes', 'Voluntary withdrawal after substantial course participation', 'Violation of institute policies', 'Academic misconduct', 'Removal from the program due to disciplinary action', 'Failure to meet internship or project requirements'] },
    ],
  },
  {
    id: 'digital-learning-materials',
    title: '10. Digital Learning Materials',
    blocks: [
      { text: 'All digital resources, including:' },
      { type: 'list', items: ['Recorded sessions', 'Course notes', 'Presentations', 'Source code', 'Templates', 'Assignments', 'Practice datasets'] },
      { text: 'are non-refundable once access has been granted.' },
    ],
  },
  {
    id: 'placement-assistance',
    title: '11. Placement Assistance',
    blocks: [
      { text: 'Placement assistance is provided as an additional career support service.' },
      { text: 'Fees paid for training programs are not refundable solely because a student does not receive an interview, internship, or job offer.' },
      { text: 'Employment decisions are made exclusively by recruiting organizations.' },
    ],
  },
  {
    id: 'force-majeure',
    title: '12. Force Majeure',
    blocks: [
      { text: 'Tinitiate AI Solutions shall not be held responsible for delays or inability to conduct programs due to events beyond our reasonable control, including but not limited to:' },
      { type: 'list', items: ['Natural disasters', 'Government actions', 'Internet outages', 'Power failures', 'Public health emergencies', 'Civil disturbances'] },
    ],
  },
  {
    id: 'changes-to-policy',
    title: '13. Changes to This Policy',
    blocks: [
      { text: 'Tinitiate AI Solutions reserves the right to update or modify this Refund & Cancellation Policy at any time.' },
      { text: 'The latest version will always be available on our website.' },
    ],
  },
  {
    id: 'contact-us',
    title: '14. Contact Us',
    blocks: [
      { text: 'Tinitiate AI Solutions' },
      { text: 'Email: contact@tinitiateai.com' },
      { text: 'Website: www.tinitiateai.com' },
      { text: 'Phone: +91 6309123485' },
      { text: 'Address: 1-2/10 SBH Colony Mohan Nagar, SBH Colony, Kothapet, 500036, Telangana, India' },
    ],
  },
]

export default function RefundPolicy() {
  return (
    <LegalPolicyPage
      currentHref="/refund-policy"
      eyebrow="Refunds & Cancellations"
      title="Refund & Cancellation Policy"
      supportEmail="contact@tinitiateai.com"
      intro={[
        'At Tinitiate AI Solutions, we strive to provide high-quality training, internship opportunities, and career guidance. This Refund & Cancellation Policy explains the terms governing course cancellations, refunds, transfers, and related matters.',
        'By enrolling in any of our programs, you acknowledge that you have read and agree to this policy.',
      ]}
      sections={sections}
      closingTitle="Our Commitment"
      closing={['Our goal is to provide industry-relevant education, practical project experience, and career guidance while maintaining a transparent and fair refund process for all students.']}
    />
  )
}
