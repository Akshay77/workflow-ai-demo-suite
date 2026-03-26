import { Link } from 'react-router-dom'
import './overview.css'

type DemoCardProps = {
  title: string
  whatItIs: string
  demonstrates: string[]
  whyRelevant: string
  to: string
  cta: string
}

function DemoCard({ title, whatItIs, demonstrates, whyRelevant, to, cta }: DemoCardProps) {
  return (
    <div className="overview-card">
      <div className="overview-card-header">
        <h2>{title}</h2>
        <p className="muted">{whatItIs}</p>
      </div>
      <div className="overview-card-body">
        <div className="overview-label">What it demonstrates</div>
        <ul className="overview-list">
          {demonstrates.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="overview-label overview-label-spaced">Why it’s relevant</div>
        <p className="muted">{whyRelevant}</p>
      </div>
      <div className="overview-card-footer">
        <Link className="button-primary" to={to}>
          {cta}
        </Link>
      </div>
    </div>
  )
}

export function OverviewPage() {
  return (
    <section className="overview-page">
      <div className="overview-hero">
        <h1>Demo Suite Overview</h1>
        <p className="muted">
          A focused demo suite built as a role-aligned exploration of <strong>internal R&amp;D workflow tooling</strong>{' '}
          and <strong>grounded assistant UX</strong>. It uses seeded synthetic data and is intentionally scoped to
          highlight API-centric integration patterns, governed actions, and traceable outputs.
        </p>
        <p className="muted">
          Portfolio demo using seeded synthetic data; examples are illustrative.
        </p>
      </div>

      <div className="overview-grid">
        <DemoCard
          title="Sample Workflow API Demo"
          whatItIs="A small workflow UI over sample records: search, inspect, and approve. Approvals write an audit event."
          demonstrates={[
            'API-driven workflow tooling',
            'Stateful UI patterns (table → detail)',
            'Governed actions + audit logging',
            'FastAPI + SQLAlchemy + Postgres persistence',
          ]}
          whyRelevant="Demonstrates how to ship internal workflow tooling where approvals are traceable and system behavior is auditable."
          to="/samples"
          cta="Open Samples Demo"
        />

        <DemoCard
          title="Breeding Knowledge Assistant Demo"
          whatItIs="A grounded question-answer experience over seeded breeding notes. Responses include cited source snippets and retrieved doc IDs."
          demonstrates={[
            'Grounded assistant UX (answer + citations)',
            'Lightweight retrieval + grounding',
            'Query history + feedback persistence',
            'API-centric full-stack integration',
          ]}
          whyRelevant="Demonstrates retrieval-augmented decision support where outputs remain anchored to internal notes and can be reviewed."
          to="/assistant"
          cta="Open Assistant Demo"
        />
      </div>

      <div className="overview-section">
        <h2>JD Mapping (role-aligned themes)</h2>
        <p className="muted">
          The themes below describe the capabilities demonstrated by this suite. They are framed as role-aligned
          explorations, not claims about any specific internal system.
        </p>
        <div className="mapping-grid">
          <div className="mapping-card">
            <div className="overview-label">API-driven workflow tooling</div>
            <p className="muted">
              CRUD-lite workflows with search, detail views, and an approval action backed by a typed API.
            </p>
          </div>
          <div className="mapping-card">
            <div className="overview-label">Auditability / governed internal systems</div>
            <p className="muted">
              Governed actions record actor + metadata to an audit log, surfaced in the UI for traceability.
            </p>
          </div>
          <div className="mapping-card">
            <div className="overview-label">Grounded assistant experiences</div>
            <p className="muted">
              Answers are returned alongside cited snippets so users can review what the response was grounded on.
            </p>
          </div>
          <div className="mapping-card">
            <div className="overview-label">Retrieval-augmented decision support</div>
            <p className="muted">
              Lightweight retrieval surfaces the most relevant notes and returns document IDs and source snippets.
            </p>
          </div>
          <div className="mapping-card">
            <div className="overview-label">Full-stack engineering</div>
            <p className="muted">
              End-to-end implementation across UI state, typed API calls, routers/services, persistence, seeding, and Docker.
            </p>
          </div>
        </div>
      </div>

      <div className="overview-section">
        <h2>Architecture / Signals</h2>
        <div className="signal-grid">
          <div className="signal-card">
            <div className="overview-label">Frontend</div>
            <ul className="overview-list">
              <li>React + TypeScript + Vite</li>
              <li>Page routing: Overview / Samples / Assistant</li>
              <li>Typed API layer + predictable loading/error states</li>
            </ul>
          </div>
          <div className="signal-card">
            <div className="overview-label">Backend</div>
            <ul className="overview-list">
              <li>FastAPI routers: `/samples`, `/audit-log`, `/rag`</li>
              <li>SQLAlchemy models + Pydantic response schemas</li>
              <li>Seed scripts for deterministic demo data</li>
            </ul>
          </div>
          <div className="signal-card">
            <div className="overview-label">Persistence + audit logging</div>
            <ul className="overview-list">
              <li>Postgres storage for workflow + assistant history</li>
              <li>Audit events for governed actions</li>
              <li>RAG query logs + feedback persistence</li>
            </ul>
          </div>
          <div className="signal-card">
            <div className="overview-label">Retrieval / grounding flow</div>
            <ul className="overview-list">
              <li>Retrieve top notes (lightweight keyword scoring)</li>
              <li>Return answer + cited snippets + doc IDs</li>
              <li>Designed for grounded decision support UX</li>
            </ul>
          </div>
          <div className="signal-card">
            <div className="overview-label">Mock data / seeded workflows</div>
            <ul className="overview-list">
              <li>20–30 synthetic notes for assistant demo</li>
              <li>15–20 synthetic samples for workflow demo</li>
              <li>Idempotent seeding for repeatable demos</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

