import { useRef } from 'react'
import './base.css'

export default function InteractiveCard({ children, className = '', ...props }) {
  const ref = useRef(null)

  const handlePointerMove = (e) => {
    const card = ref.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width
    const py = y / rect.height
    const rx = (py - 0.5) * 20
    const ry = (px - 0.5) * -20

    card.style.setProperty('--pointer-x', `${(px * 100).toFixed(1)}%`)
    card.style.setProperty('--pointer-y', `${(py * 100).toFixed(1)}%`)
    card.style.setProperty('--rotate-x', `${rx.toFixed(2)}deg`)
    card.style.setProperty('--rotate-y', `${ry.toFixed(2)}deg`)
  }

  const handlePointerLeave = () => {
    const card = ref.current
    card.style.setProperty('--pointer-x', `50%`)
    card.style.setProperty('--pointer-y', `50%`)
    card.style.setProperty('--rotate-x', `0deg`)
    card.style.setProperty('--rotate-y', `0deg`)
  }

  return (
    <div
      ref={ref}
      className={`card interactive ${className}`}
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      <div className="card__translater">
        <div className="card__rotator">
          <div className="card__front">
            {children}
            <div className="card__glare" />
          </div>
        </div>
      </div>
    </div>
  )
}