import { getPayload } from '@/lib/getPayload'
import { getUpcomingBatches } from '@/lib/batches'

function relationshipTitle(value: unknown) {
  if (
    value &&
    typeof value === 'object' &&
    'title' in value &&
    typeof value.title === 'string'
  ) {
    return value.title
  }

  return null
}

function formatIndiaDateTime(value: string) {
  const date = new Date(value)

  return `${new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)} IST`
}

export async function getCourses() {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 100,
    sort: 'title',
  })

  return result.docs.map((course) => ({
  title: course.title,
  slug: course.slug,
  shortDescription: course.shortDescription,
  level: course.level,
  duration: course.duration,
  startDate: course.startDate ?? null,
  featured: course.featured ?? false,
  tags: course.tags ?? [],
  trainer:
    course.trainer &&
    typeof course.trainer === 'object'
      ? course.trainer.name
      : null,
  keyFeatures:
    course.keyFeatures?.map((item) => item.feature) ?? [],
  targetAudience:
    course.targetAudience?.map((item) => item.audience) ?? [],
}))
}

export async function getSafeUpcomingBatches() {
  const batches = await getUpcomingBatches()

  // Meeting links are intentionally excluded from the public chatbot.
  return batches.map((batch) => ({
    id: batch.id,
    courseName: batch.courseName,
    facultyName: batch.facultyName,
    mode: batch.mode,
    startsAt: formatIndiaDateTime(batch.startsAt),
  }))
}

export async function getTrainers() {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'trainers',
    limit: 100,
    sort: 'name',
  })

  return result.docs.map((trainer) => ({
    name: trainer.name,
    title: trainer.title,
    yearsExperience: trainer.yearsExperience,
    expertise:
      trainer.expertise?.map((item) => item.skill) ?? [],
  }))
}

export async function getUpcomingDemoSlots() {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'demo-slots',
    depth: 1,
    limit: 30,
    sort: 'startsAt',
    where: {
      and: [
        {
          isActive: {
            equals: true,
          },
        },
        {
          startsAt: {
            greater_than: new Date().toISOString(),
          },
        },
      ],
    },
  })

  const slots = []

  for (const slot of result.docs) {
    const existingBookings = await payload.count({
      collection: 'demo-bookings',
      where: {
        and: [
          {
            slot: {
              equals: slot.id,
            },
          },
          {
            status: {
              not_equals: 'cancelled',
            },
          },
        ],
      },
    })

    const remaining = Math.max(
      0,
      slot.capacity - existingBookings.totalDocs,
    )

    if (remaining <= 0) {
      continue
    }

    slots.push({
      id: slot.id,
      startsAt: formatIndiaDateTime(slot.startsAt),
endsAt: formatIndiaDateTime(slot.endsAt),
      course: relationshipTitle(slot.course),
      capacity: slot.capacity,
      remaining,
    })
  }

  return slots
}

export async function getUpcomingWorkshops() {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'workshops',
    limit: 50,
    sort: 'scheduledAt',
    where: {
      scheduledAt: {
        greater_than: new Date().toISOString(),
      },
    },
  })

  return result.docs.map((workshop) => ({
    title: workshop.title,
    slug: workshop.slug,
    shortDescription: workshop.shortDescription,
    duration: workshop.duration ?? null,
    mode: workshop.mode ?? null,
    scheduledAt: workshop.scheduledAt
  ? formatIndiaDateTime(workshop.scheduledAt)
  : null,
  }))
}

export async function getRealTimeProjects() {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'real-time-projects',
    limit: 100,
    sort: 'title',
  })

  return result.docs.map((project) => ({
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription,
    level: project.level ?? null,
    tools:
      project.tools?.map((item) => item.tool) ?? [],
  }))
}

