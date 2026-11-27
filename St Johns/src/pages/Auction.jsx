import { useContext, useState, useEffect, useRef } from 'react'
import { AuctionContext } from '../context/AuctionContext'

export const Auction = () => {
  const { state, setPlayers, setTeams } = useContext(AuctionContext)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [biddingHistory, setBiddingHistory] = useState([])
  const [soldPlayers, setSoldPlayers] = useState([])
  const [unsoldPlayers, setUnsoldPlayers] = useState([])
  const [teams, setTeamsLocal] = useState(state.teams || [])
  const [showConfetti, setShowConfetti] = useState(false)
  const confettiRef = useRef(null)

  useEffect(() => {
    if (!state.players || state.players.length === 0) {
      window.history.pushState({}, '', '/setup')
      window.dispatchEvent(new Event('popstate'))
    }
  }, [state])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  const currentPlayer = state.players?.[currentPlayerIdx]
  const lastBid = biddingHistory.length > 0 ? biddingHistory[biddingHistory.length - 1] : null
  const currentBidAmount = lastBid
    ? lastBid.amount
    : state.rules?.basePrice || 50000
  const currentBidderTeam = lastBid ? teams[lastBid.teamIndex] : null

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = parseInt(e.key)
      if (key >= 1 && key <= 9 && key <= teams.length) {
        handlePlaceBid(key - 1)
      }
      if (e.key === 'Enter') handleSell()
      if (e.key.toLowerCase() === 'u') handleUnsold()
      if (e.key.toLowerCase() === 'z') handleUndo()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [biddingHistory, teams, currentBidAmount, state.rules])

  const handlePlaceBid = (teamIndex) => {
    const team = teams[teamIndex]
    const nextBidAmount = currentBidAmount + (state.rules?.increment || 10000)

    // Validation
    if (team.budget < nextBidAmount) return
    if (team.squad.length >= state.rules?.maxPlayersPerTeam) return
    if (team.budget - nextBidAmount < (state.rules?.maxPlayersPerTeam - team.squad.length) * state.rules?.basePrice)
      return

    setBiddingHistory([...biddingHistory, { teamIndex, amount: nextBidAmount }])
  }

  const handleSell = () => {
    if (!lastBid || !currentPlayer) return

    const newTeams = teams.map((t, i) => {
      if (i === lastBid.teamIndex) {
        return {
          ...t,
          budget: t.budget - lastBid.amount,
          squad: [...t.squad, currentPlayer],
          spent: t.spent + lastBid.amount,
        }
      }
      return t
    })

    setTeamsLocal(newTeams)
    setSoldPlayers([
      ...soldPlayers,
      {
        ...currentPlayer,
        soldTo: lastBid.teamIndex,
        soldAt: lastBid.amount,
      },
    ])
    setBiddingHistory([])
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)

    if (currentPlayerIdx < state.players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1)
    }
  }

  const handleUnsold = () => {
    if (!currentPlayer) return
    setUnsoldPlayers([...unsoldPlayers, currentPlayer])
    setBiddingHistory([])

    if (currentPlayerIdx < state.players.length - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1)
    }
  }

  const handleUndo = () => {
    if (biddingHistory.length > 0) {
      setBiddingHistory(biddingHistory.slice(0, -1))
    }
  }

  const handleEndAuction = () => {
    setPlayers(state.players)
    setTeams(teams)
    navigate('/results')
  }

  if (!currentPlayer) {
    return (
      <div className="auction-end">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
          
          .auction-end {
            background: #050505;
            color: #ffffff;
            font-family: 'Space Grotesk', system-ui, sans-serif;
            text-transform: uppercase;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            text-align: center;
          }

          .auction-end-content h1 {
            font-size: clamp(2rem, 6vw, 4rem);
            font-weight: 700;
            margin-bottom: 24px;
            letter-spacing: 0.08em;
          }

          .auction-end-btn {
            padding: 16px 48px;
            background: #FF8A1F;
            color: #050505;
            font-weight: 700;
            font-size: 1.1rem;
            border: none;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: 32px;
            letter-spacing: 0.04em;
          }

          .auction-end-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(255, 138, 31, 0.4);
          }
        `}</style>
        <div className="auction-end-content">
          <h1>AUCTION COMPLETE!</h1>
          <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '32px' }}>ALL PLAYERS SOLD OR UNSOLD</p>
          <button onClick={handleEndAuction} className="auction-end-btn">
            VIEW RESULTS →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auction">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .auction {
          background: #050505;
          color: #ffffff;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          text-transform: uppercase;
          min-height: 100vh;
          padding: 40px 24px;
          position: relative;
        }

        .auction-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .auction-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .auction-title {
          font-size: clamp(1.5rem, 4vw, 2.2rem);
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: 0.08em;
        }

        .auction-counter {
          font-size: 0.9rem;
          color: #666;
          letter-spacing: 0.04em;
        }

        .auction-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          margin-bottom: 40px;
        }

        @media (max-width: 1024px) {
          .auction-layout {
            grid-template-columns: 1fr;
          }
        }

        .auction-player {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 32px;
        }

        .auction-player-name {
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: 0.06em;
          word-break: break-word;
        }

        .auction-player-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 32px;
          padding-bottom: 32px;
          border-bottom: 1px solid #1a1a1a;
        }

        .auction-player-field {
          text-align: center;
        }

        .auction-player-label {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }

        .auction-player-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
        }

        .auction-bid-box {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 24px;
          text-align: center;
        }

        .auction-bid-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 12px;
        }

        .auction-bid-amount {
          font-size: clamp(2rem, 8vw, 3.5rem);
          font-weight: 700;
          color: #FF8A1F;
          margin-bottom: 20px;
          letter-spacing: 0.04em;
        }

        .auction-bid-team {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
        }

        .auction-teams {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 32px;
        }

        .auction-teams-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 20px;
          letter-spacing: 0.06em;
        }

        .auction-teams-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .auction-teams-grid {
            grid-template-columns: 1fr;
          }
        }

        .auction-team-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .auction-team-card:hover {
          border-color: #333;
        }

        .auction-team-name {
          font-weight: 700;
          margin-bottom: 12px;
          font-size: 0.95rem;
          letter-spacing: 0.04em;
        }

        .auction-team-stat {
          font-size: 0.8rem;
          color: #888;
          line-height: 1.6;
          margin-bottom: 4px;
        }

        .auction-bid-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-bottom: 32px;
        }

        .auction-bid-btn {
          padding: 14px 16px;
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 2px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .auction-bid-btn:hover:not(:disabled) {
          border-color: #FF8A1F;
          background: #151515;
          transform: translateY(-2px);
        }

        .auction-bid-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .auction-bid-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .auction-bid-btn.active {
          background: #FF8A1F;
          border-color: #FF8A1F;
          color: #050505;
        }

        .auction-controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
        }

        .auction-control-btn {
          padding: 14px 20px;
          font-weight: 700;
          font-size: 0.9rem;
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .auction-control-sell {
          background: #10b981;
          color: #050505;
        }

        .auction-control-sell:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }

        .auction-control-unsold {
          background: #ef4444;
          color: #ffffff;
        }

        .auction-control-unsold:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }

        .auction-control-undo {
          background: #666;
          color: #ffffff;
        }

        .auction-control-undo:hover:not(:disabled) {
          background: #777;
          transform: scale(1.05);
        }

        .auction-control-undo:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .auction-control-end {
          background: #3b82f6;
          color: #ffffff;
        }

        .auction-control-end:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
        }

        .confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
          z-index: 1000;
        }

        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #FF8A1F;
          animation: fall 2s linear forwards;
        }

        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        .auction-help {
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 16px;
          font-size: 0.8rem;
          color: #666;
          text-align: center;
          margin-top: 32px;
          letter-spacing: 0.02em;
        }
      `}</style>

      {/* Confetti */}
      {showConfetti && (
        <div ref={confettiRef} className="confetti">
          {Array(30)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: Math.random() * 100 + '%',
                  top: -10 + 'px',
                  delay: Math.random() * 0.5 + 's',
                  background: ['#FF8A1F', '#10b981', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 4)],
                }}
              />
            ))}
        </div>
      )}

      <div className="auction-container">
        {/* Header */}
        <div className="auction-header">
          <div className="auction-title">LIVE AUCTION</div>
          <div className="auction-counter">
            PLAYER {currentPlayerIdx + 1} / {state.players?.length || 0} | SOLD: {soldPlayers.length} | UNSOLD: {unsoldPlayers.length}
          </div>
        </div>

        {/* Main Layout */}
        <div className="auction-layout">
          {/* Player Card */}
          <div className="auction-player">
            <div className="auction-player-name">{currentPlayer?.name}</div>
            <div className="auction-player-info">
              <div className="auction-player-field">
                <div className="auction-player-label">ROLE</div>
                <div className="auction-player-value">{currentPlayer?.role}</div>
              </div>
              <div className="auction-player-field">
                <div className="auction-player-label">BASE PRICE</div>
                <div className="auction-player-value">₹{currentPlayer?.basePrice.toLocaleString()}</div>
              </div>
            </div>
            <div className="auction-bid-box">
              <div className="auction-bid-label">CURRENT BID</div>
              <div className="auction-bid-amount">₹{currentBidAmount.toLocaleString()}</div>
              {currentBidderTeam && (
                <div className="auction-bid-team" style={{ color: currentBidderTeam.color }}>
                  {currentBidderTeam.name}
                </div>
              )}
            </div>
          </div>

          {/* Bid Buttons + Teams Status */}
          <div>
            {/* Bid Buttons */}
            <div className="auction-bid-buttons">
              {teams.map((team, idx) => {
                const nextBid = currentBidAmount + (state.rules?.increment || 10000)
                const canBid =
                  team.budget >= nextBid &&
                  team.squad.length < state.rules?.maxPlayersPerTeam &&
                  team.budget - nextBid >= (state.rules?.maxPlayersPerTeam - team.squad.length) * state.rules?.basePrice

                return (
                  <button
                    key={idx}
                    className={`auction-bid-btn ${lastBid?.teamIndex === idx ? 'active' : ''}`}
                    onClick={() => handlePlaceBid(idx)}
                    disabled={!canBid}
                    style={canBid && lastBid?.teamIndex !== idx ? { borderColor: team.color } : {}}
                  >
                    {team.name}
                  </button>
                )
              })}
            </div>

            {/* Teams Status */}
            <div className="auction-teams">
              <div className="auction-teams-title">TEAM STATUS</div>
              <div className="auction-teams-grid">
                {teams.map((team) => (
                  <div key={team.id} className="auction-team-card" style={{ borderColor: team.color }}>
                    <div className="auction-team-name" style={{ color: team.color }}>
                      {team.name}
                    </div>
                    <div className="auction-team-stat">💰 BUDGET: ₹{team.budget.toLocaleString()}</div>
                    <div className="auction-team-stat">👥 SQUAD: {team.squad.length}/{state.rules?.maxPlayersPerTeam}</div>
                    <div className="auction-team-stat">💵 SPENT: ₹{team.spent.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="auction-controls">
          <button
            className="auction-control-btn auction-control-sell"
            onClick={handleSell}
            disabled={!lastBid}
          >
            ✅ SOLD
          </button>
          <button className="auction-control-btn auction-control-unsold" onClick={handleUnsold}>
            ❌ UNSOLD
          </button>
          <button
            className="auction-control-btn auction-control-undo"
            onClick={handleUndo}
            disabled={biddingHistory.length === 0}
          >
            ↩️ UNDO
          </button>
          <button className="auction-control-btn auction-control-end" onClick={handleEndAuction}>
            📊 END & RESULTS
          </button>
        </div>

        {/* Help */}
        <div className="auction-help">
          KEYBOARD: 1-9 = BID | ENTER = SOLD | U = UNSOLD | Z = UNDO
        </div>
      </div>
    </div>
  )
}
