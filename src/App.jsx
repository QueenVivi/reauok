import { useMemo, useState } from 'react'
import './App.css'
import SvgCard from './components/SvgCard'
import './components/base.css'
import InteractiveCard from './components/InteractiveCard'
import questionsData from './questions.json'

function App() {
  const [phase, setPhase] = useState('cover') // 'cover' | 'fan' | 'reveal' | 'prompt-selection' | 'prompt-display' | 'both-cards' | 'cover2-fan' | 'cover2-reveal'
  const [selectedId, setSelectedId] = useState(null)
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [originalQuestionId, setOriginalQuestionId] = useState(null)

  const cards = useMemo(() => {
    const ids = Array.from({ length: 10 }, (_, i) => `q${i + 1}`)
    // Shuffle once per mount for randomness
    return ids
      .map(id => ({ id, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ id }) => ({ id, src: `/${id}.svg` }))
  }, [])

  const cover2CardsData = useMemo(() => {
    // Create 10 copies of cover2.svg
    return Array.from({ length: 10 }, (_, i) => ({
      id: `cover2-${i + 1}`,
      src: '/cover2.svg',
      questionId: `q${i + 1}` // Maps to q1.svg, q2.svg, etc.
    }))
  }, [])


  const handleCover2Click = () => {
    setSelectedId(null)
    setPhase('cover2-fan')
  }

  const handleCover2CardClick = (cardId, questionId) => {
    setSelectedId(questionId)
    setPhase('cover2-reveal')
  }

  const handleFanCardClick = (id) => {
    setSelectedId(id)
    setPhase('reveal')
  }

  const handleChoosePrompt = () => {
    setOriginalQuestionId(selectedId) // Store the original question card ID
    setSelectedId(null)
    setSelectedPrompt(null)
    setPhase('prompt-selection')
  }

  const handlePromptSelection = (promptId) => {
    // Get random question from the selected prompt's questions
    const promptQuestions = questionsData[promptId].questions
    const randomQuestion = promptQuestions[Math.floor(Math.random() * promptQuestions.length)]
    
    setSelectedPrompt(promptId)
    setSelectedQuestion(randomQuestion)
    setPhase('prompt-display')
  }

  const handleBackToCover = () => {
    setSelectedId(null)
    setSelectedPrompt(null)
    setSelectedQuestion(null)
    setOriginalQuestionId(null)
    setPhase('cover')
  }

  const handleShowBothCards = () => {
    setPhase('both-cards')
  }

  return (
    <div className="app-root">
      <h1>REA U OK?</h1>
      {phase === 'cover' && (
        <div className="homepage-covers">
          <h2>Mindful conversations</h2>
          <div className="covers-grid">
            <div className="cover-row">
              <div className="cover-wrapper disabled">
                <InteractiveCard>
                  <SvgCard
                    src="/cover1.svg"
                    hideText={false}
                    className="cover-card"
                    title="Future-focus"
                    preserveAspectRatio="none"
                  />
                </InteractiveCard>
                <div className="cover-hover-text">Future-focus</div>
                <div className="coming-soon-overlay">Coming Soon</div>
              </div>
              <div className="cover-wrapper" onClick={handleCover2Click} role="button" tabIndex={0}>
                <InteractiveCard>
                  <SvgCard src="/cover2.svg" hideText={false} className="cover-card" title="Light-hearted" />
                </InteractiveCard>
                <div className="cover-hover-text">Light-hearted</div>
              </div>
              <div className="cover-wrapper disabled">
                <InteractiveCard>
                  <SvgCard src="/cover3.svg" hideText={false} className="cover-card" title="Deep-Dives" />
                </InteractiveCard>
                <div className="cover-hover-text">Deep-Dives</div>
                <div className="coming-soon-overlay">Coming Soon</div>
              </div>
            </div>
            <div className="cover-row">
              <div className="cover-wrapper disabled">
                <InteractiveCard>
                  <SvgCard src="/cover4.svg" hideText={false} className="cover-card" title="Positive-Reflection" />
                </InteractiveCard>
                <div className="cover-hover-text">Positive-Reflection</div>
                <div className="coming-soon-overlay">Coming Soon</div>
              </div>
              <div className="cover-wrapper disabled">
                <InteractiveCard>
                  <SvgCard src="/cover5.svg" hideText={false} className="cover-card" title="Connection" />
                </InteractiveCard>
                <div className="cover-hover-text">Connection</div>
                <div className="coming-soon-overlay">Coming Soon</div>
              </div>
              <div className="cover-wrapper disabled">
                <InteractiveCard>
                  <SvgCard src="/cover6.svg" hideText={false} className="cover-card" title="Perspective Shift" />
                </InteractiveCard>
                <div className="cover-hover-text">Perspective-Shift</div>
                <div className="coming-soon-overlay">Coming Soon</div>
              </div>
            </div>
          </div>
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
          <InteractiveCard>
            <SvgCard
              src={`/${selectedId}.svg`}
              hideText={false}
              className="card-item reveal-card"
              title={selectedId}
            />
          </InteractiveCard> 
          <button className="stack-btn" onClick={handleChoosePrompt}>Choose a prompt card</button>
        </div>
      )}

      {phase === 'prompt-selection' && (
        <div className="prompt-selection-view">
          <h2>Choose a prompt card</h2>
          <div className="prompt-cards">
            {[
              { id: 'prompt1', text: 'Light-Hearted' },
              { id: 'prompt2', text: 'Moderately Reflective' },
              { id: 'prompt3', text: 'Deep & Vulnerable' }
            ].map(({ id, text }) => (
              <div key={id} className="prompt-card-wrapper">
                <InteractiveCard
                  onClick={() => handlePromptSelection(id)}
                >
                  <SvgCard
                    src={`/${id}.svg`}
                    hideText={false}
                    className="card-item prompt-card"
                    title={id}
                  />
                </InteractiveCard>
                <div className="prompt-hover-text">{text}</div>
              </div>
            ))}
          </div>
          <button className="back-btn" onClick={handleBackToCover}>Back to cover</button>
        </div>
      )}

      {phase === 'prompt-display' && selectedPrompt && (
        <div className="prompt-display-view">
          <div className="prompt-card-container">
            <InteractiveCard>
              <SvgCard
                src={`/p-${selectedPrompt.replace('prompt', '')}.svg`}
                hideText={false}
                className="prompt-display-card"
                title={selectedPrompt}
              />
            {selectedQuestion && (
              <div className="question-overlay">
                <p className="question-text">{selectedQuestion}</p>
              </div>
            )}
            </InteractiveCard>
          </div>
          <button className="back-btn" onClick={handleShowBothCards}>Show both cards</button>
        </div>
      )}

      {phase === 'both-cards' && selectedPrompt && originalQuestionId && (
        <div className="both-cards-view">
          <h2>Your Cards</h2>
          <div className="both-cards-container">
            <div className="card-pair">
              <div className="card-label">Question Card</div>
              <InteractiveCard>
                <SvgCard
                  src={`/${originalQuestionId}.svg`}
                  hideText={false}
                  className="card-item question-card"
                  title={originalQuestionId}
                />
              </InteractiveCard>
            </div>
            <div className="card-pair">
              <div className="card-label">Prompt Card</div>
              <div className="prompt-card-container">
                <InteractiveCard>
                  <SvgCard
                    src={`/p-${selectedPrompt.replace('prompt', '')}.svg`}
                    hideText={false}
                    className="prompt-display-card"
                    title={selectedPrompt}
                  />
                {selectedQuestion && (
                  <div className="question-overlay">
                    <p className="question-text">{selectedQuestion}</p>
                  </div>
                )}
               </InteractiveCard>
              </div>
            </div>

          </div>
          <button className="back-btn" onClick={handleBackToCover}>Back to cover</button>
        </div>
      )}

      {phase === 'cover2-fan' && (
        <div className="cover2-fan-view">
          <h2>Pick a card</h2>
          <div className="cover2-grid">
            {cover2CardsData.map((card, index) => (
              <div
                key={card.id}
                className="cover2-slot"
                style={{
                  '--i': index,
                }}
              >
                <InteractiveCard
                  onClick={() => handleCover2CardClick(card.id, card.questionId)}
                >
                  <SvgCard
                    src={card.src}
                    hideText={true}
                    className="cover2-card"
                    title={card.id}
                  />
                </InteractiveCard>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'cover2-reveal' && selectedId && (
        <div className="cover2-reveal-view">
          <InteractiveCard className="cover2-reveal-card">
            <SvgCard
              src={`/${selectedId}.svg`}
              hideText={false}
              className="card-item reveal-card"
              title={selectedId}
            />
          </InteractiveCard>
          <button className="stack-btn" onClick={handleChoosePrompt}>Pick a prompt card</button>
        </div>
      )}
    </div>
  )
}

export default App
