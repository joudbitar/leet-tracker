import { useState, useCallback, useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'leet-tracker-progress'
const NOTES_KEY = 'leet-tracker-notes'
const COLLAPSED_KEY = 'leet-tracker-collapsed'

function loadChecked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

function loadNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, string>
  } catch {
    return {}
  }
}

function loadCollapsed(): Set<string> {
  try {
    const raw = localStorage.getItem(COLLAPSED_KEY)
    if (!raw) return new Set<string>()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set<string>()
  }
}

export function useProgress(session: Session | null) {
  const [checked, setChecked] = useState<Set<string>>(loadChecked)
  const [notes, setNotes] = useState<Record<string, string>>(loadNotes)
  const [collapsed, setCollapsed] = useState<Set<string>>(loadCollapsed)
  const [loading, setLoading] = useState(true)

  // Stable refs so callbacks always read latest state without going stale
  const checkedRef = useRef(checked)
  useEffect(() => { checkedRef.current = checked }, [checked])

  const notesRef = useRef(notes)
  useEffect(() => { notesRef.current = notes }, [notes])

  // Debounce timer for note saves
  const noteDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch progress from Supabase on session change (handles null → signed-in transition)
  useEffect(() => {
    if (!session) {
      setChecked(new Set())
      setNotes({})
      setLoading(false)
      return
    }

    async function fetchProgress() {
      setLoading(true)
      const { data, error } = await supabase
        .from('progress')
        .select('problem_id, checked, note')
        .eq('user_id', session!.user.id)

      if (error) {
        console.error('Failed to fetch progress:', error)
      } else if (data) {
        const newChecked = new Set<string>()
        const newNotes: Record<string, string> = {}
        for (const row of data) {
          if (row.checked) newChecked.add(row.problem_id)
          if (row.note) newNotes[row.problem_id] = row.note
        }
        setChecked(newChecked)
        setNotes(newNotes)
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...newChecked]))
        localStorage.setItem(NOTES_KEY, JSON.stringify(newNotes))
      }

      setLoading(false)
    }

    fetchProgress()
  }, [session])

  const toggleProblem = useCallback((id: string) => {
    if (!session) return
    setChecked(prev => {
      const next = new Set(prev)
      const isChecked = next.has(id)
      if (isChecked) {
        next.delete(id)
      } else {
        next.add(id)
      }
      // Optimistic local update
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))

      // Full upsert payload — include current note so a brand-new row has both fields
      const currentNote = notesRef.current[id] ?? ''
      supabase.from('progress').upsert(
        { user_id: session.user.id, problem_id: id, checked: !isChecked, note: currentNote, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,problem_id' }
      ).then(({ error }) => {
        if (error) console.error('Failed to sync toggle:', error)
      })

      return next
    })
  }, [session])

  const setNote = useCallback((id: string, text: string) => {
    setNotes(prev => {
      const next = { ...prev, [id]: text }
      if (!text) delete next[id]
      // Optimistic local update
      localStorage.setItem(NOTES_KEY, JSON.stringify(next))

      if (session) {
        // Debounce: wait 600ms after last keystroke before syncing
        if (noteDebounceRef.current) clearTimeout(noteDebounceRef.current)
        noteDebounceRef.current = setTimeout(() => {
          const isChecked = checkedRef.current.has(id)
          supabase.from('progress').upsert(
            { user_id: session.user.id, problem_id: id, checked: isChecked, note: text, updated_at: new Date().toISOString() },
            { onConflict: 'user_id,problem_id' }
          ).then(({ error }) => {
            if (error) console.error('Failed to sync note:', error)
          })
        }, 600)
      }

      return next
    })
  }, [session])

  const toggleCollapsed = useCallback((weekId: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(weekId)) {
        next.delete(weekId)
      } else {
        next.add(weekId)
      }
      localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  return { checked, notes, collapsed, loading, toggleProblem, setNote, toggleCollapsed }
}
