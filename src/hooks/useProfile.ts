import { useState, useCallback, useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

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
function shortName(session: Session): string {
  const full = (session.user.user_metadata?.full_name as string | undefined)
    ?? session.user.email?.split('@')[0]
    ?? 'anon'
  const parts = full.trim().split(/\s+/)
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0]
}

export function useProfile(session: Session | null) {
  const [profile, setProfile] = useState<Profile>(loadLocal)
  const profileRef = useRef(profile)
  useEffect(() => { profileRef.current = profile }, [profile])

  useEffect(() => {
    if (!session || !supabase) return
    let cancelled = false

    async function sync() {
      const { data, error } = await supabase!
        .from('profiles')
        .select('display_name, target_date, core_only, show_on_leaderboard')
        .eq('user_id', session!.user.id)
        .maybeSingle()
      if (cancelled) return
      if (error) {
        console.error('Failed to fetch profile:', error)
        return
      }
      if (data) {
        const merged: Profile = {
          displayName: data.display_name || shortName(session!),
          // server wins when set; otherwise keep what was chosen while logged out
          targetDate: data.target_date ?? profileRef.current.targetDate,
          coreOnly: data.core_only,
          showOnLeaderboard: data.show_on_leaderboard,
        }
        setProfile(merged)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        if (!data.target_date && merged.targetDate) upsert(merged)
      } else {
        const fresh: Profile = { ...profileRef.current, displayName: shortName(session!) }
        setProfile(fresh)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
        upsert(fresh)
      }
    }

    function upsert(p: Profile) {
      supabase!
        .from('profiles')
        .upsert({
          user_id: session!.user.id,
          display_name: p.displayName,
          target_date: p.targetDate,
          core_only: p.coreOnly,
          show_on_leaderboard: p.showOnLeaderboard,
        }, { onConflict: 'user_id' })
        .then(({ error }) => { if (error) console.error('Failed to save profile:', error) })
    }

    sync()
    return () => { cancelled = true }
  }, [session])

  const update = useCallback((partial: Partial<Profile>) => {
    setProfile(prev => {
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      if (session && supabase) {
        supabase
          .from('profiles')
          .upsert({
            user_id: session.user.id,
            display_name: next.displayName || shortName(session),
            target_date: next.targetDate,
            core_only: next.coreOnly,
            show_on_leaderboard: next.showOnLeaderboard,
          }, { onConflict: 'user_id' })
          .then(({ error }) => { if (error) console.error('Failed to save profile:', error) })
      }
      return next
    })
  }, [session])

  return { profile, update }
}
