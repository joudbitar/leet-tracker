import { PATTERNS, PROBLEMS, type Confidence } from '../data/problems'
import { isSolved, type Entries } from '../lib/plan'
import { ProblemRow } from './ProblemRow'

interface Props {
  entries: Entries
  onConfidence: (id: string, c: Confidence | null) => void
  onNote: (id: string, note: string) => void
  onComplexity: (id: string, time: string | null, space: string | null) => void
  onGuess: (id: string, pattern: string) => void
}

export function ProblemsView({ entries, ...rowProps }: Props) {
  let index = 0
  return (
    <div>
      {PATTERNS.map(pattern => {
        const group = PROBLEMS.filter(p => p.pattern === pattern)
        const done = group.filter(p => isSolved(entries[p.id])).length
        return (
          <div key={pattern}>
            <div className="sectionhead">
              {pattern.toLowerCase()} ({done}/{group.length})
            </div>
            {group.map(p => (
              <ProblemRow key={p.id} problem={p} index={++index} entry={entries[p.id]} {...rowProps} />
            ))}
          </div>
        )
      })}
    </div>
  )
}
