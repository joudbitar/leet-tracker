import { useState } from 'react'
import { type Confidence, type Problem } from '../data/problems'
import { daysAgo, isReviewDue, EMPTY_ENTRY, type Entry } from '../lib/plan'

const COMPLEXITIES = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)']

const CONFIDENCE_HINTS: Record<Confidence, string> = {
  clean: 'solved without help',
  hints: 'needed a hint or two',
  solution: 'read the solution. comes back for review in a week',
}

interface Props {
  problem: Problem
  index: number
  entry?: Entry
  onConfidence: (id: string, c: Confidence | null, resetClock?: boolean) => void
  onNote: (id: string, note: string) => void
  onComplexity: (id: string, time: string | null, space: string | null) => void
}

export function ProblemRow({ problem, index, entry = EMPTY_ENTRY, onConfidence, onNote, onComplexity }: Props) {
  const [noteOpen, setNoteOpen] = useState(false)
  const [confirmUnsolve, setConfirmUnsolve] = useState(false)

  const solved = entry.confidence != null
  const due = isReviewDue(entry, new Date())

  function toggleConfidence(c: Confidence) {
    if (entry.confidence === c && !due) {
      // clicking the active level = un-solve; that's data loss, so confirm inline
      setConfirmUnsolve(true)
      return
    }
    // fresh solves and due-review re-rates stamp now; corrections keep the old date
    onConfidence(problem.id, c, !solved || due)
  }

  return (
    <div className="row">
      <div className="rowline">
        <span className="rank">{index}.</span>
        <a
          className={`arrow ${solved ? `arrow-${entry.confidence}` : ''}`}
          title={solved ? 'unsolve' : 'mark solved clean'}
          onClick={() => (solved ? setConfirmUnsolve(true) : onConfidence(problem.id, 'clean', true))}
        >▲</a>
        <a
          className={`title ${solved ? 'title-solved' : ''}`}
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {problem.name}
        </a>
        <span className={`diff diff-${problem.difficulty.toLowerCase()}`}>{problem.difficulty.toLowerCase()}</span>
        {due && <span className="due">review due</span>}
      </div>

      <div className="subtext">
        {solved && (
          <>
            <span>{problem.pattern.toLowerCase()}</span>
            {(entry.timeComplexity || entry.spaceComplexity) && (
              <span> | {entry.timeComplexity ?? '?'} / {entry.spaceComplexity ?? '?'}</span>
            )}
            {entry.solvedAt && (
              <span> | {due ? `solved with ${entry.confidence} ` : ''}{daysAgo(entry.solvedAt)}</span>
            )}
            {' | '}
          </>
        )}
        {confirmUnsolve ? (
          <>
            <span className="confirm">unsolve? </span>
            <a className="act confirm" onClick={() => { onConfidence(problem.id, null); setConfirmUnsolve(false) }}>yes</a>
            <a className="act" onClick={() => setConfirmUnsolve(false)}>no</a>
          </>
        ) : (
          <>
            <span className="actlabel">{due ? 're-solved it?' : solved ? 'rated:' : 'solved it?'} </span>
            {(['clean', 'hints', 'solution'] as Confidence[]).map(c => (
              <a
                key={c}
                title={CONFIDENCE_HINTS[c]}
                className={`act ${entry.confidence === c && !due ? 'act-on' : ''}`}
                onClick={() => toggleConfidence(c)}
              >
                {c}
              </a>
            ))}
          </>
        )}
        <a className={`act ${entry.note ? 'act-on' : ''}`} onClick={() => setNoteOpen(o => !o)}>
          note{entry.note ? '*' : ''}
        </a>
      </div>

      {noteOpen && (
        <div className="notebox">
          <textarea
            className="noteinput"
            placeholder="approach, gotchas, complexity"
            value={entry.note}
            onChange={e => onNote(problem.id, e.target.value)}
            rows={2}
          />
          <div className="cxrow">
            <span className="cxlabel">time</span>
            {COMPLEXITIES.map(c => (
              <a
                key={c}
                className={`chip ${entry.timeComplexity === c ? 'chip-on' : ''}`}
                onClick={() => onComplexity(problem.id, entry.timeComplexity === c ? null : c, entry.spaceComplexity)}
              >
                {c}
              </a>
            ))}
          </div>
          <div className="cxrow">
            <span className="cxlabel">space</span>
            {COMPLEXITIES.map(c => (
              <a
                key={c}
                className={`chip ${entry.spaceComplexity === c ? 'chip-on' : ''}`}
                onClick={() => onComplexity(problem.id, entry.timeComplexity, entry.spaceComplexity === c ? null : c)}
              >
                {c}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
