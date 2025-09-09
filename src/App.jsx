import { useMemo, useState } from 'react'
import './App.css'
import SvgCard from './components/SvgCard'

function App() {
  const [phase, setPhase] = useState('cover') // 'cover' | 'fan' | 'reveal'
  const [selectedId, setSelectedId] = useState(null)

  const cards = useMemo(() => {
    const ids = Array.from({ length: 10 }, (_, i) => `q${i + 1}`)
    // Shuffle once per mount for randomness
    return ids
      .map(id => ({ id, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ id }) => ({ id, src: `/${id}.svg` }))
  }, [])

  const handleCoverClick = () => {
    setSelectedId(null)
    setPhase('fan')
  }

  const handleFanCardClick = (id) => {
    setSelectedId(id)
    setPhase('reveal')
  }

  const handleStackAway = () => {
    setSelectedId(null)
    setPhase('cover')
  }

  return (
    <div className="app-root">
      <h1>REA U OK</h1>
      {phase === 'cover' && (
        <div className="cover-wrapper" onClick={handleCoverClick} role="button" tabIndex={0}>
          <SvgCard src="/cover.svg" hideText={false} className="cover cover-glow" title="Cover" />
          <div className="cover-hint">Click the cover to pick a card</div>
        </div>
      )}

      {phase === 'fan' && (
        <div className="cover-fan-stage">
          <div className="fan" aria-label="Pick a card">
            {cards.map(({ id }, index) => (
              <div
                key={id}
                className="fan-slot"
                style={{
                  '--i': index,
                  '--n': cards.length,
                }}
              >
                <SvgCard
                  src="/cover.svg"
                  hideText={true}
                  className="card-item fan-card"
                  title={id}
                  onClick={() => handleFanCardClick(id)}
                />
              </div>
            ))}
          </div>
          <div className="cover-on-top">
            <SvgCard src="/cover.svg" hideText={false} className="cover" title="Cover" />
          </div>
        </div>
      )}

      {phase === 'reveal' && selectedId && (
        <div className="reveal-view">
          <SvgCard
            src={`/${selectedId}.svg`}
            hideText={false}
            className="card-item reveal-card"
            title={selectedId}
          />
          <button className="stack-btn" onClick={handleStackAway}>Stack away card</button>
        </div>
      )}
    </div>
  )
}

export default App
