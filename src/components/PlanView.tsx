import { useState } from 'react'
import { PROBLEMS, CORE_TOTAL, type Confidence } from '../data/problems'
import { isSolved, type Entries, type Plan } from '../lib/plan'
import type { Profile } from '../hooks/useProfile'
import { ProblemRow } from './ProblemRow'

interface Props {
  plan: Plan
  entries: Entries
  profile: Profile
  onProfile: (p: Partial<Profile>) => void
  onConfidence: (id: string, c: Confidence | null) => void
  onNote: (id: string, note: string) => void
  onComplexity: (id: string, time: string | null, space: string | null) => void
  onGuess: (id: string, pattern: string) => void
}

const STATUS_COPY: Record<Plan['status'], string> = {
  'no-date': '',
  'done': 'done. all of it. go get the offer.',
  'past-date': 'target date passed — set a new one',
  'on-track': 'on track',
  'behind': 'behind — this week grew',
  'insane': 'godspeed.',
}

export function PlanView({ plan, entries, profile, onProfile, onConfidence, onNote, onComplexity, onGuess }: Props) {
  const [dateDraft, setDateDraft] = useState(profile.targetDate ?? '')
  const [editingDate, setEditingDate] = useState(false)

  const rowProps = { onConfidence, onNote, onComplexity, onGuess }
  const indexOf = (id: string) => PROBLEMS.findIndex(p => p.id === id) + 1
  const showDateForm = !profile.targetDate || editingDate

  const coreRemaining = PROBLEMS.filter(p => p.core && !isSolved(entries[p.id])).length

  return (
    <div>
      {showDateForm && (
        <div className="banner">
          <b>when's the interview?</b>{' '}
          <input
            type="date"
            className="dateinput"
            value={dateDraft}
            onChange={e => setDateDraft(e.target.value)}
          />{' '}
          <a className="act" onClick={() => { if (dateDraft) { onProfile({ targetDate: dateDraft }); setEditingDate(false) } }}>set</a>
          {profile.targetDate
            ? <>{' '}<a className="act" onClick={() => setEditingDate(false)}>cancel</a></>
            : <span className="subtext"> — or just grind, no date. the plan adapts either way.</span>}
        </div>
      )}

      <div className="statusline">
        {profile.targetDate && !editingDate && (
          <>
            <b>{profile.targetDate}</b> · {plan.daysLeft} days left ·{' '}
          </>
        )}
        {plan.remaining.length} to go
        {plan.perWeek != null && <> · pace {plan.perWeek}/wk{plan.perDay != null && plan.perDay > 3 ? ` (${plan.perDay}/day)` : ''}</>}
        {STATUS_COPY[plan.status] && <> · <span className={`status status-${plan.status}`}>{STATUS_COPY[plan.status]}</span></>}
        {profile.targetDate && !editingDate && (
          <>{' '}· <a className="act" onClick={() => { setDateDraft(profile.targetDate!); setEditingDate(true) }}>edit date</a></>
        )}
        {' '}· <a className={`act ${profile.coreOnly ? 'act-on' : ''}`} onClick={() => onProfile({ coreOnly: !profile.coreOnly })}>
          core-75: {profile.coreOnly ? 'on' : 'off'}
        </a>
      </div>

      <div className="subtext legend">
        rate each solve — <b>clean</b>: no help · <b>hints</b>: needed a nudge · <b>solution</b>: read the answer.
        shaky solves come back for review automatically.
      </div>

      {plan.suggestCore && (
        <div className="warn">
          {plan.perWeek}/wk is heavy. trim to the blind-75 core ({plan.remaining.length} left → {coreRemaining} left)?{' '}
          <a className="act" onClick={() => onProfile({ coreOnly: true })}>do it</a>
        </div>
      )}
      {profile.coreOnly && (
        <div className="subtext sectionnote">core-75 mode — pacing against the {CORE_TOTAL} essentials. the rest still count when solved.</div>
      )}

      {plan.reviews.length > 0 && (
        <>
          <div className="sectionhead">review due ({plan.reviews.length}) — re-solve, then re-rate</div>
          {plan.reviews.map(p => (
            <ProblemRow key={p.id} problem={p} index={indexOf(p.id)} entry={entries[p.id]} {...rowProps} />
          ))}
        </>
      )}

      <div className="sectionhead">
        {profile.targetDate
          ? `this week (${Math.min(plan.solvedThisWeek, plan.thisWeekQuota)} of ${plan.thisWeekQuota} done)`
          : `next up · ${plan.solvedThisWeek} solved this week`}
      </div>
      {(() => {
        // solved problems stay in the week view — shown upvoted, not vanished
        const weekList = [...plan.doneThisWeek, ...plan.nextUp].sort((a, b) => indexOf(a.id) - indexOf(b.id))
        if (weekList.length === 0) {
          return <div className="subtext sectionnote">{plan.status === 'done' ? 'nothing left. seriously.' : 'nothing due. rest, or pull ahead from the problems tab.'}</div>
        }
        return (
          <>
            {weekList.map(p => (
              <ProblemRow key={p.id} problem={p} index={indexOf(p.id)} entry={entries[p.id]} {...rowProps} />
            ))}
            {plan.nextUp.length === 0 && plan.status !== 'done' && (
              <div className="subtext sectionnote">week’s quota done. rest, or pull ahead from the problems tab.</div>
            )}
          </>
        )
      })()}
    </div>
  )
}
