import type { RagSourceSnippet } from '../../types/rag'
import { SourceSnippetCard } from './SourceSnippetCard'

type AnswerCardProps = {
  answer: string | null
  sources: RagSourceSnippet[]
  isLoading: boolean
  error: string | null
  feedbackStatus: 'idle' | 'saved_helpful' | 'saved_not_helpful'
  feedbackLoading: boolean
  onFeedback: (value: 'helpful' | 'not_helpful') => void
}

export function AnswerCard({
  answer,
  sources,
  isLoading,
  error,
  feedbackStatus,
  feedbackLoading,
  onFeedback,
}: AnswerCardProps) {
  return (
    <div className="card">
      <h2>Answer</h2>

      {isLoading && <div className="panel-state">Loading answer...</div>}
      {!isLoading && error && <div className="panel-state panel-error">Failed to query: {error}</div>}
      {!isLoading && !error && !answer && (
        <div className="panel-state">Submit a question to see grounded answer and citations.</div>
      )}

      {!isLoading && !error && answer && (
        <>
          <div className="answer-text">{answer}</div>
          <div className="feedback-row">
            <button
              className="button-secondary"
              disabled={feedbackLoading}
              onClick={() => onFeedback('helpful')}
            >
              Helpful
            </button>
            <button
              className="button-secondary"
              disabled={feedbackLoading}
              onClick={() => onFeedback('not_helpful')}
            >
              Not Helpful
            </button>
            <span className="muted">
              {feedbackStatus === 'saved_helpful' && 'Feedback saved: helpful'}
              {feedbackStatus === 'saved_not_helpful' && 'Feedback saved: not helpful'}
            </span>
          </div>

          <h3 className="subheading">Cited Sources</h3>
          {sources.length === 0 ? (
            <div className="panel-state">No source snippets returned.</div>
          ) : (
            <div className="source-list">
              {sources.map((source) => (
                <SourceSnippetCard key={source.doc_id} source={source} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

