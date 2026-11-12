import Link from 'next/link'
import { RiOpenaiFill as SiOpenai } from "react-icons/ri";
import { FaCss3Alt as SiCss3 } from "react-icons/fa6";
import { Database as SiOracle } from "lucide-react";
import { ChartNoAxesCombined as SiTableau } from "lucide-react";
import { FiBox, FiPhone, FiCode, FiDatabase, FiCloud, FiBarChart2, FiSmartphone, FiCheckCircle, FiCpu } from 'react-icons/fi'
import Image from 'next/image'
import { SiPython, SiReact, SiAngular, SiNextdotjs, SiHtml5, SiJavascript, SiMysql, SiPostgresql, SiNodedotjs, SiDocker, SiKubernetes, SiLinux, SiGit, SiDjango, SiSpring, SiExpress, SiDotnet, SiApachespark, SiApachekafka, SiFlask, SiFastapi, SiGooglecloud, SiLangchain, SiHuggingface } from 'react-icons/si';

const hero = {
  title: 'Personalized Training, Tailored to You',
  intro:
    'Learn faster with a custom curriculum, flexible scheduling, and hands-on projects—all guided by experienced mentors.',
  image: '/azure/images/banners/personalized-training.jpg',
}

function SafeIcon({ Icon, className, label, style }) {
  const Ico = Icon ?? FiBox
  return <Ico className={className} aria-label={label} aria-hidden={!label} style={style} />
}

const USE_DEVICON = new Set([])
const DEVICON_CLASS = {}

const BRAND = {
  python: '#3776AB', react: '#61DAFB', angular: '#DD0031', nextjs: '#000000',
  html: '#E34F26', css: '#1572B6', javascript: '#F7DF1E',

  mysql: '#4479A1', postgresql: '#336791', 'sql-server': '#CC2927',SiOracle:'#DD0031',SiNodedotjs:'#6fce30ff',
  'power-bi': '#F2C811', azure: '#0078D4', docker: '#2496ED', kubernetes: '#326CE5',
  linux: '#FCC624', git: '#F05032', django: '#092E20', spring: '#6DB33F',
  express: '#000000', dotnet: '#512BD4', spark: '#E25A1C', tableau: '#E97627',flask: '#000000',gcp: '#4285F4',
  fastapi: '#009688',
  kafka: '#231F20',
SiLangchain: "#1C3C3C",   // dark green from LangChain brand
SiHuggingface: "#FFCC4D", // hugging face yellow
SiOpenai: "#412991",      // OpenAI purple
}

