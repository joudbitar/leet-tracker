import { useEffect, useRef } from 'react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSignIn: () => void
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const cardStyle: React.CSSProperties = {
  borderRadius: 14,
  border: '1px solid #2a2a2a',
  backgroundColor: '#161616',
  padding: 28,
  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
  maxWidth: 400,
  width: '100%',
  position: 'relative',
  animation: 'authModalIn 200ms ease-out',
}

export function AuthModal({ isOpen, onClose, onSignIn }: AuthModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={overlayStyle}
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div style={cardStyle}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#555',
            padding: 4,
            lineHeight: 1,
            fontSize: 18,
            transition: 'color 120ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#888')}
          onMouseLeave={e => (e.currentTarget.style.color = '#555')}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: '#e8e8e8', margin: 0 }}>
          Sign in to track progress
        </h2>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.5, margin: '8px 0 24px' }}>
          Your completions and notes sync across devices. No password needed.
        </p>

        <button
          onClick={onSignIn}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            width: '100%',
            padding: '13px',
            borderRadius: 10,
            backgroundColor: '#ffffff',
            color: '#111',
            fontSize: 15,
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'opacity 120ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.92')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {/* Google G logo */}
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#555', marginTop: 16 }}>
          Browse freely — sign in only to track progress.
        </p>
      </div>

      <style>{`
        @keyframes authModalIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
