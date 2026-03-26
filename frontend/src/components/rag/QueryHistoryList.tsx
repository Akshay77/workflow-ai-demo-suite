import type { RagQueryHistoryItem } from '../../types/rag'

type QueryHistoryListProps = {
  history: RagQueryHistoryItem[]
  isLoading: boolean
  error: string | null
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

export function QueryHistoryList({ history, isLoading, error }: QueryHistoryListProps) {
  return (
    <div className="card">
      <h2>Recent Query History</h2>
      {isLoading && <div className="panel-state">Loading query history...</div>}
      {!isLoading && error && (
        <div className="panel-state panel-error">Failed to load history: {error}</div>
      )}
      {!isLoading && !error && history.length === 0 && (
        <div className="panel-state">No query history yet.</div>
      )}
      {!isLoading && !error && history.length > 0 && (
        <ul className="history-list">
          {history.map((item) => (
            <li key={item.id}>
              <div className="history-question">{item.question}</div>
              <div className="history-meta">
                {formatDate(item.created_at)} | docs: {item.retrieved_doc_ids.join(', ') || '-'} | feedback:{' '}
                {item.feedback ?? 'none'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