const COURSES = [
  { key: 'python', name: 'Python', href: '/courses/python-language-course', Icon: SiPython },
  { key: 'java', name: 'Java', href: '/courses/java-language-course', Icon: null, image: '/azure/images/courses/csharp.png' },
  { key: 'nodejs', name: 'Node.js', href: '/courses/nodejs-beginner-course', Icon: SiNodedotjs },
  { key: 'aws', name: 'AWS', href: '/courses/aws-beginner-course', Icon: null, image: '/azure/images/courses/aws-devops.png' },
  { key: 'react', name: 'React', href: '/courses/react-beginner-course', Icon: SiReact },
  { key: 'power-bi', name: 'Power BI', href: '/courses/powerbi-beginner-course', Icon: null, image: '/azure/images/courses/powerbi.png' },
  { key: 'sql-server', name: 'SQL Server', href: '/courses/sql-server-beginner-course', Icon: null, image: '/azure/images/courses/sql.png' },
  { key: 'mysql', name: 'MySQL', href: '/courses/mysql-beginner-course', Icon: SiMysql },
  { key: 'docker', name: 'Docker', href: '/courses/docker-beginner-course', Icon: SiDocker },
  { key: 'kubernetes', name: 'Kubernetes', href: '/courses/kubernetes-beginner-course', Icon: SiKubernetes },
  { key: 'angular', name: 'Angular', href: '/courses/angular-beginner-course', Icon: SiAngular },
  { key: 'azure', name: 'Microsoft Azure', href: '/courses/microsoft-azure-beginner-course', Icon: null, image:'/azure/images/courses/microsoftAzure.png' },
  { key: 'css', name: 'CSS3', href: '/courses/css-beginner-course', Icon: SiCss3 },
  { key: 'django', name: 'Django', href: '/courses/django-beginner-course', Icon: SiDjango },
  { key: 'dotnet', name: '.NET', href: '/courses/dotnet-beginner-course', Icon: SiDotnet, image: '/azure/images/courses/csharp.png' },
  { key: 'express', name: 'Express.js', href: '/courses/expressjs-beginner-course', Icon: SiExpress },
  { key: 'git', name: 'Git & GitHub', href: '/courses/git-github-beginner-course', Icon: SiGit },
  { key: 'html', name: 'HTML5', href: '/courses/html-beginner-course', Icon: SiHtml5 },
  { key: 'javascript', name: 'JavaScript', href: '/courses/javascript-language-course', Icon: SiJavascript },
  { key: 'linux', name: 'Linux', href: '/courses/linux-beginner-course', Icon: SiLinux },
  { key: 'nextjs', name: 'Next.js', href: '/courses/nextjs-beginner-course', Icon: SiNextdotjs },
  { key: 'postgresql', name: 'PostgreSQL', href: '/courses/postgresql-beginner-course', Icon: SiPostgresql },
  { key: 'spark', name: 'Apache Spark', href: '/courses/apache-spark-beginner-course', Icon: SiApachespark },
  { key: 'spring', name: 'Spring', href: '/courses/spring-beginner-course', Icon: SiSpring },
  { key: 'tableau', name: 'Tableau', href: '/courses/tableau-beginner-course', Icon: SiTableau },
  { key: 'kafka', name: 'Apache Kafka', href: '/courses/apache-kafka-beginner-course', Icon: SiApachekafka },
  { key: 'oracle', name: 'Oracle Database', href: '/courses/oracle-beginner-course', Icon: SiOracle,  },
  { key: 'flask', name: 'Flask', href: '/courses/flask-beginner-course', Icon: SiFlask },
  { key: 'fastapi', name: 'FastAPI', href: '/courses/fastapi-beginner-course', Icon: SiFastapi },
  { key: 'gcp', name: 'Google Cloud Platform', href: '/courses/gcp-beginner-course', Icon: SiGooglecloud },
  { key: 'gpt', name: 'OpenAI GPT', href: '/courses/gpt-beginner-course', Icon: SiOpenai },
  { key: 'langchain', name: 'LangChain', href: '/courses/langchain-beginner-course', Icon: SiLangchain },
  { key: 'huggingface', name: 'Hugging Face', href: '/courses/huggingface-beginner-course', Icon: SiHuggingface },

]

const FAQ = [
  { q: 'What is Personalized Training?', a: 'A tailored program with flexible scheduling and mentor guidance based on your goals and background.' },
  { q: 'Do you provide recordings & materials?', a: 'Yes. Session recordings (where applicable), labs, and notes are shared through our portal.' },
  { q: 'Can I switch tracks?', a: 'Yes. We can realign your plan during periodic reviews within your enrolled tenure.' },
  { q: 'Is there a certificate?', a: 'Yes. You receive a TINITIATE completion certificate after evaluations.' },
]

const CATEGORY_ICONS = {
  'Cloud & DevOps': FiCloud,
  'Web & App Development': FiCode,
  'Mobile Development': FiSmartphone,
  'Databases': FiDatabase,
  'Data & Analytics': FiBarChart2,
   'AI': FiCpu
}

const CATEGORY_HEADING_COLOR = 'from-purple-700 to-pink-500'

