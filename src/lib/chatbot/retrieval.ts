import knowledgeIndex from '@/content/chatbot/knowledge-index.json'
import {
  EMBEDDING_MODEL,
  getGeminiClient,
} from '@/lib/chatbot/gemini'

type KnowledgeChunk = {
  id: string
  title: string
  topLevel: string
  headings: string[]
  source: string | null
  text: string
  embedding: number[]
}

export type RetrievedKnowledge = {
  id: string
  title: string
  source: string | null
  text: string
  score: number
}

const index = knowledgeIndex as {
  version: number
  dimensions: number
  chunks: KnowledgeChunk[]
}

function cosineSimilarity(a: number[], b: number[]) {
  if (a.length !== b.length || a.length === 0) {
    return 0
  }

  let dot = 0
  let magnitudeA = 0
  let magnitudeB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magnitudeA += a[i] * a[i]
    magnitudeB += b[i] * b[i]
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
}

async function embedQuestion(question: string) {
  const ai = getGeminiClient()

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: `task: question answering | query: ${question}`,
    config: {
      outputDimensionality: index.dimensions,
    },
  })

  const embedding = response.embeddings?.[0]?.values

  if (!embedding?.length) {
    throw new Error('Gemini returned an empty query embedding')
  }

  if (embedding.length !== index.dimensions) {
    throw new Error(
      `Expected ${index.dimensions} dimensions but received ${embedding.length}`,
    )
  }

  return embedding
}

export async function retrieveKnowledge(
  question: string,
  options?: {
    limit?: number
    minimumScore?: number
  },
): Promise<RetrievedKnowledge[]> {
  const cleanedQuestion = question.trim()

  if (!cleanedQuestion) {
    return []
  }

  const limit = Math.min(
    Math.max(options?.limit ?? 5, 1),
    8,
  )

  const minimumScore = options?.minimumScore ?? 0.3

  const questionEmbedding =
    await embedQuestion(cleanedQuestion)

  return index.chunks
    .map((chunk) => ({
      id: chunk.id,
      title: chunk.title,
      source: chunk.source,
      text: chunk.text,
      score: cosineSimilarity(
        questionEmbedding,
        chunk.embedding,
      ),
    }))
    .filter((chunk) => chunk.score >= minimumScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function buildKnowledgeContext(
  chunks: RetrievedKnowledge[],
) {
  if (!chunks.length) {
    return ''
  }

  return chunks
    .map((chunk, index) => {
      const source = chunk.source
        ? `Source page: ${chunk.source}`
        : 'Source page: internal knowledge'

      return [
        `[Knowledge ${index + 1}]`,
        `Section: ${chunk.title}`,
        source,
        chunk.text,
      ].join('\n')
    })
    .join('\n\n---\n\n')
}