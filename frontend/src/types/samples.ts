export type Sample = {
  id: number
  sample_id: string
  cross_id: string
  trait_score: number | null
  assay_status: string
  lab_result: string | null
  approval_status: string
  approved_by: string | null
  created_at: string
}

export type AuditEvent = {
  id: number
  entity_type: string
  entity_id: string
  action: string
  actor: string
  metadata_json: Record<string, unknown>
  created_at: string
}

export type ApproveSampleResponse = {
  sample: Sample
  message: string
}

