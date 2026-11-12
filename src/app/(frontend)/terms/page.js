import LegalPolicyPage from '../components/LegalPolicyPage'

export const metadata = {
  title: 'Terms & Conditions | Tinitiate AI Solutions',
  description:
    'Terms and Conditions for Tinitiate AI Solutions website, training programs, internships, payments, conduct, placement assistance, and certificates.',
}

const sections = [
  { id: 'definitions', title: '1. Definitions', blocks: [
    { text: 'Company refers to Tinitiate AI Solutions' },
    { text: 'Student refers to any individual enrolled in our training programs.' },
    { text: 'Website refers to www.tinitiateai.com' },
    { text: 'Services include training, mentoring, internships, workshops, certifications, career guidance, placement assistance, and consulting.' },
  ] },
  { id: 'eligibility', title: '2. Eligibility', blocks: [
    { text: 'To enroll in our programs, you should:' },
    { type: 'list', items: ['Be at least 18 years of age, or have parental/guardian consent if younger.', 'Provide accurate registration details.', 'Agree to comply with our policies.'] },
  ] },
  { id: 'course-enrollment', title: '3. Course Enrollment', blocks: [
    { text: 'Enrollment is confirmed only after:' },
    { type: 'list', items: ['Successful registration', 'Payment of applicable fees', 'Acceptance by Tinitiate AI Solutions'] },
    { text: 'The company reserves the right to refuse or cancel registrations that violate these Terms.' },
  ] },
  { id: 'fees-payments', title: '4. Fees & Payments', blocks: [
    { text: 'Students agree to pay all applicable course fees before the due date.' },
    { text: 'Payments may be made through approved payment gateways.' },
    { text: 'Failure to complete payment may result in:' },
    { type: 'list', items: ['Suspension of course access', 'Cancellation of enrollment', 'Delay in certification'] },
  ] },
  { id: 'program-benefits', title: '5. Program Benefits', blocks: [
    { type: 'subheading', text: 'Industry-Oriented Training' },
    { text: 'Our curriculum is designed by experienced professionals based on current industry requirements, ensuring you gain practical, job-ready skills in Data Engineering, AI, Cloud, Full Stack Development, and related technologies.' },
    { type: 'subheading', text: 'Internship & Real Project Experience' },
    { text: 'Students work on real-world, production-style projects during the internship, gaining practical experience that mirrors the software industry.' },
    { type: 'subheading', text: 'Capstone Project' },
    { text: 'Every student completes an end-to-end capstone project that demonstrates their technical skills and becomes a valuable addition to their professional portfolio.' },
    { type: 'subheading', text: 'Expert Mentorship' },
    { text: 'Learn from experienced industry professionals with hands-on expertise in AI, Cloud, Data Engineering, DevOps, and Full Stack technologies who provide practical guidance throughout the program.' },
    { type: 'subheading', text: 'Communication & Professional Development' },
    { text: 'Enhance your career with dedicated sessions on:' },
    { type: 'list', items: ['Business Communication', 'Email Writing', 'Presentation Skills', 'Group Discussions', 'Public Speaking', 'Interview Communication'] },
    { type: 'subheading', text: 'Corporate Readiness Program' },
    { text: 'Prepare for the workplace with training on:' },
    { type: 'list', items: ['Business Etiquette', 'Workplace Ethics', 'POSH (Prevention of Sexual Harassment)', 'Intellectual Property Rights (IPR)', 'Payroll & Employee Benefits', 'Leave & Attendance Policies', 'Timesheets & Project Reporting', "Professional Workplace Do's and Don'ts"] },
    { type: 'subheading', text: 'Resume & Interview Preparation' },
    { text: 'Receive comprehensive career support including:' },
    { type: 'list', items: ['ATS-friendly Resume Building', 'LinkedIn Profile Optimization', 'GitHub Portfolio Development', 'Mock Technical Interviews', 'HR Interview Preparation', 'Salary Negotiation Guidance'] },
    { type: 'subheading', text: 'Placement Assistance' },
    { text: 'Eligible students receive placement assistance, interview opportunities, career guidance, and employer referrals through our hiring network. While we strive to provide extensive career support, final hiring decisions are made by recruiting organizations based on their selection process.' },
    { type: 'subheading', text: 'Certificate of Completion' },
    { text: 'Students who successfully complete the program and internship will receive a Certificate of Completion from Tinitiate AI Solutions.' },
    { type: 'subheading', text: 'Lifetime Learning Support' },
    { text: 'Continue your learning journey with access to alumni support, technical guidance, interview assistance, and future course updates whenever available.' },
  ] },
  { id: 'internship-delivery', title: '6. Internship Delivery', blocks: [
    { text: 'The internship program at Tinitiate AI Solutions is designed to provide students with practical industry experience in their chosen technology domain, including but not limited to:' },
    { type: 'list', items: ['Data Engineering with AI', 'Artificial Intelligence & Machine Learning', 'AWS Cloud', 'Microsoft Azure', 'Google Cloud Platform (GCP)', 'Snowflake', 'DevOps', 'Full Stack Development', 'Web Technologies'] },
    { text: 'The internship emphasizes hands-on learning, real-world projects, and industry best practices. Students will work under the guidance of experienced mentors and industry professionals while contributing to production-style assignments, Proof of Concepts (PoCs), and capstone projects.' },
  ] },
  { id: 'internship-terms', title: '7. Internship Terms & Conditions', blocks: [
    { type: 'subheading', text: '7.1 Working Schedule' },
    { text: 'The internship is generally conducted Monday to Saturday, with the schedule communicated before the commencement of each batch.' },
    { text: 'Official holidays will be observed in accordance with the published academic calendar or applicable local regulations.' },
    { type: 'subheading', text: '7.2 Attendance' },
    { text: 'Students are expected to maintain regular attendance throughout the internship.' },
    { text: 'A minimum attendance requirement may apply for successful completion and certification.' },
    { text: 'Repeated absenteeism without prior approval may affect internship completion status.' },
    { type: 'subheading', text: '7.3 Assignments & Project Deliverables' },
    { text: 'Students are expected to:' },
    { type: 'list', items: ['Complete all assignments on time.', 'Participate actively in practical sessions.', 'Submit project deliverables as instructed.', 'Complete the assigned capstone project.'] },
    { text: 'Timely submission of work is an important criterion for successful completion.' },
    { type: 'subheading', text: '7.4 Bring Your Own Device (BYOD)' },
    { text: 'Students are required to bring their own laptop meeting the minimum hardware and software requirements specified by Tinitiate AI Solutions.' },
    { text: 'Students are responsible for:' },
    { type: 'list', items: ['Device maintenance', 'Software installation', 'Antivirus protection', 'Data backup'] },
    { text: 'Company resources and intellectual property must not be copied, distributed, or transferred without written authorization.' },
    { type: 'subheading', text: '7.5 Performance Evaluation' },
    { text: 'Student performance will be evaluated based on:' },
    { type: 'list', items: ['Attendance', 'Assignment completion', 'Practical lab performance', 'Project quality', 'Technical knowledge', 'Professional conduct', 'Team collaboration', 'Communication skills'] },
    { type: 'subheading', text: '7.6 Internship Completion' },
    { text: 'Students who successfully satisfy the internship requirements will receive an Internship Completion Certificate from Tinitiate AI Solutions.' },
    { type: 'subheading', text: '7.7 Internship Continuity' },
    { text: 'Students are expected to participate continuously throughout the internship.' },
    { text: 'Requests for schedule modifications or extensions will be considered only in exceptional circumstances and at the sole discretion of Tinitiate AI Solutions.' },
    { type: 'subheading', text: '7.8 Placement Assistance' },
    { text: 'Eligible students may receive placement assistance, interview opportunities, resume reviews, and career guidance.' },
    { text: 'Placement assistance does not constitute a guarantee of employment. Final hiring decisions are made solely by recruiting organizations based on their recruitment process and candidate performance.' },
    { type: 'subheading', text: '7.9 Confidentiality' },
    { text: 'Students shall maintain the confidentiality of all non-public information, including:' },
    { type: 'list', items: ['Client information', 'Project documentation', 'Source code', 'Business processes', 'Internal documents', 'Training materials'] },
    { text: 'Confidential information must not be shared without prior written authorization.' },
    { type: 'subheading', text: '7.10 Intellectual Property' },
    { text: 'All training materials, presentations, source code, documentation, projects, templates, videos, graphics, and software developed or provided by Tinitiate AI Solutions remain the intellectual property of the company unless otherwise agreed in writing.' },
    { text: 'Students retain ownership of their original work unless it is developed as part of a company-sponsored project or client engagement under separate written terms.' },
    { type: 'subheading', text: '7.11 Acceptable Use of Resources' },
    { text: 'Students shall use company-provided systems, software, cloud environments, and infrastructure solely for educational and authorized project purposes.' },
    { text: 'Unauthorized access, misuse, or sharing of company resources is strictly prohibited.' },
    { type: 'subheading', text: '7.12 Professional Conduct' },
    { text: 'Students are expected to maintain professional behavior throughout the program.' },
    { text: 'The following may result in disciplinary action or removal from the program:' },
    { type: 'list', items: ['Harassment or discrimination', 'Disruptive behavior', 'Abuse of instructors or fellow students', 'Academic dishonesty', 'Unauthorized sharing of course material', 'Violation of company policies'] },
  ] },
  { id: 'health-declaration', title: '8. Health Declaration', blocks: [
    { text: 'Students are encouraged to inform Tinitiate AI Solutions of any medical condition that may affect participation in classroom activities or internship sessions.' },
    { text: 'This information will be handled confidentially and used only to provide appropriate support where reasonably possible.' },
  ] },
  { id: 'social-media-marketing-consent', title: '9. Social Media & Marketing Consent', blocks: [
    { text: 'Tinitiate AI Solutions may use photographs, videos, testimonials, project demonstrations, or success stories for educational and promotional purposes.' },
    { text: 'These may include:' },
    { type: 'list', items: ['Student testimonials', 'Graduation photographs', 'Project demonstrations', 'Technical presentations', 'Workshop recordings', 'LinkedIn profile highlights', 'YouTube educational content', 'Website success stories'] },
    { text: 'Students who do not wish to appear in promotional content may notify Tinitiate AI Solutions in writing before the commencement of the program. We will make reasonable efforts to respect such requests where practicable.' },
    { text: "Digital portfolios, GitHub projects, LinkedIn profiles, and resume showcases created by students may also be promoted with the student's consent to support career development and placement opportunities." },
  ] },
  { id: 'refund-policy', title: '10. Refund Policy', blocks: [
    { text: 'Unless otherwise stated in writing:' },
    { type: 'list', items: ['Registration fees are non-refundable.', 'Refund requests are evaluated according to the specific program policy.', 'No refunds will be provided after substantial course access or participation, except where required by applicable law.'] },
  ] },
  { id: 'course-access', title: '11. Course Access', blocks: [
    { text: 'Students receive access only for the duration specified in their enrolled program.' },
    { text: 'Access may include:' },
    { type: 'list', items: ['Recorded videos', 'Live sessions', 'Assignments', 'Labs', 'Practice exercises', 'Downloadable resources'] },
    { text: 'Sharing login credentials with others is strictly prohibited.' },
  ] },
  { id: 'student-responsibilities', title: '12. Student Responsibilities', blocks: [
    { text: 'Students agree to:' },
    { type: 'list', items: ['Attend sessions regularly.', 'Complete assignments honestly.', 'Respect instructors and fellow learners.', 'Maintain professional conduct.', 'Avoid plagiarism or misuse of course materials.'] },
  ] },
  { id: 'internship-placement-assistance', title: '13. Internship & Placement Assistance', blocks: [
    { text: 'Tinitiate AI Solutions may provide:' },
    { type: 'list', items: ['Resume preparation', 'Mock interviews', 'Internship opportunities', 'Placement assistance', 'Industry referrals'] },
    { text: 'However:' },
    { type: 'list', items: ['Employment is not guaranteed.', 'Hiring decisions are made solely by recruiting organizations.', "Placement outcomes depend on the student's skills, performance, interview results, and employer requirements."] },
  ] },
  { id: 'intellectual-property', title: '14. Intellectual Property', blocks: [
    { text: 'All course content, including:' },
    { type: 'list', items: ['Videos', 'Presentations', 'Code', 'Documents', 'Assignments', 'Projects', 'Templates', 'Graphics'] },
    { text: 'remains the intellectual property of Tinitiate AI Solutions unless otherwise stated.' },
    { text: 'Students may use materials only for personal learning purposes.' },
  ] },
  { id: 'restrictions', title: '15. Restrictions', blocks: [
    { text: 'Students must not:' },
    { type: 'list', items: ['Copy or resell course materials.', 'Record live sessions without permission.', 'Share course access with others.', 'Upload copyrighted material without authorization.', 'Misuse our website or systems.'] },
    { text: 'Violation may result in immediate termination of access without refund.' },
  ] },
  { id: 'certificates', title: '16. Certificates', blocks: [
    { text: 'Certificates may be issued after successful completion of course requirements, which may include attendance, assignments, projects, or assessments.' },
    { text: 'The company reserves the right to withhold certification if requirements are not met.' },
  ] },
  { id: 'website-usage', title: '17. Website Usage', blocks: [
    { text: 'Users agree not to:' },
    { type: 'list', items: ['Attempt unauthorized access.', 'Introduce malicious software.', 'Interfere with website functionality.', 'Use automated tools to scrape or copy website content without permission.'] },
  ] },
  { id: 'third-party-services', title: '18. Third-Party Services', blocks: [
    { text: 'Our website may contain links to third-party platforms such as:' },
    { type: 'list', items: ['GitHub', 'LinkedIn', 'YouTube', 'Google', 'Payment providers'] },
    { text: 'We are not responsible for the content, availability, or privacy practices of these third-party services.' },
  ] },
  { id: 'limitation-of-liability', title: '19. Limitation of Liability', blocks: [
    { text: 'To the fullest extent permitted by law, Tinitiate AI Solutions shall not be liable for:' },
    { type: 'list', items: ['Indirect or consequential damages.', 'Loss of profits or business opportunities.', 'Internet outages or technical issues beyond our control.', 'Delays caused by third-party service providers.'] },
    { text: 'Our total liability shall not exceed the amount paid by the student for the relevant service.' },
  ] },
  { id: 'disclaimer', title: '20. Disclaimer', blocks: [
    { text: 'Training programs are intended to improve professional knowledge and practical skills.' },
    { text: 'While we strive to provide high-quality education and career support:' },
    { type: 'list', items: ['We do not guarantee employment.', 'We do not guarantee salary levels.', 'We do not guarantee interview selection by employers.'] },
    { text: 'Success depends on individual effort, market conditions, and employer requirements.' },
  ] },
  { id: 'privacy', title: '21. Privacy', blocks: [
    { text: 'Your use of our website is also governed by our Privacy Policy.' },
    { text: 'By using our services, you acknowledge that you have read and understood our Privacy Policy.' },
  ] },
  { id: 'changes-to-terms', title: '22. Changes to Terms', blocks: [
    { text: 'We may update these Terms & Conditions periodically.' },
    { text: 'Updated versions will be published on this page with a revised effective date.' },
    { text: 'Continued use of our website or services constitutes acceptance of the updated Terms.' },
  ] },
  { id: 'governing-law', title: '23. Governing Law', blocks: [
    { text: 'These Terms & Conditions shall be governed by the laws applicable to the jurisdiction in which Tinitiate AI Solutions operates.' },
    { text: 'Any disputes shall be subject to the competent courts of that jurisdiction.' },
  ] },
  { id: 'contact-us', title: '24. Contact Us', blocks: [
    { text: 'Tinitiate AI Solutions' },
    { text: 'Email: contact@tinitiateai.com' },
    { text: 'Website: www.tinitiateai.com' },
    { text: 'Phone: +91 6309123485' },
    { text: 'Address: 1-2/10 SBH Colony Mohan Nagar, SBH Colony, Kothapet, 500036, Telangana, India' },
  ] },
]

export default function TermsAndConditions() {
  return (
    <LegalPolicyPage
      currentHref="/terms"
      eyebrow="Website Use & Legal Terms"
      title="Terms & Conditions"
      supportEmail="contact@tinitiateai.com"
      intro={[
        'Welcome to Tinitiate AI Solutions. These Terms & Conditions govern your access to and use of our website, training programs, internship opportunities, workshops, online learning platform, and related services.',
        'By accessing our website or enrolling in any program, you agree to these Terms & Conditions.',
      ]}
      sections={sections}
      closingTitle="Final Statement"
      closing={['By accessing our website, enrolling in our programs, or using our services, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.']}
    />
  )
}
