import { useEffect, useMemo, useState } from 'react'
import { fetchAuditLog, fetchSampleById, fetchSamples, approveSample } from '../api/samplesApi'
import { AuditLog } from '../components/samples/AuditLog'
import { SampleDetail } from '../components/samples/SampleDetail'
import { SampleTable } from '../components/samples/SampleTable'
import type { AuditEvent, Sample } from '../types/samples'
import './samples.css'

export function SamplesPage() {
  const [searchInput, setSearchInput] = useState('')
  const [activeQuery, setActiveQuery] = useState('')

  const [samples, setSamples] = useState<Sample[]>([])
  const [samplesLoading, setSamplesLoading] = useState(true)
  const [samplesError, setSamplesError] = useState<string | null>(null)

  const [selectedSampleId, setSelectedSampleId] = useState<number | null>(null)
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [approving, setApproving] = useState(false)

  const [auditLog, setAuditLog] = useState<AuditEvent[]>([])
  const [auditLoading, setAuditLoading] = useState(true)
  const [auditError, setAuditError] = useState<string | null>(null)

  async function loadSamples(query: string) {
    setSamplesLoading(true)
    setSamplesError(null)
    try {
      const data = await fetchSamples(query)
      setSamples(data)
      if (data.length === 0) {
        setSelectedSampleId(null)
        setSelectedSample(null)
      } else if (!data.some((sample) => sample.id === selectedSampleId)) {
        setSelectedSampleId(data[0].id)
      }
    } catch (error) {
      setSamplesError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setSamplesLoading(false)
    }
  }

  async function loadAuditLog() {
    setAuditLoading(true)
    setAuditError(null)
    try {
      setAuditLog(await fetchAuditLog())
    } catch (error) {
      setAuditError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setAuditLoading(false)
    }
  }

  async function loadSampleDetail(sampleId: number) {
    setDetailLoading(true)
    setDetailError(null)
    try {
      setSelectedSample(await fetchSampleById(sampleId))
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : 'Unknown error')
      setSelectedSample(null)
    } finally {
      setDetailLoading(false)
    }
  }

  useEffect(() => {
    loadSamples(activeQuery)
  }, [activeQuery])

  useEffect(() => {
    loadAuditLog()
  }, [])

  useEffect(() => {
    if (selectedSampleId !== null) {
      loadSampleDetail(selectedSampleId)
    }
  }, [selectedSampleId])

  async function handleApprove() {
    if (selectedSampleId === null) return
    setApproving(true)
    try {
      await approveSample(selectedSampleId)
      await Promise.all([loadSampleDetail(selectedSampleId), loadAuditLog(), loadSamples(activeQuery)])
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setApproving(false)
    }
  }

  const selectedSummary = useMemo(() => {
    if (!selectedSample) return 'No sample selected'
    return `${selectedSample.sample_id} (${selectedSample.cross_id})`
  }, [selectedSample])

  return (
    <section className="samples-page">
      <div className="samples-header">
        <div>
          <h1>Sample Workflow</h1>
          <p>Search and approve sample records with an audit trail.</p>
        </div>
        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault()
            setActiveQuery(searchInput)
          }}
        >
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search sample_id or cross_id"
          />
          <button type="submit" disabled={samplesLoading}>
            {samplesLoading ? 'Loading...' : 'Search'}
          </button>
        </form>
      </div>

      <div className="samples-grid">
        <div className="card">
          <h2>Sample Records</h2>
          <SampleTable
            samples={samples}
            selectedSampleId={selectedSampleId}
            onRowClick={setSelectedSampleId}
            isLoading={samplesLoading}
            error={samplesError}
          />
        </div>

        <div className="card">
          <h2>Selected: {selectedSummary}</h2>
          <SampleDetail
            sample={selectedSample}
            isLoading={detailLoading}
            error={detailError}
            isApproving={approving}
            onApprove={handleApprove}
          />
        </div>
      </div>

      <div className="card">
        <h2>Audit Log</h2>
        <AuditLog events={auditLog} isLoading={auditLoading} error={auditError} />
      </div>
    </section>
  )
}

