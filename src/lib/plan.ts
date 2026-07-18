import { PROBLEMS, type Confidence, type Problem } from '../data/problems'

export interface Entry {
  confidence: Confidence | null
  note: string
  solvedAt: string | null
  guessedPattern: string | null // pattern name, or 'skipped'
  guessCorrect: boolean | null
  timeComplexity: string | null
  spaceComplexity: string | null
}

export type Entries = Record<string, Entry>

export const EMPTY_ENTRY: Entry = {
  confidence: null,
  note: '',
  solvedAt: null,
  guessedPattern: null,
  guessCorrect: null,
  timeComplexity: null,
  spaceComplexity: null,
}

// Days after solving before a shaky problem comes back around.
// 'clean' never does. Re-rating after a re-solve resets the clock.
export const REVIEW_DAYS: Record<Confidence, number | null> = {
  clean: null,
  hints: 14,
  solution: 7,
}

const DAY = 24 * 60 * 60 * 1000

export function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** Monday 00:00 of the week containing d — leaderboard + quota reset point */
export function startOfWeek(d: Date): Date {
  const x = startOfDay(d)
  const day = x.getDay() // 0 = Sunday
  x.setDate(x.getDate() - ((day + 6) % 7))
  return x
}

export function isSolved(e: Entry | undefined): boolean {
  return !!e?.confidence
}

export function reviewDueAt(e: Entry | undefined): number | null {
  if (!e?.confidence || !e.solvedAt) return null
  const days = REVIEW_DAYS[e.confidence]
  if (days == null) return null
  return new Date(e.solvedAt).getTime() + days * DAY
}

export function isReviewDue(e: Entry | undefined, now: Date): boolean {
  const due = reviewDueAt(e)
  return due != null && due <= now.getTime()
}

export type PlanStatus = 'no-date' | 'done' | 'past-date' | 'on-track' | 'behind' | 'insane'

export interface PlanWeek {
  label: string
  problems: Problem[]
}

export interface Plan {
  pool: Problem[]
  remaining: Problem[]
  reviews: Problem[]
  doneThisWeek: Problem[]
  solvedInPool: number
  solvedThisWeek: number
  thisWeekQuota: number
  nextUp: Problem[]
  /** the whole remaining path, chunked by week (single chunk when no date) */
  weeks: PlanWeek[]
  daysLeft: number | null
  perWeek: number | null
  perDay: number | null
  status: PlanStatus
  suggestCore: boolean
}

const INSANE_PER_WEEK = 50
const HEAVY_PER_WEEK = 25
const NO_DATE_WINDOW = 5

export function buildPlan(entries: Entries, targetDate: string | null, coreOnly: boolean, now = new Date()): Plan {
  const pool = coreOnly ? PROBLEMS.filter(p => p.core) : PROBLEMS
  const remaining = pool.filter(p => !isSolved(entries[p.id]))
  const reviews = pool.filter(p => isReviewDue(entries[p.id], now))
  const solvedInPool = pool.length - remaining.length

  const weekStart = startOfWeek(now).getTime()
  const doneThisWeek = pool.filter(p => {
    const e = entries[p.id]
    return isSolved(e) && e.solvedAt != null && new Date(e.solvedAt).getTime() >= weekStart
  })
  const solvedThisWeek = doneThisWeek.length

  let daysLeft: number | null = null
  let perWeek: number | null = null
  let perDay: number | null = null
  let thisWeekQuota: number
  let status: PlanStatus

  if (remaining.length === 0) {
    thisWeekQuota = solvedThisWeek
    status = 'done'
  } else if (!targetDate) {
    thisWeekQuota = solvedThisWeek + Math.min(NO_DATE_WINDOW, remaining.length)
    status = 'no-date'
  } else {
    const target = startOfDay(new Date(targetDate + 'T00:00:00')).getTime()
    const today = startOfDay(now).getTime()
    daysLeft = Math.max(0, Math.round((target - today) / DAY))

    if (daysLeft === 0) {
      thisWeekQuota = solvedThisWeek + remaining.length
      status = 'past-date'
    } else {
      perWeek = Math.ceil(remaining.length / (daysLeft / 7))
      perDay = Math.ceil(remaining.length / daysLeft)
      // Quota is computed from the start of this week so it stays stable all
      // week, then re-plans on Monday from whatever is actually left.
      const weeksSpan = Math.max(1, Math.ceil((target - weekStart) / (7 * DAY)))
      const remainingAtWeekStart = remaining.length + solvedThisWeek
      thisWeekQuota = Math.min(remainingAtWeekStart, Math.ceil(remainingAtWeekStart / weeksSpan))
      status = perWeek > INSANE_PER_WEEK ? 'insane' : solvedThisWeek >= thisWeekQuota ? 'on-track' : 'behind'
      if (status === 'behind' && solvedThisWeek + remaining.length > 0) {
        // behind only once the week is more spent than the quota is filled
        const weekFraction = (startOfDay(now).getTime() - weekStart) / (7 * DAY)
        if (solvedThisWeek >= thisWeekQuota * weekFraction) status = 'on-track'
      }
    }
  }

  const nextUp = remaining.slice(0, Math.max(0, thisWeekQuota - solvedThisWeek))
  const coreRemaining = PROBLEMS.filter(p => p.core && !isSolved(entries[p.id])).length
  const suggestCore =
    !coreOnly && perWeek != null && perWeek > HEAVY_PER_WEEK && coreRemaining < remaining.length

  // Lay the whole remaining path out at once — chunked into stable week
  // sections when there's a date, one flat list when there isn't. Chunks only
  // shift on the Monday re-plan (or a date change), never mid-week on a solve.
  const byIndex = (a: Problem, b: Problem) => PROBLEMS.indexOf(a) - PROBLEMS.indexOf(b)
  const weeks: PlanWeek[] = []
  if (!targetDate || remaining.length === 0) {
    // no date: flat path in HN-sized pages of 30
    const all = [...doneThisWeek, ...remaining].sort(byIndex)
    for (let i = 0; i < all.length; i += 30) {
      weeks.push({ label: i === 0 ? 'next up' : 'later', problems: all.slice(i, i + 30) })
    }
  } else {
    weeks.push({ label: 'this week', problems: [...doneThisWeek, ...nextUp].sort(byIndex) })
    const target = startOfDay(new Date(targetDate + 'T00:00:00')).getTime()
    let rest = remaining.slice(nextUp.length)
    let ws = weekStart + 7 * DAY
    let i = 0
    while (rest.length > 0) {
      const weeksLeftHere = Math.max(1, Math.ceil((target - ws) / (7 * DAY)))
      const n = Math.ceil(rest.length / weeksLeftHere)
      const d = new Date(ws)
      const label = i === 0
        ? 'next week'
        : `week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase()}`
      weeks.push({ label, problems: rest.slice(0, n) })
      rest = rest.slice(n)
      ws += 7 * DAY
      i++
    }
  }

  return {
    pool, remaining, reviews, doneThisWeek, solvedInPool, solvedThisWeek,
    thisWeekQuota, nextUp, weeks, daysLeft, perWeek, perDay, status, suggestCore,
  }
}

export function daysAgo(iso: string | null, now = new Date()): string {
  if (!iso) return ''
  const d = Math.floor((now.getTime() - new Date(iso).getTime()) / DAY)
  if (d <= 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}
