import { GoogleGenAI } from '@google/genai'

export const CHAT_MODELS = [
  process.env.GEMINI_CHAT_MODEL || 'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
].filter(
  (model, index, models) =>
    models.indexOf(model) === index,
)

export const CHAT_MODEL = CHAT_MODELS[0]

export const EMBEDDING_MODEL =
  process.env.GEMINI_EMBEDDING_MODEL ||
  'gemini-embedding-2'

let client: GoogleGenAI | null = null

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured',
    )
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey,
    })
  }

  return client
}