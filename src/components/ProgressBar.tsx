interface ProgressBarProps {
  label: string
  done: number
  total: number
  color?: string
}

export function ProgressBar({ label, done, total, color = '#72A449' }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-label">{label}</span>
        <span className="progress-count">{done} / {total}</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
