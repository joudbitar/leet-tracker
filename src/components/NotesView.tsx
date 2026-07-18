import { PATTERNS, PROBLEMS } from '../data/problems'
import type { Entries } from '../lib/plan'

interface Props {
  entries: Entries
}

// per-pattern cheatsheet: every note + complexity you've written, in one place
export function NotesView({ entries }: Props) {
  const withNotes = PROBLEMS.filter(p => {
    const e = entries[p.id]
    return e && (e.note || e.timeComplexity || e.spaceComplexity)
  })

  if (withNotes.length === 0) {
    return <div className="subtext sectionnote">no notes yet. write one when you solve — future-you at the whiteboard will thank you.</div>
  }

  return (
    <div>
      {PATTERNS.map(pattern => {
        const group = withNotes.filter(p => p.pattern === pattern)
        if (group.length === 0) return null
        return (
          <div key={pattern}>
            <div className="sectionhead">{pattern.toLowerCase()}</div>
            {group.map(p => {
              const e = entries[p.id]!
              return (
                <div className="row" key={p.id}>
                  <div className="rowline">
                    <a className="title" href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                    {(e.timeComplexity || e.spaceComplexity) && (
                      <span className="subtext"> {e.timeComplexity ?? '?'} / {e.spaceComplexity ?? '?'}</span>
                    )}
                  </div>
                  {e.note && <div className="notetext">{e.note}</div>}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
