import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut, type User } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [initializing, setInitializing] = useState(!!auth)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, u => {
      setUser(u)
      setInitializing(false)
    })
  }, [])

  const signInWithGoogle = () => {
    if (auth) signInWithPopup(auth, googleProvider).catch(e => console.error('Sign-in failed:', e))
  }

  const signOut = () => { if (auth) fbSignOut(auth) }

  return { user, initializing, signInWithGoogle, signOut }
}
