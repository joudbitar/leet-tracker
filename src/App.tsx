import { useMemo, useState } from 'react'
import { CURRICULUM, TOTAL_PROBLEMS, PHASE_COUNTS } from './data/curriculum'
import { useProgress } from './hooks/useProgress'
import { useAuth } from './hooks/useAuth'
import { ProgressBar } from './components/ProgressBar'
import { WeekSection } from './components/WeekSection'
import { TopicSidebar } from './components/TopicSidebar'
import { AuthModal } from './components/AuthModal'

const FAANG_TARGET = new Date('2026-07-15T00:00:00')

function getDaysUntil(target: Date): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function getCurrentWeekId(): string | null {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  for (let i = CURRICULUM.length - 1; i >= 0; i--) {
    const w = CURRICULUM[i]
    const start = new Date(w.startDate)
    start.setHours(0, 0, 0, 0)
    if (now >= start) {
      const end = new Date(start)
      end.setDate(end.getDate() + 7)
      if (now < end) return w.id
      return w.id
    }
  }
  return CURRICULUM[0].id
}

function computeStreak(curriculum: typeof CURRICULUM, checked: Set<string>): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  let currentIdx = 0
  for (let i = CURRICULUM.length - 1; i >= 0; i--) {
    const start = new Date(CURRICULUM[i].startDate)
    start.setHours(0, 0, 0, 0)
    if (now >= start) {
      currentIdx = i
      break
    }
  }

  let streak = 0
  for (let i = currentIdx; i >= 0; i--) {
    const week = curriculum[i]
    const allDone = week.problems.every(p => checked.has(p.id))
    if (allDone) {
      streak++
    } else {
      if (i === currentIdx) continue
      break
    }
  }
  return streak
}

export default function App() {
  const { session, user, initializing, signInWithGoogle, signOut } = useAuth()
  const { checked, notes, collapsed, loading, toggleProblem, setNote, toggleCollapsed } = useProgress(session)
  const [authModalOpen, setAuthModalOpen] = useState(false)

  const currentWeekId = useMemo(() => getCurrentWeekId(), [])
  const daysUntilFaang = getDaysUntil(FAANG_TARGET)
  const streak = useMemo(() => computeStreak(CURRICULUM, checked), [checked])

  const totalDone = checked.size
  const phase1Done = CURRICULUM.filter(w => w.phase === 1).flatMap(w => w.problems).filter(p => checked.has(p.id)).length
  const phase2Done = CURRICULUM.filter(w => w.phase === 2).flatMap(w => w.problems).filter(p => checked.has(p.id)).length
  const phase3Done = CURRICULUM.filter(w => w.phase === 3).flatMap(w => w.problems).filter(p => checked.has(p.id)).length

  const isCollapsed = (weekId: string) => {
    const hasData = localStorage.getItem('leet-tracker-collapsed') !== null
    if (!hasData) return weekId !== currentWeekId
    return collapsed.has(weekId)
  }

  const phases = [1, 2, 3] as const
  const phaseLabels = { 1: 'Phase 1 — Foundation', 2: 'Phase 2 — Core Patterns', 3: 'Phase 3 — FAANG Level' }
  const phaseDone = { 1: phase1Done, 2: phase2Done, 3: phase3Done }
  const phaseColors = { 1: '#72A449', 2: '#4a7ab5', 3: '#9b59b6' }

  const handleAttemptCheck = session ? undefined : () => setAuthModalOpen(true)

  if (initializing || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f0f0f' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-top">
          <div className="header-brand">
            <h1 className="app-title">LeetTracker</h1>
            <span className="app-subtitle">NeetCode 150 · 31 weeks · free for everyone</span>
          </div>
          <div className="header-stats">
            <div className="countdown-box">
              <span className="countdown-num">{daysUntilFaang}</span>
              <span className="countdown-label">days until FAANG apps open</span>
            </div>
            <div className="streak-box">
              <span className="streak-num">{streak}</span>
              <span className="streak-label">week streak 🔥</span>
            </div>
            <div className="user-box">
              {user ? (
                <>
                  <span className="user-email">{user.email}</span>
                  <button className="signout-btn" onClick={() => signOut()}>Sign out</button>
                </>
              ) : (
                <button className="signout-btn" onClick={() => setAuthModalOpen(true)}>Sign in</button>
              )}
            </div>
          </div>
        </div>

        <div className="overall-progress">
          <ProgressBar
            label="Overall Progress"
            done={totalDone}
            total={TOTAL_PROBLEMS}
            color="#72A449"
          />
        </div>

        <div className="phase-progress-grid">
          {phases.map(phase => (
            <ProgressBar
              key={phase}
              label={phaseLabels[phase]}
              done={phaseDone[phase]}
              total={PHASE_COUNTS[phase]}
              color={phaseColors[phase]}
            />
          ))}
        </div>
      </header>

      {/* Main content */}
      <div className="app-body">
        <main className="curriculum-main">
          {phases.map(phase => (
            <section key={phase} className="phase-section">
              <h2 className="phase-title" style={{ color: phaseColors[phase] }}>
                {phaseLabels[phase]}
              </h2>
              {CURRICULUM.filter(w => w.phase === phase).map(week => (
                <WeekSection
                  key={week.id}
                  week={week}
                  checked={checked}
                  notes={notes}
                  isCurrentWeek={week.id === currentWeekId}
                  isCollapsed={isCollapsed(week.id)}
                  onToggleProblem={toggleProblem}
                  onNoteChange={setNote}
                  onToggleCollapsed={toggleCollapsed}
                  onAttemptCheck={handleAttemptCheck}
                />
              ))}
            </section>
          ))}
        </main>

        <aside className="sidebar">
          <TopicSidebar checked={checked} />
        </aside>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSignIn={() => { signInWithGoogle(); setAuthModalOpen(false) }}
      />
    </div>
  )
}
