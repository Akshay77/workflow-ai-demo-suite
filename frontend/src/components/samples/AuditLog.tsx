import type { AuditEvent } from '../../types/samples'

type AuditLogProps = {
  events: AuditEvent[]
  isLoading: boolean
  error: string | null
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

export function AuditLog({ events, isLoading, error }: AuditLogProps) {
  if (isLoading) {
    return <div className="panel-state">Loading audit log...</div>
  }

  if (error) {
    return <div className="panel-state panel-error">Failed to load audit log: {error}</div>
  }

  if (events.length === 0) {
    return <div className="panel-state">No audit events yet.</div>
  }

  return (
    <ul className="audit-list">
      {events.map((event) => (
        <li key={event.id}>
          <div className="audit-title">
            {event.action} {event.entity_type} #{event.entity_id}
          </div>
          <div className="audit-meta">
            by {event.actor} at {formatDate(event.created_at)}
          </div>
        </li>
      ))}
    </ul>
  )
}

