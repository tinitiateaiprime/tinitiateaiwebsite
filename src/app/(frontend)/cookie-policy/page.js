import LegalPolicyPage from '../components/LegalPolicyPage'

export const metadata = {
  title: 'Cookie Policy | Tinitiate AI Solutions',
  description:
    'Cookie Policy for Tinitiate AI Solutions covering essential, analytics, functional, marketing, and third-party cookies.',
}

const sections = [
  { id: 'what-are-cookies', title: '1. What Are Cookies?', blocks: [
    { text: 'Cookies are small text files that are stored on your computer, tablet, or mobile device when you visit a website.' },
    { text: 'They help websites:' },
    { type: 'list', items: ['Remember your preferences', 'Improve website performance', 'Enhance user experience', 'Analyze visitor behavior', 'Provide secure access to services'] },
    { text: 'Cookies do not normally contain information that directly identifies you, but they may be linked to information you have provided to us.' },
  ] },
  { id: 'why-we-use-cookies', title: '2. Why We Use Cookies', blocks: [
    { text: 'Tinitiate AI Solutions uses cookies to:' },
    { type: 'list', items: ['Improve website performance', 'Remember your preferences', 'Keep you signed in (where applicable)', 'Analyze website traffic', 'Measure training program interest', 'Improve our courses and services', 'Provide a better browsing experience'] },
  ] },
  { id: 'types-of-cookies', title: '3. Types of Cookies We Use', blocks: [
    { type: 'subheading', text: 'Essential Cookies' },
    { text: 'These cookies are necessary for the website to function properly.' },
    { text: 'Examples include:' },
    { type: 'list', items: ['User authentication', 'Session management', 'Security features', 'Form submissions'] },
    { text: 'Without these cookies, certain parts of the website may not function correctly.' },
    { type: 'subheading', text: 'Performance & Analytics Cookies' },
    { text: 'These cookies help us understand how visitors interact with our website.' },
    { text: 'They allow us to measure:' },
    { type: 'list', items: ['Number of visitors', 'Most visited pages', 'Time spent on pages', 'Navigation paths', 'Website performance'] },
    { text: 'This information helps us improve our website and user experience.' },
    { type: 'subheading', text: 'Functional Cookies' },
    { text: 'These cookies remember your preferences, such as:' },
    { type: 'list', items: ['Language selection', 'Login preferences', 'Previously viewed pages', 'Course preferences'] },
    { text: 'These cookies provide a more personalized browsing experience.' },
    { type: 'subheading', text: 'Marketing Cookies' },
    { text: 'With your consent, marketing cookies may be used to:' },
    { type: 'list', items: ['Measure advertising performance', 'Display relevant course advertisements', 'Promote upcoming training programs', 'Analyze campaign effectiveness'] },
    { text: 'These cookies may be provided by trusted third-party advertising platforms.' },
  ] },
  { id: 'third-party-cookies', title: '4. Third-Party Cookies', blocks: [
    { text: 'Our website may use trusted third-party services that set cookies, including:' },
    { type: 'list', items: ['Google Analytics', 'Google Tag Manager', 'YouTube (embedded videos)', 'LinkedIn', 'Meta (Facebook)', 'Payment Gateway Providers'] },
    { text: 'These third parties have their own privacy and cookie policies.' },
    { text: 'We encourage you to review their respective policies for additional information.' },
  ] },
  { id: 'managing-cookies', title: '5. Managing Cookies', blocks: [
    { text: 'Most web browsers automatically accept cookies.' },
    { text: 'You may choose to:' },
    { type: 'list', items: ['Accept all cookies', 'Reject non-essential cookies', 'Delete stored cookies', 'Receive notifications before cookies are stored'] },
    { text: 'These settings can usually be changed through your browser preferences.' },
    { text: 'Please note that disabling essential cookies may affect the functionality of our website.' },
  ] },
  { id: 'browser-settings', title: '6. Browser Settings', blocks: [
    { text: 'You can manage cookies through your browser settings.' },
    { text: 'Common browser help pages include:' },
    { type: 'list', items: ['Google Chrome', 'Microsoft Edge', 'Mozilla Firefox', 'Apple Safari'] },
    { text: "Refer to your browser's support documentation for instructions on managing cookies." },
  ] },
  { id: 'changes-to-policy', title: '7. Changes to This Cookie Policy', blocks: [
    { text: 'We may update this Cookie Policy from time to time to reflect changes in:' },
    { type: 'list', items: ['Technology', 'Legal requirements', 'Website functionality', 'Business operations'] },
    { text: 'The latest version will always be available on this page.' },
  ] },
  { id: 'contact-us', title: '8. Contact Us', blocks: [
    { text: 'If you have any questions regarding this Cookie Policy, please contact us.' },
    { text: 'Tinitiate AI Solutions' },
    { text: 'Email: contact@tinitiateai.com' },
    { text: 'Website: www.tinitiateai.com' },
    { text: 'Phone: +91 6309123485' },
    { text: 'Address: 1-2/10 SBH Colony Mohan Nagar, SBH Colony, Kothapet, 500036, Telangana, India' },
  ] },
]

export default function CookiePolicy() {
  return (
    <LegalPolicyPage
      currentHref="/cookie-policy"
      eyebrow="Cookies & Tracking"
      title="Cookie Policy"
      supportEmail="contact@tinitiateai.com"
      intro={[
        'Welcome to Tinitiate AI Solutions.',
        'This Cookie Policy explains how we use cookies and similar technologies when you visit our website or use our online services.',
        'By continuing to browse or use our website, you consent to our use of cookies in accordance with this Cookie Policy.',
      ]}
      sections={sections}
      closingTitle="Our Commitment"
      closing={['Tinitiate AI Solutions is committed to protecting your privacy while providing a secure, reliable, and personalized learning experience. We use cookies responsibly to enhance website functionality, improve our training services, and ensure the best possible experience for our students and visitors.']}
    />
  )
}