const CATEGORIES = [
  { name: 'Cloud & DevOps', items: ['aws', 'azure', 'gcp', 'docker', 'kubernetes',  'git'] },
  { name: 'Web & App Development', items: ['react', 'angular', 'nextjs', 'django', 'flask', 'fastapi'] },
  { name: 'Mobile Development', items: ['java', 'spring', 'dotnet', 'nodejs'] },
  { name: 'Databases', items: ['mysql', 'postgresql', 'sql-server', 'oracle'] },  // 👈 Oracle kept
  { name: 'Data & Analytics', items: ['python', 'spark', 'kafka', 'power-bi', 'tableau'] },
  { name: 'AI', items: ['gpt', 'langchain', 'huggingface'] }
];

function CourseIcon({ keyName, Icon, image }) {
  if (USE_DEVICON.has(keyName)) {
    return <i className={`${DEVICON_CLASS[keyName]} text-[40px] leading-none`} aria-hidden />
  }
  if (Icon) {
    return (
      <SafeIcon
        Icon={Icon}
        className="h-10 w-10"
        style={{ color: BRAND[keyName] ?? '#4B5563' }}
      />
    )
  }
  if (image) {
    return (
      <Image
        src={image}
        alt={keyName}
        width={40}
        height={40}
        priority
        className="h-10 w-10 object-contain"
      />
    )
  }
  return <FiBox className="h-10 w-10 text-gray-400" />
}

export default function Page() {
  return (
    <div className="bg-white text-gray-900">

      <section className="w-full bg-black py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-64 md:h-80">
            <Image
              src={hero.image}
              alt={hero.title}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              className="object-contain rounded-lg"
              priority
  fetchPriority="high"

            />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              {hero.title}
            </h1>
            <p className="text-lg text-white mb-3">{hero.intro}</p>
            <Link
              href="/request-callback"
              className="mt-7 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Request a Callback
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl md:text-4xl text-center font-bold tracking-tight text-gray-800 mb-12">
            Course Catalog
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map(cat => {
              const Icon = CATEGORY_ICONS[cat.name] ?? FiBox
              return (
                <div
                  key={cat.name}
                  className="rounded-3xl overflow-hidden shadow-md border border-gray-200 bg-white flex flex-col"
                >

                  <div className={`px-6 py-4 flex items-center gap-3 bg-gradient-to-r ${CATEGORY_HEADING_COLOR}`}>
                    <Icon className="h-6 w-6 text-white" />
                    <h3 className="text-lg md:text-xl font-bold text-white">{cat.name}</h3>
                  </div>

                  <div className="p-6 flex-1">
                    <ul className="grid gap-6 grid-cols-2 sm:grid-cols-3">
                      {cat.items.map(key => {
                        const course = COURSES.find(c => c.key === key)
                        if (!course) return null
                        const { name, href, Icon, image } = course
                        return (
                          <li key={key}>
                            <Link href={href}>
                              <div className="grid place-items-center group">
                                <div
                                  className="grid h-20 w-20 place-items-center rounded-xl bg-white ring-1 ring-gray-200 
                                             transition group-hover:scale-110 group-hover:ring-purple-500"
                                >
                                  <CourseIcon keyName={key} Icon={Icon} image={image} />
                                </div>
                                <div className="mt-3 text-center text-sm font-medium text-gray-900 group-hover:text-purple-600">
                                  {name}
                                </div>
                              </div>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

<section className="px-6 py-12 bg-white">
  <div className="mx-auto max-w-7xl">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-start mb-6">
      FAQs
    </h2>

    <div className="grid gap-6 md:grid-cols-2">
      {(Array.isArray(FAQ) ? FAQ : []).map(({ q, a }, i) => (
        <div
          key={q ?? i}
          className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-2 mb-3">
            <FiCheckCircle className="h-5 w-5 text-indigo-600 opacity-80" />
            <h3 className="text-base font-semibold text-gray-900">{q}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-lg font-bold text-gray-900">Want a personalized study plan?</h4>
                <p className="text-sm text-gray-700">
                  Tell us your goals—career switch, upskilling, or interview prep—and we’ll map the path.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/request-callback"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                  <FiPhone className="h-4 w-4" />
                  Request a Callback
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
