"use client";

import Image from "next/image"
export default function CompanyOverview() {
  return (
    <div className="text-gray-800">

              <section className="relative bg-black py-20 sm:py-10 md:py-15 ">
  <div className="max-w-7xl sm:px-5 mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">

    <div className="text-center md:text-left">
      <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
        Trusted IT Experts
      </span>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
        TINITIATE Technologies 
      </h1>
      <p className="text-base sm:text-lg text-white mb-6 max-w-xl">
         Empowering individuals and businesses through innovative IT training and development services.
      </p>
    </div>

    <div className="relative w-full h-64 p-2 sm:h-80 md:h-[22rem] rounded-lg overflow-hidden shadow-lg">
      <Image
        src="/azure/images/banners/company.jpg" // Replace with a real high-quality hero image
        alt="IT Development Solutions"
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
    </div>
  </div>
  </section>

      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            TINITIATE is a technology-driven organization committed to delivering high-quality IT training and development services. With over 15 years of industry experience, we bridge the gap between education and employment by equipping students and professionals with real-world skills.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our team of experienced professionals, industry experts, and technologists ensure every engagement reflects our commitment to excellence, innovation, and learner success.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6 ">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            To enable individuals, students, and corporate teams to thrive in the digital world by delivering hands-on, real-time IT education, software development, and cloud-based engineering solutions.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Empower through practical, live-project-based training</li>
            <li>Deliver full-cycle software development and support</li>
            <li>Support career growth with domain-oriented guidance</li>
          </ul>
        </div>
      </section>

      <section className="bg-white py-20 px-6 ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Partner With Us?</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Whether you&apos;re an individual looking to upskill or an enterprise needing cutting-edge development services, TINITIATE is your trusted technology partner. Our commitment to personalized mentoring, project-oriented learning, and scalable engineering makes us stand out.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {[
              'Proven industry experience across multiple domains',
              'Live project-based training with practical exposure',
              'Full-stack, cloud, and DevOps capabilities',
              'Support for corporate upskilling and transformation',
            ].map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-lg">✓</span>
                <span className="text-gray-700">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
