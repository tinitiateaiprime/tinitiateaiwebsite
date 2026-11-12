'use client'

import Image from 'next/image'
import Link from 'next/link'

const databaseServices = [
  {
    title: 'MySQL Database Service',
    description:
      'Performance tuning, replication setup, and HA strategies for MySQL.',
    icon: '/azure/images/remote-consulting/mysql.png',
    href: '/remote-consulting/mysql',
  },
  {
    title: 'Oracle Database Services',
    description:
      'Oracle RAC, Data Guard, and enterprise-grade tuning expertise.',
    icon: '/azure/images/remote-consulting/Oracle.png',
    href: '/remote-consulting/oracle',
  },
  {
    title: 'PostgreSQL Services',
    description:
      'PostgreSQL clustering, partitioning, and extension optimization.',
    icon: '/azure/images/remote-consulting/postgresql.png',
    href: '/remote-consulting/postgresql',
  },
  {
    title: 'SQL Server Services',
    description:
      'SQL Server Always On, ETL optimization, and DWH performance.',
    icon: '/azure/images/remote-consulting/sqlserver.png',
    href: '/remote-consulting/sqlserver',
  },
  {
    title: 'Amazon Redshift',
    description:
      'Redshift WLM, Spectrum queries, and scalable warehouse support.',
    icon: '/azure/images/remote-consulting/redshift.png',
    href: '/remote-consulting/redshift',
  },
]

export default function DatabaseServices() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">🗄️ Database Services We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {databaseServices.map(({ title, description, icon }, idx) => (
            <Link
              href={`/request-callback?service=${encodeURIComponent(title)}`}
              key={idx}
              className="bg-gray-50 hover:bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center text-center transition-shadow shadow-sm hover:shadow-md"
            >
              <div className="relative w-16 h-16 mb-4">
                <Image
                  src={icon}
                  alt={title}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}