import { useState } from 'react'
import { PATTERNS, type Confidence, type Problem } from '../data/problems'
import { daysAgo, isReviewDue, EMPTY_ENTRY, type Entry } from '../lib/plan'

const COMPLEXITIES = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)']

interface Props {
  problem: Problem
  index: number
  entry?: Entry
  onConfidence: (id: string, c: Confidence | null) => void
  onNote: (id: string, note: string) => void
  onComplexity: (id: string, time: string | null, space: string | null) => void
  onGuess: (id: string, pattern: string) => void
}

export function ProblemRow({ problem, index, entry = EMPTY_ENTRY, onConfidence, onNote, onComplexity, onGuess }: Props) {
  const [guessOpen, setGuessOpen] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)

  const solved = entry.confidence != null
  const due = isReviewDue(entry, new Date())
  const needsGuess = !solved && entry.guessedPattern == null

  function handleTitleClick(e: React.MouseEvent) {
    if (needsGuess) {
      e.preventDefault()
      setGuessOpen(o => !o)
    }
    // solved or already-guessed: plain link behavior
  }

  function pickGuess(pattern: string) {
    onGuess(problem.id, pattern)
    setGuessOpen(false)
    window.open(problem.url, '_blank', 'noopener')
  }

  function toggleConfidence(c: Confidence) {
    // clicking the active level un-solves; on a due review any click re-rates and resets the clock
    onConfidence(problem.id, entry.confidence === c && !due ? null : c)
  }

  return (
    <div className="row">
      <div className="rowline">
        <span className="rank">{index}.</span>
        <span className={`arrow ${solved ? `arrow-${entry.confidence}` : ''}`}>▲</span>
        <a
          className={`title ${solved ? 'title-solved' : ''}`}
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleTitleClick}
        >
          {problem.name}
        </a>
        <span className={`diff diff-${problem.difficulty.toLowerCase()}`}>{problem.difficulty.toLowerCase()}</span>
        {due && <span className="due">review due</span>}
      </div>

      <div className="subtext">
        {solved ? (
          <>
            <span>{problem.pattern.toLowerCase()}</span>
            {entry.guessedPattern && entry.guessedPattern !== 'skipped' && (
              <span className={entry.guessCorrect ? 'guess-right' : 'guess-wrong'}>
                {entry.guessCorrect ? ' ✓ guessed' : ` ✗ guessed ${entry.guessedPattern.toLowerCase()}`}
              </span>
            )}
            {(entry.timeComplexity || entry.spaceComplexity) && (
              <span> | {entry.timeComplexity ?? '?'} / {entry.spaceComplexity ?? '?'}</span>
            )}
            {entry.solvedAt && (
              <span> | {due ? `solved with ${entry.confidence} ` : ''}{daysAgo(entry.solvedAt)}</span>
            )}
          </>
        ) : (
          <span>pattern: ?</span>
        )}
        {' | '}
        {(['clean', 'hints', 'solution'] as Confidence[]).map(c => (
          <a
            key={c}
            className={`act ${entry.confidence === c && !due ? 'act-on' : ''}`}
            onClick={() => toggleConfidence(c)}
          >
            {due ? `re-solved ${c}` : c}
          </a>
        ))}
        <a className={`act ${entry.note ? 'act-on' : ''}`} onClick={() => setNoteOpen(o => !o)}>
          note{entry.note ? '*' : ''}
        </a>
      </div>

      {guessOpen && (
        <div className="guessbox">
          <span className="guesslabel">pattern?</span>
          {PATTERNS.map(p => (
            <a key={p} className="chip" onClick={() => pickGuess(p)}>{p.toLowerCase()}</a>
          ))}
          <a className="chip chip-skip" onClick={() => pickGuess('skipped')}>skip →</a>
        </div>
      )}

      {noteOpen && (
        <div className="notebox">
          <textarea
            className="noteinput"
            placeholder="approach, the gotcha, what you'd tell yourself next time…"
            value={entry.note}
            onChange={e => onNote(problem.id, e.target.value)}
            rows={2}
          />
          <div className="cxrow">
            <span className="guesslabel">time</span>
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
            <span className="guesslabel">space</span>
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
