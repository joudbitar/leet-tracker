import { useEffect, useRef } from 'react'
import type { User } from 'firebase/auth'
import { doc, setDoc, collection, query, where, limit, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { PROBLEMS } from '../data/problems'
import { isSolved, startOfWeek, type Entries } from '../lib/plan'
import type { Profile } from './useProfile'

/** local-date key for the Monday of this week, e.g. "2026-07-13" */
export function weekKey(now = new Date()): string {
  const m = startOfWeek(now)
  return `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}-${String(m.getDate()).padStart(2, '0')}`
}

export interface BoardRow {
  displayName: string
  solved: number
}

// Each user maintains their own public board/{uid} doc: { displayName, weekStart,
// solved, show }. The board is just a query over docs with this week's key.
export function useBoardPush(user: User | null, entries: Entries, profile: Profile) {
  const lastPushed = useRef('')

  useEffect(() => {
    if (!user || !db) return
    const wk = weekKey()
    const weekStartMs = startOfWeek(new Date()).getTime()
    const solved = PROBLEMS.filter(p => {
      const e = entries[p.id]
      return isSolved(e) && e.solvedAt != null && new Date(e.solvedAt).getTime() >= weekStartMs
    }).length

    const payload = {
      displayName: profile.displayName,
      weekStart: wk,
      solved,
      show: profile.showOnLeaderboard,
    }
    const key = JSON.stringify(payload)
    if (key === lastPushed.current || !payload.displayName) return

    const t = setTimeout(() => {
      setDoc(doc(db!, 'board', user.uid), payload)
        .then(() => { lastPushed.current = key })
        .catch(e => console.error('Board push failed:', e))
    }, 800)
    return () => clearTimeout(t)
  }, [user, entries, profile])
}

export async function fetchWeeklyBoard(): Promise<BoardRow[]> {
  if (!db) return []
  const q = query(collection(db, 'board'), where('weekStart', '==', weekKey()), limit(200))
  const snap = await getDocs(q)
  return snap.docs
    .map(d => d.data() as { displayName: string; solved: number; show: boolean })
    .filter(r => r.show !== false && r.displayName && r.solved > 0)
    .sort((a, b) => b.solved - a.solved || a.displayName.localeCompare(b.displayName))
    .slice(0, 100)
    .map(r => ({ displayName: r.displayName, solved: r.solved }))
}
