import type { Sample } from '../../types/samples'

type SampleTableProps = {
  samples: Sample[]
  selectedSampleId: number | null
  onRowClick: (sampleId: number) => void
  isLoading: boolean
  error: string | null
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString()
}

export function SampleTable({
  samples,
  selectedSampleId,
  onRowClick,
  isLoading,
  error,
}: SampleTableProps) {
  if (isLoading) {
    return <div className="panel-state">Loading samples...</div>
  }

  if (error) {
    return <div className="panel-state panel-error">Failed to load samples: {error}</div>
  }

  if (samples.length === 0) {
    return <div className="panel-state">No samples found.</div>
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Sample ID</th>
            <th>Cross ID</th>
            <th>Trait Score</th>
            <th>Assay Status</th>
            <th>Approval Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample) => (
            <tr
              key={sample.id}
              className={sample.id === selectedSampleId ? 'selected' : ''}
              onClick={() => onRowClick(sample.id)}
            >
              <td>{sample.sample_id}</td>
              <td>{sample.cross_id}</td>
              <td>{sample.trait_score ?? '-'}</td>
              <td>{sample.assay_status}</td>
              <td>{sample.approval_status}</td>
              <td>{formatDate(sample.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

