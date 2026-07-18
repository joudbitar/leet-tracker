import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import type { Profile } from '../hooks/useProfile'

interface Row {
  display_name: string
  solved: number
}

interface Props {
  session: Session | null
  profile: Profile
  onProfile: (p: Partial<Profile>) => void
  onSignIn: () => void
}

export function BoardView({ session, profile, onProfile, onSignIn }: Props) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.rpc('weekly_leaderboard').then(({ data, error }) => {
      if (error) {
        console.error('Leaderboard failed:', error)
        setError(true)
      } else {
        setRows((data as Row[]) ?? [])
      }
    })
  }, [])

  if (!supabase) return <div className="subtext sectionnote">running without a backend — no board in local mode.</div>
  if (error) return <div className="subtext sectionnote">board unavailable. (self-hosting? run the v2 migration in supabase/migrations.)</div>
  if (rows === null) return <div className="subtext sectionnote">loading…</div>

  return (
    <div>
      <div className="statusline">
        <b>this week</b> · resets monday · every confidence level counts — honesty is free
      </div>
      {rows.length === 0 ? (
        <div className="subtext sectionnote">nobody has solved anything this week. first blood is right there.</div>
      ) : (
        rows.map((r, i) => (
          <div className="row" key={r.display_name + i}>
            <div className="rowline">
              <span className="rank">{i + 1}.</span>
              <span className={i === 0 ? 'boardname boardtop' : 'boardname'}>{r.display_name}</span>
              <span className="subtext"> — {r.solved} solved</span>
            </div>
          </div>
        ))
      )}
      <div className="subtext sectionnote">
        {session ? (
          <a className="act" onClick={() => onProfile({ showOnLeaderboard: !profile.showOnLeaderboard })}>
            {profile.showOnLeaderboard ? 'hide me from the board' : 'show me on the board'}
          </a>
        ) : (
          <a className="act" onClick={onSignIn}>sign in</a>
        )}
        {!session && ' to compete'}
      </div>
    </div>
  )
}
