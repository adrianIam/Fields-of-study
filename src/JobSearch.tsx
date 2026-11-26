import { useEffect, useMemo, useRef, useState } from 'react'
import jobTitles from './job-titles.txt?raw'

type Pathway = { role: string; description: string }
type Domain = { id: string; name: string; subdomains: { name: string; fields: string[] }[] }
export type JobLocation = {
  domainIdx: number
  subIdx: number
  fieldIdx: number
  field: string
  label: string
  description: string
}
type Job = { title: string; locations: JobLocation[] }

// Keep future descriptions here, keyed by job title. Existing pathway
// descriptions remain in their original specialisations.
const JOB_DESCRIPTIONS: Record<string, string> = {}

function cleanTitle(title: string) {
  return title.replace(/&amp;/gi, '&').replace(/&nbsp;/gi, ' ').trim().replace(/\s+/g, ' ')
}
function jobKey(title: string) {
  return cleanTitle(title).toLowerCase()
}
export function buildJobIndex(domains: Domain[], pathways: Record<string, Record<string, Pathway[]>>) {
  const index = new Map<string, Job>()
  function getJob(raw: string) {
    const title = cleanTitle(raw)
    const key = jobKey(title)
    let job = index.get(key)
    if (!job) {
      job = { title, locations: [] }
      index.set(key, job)
    }
    return job
  }

  // Index the actual tree rather than maintaining a second list of pathways.
  domains.forEach((domain, domainIdx) => {
    domain.subdomains.forEach((sub, subIdx) => {
      sub.fields.forEach((field, fieldIdx) => {
        for (const pathway of pathways[domain.id]?.[field] ?? []) {
          const job = getJob(pathway.role)
          job.locations.push({
            domainIdx, subIdx, fieldIdx, field,
            label: [domain.name, sub.name, field].join(' › '),
            description: pathway.description,
          })
        }
      })
    })
  })
  for (const title of jobTitles.split(/\r?\n/)) {
    if (cleanTitle(title)) getJob(title)
  }
  return Array.from(index.values()).sort((a, b) => a.title.localeCompare(b.title))
}

const PAGE_SIZE = 100
export default function JobSearch({ jobs, onClose, onNavigate }: {
  jobs: Job[]
  onClose: () => void
  onNavigate: (location: JobLocation) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const results = useMemo(() => {
    const terms = jobKey(query).split(' ').filter(Boolean)
    return jobs.filter(job => terms.every(term => jobKey(job.title).includes(term)))
  }, [jobs, query])
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    element.showModal()
    search.current?.focus()
    return () => { if (element.open) element.close() }
  }, [])
  useEffect(() => { if (list.current) list.current.scrollTop = 0 }, [page, query])

  const buttonStyle = {
    border: '1px solid #334155', borderRadius: 8, background: '#15152d',
    color: '#e2e8f0', padding: '8px 12px', cursor: 'pointer', fontFamily: 'inherit',
  }
  return (
    <dialog ref={dialog} aria-labelledby="job-search-title"
      onCancel={event => { event.preventDefault(); onClose() }}
      onClick={event => { if (event.target === event.currentTarget) onClose() }}
      style={{
        boxSizing: 'border-box', padding: 0, width: 'min(760px, calc(100vw - 32px))',
        maxHeight: 'calc(100dvh - 32px)', border: '1px solid #334155', borderRadius: 16,
        background: '#0d0d28', color: '#e2e8f0', fontFamily: 'Outfit, sans-serif',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7)', overflow: 'hidden', margin: 'auto',
      }}>
      <style>{'dialog::backdrop { background: rgba(3, 3, 15, 0.75); }'}</style>
      <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100dvh - 36px)' }}>
        <header style={{ padding: 20, borderBottom: '1px solid #25253d' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <h2 id="job-search-title" style={{ margin: 0, fontSize: 22 }}>Search by job</h2>
            <button type="button" aria-label="Close job search" onClick={onClose} style={buttonStyle}>×</button>
          </div>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '10px 0' }}>
            Search job titles or select a specialisation to explore its employment pathways.
          </p>
          <input ref={search} type="search" aria-label="Search job titles" placeholder="Enter a job title..."
            value={query} onChange={event => { setQuery(event.target.value); setPage(0) }}
            style={{ boxSizing: 'border-box', width: '100%', padding: 12, borderRadius: 8, border: '1px solid #475569', background: '#060612', color: '#f1f5f9', fontSize: 15, fontFamily: 'inherit' }} />
          <p role="status" style={{ margin: '10px 0 0', color: '#94a3b8', fontSize: 12 }}>
            {results.length.toLocaleString()} {results.length === 1 ? 'job' : 'jobs'} found
          </p>
        </header>
        <div ref={list} style={{ overflowY: 'auto', minHeight: 0, flex: '1 1 auto', padding: '0 20px' }}>
          {results.length === 0 && <p style={{ color: '#94a3b8' }}>No matching jobs. Try another search.</p>}
          {results.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map(job => (
            <article key={jobKey(job.title)} style={{ padding: '14px 0', borderBottom: '1px solid #25253d' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 15, color: '#f1f5f9' }}>{job.title}</h3>
              {job.locations.length ? job.locations.map(location => (
                <div key={location.domainIdx + ':' + location.subIdx + ':' + location.fieldIdx + ':' + location.description} style={{ margin: '8px 0' }}>
                  <button type="button" onClick={() => onNavigate(location)}
                    style={{ ...buttonStyle, textAlign: 'left', color: '#7dd3fc', fontSize: 12, background: 'transparent' }}>
                    {location.label} ›
                  </button>
                  <p style={{ color: '#94a3b8', fontSize: 12, margin: '5px 0', lineHeight: 1.5 }}>{location.description}</p>
                </div>
              )) : (
                <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>
                  {JOB_DESCRIPTIONS[job.title] ?? 'Job description to be added.'}
                </p>
              )}
            </article>
          ))}
        </div>
        {pages > 1 && <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid #25253d', gap: 8 }}>
          <button type="button" disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ ...buttonStyle, opacity: page === 0 ? 0.45 : 1 }}>Previous</button>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>Page {page + 1} of {pages}</span>
          <button type="button" disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} style={{ ...buttonStyle, opacity: page >= pages - 1 ? 0.45 : 1 }}>Next</button>
        </footer>}
      </div>
    </dialog>
  )
}