export async function getCurrentContactDetails() {
  const payload = await getPayload()

  const settings = await payload.findGlobal({
    slug: 'site-settings',
  })

  return {
    siteName: settings.siteName,
    tagline: settings.tagline ?? null,
    phone: settings.contactPhone ?? null,
    email: settings.contactEmail ?? null,
    address: settings.address ?? null,
  }
}

function matches(
  message: string,
  patterns: RegExp[],
) {
  return patterns.some((pattern) => pattern.test(message))
}

export async function getLiveChatContext(
  message: string,
) {
  const query = message.toLowerCase()

  const sections: string[] = []
  const usedTools: string[] = []

  const wantsCourses = matches(query, [
    /\bcourses?\b/,
    /\btraining\b/,
    /\bprograms?\b/,
    /\bduration\b/,
    /\bcourse fee\b/,
    /\bcourse price\b/,
    /\bwhich course\b/,
    /\bwhat should i learn\b/,
  ])

  const wantsBatches = matches(query, [
    /\bbatches?\b/,
    /\bupcoming\b/,
    /\bschedule\b/,
    /\bclassroom\b/,
    /\bonline batch\b/,
    /\bweekend batch\b/,
    /\bstart date\b/,
    /\bstarts?\b/,
  ])

  const wantsTrainers = matches(query, [
    /\btrainers?\b/,
    /\bfaculty\b/,
    /\binstructors?\b/,
    /\bmentor\b/,
  ])

  const wantsDemo = matches(query, [
    /\bdemo\b/,
    /\bfree session\b/,
    /\bfree sessions\b/,
    /\btrial session\b/,
    /\btrial sessions\b/,
  ])

  const wantsWorkshops = matches(query, [
    /\bworkshops?\b/,
  ])

  const wantsProjects = matches(query, [
    /\breal[- ]?time projects?\b/,
    /\bprojects?\b/,
  ])

  const wantsContact = matches(query, [
    /\bcontact\b/,
    /\bphone\b/,
    /\bemail\b/,
    /\baddress\b/,
    /\blocation\b/,
    /\bwhere are you located\b/,
  ])

  if (wantsCourses) {
    const courses = await getCourses()

    sections.push(
      `[LIVE COURSES]\n${JSON.stringify(courses, null, 2)}`,
    )

    usedTools.push('courses')
  }

  if (wantsBatches) {
    const batches = await getSafeUpcomingBatches()

    sections.push(
      `[LIVE UPCOMING BATCHES]\n${JSON.stringify(
        batches,
        null,
        2,
      )}`,
    )

    usedTools.push('batches')
  }

  if (wantsTrainers) {
    const trainers = await getTrainers()

    sections.push(
      `[LIVE TRAINERS]\n${JSON.stringify(
        trainers,
        null,
        2,
      )}`,
    )

    usedTools.push('trainers')
  }

  if (wantsDemo) {
    const demoSlots = await getUpcomingDemoSlots()

    sections.push(
      `[LIVE AVAILABLE DEMO SLOTS]\n${JSON.stringify(
        demoSlots,
        null,
        2,
      )}`,
    )

    usedTools.push('demo-slots')
  }

  if (wantsWorkshops) {
    const workshops = await getUpcomingWorkshops()

    sections.push(
      `[LIVE UPCOMING WORKSHOPS]\n${JSON.stringify(
        workshops,
        null,
        2,
      )}`,
    )

    usedTools.push('workshops')
  }

  if (wantsProjects) {
    const projects = await getRealTimeProjects()

    sections.push(
      `[LIVE REAL-TIME PROJECTS]\n${JSON.stringify(
        projects,
        null,
        2,
      )}`,
    )

    usedTools.push('real-time-projects')
  }

  if (wantsContact) {
    const contact = await getCurrentContactDetails()

    sections.push(
      `[LIVE SITE CONTACT DETAILS]\n${JSON.stringify(
        contact,
        null,
        2,
      )}`,
    )

    usedTools.push('site-settings')
  }

  return {
    context: sections.join('\n\n'),
    usedTools,
  }
}