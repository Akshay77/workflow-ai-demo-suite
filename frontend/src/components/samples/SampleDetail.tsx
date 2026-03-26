import type { Sample } from '../../types/samples'

type SampleDetailProps = {
  sample: Sample | null
  isLoading: boolean
  error: string | null
  isApproving: boolean
  onApprove: () => void
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

export function SampleDetail({
  sample,
  isLoading,
  error,
  isApproving,
  onApprove,
}: SampleDetailProps) {
  if (isLoading) {
    return <div className="panel-state">Loading sample detail...</div>
  }

  if (error) {
    return <div className="panel-state panel-error">Failed to load sample: {error}</div>
  }

  if (!sample) {
    return <div className="panel-state">Select a sample row to view details.</div>
  }

  const canApprove = sample.approval_status !== 'APPROVED'

  return (
    <div className="detail-panel">
      <h3>Sample Detail</h3>
      <dl className="detail-grid">
        <dt>ID</dt>
        <dd>{sample.id}</dd>
        <dt>Sample ID</dt>
        <dd>{sample.sample_id}</dd>
        <dt>Cross ID</dt>
        <dd>{sample.cross_id}</dd>
        <dt>Trait Score</dt>
        <dd>{sample.trait_score ?? '-'}</dd>
        <dt>Assay Status</dt>
        <dd>{sample.assay_status}</dd>
        <dt>Lab Result</dt>
        <dd>{sample.lab_result ?? '-'}</dd>
        <dt>Approval Status</dt>
        <dd>{sample.approval_status}</dd>
        <dt>Approved By</dt>
        <dd>{sample.approved_by ?? '-'}</dd>
        <dt>Created At</dt>
        <dd>{formatDate(sample.created_at)}</dd>
      </dl>

      <button className="button-primary" onClick={onApprove} disabled={!canApprove || isApproving}>
        {isApproving ? 'Approving...' : canApprove ? 'Approve Sample' : 'Already Approved'}
      </button>
    </div>
  )
}

