import { useState, useCallback, useEffect, useRef } from 'react'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
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

function isEmpty(e: Entry): boolean {
  return e.confidence == null && !e.note && e.guessedPattern == null
}

// All of a user's progress lives in one doc: users/{uid} → { entries: { <problemId>: Entry } }.
// One read per login, one merge-write per action.
export function useProgress(user: User | null) {
  const [entries, setEntries] = useState<Entries>(loadLocal)
  const [loading, setLoading] = useState(false)
  const [syncError, setSyncError] = useState(false)

  const entriesRef = useRef(entries)
  useEffect(() => { entriesRef.current = entries }, [entries])

  const noteDebounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // On login: pull the server doc, push local-only work up, server wins elsewhere.
  useEffect(() => {
    if (!user || !db) return
    let cancelled = false

    async function sync() {
      setLoading(true)
      try {
        const snap = await getDoc(doc(db!, 'users', user!.uid))
        if (cancelled) return
        const server = (snap.data()?.entries ?? {}) as Entries

        const merged: Entries = {}
        for (const [id, e] of Object.entries(server)) {
          if (PROBLEM_BY_ID.has(id)) merged[id] = { ...EMPTY_ENTRY, ...e }
        }
        const localOnly: Entries = {}
        for (const [id, e] of Object.entries(entriesRef.current)) {
          if (!merged[id] && !isEmpty(e)) {
            merged[id] = e
            localOnly[id] = e
          }
        }
        setEntries(merged)
        saveLocal(merged)
        setLoading(false)

        if (Object.keys(localOnly).length) {
          await setDoc(doc(db!, 'users', user!.uid), { entries: localOnly }, { merge: true })
        }
      } catch (e) {
        if (cancelled) return
        console.error('Sync failed:', e)
        setSyncError(true)
        setLoading(false)
      }
    }

    sync()
    return () => { cancelled = true }
  }, [user])

  const push = useCallback((id: string, entry: Entry) => {
    if (!user || !db) return
    setDoc(doc(db, 'users', user.uid), { entries: { [id]: entry } }, { merge: true })
      .catch(e => { console.error('Sync failed:', e); setSyncError(true) })
  }, [user])

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

  /**
   * Set how a solve went. null = unsolve. Correcting the rating on an
   * already-solved problem keeps the original solve date (so it isn't
   * re-counted this week); resetClock (review re-rates, fresh solves)
   * stamps it now.
   */
  const setConfidence = useCallback((id: string, confidence: Confidence | null, resetClock = false) => {
    const prev = entriesRef.current[id]
    const solvedAt = confidence
      ? (resetClock || !prev?.solvedAt ? new Date().toISOString() : prev.solvedAt)
      : null
    patch(id, { confidence, solvedAt })
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
