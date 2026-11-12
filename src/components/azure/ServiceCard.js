"use client"

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function ServiceCards() {


  const itDevelopmentServices = [
    {
      title: 'Cloud Services',
      duration: 'Project Based',
      image: '/azure/images/it-development/cloud.jpg',
      description: 'Architect, migrate, and manage workloads on AWS, Azure, and GCP—IaC, containers, serverless, CI/CD, observability, security, and cost optimization.',
      href: '/it-development/cloud-services',
    },
    {
      title: 'AI-Powered Development',
      duration: 'Project Based',
      image: '/azure/images/it-development/ai-powered.jpg',
      description: 'Design and ship LLM apps, RAG search, agents, and AI copilots. Integrate OpenAI/Azure OpenAI/Bedrock, build secure data pipelines, and ensure responsible AI.',
      href: '/it-development/ai-powered-development',
    },
    {
      title: 'App Development',
      duration: 'Custom Timeline',
      image: '/azure/images/it-development/app-development-1.jpg',
      description: 'Build cross-platform mobile and web apps tailored to client needs with seamless UX and secure APIs.',
      href: '/it-development/app-development',
    },
    {
      title: 'Web/Backend Development',
      duration: 'Project Based',
      image: '/azure/images/it-development/web-backend-2.jpg',
      description: 'Develop scalable, secure backend systems and responsive web applications using modern frameworks.',
      href: '/it-development/web-backend',
    },
    {
      title: 'Testing and Support',
      duration: 'Ongoing',
      image: '/azure/images/it-development/testing-support-2.jpg',
      description: 'Ensure quality through automated/manual testing, bug fixing, and continuous support for deployments.',
      href: '/it-development/testing-support',
    },
    {
      title: 'Reporting Services',
      duration: 'Monthly / On-Demand',
      image: '/azure/images/it-development/reporting.jpg',
      description: 'Build interactive dashboards, automated reports, and business intelligence systems for actionable insights.',
      href: '/it-development/reporting',
    },
    {
      title: 'DevOps Services',
      duration: 'Ongoing / Project-Based',
      image: '/azure/images/it-development/DevOps.jpg',
      description: 'Streamline development and deployment with CI/CD pipelines, containerization, and infrastructure automation.',
      href: '/it-development/devops',
    },
    {
      title: 'Database Services',
      duration: 'Project / Ongoing',
      image: '/azure/images/it-development/database.jpg',
      description: 'Design, optimize, and manage relational and NoSQL databases with high availability, replication, and backup strategies.',
      href: '/it-development/database',
    },
    {
      title: 'Full Stack Development',
      duration: 'Custom Timeline',
      image: '/azure/images/it-development-services.jpg',
      description: 'End-to-end development using modern frontend and backend technologies, delivering complete web and mobile solutions.',
      href: '/it-development/full-stack-development',
    }
  ]

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 ">
  {itDevelopmentServices.map((service, index) => (
    <motion.div
      key={index}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
      
    >
      <div className="relative w-full h-48">
        <Image
          src={service.image}
          alt={service.title}
          fill
          loading="lazy"
          sizes="(max-width: 640px) 100vw,
                 (max-width: 1024px) 50vw,
                 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
          {service.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">Timeline: {service.duration}</p>
        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{service.description}</p>
        <Link href={`/request-callback?service=${encodeURIComponent(service.title)}`} className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline">
          Discuss this service
        </Link>
      </div>
    </motion.div>
  ))}
</div>

  )
}