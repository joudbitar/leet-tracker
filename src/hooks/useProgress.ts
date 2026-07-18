import { useState, useCallback, useEffect, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { LEGACY_ID_MAP, PROBLEM_BY_ID, type Confidence } from '../data/problems'
import { EMPTY_ENTRY, type Entries, type Entry } from '../lib/plan'

const STORAGE_KEY = 'lt-entries-v2'
const V1_CHECKED_KEY = 'leet-tracker-progress'
const V1_NOTES_KEY = 'leet-tracker-notes'

function migrateV1(): Entries {
  const entries: Entries = {}
  try {
    const checked = new Set(JSON.parse(localStorage.getItem(V1_CHECKED_KEY) ?? '[]') as string[])
    const notes = JSON.parse(localStorage.getItem(V1_NOTES_KEY) ?? '{}') as Record<string, string>
    for (const oldId of new Set([...checked, ...Object.keys(notes)])) {
      const id = LEGACY_ID_MAP[oldId] ?? oldId
      if (!PROBLEM_BY_ID.has(id)) continue
      entries[id] = {
        ...EMPTY_ENTRY,
        ...entries[id],
        confidence: checked.has(oldId) ? 'clean' : (entries[id]?.confidence ?? null),
        solvedAt: checked.has(oldId) ? new Date().toISOString() : (entries[id]?.solvedAt ?? null),
        note: notes[oldId] || entries[id]?.note || '',
      }
    }
  } catch { /* ignore corrupt v1 data */ }
  return entries
}

function loadLocal(): Entries {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Entries
  } catch { /* fall through */ }
  const migrated = migrateV1()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
  return migrated
}

function saveLocal(entries: Entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

interface Row {
  problem_id: string
  checked: boolean
  note: string
  confidence: Confidence | null
  solved_at: string | null
  guessed_pattern: string | null
  guess_correct: boolean | null
  time_complexity: string | null
  space_complexity: string | null
}

function rowToEntry(r: Row): Entry {
  return {
    confidence: r.confidence ?? (r.checked ? 'clean' : null),
    note: r.note ?? '',
    solvedAt: r.solved_at,
    guessedPattern: r.guessed_pattern,
    guessCorrect: r.guess_correct,
    timeComplexity: r.time_complexity,
    spaceComplexity: r.space_complexity,
  }
}

function entryToRow(userId: string, id: string, e: Entry) {
  return {
    user_id: userId,
    problem_id: id,
    checked: e.confidence != null,
    note: e.note,
    confidence: e.confidence,
    solved_at: e.solvedAt,
    guessed_pattern: e.guessedPattern,
    guess_correct: e.guessCorrect,
    time_complexity: e.timeComplexity,
    space_complexity: e.spaceComplexity,
    updated_at: new Date().toISOString(),
  }
}

function isEmpty(e: Entry): boolean {
  return e.confidence == null && !e.note && e.guessedPattern == null
}

export function useProgress(session: Session | null) {
  const [entries, setEntries] = useState<Entries>(loadLocal)
  const [loading, setLoading] = useState(false)
  const [syncError, setSyncError] = useState(false)

  const entriesRef = useRef(entries)
  useEffect(() => { entriesRef.current = entries }, [entries])

  const noteDebounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // On login: pull server rows, push local-only work up, server wins elsewhere.
  useEffect(() => {
    if (!session || !supabase) return
    let cancelled = false

    async function sync() {
      setLoading(true)
      const { data, error } = await supabase!
        .from('progress')
        .select('problem_id, checked, note, confidence, solved_at, guessed_pattern, guess_correct, time_complexity, space_complexity')
        .eq('user_id', session!.user.id)

      if (cancelled) return
      if (error) {
        console.error('Failed to fetch progress:', error)
        setSyncError(true)
        setLoading(false)
        return
      }

      const merged: Entries = {}
      const serverIds = new Set<string>()
      for (const row of (data ?? []) as Row[]) {
        const id = LEGACY_ID_MAP[row.problem_id] ?? row.problem_id
        if (!PROBLEM_BY_ID.has(id)) continue
        serverIds.add(id)
        const e = rowToEntry(row)
        if (!isEmpty(e) || !merged[id]) merged[id] = e
      }
      const localOnly: Record<string, Entry> = {}
      for (const [id, e] of Object.entries(entriesRef.current)) {
        if (!serverIds.has(id) && !isEmpty(e)) {
          merged[id] = e
          localOnly[id] = e
        }
      }
      setEntries(merged)
      saveLocal(merged)
      setLoading(false)

      const upserts = Object.entries(localOnly).map(([id, e]) => entryToRow(session!.user.id, id, e))
      if (upserts.length) {
        const { error: upErr } = await supabase!
          .from('progress')
          .upsert(upserts, { onConflict: 'user_id,problem_id' })
        if (upErr) { console.error('Failed to push local progress:', upErr); setSyncError(true) }
      }
    }

    sync()
    return () => { cancelled = true }
  }, [session])

  const push = useCallback((id: string, entry: Entry) => {
    if (!session || !supabase) return
    supabase
      .from('progress')
      .upsert(entryToRow(session.user.id, id, entry), { onConflict: 'user_id,problem_id' })
      .then(({ error }) => {
        if (error) { console.error('Failed to sync:', error); setSyncError(true) }
      })
  }, [session])

  const patch = useCallback((id: string, partial: Partial<Entry>, debounceNote = false) => {
    setEntries(prev => {
      const entry: Entry = { ...EMPTY_ENTRY, ...prev[id], ...partial }
      const next = { ...prev, [id]: entry }
      saveLocal(next)
      if (debounceNote) {
        clearTimeout(noteDebounceRef.current[id])
        noteDebounceRef.current[id] = setTimeout(() => push(id, entriesRef.current[id]), 600)
      } else {
        push(id, entry)
      }
      return next
    })
  }, [push])

  /** Set (or re-set after a review re-solve) how a solve went. null = unsolve. */
  const setConfidence = useCallback((id: string, confidence: Confidence | null) => {
    patch(id, { confidence, solvedAt: confidence ? new Date().toISOString() : null })
  }, [patch])

  const setNote = useCallback((id: string, note: string) => {
    patch(id, { note }, true)
  }, [patch])

  const setComplexity = useCallback((id: string, time: string | null, space: string | null) => {
    patch(id, { timeComplexity: time, spaceComplexity: space })
  }, [patch])

  const recordGuess = useCallback((id: string, pattern: string) => {
    const actual = PROBLEM_BY_ID.get(id)?.pattern
    patch(id, {
      guessedPattern: pattern,
      guessCorrect: pattern === 'skipped' ? null : pattern === actual,
    })
  }, [patch])

  return { entries, loading, syncError, setConfidence, setNote, setComplexity, recordGuess }
}
