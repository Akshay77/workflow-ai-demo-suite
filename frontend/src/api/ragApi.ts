import type { RagQueryHistoryItem, RagQueryResponse } from '../types/rag'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }
  return (await response.json()) as T
}

export async function queryRag(question: string, topK = 3): Promise<RagQueryResponse> {
  const response = await fetch(`${API_BASE_URL}/rag/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, top_k: topK }),
  })
  return parseResponse<RagQueryResponse>(response)
}

export async function submitRagFeedback(queryLogId: number, feedback: 'helpful' | 'not_helpful') {
  const response = await fetch(`${API_BASE_URL}/rag/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query_log_id: queryLogId, feedback }),
  })
  return parseResponse<{ query_log_id: number; message: string }>(response)
}

export async function fetchRagHistory(): Promise<RagQueryHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/rag/history`)
  return parseResponse<RagQueryHistoryItem[]>(response)
}

