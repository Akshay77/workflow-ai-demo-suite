import { useEffect, useState } from 'react'
import { fetchRagHistory, queryRag, submitRagFeedback } from '../api/ragApi'
import { AnswerCard } from '../components/rag/AnswerCard'
import { QueryHistoryList } from '../components/rag/QueryHistoryList'
import { QueryPanel } from '../components/rag/QueryPanel'
import type { RagQueryHistoryItem, RagSourceSnippet } from '../types/rag'
import './assistant.css'

export function AssistantPage() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<string | null>(null)
  const [sources, setSources] = useState<RagSourceSnippet[]>([])
  const [queryLoading, setQueryLoading] = useState(false)
  const [queryError, setQueryError] = useState<string | null>(null)

  const [history, setHistory] = useState<RagQueryHistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [currentQueryLogId, setCurrentQueryLogId] = useState<number | null>(null)

  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'saved_helpful' | 'saved_not_helpful'>(
    'idle',
  )

  async function loadHistory() {
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const data = await fetchRagHistory()
      setHistory(data)
      return data
    } catch (error) {
      setHistoryError(error instanceof Error ? error.message : 'Unknown error')
      return []
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  async function handleQuerySubmit() {
    if (!question.trim()) return
    setQueryLoading(true)
    setQueryError(null)
    setFeedbackStatus('idle')
    setCurrentQueryLogId(null)
    try {
      const result = await queryRag(question.trim())
      setAnswer(result.answer)
      setSources(result.sources)

      const latestHistory = await loadHistory()
      const matched = latestHistory.find(
        (item) => item.question === question.trim() && item.answer === result.answer,
      )
      setCurrentQueryLogId(matched?.id ?? null)
    } catch (error) {
      setQueryError(error instanceof Error ? error.message : 'Unknown error')
      setAnswer(null)
      setSources([])
    } finally {
      setQueryLoading(false)
    }
  }

  async function handleFeedback(value: 'helpful' | 'not_helpful') {
    if (currentQueryLogId === null) return
    setFeedbackLoading(true)
    try {
      await submitRagFeedback(currentQueryLogId, value)
      setFeedbackStatus(value === 'helpful' ? 'saved_helpful' : 'saved_not_helpful')
      await loadHistory()
    } catch (error) {
      setQueryError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setFeedbackLoading(false)
    }
  }

  return (
    <section className="assistant-page">
      <h1>Breeding Knowledge Assistant</h1>
      <p className="muted">Grounded answers from seeded breeding notes with citations.</p>

      <QueryPanel
        question={question}
        onQuestionChange={setQuestion}
        onSubmit={handleQuerySubmit}
        isLoading={queryLoading}
      />

      <AnswerCard
        answer={answer}
        sources={sources}
        isLoading={queryLoading}
        error={queryError}
        feedbackStatus={feedbackStatus}
        feedbackLoading={feedbackLoading || currentQueryLogId === null}
        onFeedback={handleFeedback}
      />

      <QueryHistoryList history={history} isLoading={historyLoading} error={historyError} />
    </section>
  )
}

