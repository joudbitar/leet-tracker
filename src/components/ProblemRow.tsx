import { useState } from 'react'
import type { Problem } from '../data/curriculum'

interface ProblemRowProps {
  problem: Problem
  checked: boolean
  note: string
  onToggle: (id: string) => void
  onNoteChange: (id: string, text: string) => void
  onAttemptCheck?: () => void
}

const DIFF_CLASS: Record<string, string> = {
  Easy: 'diff-easy',
  Medium: 'diff-medium',
  Hard: 'diff-hard',
}

export function ProblemRow({ problem, checked, note, onToggle, onNoteChange, onAttemptCheck }: ProblemRowProps) {
  const [noteOpen, setNoteOpen] = useState(false)

  return (
    <div className={`problem-row ${checked ? 'problem-checked' : ''}`}>
      <div className="problem-main">
        <button
          className={`checkbox ${checked ? 'checkbox-checked' : ''}`}
          onClick={() => onAttemptCheck ? onAttemptCheck() : onToggle(problem.id)}
          aria-label={checked ? 'Mark incomplete' : 'Mark complete'}
        >
          {checked && (
            <svg viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`problem-name ${checked ? 'problem-name-done' : ''}`}
        >
          {problem.name}
          <svg className="ext-icon" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2H2M10 2V10M10 2L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <span className={`difficulty-badge ${DIFF_CLASS[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        <button
          className={`note-toggle ${noteOpen || note ? 'note-toggle-active' : ''}`}
          onClick={() => setNoteOpen(o => !o)}
          title="Add note"
        >
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2h10v8l-3 2H2V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
            <path d="M5 5h4M5 7.5h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {(noteOpen || note) && (
        <div className="note-area">
          <textarea
            className="note-input"
            placeholder="Approach, trick, difficulty..."
            value={note}
            onChange={e => onNoteChange(problem.id, e.target.value)}
            rows={2}
          />
        </div>
      )}
    </div>
  )
}
