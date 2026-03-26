import type { ApproveSampleResponse, AuditEvent, Sample } from '../types/samples'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed with status ${response.status}`)
  }
  return (await response.json()) as T
}

export async function fetchSamples(query: string): Promise<Sample[]> {
  const params = new URLSearchParams()
  if (query.trim()) {
    params.set('q', query.trim())
  }
  const url = `${API_BASE_URL}/samples${params.toString() ? `?${params}` : ''}`
  const response = await fetch(url)
  return parseResponse<Sample[]>(response)
}

export async function fetchSampleById(sampleId: number): Promise<Sample> {
  const response = await fetch(`${API_BASE_URL}/samples/${sampleId}`)
  return parseResponse<Sample>(response)
}

export async function approveSample(
  sampleId: number,
  actor = 'demo_reviewer',
): Promise<ApproveSampleResponse> {
  const response = await fetch(`${API_BASE_URL}/samples/${sampleId}/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actor }),
  })
  return parseResponse<ApproveSampleResponse>(response)
}

export async function fetchAuditLog(): Promise<AuditEvent[]> {
  const response = await fetch(`${API_BASE_URL}/audit-log`)
  return parseResponse<AuditEvent[]>(response)
}

