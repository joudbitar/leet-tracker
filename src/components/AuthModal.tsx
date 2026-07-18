interface Props {
  isOpen: boolean
  onClose: () => void
  onSignIn: () => void
}

export function AuthModal({ isOpen, onClose, onSignIn }: Props) {
  if (!isOpen) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <b>sign in</b>
        <p className="subtext modal-sub">
          your local progress comes with you. signing in syncs it across devices and puts you on the board.
        </p>
        <button className="googlebtn" onClick={onSignIn}>continue with google</button>
        <div className="subtext modal-sub"><a className="act" onClick={onClose}>never mind</a></div>
      </div>
    </div>
  )
}
