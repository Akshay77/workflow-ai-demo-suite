type QueryPanelProps = {
  question: string
  onQuestionChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function QueryPanel({ question, onQuestionChange, onSubmit, isLoading }: QueryPanelProps) {
  return (
    <div className="card">
      <h2>Ask Breeding Assistant</h2>
      <p className="muted">Ask about traits, trials, regions, or season performance.</p>
      <div className="query-panel">
        <textarea
          rows={4}
          placeholder="e.g. Which notes mention sweetness and firmness in North region?"
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
        />
        <button className="button-primary" onClick={onSubmit} disabled={isLoading || !question.trim()}>
          {isLoading ? 'Querying...' : 'Run Query'}
        </button>
      </div>
    </div>
  )
}

