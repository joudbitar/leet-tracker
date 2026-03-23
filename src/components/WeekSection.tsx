import type { Week } from '../data/curriculum'
import { ProblemRow } from './ProblemRow'

interface WeekSectionProps {
  week: Week
  checked: Set<string>
  notes: Record<string, string>
  isCurrentWeek: boolean
  isCollapsed: boolean
  onToggleProblem: (id: string) => void
  onNoteChange: (id: string, text: string) => void
  onToggleCollapsed: (weekId: string) => void
  onAttemptCheck?: () => void
}

const PHASE_COLOR: Record<number, string> = {
  1: '#72A449',
  2: '#4a7ab5',
  3: '#9b59b6',
}

export function WeekSection({
  week,
  checked,
  notes,
  isCurrentWeek,
  isCollapsed,
  onToggleProblem,
  onNoteChange,
  onToggleCollapsed,
  onAttemptCheck,
}: WeekSectionProps) {
  const done = week.problems.filter(p => checked.has(p.id)).length
  const total = week.problems.length
  const allDone = done === total

  return (
    <div className={`week-section ${isCurrentWeek ? 'week-current' : ''} ${allDone ? 'week-done' : ''}`}>
      <button
        className="week-header"
        onClick={() => onToggleCollapsed(week.id)}
      >
        <div className="week-header-left">
          <span className="week-chevron" style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
            <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="week-number">Week {week.number}</span>
          <span className="week-date">{week.dateRange}</span>
          <span
            className="week-topic-badge"
            style={{ borderColor: PHASE_COLOR[week.phase], color: PHASE_COLOR[week.phase] }}
          >
            {week.topic}
          </span>
          {isCurrentWeek && <span className="current-badge">CURRENT</span>}
        </div>
        <div className="week-header-right">
          <span className="week-progress-text">{done}/{total}</span>
          <div className="week-mini-bar">
            <div
              className="week-mini-fill"
              style={{ width: `${(done / total) * 100}%`, background: PHASE_COLOR[week.phase] }}
            />
          </div>
        </div>
      </button>
      {!isCollapsed && (
        <div className="week-problems">
          {week.problems.map(problem => (
            <ProblemRow
              key={problem.id}
              problem={problem}
              checked={checked.has(problem.id)}
              note={notes[problem.id] || ''}
              onToggle={onToggleProblem}
              onNoteChange={onNoteChange}
              onAttemptCheck={onAttemptCheck}
            />
          ))}
        </div>
      )}
    </div>
  )
}
