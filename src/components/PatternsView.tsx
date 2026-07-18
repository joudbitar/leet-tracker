import { PATTERNS, PROBLEMS } from '../data/problems'
import type { Entries } from '../lib/plan'

// mastery weights: a clean solve is mastery, a solution-read barely counts
const WEIGHT = { clean: 1, hints: 0.5, solution: 0.25 } as const

interface Props {
  entries: Entries
}

export function PatternsView({ entries }: Props) {
  const rows = PATTERNS.map(pattern => {
    const group = PROBLEMS.filter(p => p.pattern === pattern)
    const counts = { clean: 0, hints: 0, solution: 0, left: 0 }
    let score = 0
    for (const p of group) {
      const c = entries[p.id]?.confidence
      if (c) {
        counts[c]++
        score += WEIGHT[c]
      } else {
        counts.left++
      }
    }
    return { pattern, group, counts, mastery: score / group.length }
  })

  const total = PROBLEMS.length
  const overall = rows.reduce((s, r) => s + r.mastery * r.group.length, 0) / total

  return (
    <div>
      <div className="statusline">
        readiness <b>{Math.round(overall * 100)}%</b>
        <span className="subtext"> (clean = 100%, hints = 50%, solution = 25%)</span>
      </div>

      <table className="grid">
        <tbody>
          {rows.map(({ pattern, group, counts, mastery }) => (
            <tr key={pattern}>
              <td className="grid-name">{pattern.toLowerCase()}</td>
              <td className="grid-bar">
                <div className="bar">
                  {counts.clean > 0 && <div className="bar-clean" style={{ width: `${(counts.clean / group.length) * 100}%` }} />}
                  {counts.hints > 0 && <div className="bar-hints" style={{ width: `${(counts.hints / group.length) * 100}%` }} />}
                  {counts.solution > 0 && <div className="bar-solution" style={{ width: `${(counts.solution / group.length) * 100}%` }} />}
                </div>
              </td>
              <td className="grid-nums subtext">
                {counts.clean}c {counts.hints}h {counts.solution}s · {counts.left} left
              </td>
              <td className="grid-pct">{Math.round(mastery * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="subtext sectionnote">
        <span className="key key-clean" /> clean <span className="key key-hints" /> hints <span className="key key-solution" /> solution
      </div>
    </div>
  )
}
