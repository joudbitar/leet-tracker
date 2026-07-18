import { Fragment, useState } from 'react'
import { PATTERNS, PROBLEMS, CORE_TOTAL, type Confidence } from '../data/problems'
import { isSolved, type Entries, type Plan } from '../lib/plan'
import type { Profile } from '../hooks/useProfile'
import { ProblemRow } from './ProblemRow'

interface Props {
  plan: Plan
  entries: Entries
  profile: Profile
  onProfile: (p: Partial<Profile>) => void
  onConfidence: (id: string, c: Confidence | null, resetClock?: boolean) => void
  onNote: (id: string, note: string) => void
  onComplexity: (id: string, time: string | null, space: string | null) => void
}

const STATUS_COPY: Record<Plan['status'], string> = {
  'no-date': '',
  'done': 'done',
  'past-date': 'target date passed',
  'on-track': 'on track',
  'behind': 'behind, this week grew',
  'insane': 'godspeed',
}

export function PlanView({ plan, entries, profile, onProfile, onConfidence, onNote, onComplexity }: Props) {
  const [dateDraft, setDateDraft] = useState(profile.targetDate ?? '')
  const [editingDate, setEditingDate] = useState(false)
  const [shownWeeks, setShownWeeks] = useState(1)

  const rowProps = { onConfidence, onNote, onComplexity }
  const indexOf = (id: string) => PROBLEMS.findIndex(p => p.id === id) + 1
  const showDateForm = !profile.targetDate || editingDate

  const coreRemaining = PROBLEMS.filter(p => p.core && !isSolved(entries[p.id])).length

  // roadmap: where you are on the 18-pattern path
  const currentPattern = plan.remaining[0]?.pattern
  const clearedPatterns = PATTERNS.filter(pat => {
    const group = plan.pool.filter(p => p.pattern === pat)
    return group.length > 0 && group.every(p => isSolved(entries[p.id]))
  }).length
  const currentGroup = currentPattern ? plan.pool.filter(p => p.pattern === currentPattern) : []
  const currentDone = currentGroup.filter(p => isSolved(entries[p.id])).length

  const dateBanner = showDateForm && (
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
        : <span className="subtext"> or just grind with no date</span>}
    </div>
  )

  const hiddenWeeks = plan.weeks.slice(shownWeeks)
  const hiddenCount = hiddenWeeks.reduce((s, w) => s + w.problems.length, 0)

  return (
    <div>
      {dateBanner}

      {profile.targetDate && !editingDate && (
        <div className="statusline">
          <b>{profile.targetDate}</b> · {plan.daysLeft} days left
          {plan.perWeek != null && <> · pace {plan.perWeek}/wk{plan.perDay != null && plan.perDay > 3 ? ` (${plan.perDay}/day)` : ''}</>}
          {STATUS_COPY[plan.status] && <> · <span className={`status status-${plan.status}`}>{STATUS_COPY[plan.status]}</span></>}
          {' '}· <a className="act" onClick={() => { setDateDraft(profile.targetDate!); setEditingDate(true) }}>edit date</a>
        </div>
      )}

      {currentPattern && (
        <div className="subtext legend">
          roadmap: {clearedPatterns} of {PATTERNS.length} patterns cleared · now:{' '}
          <b>{currentPattern.toLowerCase()}</b> ({currentDone}/{currentGroup.length}) ·{' '}
          <a href="#/patterns">full grid →</a>
        </div>
      )}

      {plan.suggestCore && (
        <div className="warn">
          {plan.perWeek}/wk is heavy. trim to the blind-75 core ({plan.remaining.length} left → {coreRemaining} left)?{' '}
          <a className="act" onClick={() => onProfile({ coreOnly: true })}>do it</a>
        </div>
      )}
      {profile.coreOnly && (
        <div className="subtext sectionnote">core-75 mode: pacing against the {CORE_TOTAL} essentials. the rest still count when solved. <a className="act" onClick={() => onProfile({ coreOnly: false })}>show all 150</a></div>
      )}

      {plan.reviews.length > 0 && (
        <>
          <div className="sectionhead">review due ({plan.reviews.length})</div>
          {plan.reviews.map(p => (
            <ProblemRow key={p.id} problem={p} index={indexOf(p.id)} entry={entries[p.id]} {...rowProps} />
          ))}
        </>
      )}

      {plan.status === 'done' && <div className="subtext sectionnote">nothing left.</div>}
      {plan.weeks.slice(0, shownWeeks).map((week, wi) => (
        <div key={week.label + wi}>
          <div className="sectionhead">
            {week.label === 'this week'
              ? `this week (${Math.min(plan.solvedThisWeek, plan.thisWeekQuota)} of ${plan.thisWeekQuota} done)`
              : week.label === 'next up'
                ? `next up · ${plan.solvedThisWeek} solved this week`
                : `${week.label} (${week.problems.length})`}
          </div>
          {week.problems.map((p, i) => {
            const group = plan.pool.filter(g => g.pattern === p.pattern)
            const done = group.filter(g => isSolved(entries[g.id])).length
            return (
              <Fragment key={p.id}>
                {(i === 0 || week.problems[i - 1].pattern !== p.pattern) && (
                  <div className="patternhead">
                    {p.pattern.toLowerCase()} <span className="subtext">{done}/{group.length}</span>
                  </div>
                )}
                <ProblemRow problem={p} index={indexOf(p.id)} entry={entries[p.id]} {...rowProps} />
              </Fragment>
            )
          })}
          {wi === 0 && week.label === 'this week' && plan.nextUp.length === 0 && plan.status !== 'done' && (
            <div className="subtext sectionnote">quota done. anything below is pulling ahead.</div>
          )}
        </div>
      ))}

      {hiddenWeeks.length > 0 && (
        <a className="morelink" onClick={() => setShownWeeks(n => n + 1)}>
          more ({hiddenCount} problems)
        </a>
      )}
    </div>
  )
}
