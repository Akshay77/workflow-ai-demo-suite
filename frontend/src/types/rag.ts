export type RagSourceSnippet = {
  doc_id: string
  title: string
  snippet: string
}

export type RagQueryResponse = {
  answer: string
  sources: RagSourceSnippet[]
  retrieved_doc_ids: string[]
}

export type RagQueryHistoryItem = {
  id: number
  question: string
  answer: string
  retrieved_doc_ids: string[]
  feedback: string | null
  created_at: string
}

