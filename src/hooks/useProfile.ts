import { useState, useCallback, useEffect, useRef } from 'react'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const STORAGE_KEY = 'lt-profile-v2'

export interface Profile {
  displayName: string
  targetDate: string | null // YYYY-MM-DD
  coreOnly: boolean
  showOnLeaderboard: boolean
}

const DEFAULTS: Profile = { displayName: '', targetDate: null, coreOnly: false, showOnLeaderboard: true }

function loadLocal(): Profile {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') }
  } catch {
    return DEFAULTS
  }
}

/** "Joud Bitar" → "Joud B." — what everyone else sees on the board */
function shortName(user: User): string {
  const full = user.displayName ?? user.email?.split('@')[0] ?? 'anon'
  const parts = full.trim().split(/\s+/)
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0]
}

// Profile fields live on the same users/{uid} doc as progress, under `profile`.
export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile>(loadLocal)
  const profileRef = useRef(profile)
  useEffect(() => { profileRef.current = profile }, [profile])

  useEffect(() => {
    if (!user || !db) return
    let cancelled = false

    async function sync() {
      try {
        const snap = await getDoc(doc(db!, 'users', user!.uid))
        if (cancelled) return
        const server = (snap.data()?.profile ?? {}) as Partial<Profile>
        const merged: Profile = {
          displayName: server.displayName || shortName(user!),
          // server wins when set; otherwise keep what was chosen while logged out
          targetDate: server.targetDate ?? profileRef.current.targetDate,
          coreOnly: server.coreOnly ?? profileRef.current.coreOnly,
          showOnLeaderboard: server.showOnLeaderboard ?? true,
        }
        setProfile(merged)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        await setDoc(doc(db!, 'users', user!.uid), { profile: merged }, { merge: true })
      } catch (e) {
        if (!cancelled) console.error('Profile sync failed:', e)
      }
    }

    sync()
    return () => { cancelled = true }
  }, [user])

  const update = useCallback((partial: Partial<Profile>) => {
    setProfile(prev => {
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (user && db) {
        setDoc(doc(db, 'users', user.uid), { profile: next }, { merge: true })
          .catch(e => console.error('Profile save failed:', e))
      }
      return next
    })
  }, [user])

  return { profile, update }
}
