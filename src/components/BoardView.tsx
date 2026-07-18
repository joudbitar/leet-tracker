import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { hasFirebase } from '../lib/firebase'
import { fetchWeeklyBoard, type BoardRow } from '../hooks/useBoard'
import type { Profile } from '../hooks/useProfile'

interface Props {
  user: User | null
  profile: Profile
  onProfile: (p: Partial<Profile>) => void
  onSignIn: () => void
}

export function BoardView({ user, profile, onProfile, onSignIn }: Props) {
  const [rows, setRows] = useState<BoardRow[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!hasFirebase) return
    fetchWeeklyBoard()
      .then(setRows)
      .catch(e => { console.error('Leaderboard failed:', e); setError(true) })
  }, [])

  if (!hasFirebase) return <div className="subtext sectionnote">no board in local mode.</div>
  if (error) return <div className="subtext sectionnote">board unavailable. try a refresh.</div>
  if (rows === null) return <div className="subtext sectionnote">loading…</div>

  return (
    <div>
      <div className="statusline">
        <b>this week</b> · resets monday · all ratings count
      </div>
      {rows.length === 0 ? (
        <div className="subtext sectionnote">nobody has solved anything this week.</div>
      ) : (
        rows.map((r, i) => (
          <div className="row" key={r.displayName + i}>
            <div className="rowline">
              <span className="rank">{i + 1}.</span>
              <span className={i === 0 ? 'boardname boardtop' : 'boardname'}>{r.displayName}</span>
              <span className="subtext"> · {r.solved} solved</span>
            </div>
          </div>
        ))
      )}
      <div className="subtext sectionnote">
        {user ? (
          <a className="act" onClick={() => onProfile({ showOnLeaderboard: !profile.showOnLeaderboard })}>
            {profile.showOnLeaderboard ? 'hide me from the board' : 'show me on the board'}
          </a>
        ) : (
          <a className="act" onClick={onSignIn}>sign in</a>
        )}
        {!user && ' to compete'}
      </div>
    </div>
  )
}
