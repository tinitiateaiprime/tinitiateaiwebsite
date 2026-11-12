import fs from 'node:fs/promises'
import path from 'node:path'
import { GoogleGenAI } from '@google/genai'

const ROOT = process.cwd()

const INPUT_FILE = path.join(
  ROOT,
  'src',
  'content',
  'chatbot',
  'tinitiateai.md',
)

const OUTPUT_FILE = path.join(
  ROOT,
  'src',
  'content',
  'chatbot',
  'knowledge-index.json',
)

const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-2'

const EMBEDDING_DIMENSIONS = 768
const MAX_CHUNK_CHARS = 1800

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const SOURCE_ROUTES = {
  'About Tinitiate AI Solutions': '/about',
  'Training Approach': '/courses',
  'Classroom Training': '/classroom-training',
  'Online Training': '/online-training',
  'Weekend Training': '/weekend-training',
  Internships: '/internships',
  'Real-Time Projects': '/real-time-projects',
  'Job Assistance': '/job-assistance',
  'Placement Assistance': '/job-assistance',
  'Program Pricing': '/pricing',
  'Pricing Policy': '/pricing-policy',
  'Privacy Policy': '/privacy-policy',
  'Refund & Cancellation Policy': '/refund-policy',
  'Cookie Policy': '/cookie-policy',
  'Terms & Conditions': '/terms',
  'Contact and Support': '/contact',
}

function cleanText(text) {
  return text
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function splitLargeText(text, maxChars = MAX_CHUNK_CHARS) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((value) => value.trim())
    .filter(Boolean)

  const chunks = []
  let current = ''

  for (const paragraph of paragraphs) {
    if (!current) {
      if (paragraph.length <= maxChars) {
        current = paragraph
        continue
      }

      for (let i = 0; i < paragraph.length; i += maxChars) {
        chunks.push(paragraph.slice(i, i + maxChars).trim())
      }

      continue
    }

    const combined = `${current}\n\n${paragraph}`

    if (combined.length <= maxChars) {
      current = combined
      continue
    }

    chunks.push(current.trim())

    if (paragraph.length <= maxChars) {
      current = paragraph
    } else {
      for (let i = 0; i < paragraph.length; i += maxChars) {
        const part = paragraph.slice(i, i + maxChars).trim()

        if (part.length === maxChars) {
          chunks.push(part)
        } else {
          current = part
        }
      }
    }
  }

  if (current.trim()) {
    chunks.push(current.trim())
  }

  return chunks
}

function parseMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/)

  const headings = {
    1: '',
    2: '',
    3: '',
  }

  const sections = []
  let buffer = []

  function flush() {
    const raw = cleanText(buffer.join('\n'))

    if (!raw) {
      buffer = []
      return
    }

    const headingPath = [
      headings[1],
      headings[2],
      headings[3],
    ].filter(Boolean)

    const topLevel = headings[1] || 'Tinitiate AI Solutions'

    let source = SOURCE_ROUTES[topLevel] || null

    const sourceMatch = raw.match(/^Source:\s*(\/[^\s]+)\s*$/m)

    if (sourceMatch) {
      source = sourceMatch[1]
    }

    const content = cleanText(
      raw.replace(/^Source:\s*\/[^\s]+\s*$/gm, ''),
    )

    if (!content) {
      buffer = []
      return
    }

    const pieces = splitLargeText(content)

    pieces.forEach((piece, index) => {
      sections.push({
        topLevel,
        headingPath,
        source,
        text: piece,
        part: index + 1,
        totalParts: pieces.length,
      })
    })

    buffer = []
  }

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+?)\s*$/)

    if (!match) {
      buffer.push(line)
      continue
    }

    flush()

    const level = match[1].length
    const title = match[2].trim()

    headings[level] = title

    for (let deeper = level + 1; deeper <= 3; deeper++) {
      headings[deeper] = ''
    }
  }

  flush()

  return sections
}

async function embedWithRetry(ai, text, attempt = 1) {
  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
      },
    })

    const embedding = response.embeddings?.[0]?.values

    if (!embedding?.length) {
      throw new Error('Gemini returned an empty embedding')
    }

    if (embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Expected ${EMBEDDING_DIMENSIONS} dimensions but received ${embedding.length}`,
      )
    }

    return embedding
  } catch (error) {
    if (attempt >= 6) {
      throw error
    }

    const message =
      error instanceof Error ? error.message : String(error)

    const waitMs = Math.min(
      60000,
      5000 * Math.pow(2, attempt - 1),
    )

    console.warn(
      `Embedding request failed (attempt ${attempt}/6).`,
    )
    console.warn(message)
    console.warn(`Retrying in ${waitMs / 1000}s...`)

    await sleep(waitMs)

    return embedWithRetry(ai, text, attempt + 1)
  }
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      'GEMINI_API_KEY is missing. Run this script with .env.local loaded.',
    )
  }

  console.log('Reading knowledge file...')

  const markdown = await fs.readFile(INPUT_FILE, 'utf8')

  const sections = parseMarkdown(markdown)

  if (!sections.length) {
    throw new Error('No knowledge chunks were generated.')
  }

  console.log(`Generated ${sections.length} text chunks.`)
  console.log(`Embedding model: ${EMBEDDING_MODEL}`)
  console.log(`Dimensions: ${EMBEDDING_DIMENSIONS}`)
  console.log('')

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  })

  const chunks = []

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]

    const title =
      section.headingPath.join(' > ') ||
      section.topLevel

    // Gemini Embedding 2 retrieval-document format.
    const embeddingInput =
      `title: ${title} | text: ${section.text}`

    console.log(
      `[${i + 1}/${sections.length}] ${title}`,
    )

    const embedding = await embedWithRetry(
      ai,
      embeddingInput,
    )

    chunks.push({
      id: `chunk-${String(i + 1).padStart(4, '0')}`,
      title,
      topLevel: section.topLevel,
      headings: section.headingPath,
      source: section.source,
      text: section.text,
      embedding,
    })

    // Keep requests gentle for free-tier rate limits.
    if (i < sections.length - 1) {
      await sleep(1100)
    }
  }

  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    sourceFile: 'src/content/chatbot/tinitiateai.md',
    embeddingModel: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    chunkCount: chunks.length,
    chunks,
  }

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(index, null, 2),
    'utf8',
  )

  console.log('')
  console.log('RAG index created successfully.')
  console.log(`Chunks: ${chunks.length}`)
  console.log(`Output: ${OUTPUT_FILE}`)
}

main().catch((error) => {
  console.error('')
  console.error('Failed to build chatbot index:')
  console.error(error)
  process.exit(1)
})