import { useEffect, useMemo, useState } from 'react'
import { PROBLEMS, TOTAL } from './data/problems'
import { buildPlan, isSolved } from './lib/plan'
import { hasFirebase } from './lib/firebase'
import { useAuth } from './hooks/useAuth'
import { useProgress } from './hooks/useProgress'
import { useProfile } from './hooks/useProfile'
import { useBoardPush } from './hooks/useBoard'
import { PlanView } from './components/PlanView'
import { PatternsView } from './components/PatternsView'
import { NotesView } from './components/NotesView'
import { BoardView } from './components/BoardView'
import { AuthModal } from './components/AuthModal'

type View = 'plan' | 'patterns' | 'notes' | 'board'

const VIEWS: { key: View; label: string }[] = [
  { key: 'plan', label: 'plan' },
  { key: 'patterns', label: 'patterns' },
  { key: 'notes', label: 'notes' },
  { key: 'board', label: 'board' },
]

function viewFromHash(): View {
  const h = window.location.hash.replace('#/', '').replace('#', '')
  return (VIEWS.some(v => v.key === h) ? h : 'plan') as View
}

export default function App() {
  const { user, initializing, signInWithGoogle, signOut } = useAuth()
  const { entries, loading, syncError, setConfidence, setNote, setComplexity, recordGuess } = useProgress(user)
  const { profile, update } = useProfile(user)
  const [view, setView] = useState<View>(viewFromHash)
  const [authOpen, setAuthOpen] = useState(false)

  useBoardPush(user, entries, profile)

  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const plan = useMemo(
    () => buildPlan(entries, profile.targetDate, profile.coreOnly),
    [entries, profile.targetDate, profile.coreOnly]
  )
  const solvedTotal = useMemo(() => PROBLEMS.filter(p => isSolved(entries[p.id])).length, [entries])

  const rowProps = {
    onConfidence: setConfidence,
    onNote: setNote,
    onComplexity: setComplexity,
    onGuess: recordGuess,
  }

  return (
    <div className="page">
      <div className="topbar">
        <a className="brand" href="#/">
          <span className="logo">λ</span> <b>leet-tracker</b>
        </a>
        <span className="topnav">
          {VIEWS.map((v, i) => (
            <span key={v.key}>
              {i > 0 && ' | '}
              <a className={view === v.key ? 'nav nav-on' : 'nav'} href={`#/${v.key}`}>{v.label}</a>
            </span>
          ))}
        </span>
        <span className="topright">
          {solvedTotal}/{TOTAL}
          {' · '}
          {hasFirebase ? (
            user ? (
              <>
                {profile.displayName || user.email}{' '}
                <a className="nav" onClick={() => signOut()}>logout</a>
              </>
            ) : (
              <a className="nav" onClick={() => setAuthOpen(true)}>login</a>
            )
          ) : (
            'local'
          )}
        </span>
      </div>

      <div className="content">
        {initializing || loading ? (
          <div className="subtext sectionnote">loading…</div>
        ) : (
          <>
            {syncError && <div className="warn">sync failing. progress is safe in this browser.</div>}
            {!user && hasFirebase && view !== 'board' && (
              <div className="subtext sectionnote">
                progress saves to this browser. <a className="act" onClick={() => setAuthOpen(true)}>sign in</a> to sync + compete.
              </div>
            )}
            {view === 'plan' && (
              <PlanView plan={plan} entries={entries} profile={profile} onProfile={update} {...rowProps} />
            )}
            {view === 'patterns' && <PatternsView entries={entries} />}
            {view === 'notes' && <NotesView entries={entries} />}
            {view === 'board' && (
              <BoardView user={user} profile={profile} onProfile={update} onSignIn={() => setAuthOpen(true)} />
            )}
          </>
        )}
      </div>

      <div className="footer subtext">
        neetcode 150 · pick a date, it does the math · <a href="https://github.com/joudbitar/leet-tracker" target="_blank" rel="noopener noreferrer">source</a>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSignIn={() => { signInWithGoogle(); setAuthOpen(false) }} />
    </div>
  )
}
