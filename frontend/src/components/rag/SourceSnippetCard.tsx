import type { RagSourceSnippet } from '../../types/rag'

type SourceSnippetCardProps = {
  source: RagSourceSnippet
}

export function SourceSnippetCard({ source }: SourceSnippetCardProps) {
  return (
    <div className="source-card">
      <div className="source-title">
        {source.doc_id} - {source.title}
      </div>
      <div className="source-snippet">{source.snippet}</div>
    </div>
  )
}

