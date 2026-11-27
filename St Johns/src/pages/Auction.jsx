import { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { AuctionContext } from '../context/AuctionContext'

const CURSOR_COLORS = ['#FF3B30', '#A855F7', '#10B981', '#3B82F6', '#FACC15', '#FF8A1F']

export const Auction = () => {
  const { state, setPlayers, setTeams } = useContext(AuctionContext)
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0)
  const [biddingHistory, setBiddingHistory] = useState([])
  const [soldPlayers, setSoldPlayers] = useState([])
  const [unsoldPlayers, setUnsoldPlayers] = useState([])
  const [teams, setTeamsLocal] = useState(state.teams || [])
  const [showConfetti, setShowConfetti] = useState(false)
  const [cursorIdx, setCursorIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [showSoldModal, setShowSoldModal] = useState(false)
  const [lastSoldInfo, setLastSoldInfo] = useState(null)
  const confettiRef = useRef(null)
  const orbRefs = useRef([])
  const floatingRefs = useRef([])
  const containerRef = useRef(null)

  useEffect(() => {
    if (!state.players || state.players.length === 0) {
      window.history.pushState({}, '', '/setup')
      window.dispatchEvent(new Event('popstate'))
    }
  }, [state])

  // Dynamic cursor color
  useEffect(() => {
    const timer = setInterval(() => {
      setCursorIdx((prev) => (prev + 1) % CURSOR_COLORS.length)
    }, 1200)
    return () => clearInterval(timer)
  }, [])

  // Smooth floating orbs animation
  useEffect(() => {
    let rafId
    const start = performance.now()
    const loop = (now) => {
      const t = (now - start) / 1000
      orbRefs.current.forEach((el, idx) => {
        if (!el) return
        const dx = Math.cos(t * (0.32 + idx * 0.08) + idx) * (24 + idx * 8)
        const dy = Math.sin(t * (0.4 + idx * 0.1) + idx * 1.3) * (20 + idx * 7)
        const sc = 1 + Math.sin(t * 0.45 + idx) * 0.06
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${sc})`
      })
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Parallax effect with mouse tracking + 3D floating objects
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      floatingRefs.current.forEach((el, idx) => {
        if (!el) return
        const depth = 1 + idx * 0.3
        const moveX = (x - 0.5) * 60 * depth
        const moveY = (y - 0.5) * 60 * depth
        const rotX = (y - 0.5) * 15
        const rotY = (x - 0.5) * 15
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${0.8 + idx * 0.1})`
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  const activeCursorColor = CURSOR_COLORS[cursorIdx]
  const cursorDataUrl = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${activeCursorColor}" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"><path d="M4 2L20 11.5L12.5 13.5L9 21L4 2Z"/></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 4 2, auto`
  }, [activeCursorColor])

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
      if (e.key.toLowerCase() === 'p') handlePauseResume()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [biddingHistory, teams, currentBidAmount, state.rules, isPaused])

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

    const soldTeam = newTeams[lastBid.teamIndex]
    setLastSoldInfo({
      playerName: currentPlayer.name,
      teamName: soldTeam.name,
      amount: lastBid.amount,
      teamColor: soldTeam.color || '#FF8A1F',
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
    setShowSoldModal(true)
    setTimeout(() => setShowConfetti(false), 2000)
    setTimeout(() => setShowSoldModal(false), 3500)

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

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
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
    <div
      className="w-full min-h-screen bg-[#050505] text-white relative overflow-x-hidden"
      style={{ cursor: cursorDataUrl, perspective: '1000px' }}
      ref={containerRef}
    >
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />

      {/* Floating 3D Geometric Objects */}
      <div
        ref={(el) => (floatingRefs.current[0] = el)}
        className="fixed w-32 h-32 pointer-events-none z-5 opacity-30"
        style={{
          top: '10%',
          left: '5%',
          background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), rgba(255,255,255,0.05))',
          borderRadius: '50%',
          filter: 'blur(1px)',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        ref={(el) => (floatingRefs.current[1] = el)}
        className="fixed w-24 h-24 pointer-events-none z-5 opacity-25"
        style={{
          top: '20%',
          right: '10%',
          background: 'linear-gradient(135deg, rgba(255,138,31,0.3), rgba(255,138,31,0.08))',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        ref={(el) => (floatingRefs.current[2] = el)}
        className="fixed w-28 h-28 pointer-events-none z-5 opacity-20"
        style={{
          bottom: '15%',
          left: '12%',
          background: 'radial-gradient(circle at 40% 40%, rgba(200,200,200,0.3), rgba(100,100,100,0.05))',
          borderRadius: '8px',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        ref={(el) => (floatingRefs.current[3] = el)}
        className="fixed pointer-events-none z-5 opacity-15"
        style={{
          width: '80px',
          height: '80px',
          bottom: '30%',
          right: '8%',
          background: 'conic-gradient(from 0deg, rgba(255,138,31,0.2), rgba(100,200,255,0.2), rgba(255,138,31,0.2))',
          borderRadius: '50%',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        ref={(el) => (floatingRefs.current[4] = el)}
        className="fixed pointer-events-none z-5 opacity-25"
        style={{
          width: '60px',
          height: '60px',
          top: '40%',
          right: '25%',
          background: 'linear-gradient(45deg, rgba(168,85,247,0.25), rgba(255,138,31,0.15))',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          transition: 'transform 0.1s ease-out',
        }}
      />
      <div
        ref={(el) => (floatingRefs.current[5] = el)}
        className="fixed pointer-events-none z-5 opacity-20"
        style={{
          width: '90px',
          height: '50px',
          top: '65%',
          left: '20%',
          background: 'linear-gradient(to right, rgba(100,200,255,0.2), rgba(255,138,31,0.2))',
          borderRadius: '50px',
          transition: 'transform 0.1s ease-out',
        }}
      />

      {/* Original Floating Orbs */}
      <div
        ref={(el) => (orbRefs.current[0] = el)}
        className="ambient-orb fixed w-[42vw] h-[42vw] -top-[10%] -right-[8%] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.005) 70%, transparent 100%)',
          filter: 'blur(42px)',
        }}
      />
      <div
        ref={(el) => (orbRefs.current[1] = el)}
        className="ambient-orb fixed w-[36vw] h-[36vw] -bottom-[12%] -left-[6%] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.005) 70%, transparent 100%)',
          filter: 'blur(42px)',
        }}
      />

      {/* Confetti */}
      {showConfetti && (
        <div ref={confettiRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array(40)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: Math.random() * 100 + '%',
                  top: -10 + 'px',
                  background: ['#FF8A1F', '#10b981', '#3b82f6', '#ef4444', '#a855f7'][Math.floor(Math.random() * 5)],
                  animation: `fall-confetti 2.5s linear forwards`,
                  animationDelay: Math.random() * 0.5 + 's',
                }}
              />
            ))}
        </div>
      )}

      {/* Sold Modal - Fade in center */}
      {showSoldModal && lastSoldInfo && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40" style={{ animation: 'fade-in-out 3.5s ease-in-out forwards' }}>
          <div className="bg-black/90 rounded-lg p-8 md:p-12 text-center max-w-md backdrop-blur-sm border-2" style={{ borderColor: lastSoldInfo.teamColor, animation: 'scale-up 0.3s ease-out' }}>
            <div className="text-sm uppercase tracking-widest text-gray-400 mb-2">SOLD TO</div>
            <div className="text-4xl md:text-5xl font-bold mb-6" style={{ color: lastSoldInfo.teamColor, textShadow: `0 0 20px ${lastSoldInfo.teamColor}` }}>
              {lastSoldInfo.teamName}
            </div>
            <div className="text-xl md:text-2xl font-semibold text-white mb-6">{lastSoldInfo.playerName}</div>
            <div className="text-3xl md:text-4xl font-bold text-white">₹{lastSoldInfo.amount.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">LIVE AUCTION</h1>
              <p className="text-xs md:text-sm uppercase tracking-widest text-neutral-400 mt-2">
                PLAYER {currentPlayerIdx + 1} / {state.players?.length || 0} | SOLD: {soldPlayers.length} | UNSOLD: {unsoldPlayers.length}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg px-4 py-3 border border-neutral-900">
              <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-orange-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-300">{isPaused ? 'PAUSED' : 'LIVE'}</span>
            </div>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
          {/* Player Card */}
          <div className="lg:col-span-1 bg-[#0a0a0a] rounded-lg p-6 md:p-8 border border-neutral-900">
            <div className="mb-6 pb-6 border-b border-neutral-900">
              <div className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 break-words">
                {currentPlayer?.name}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest text-neutral-400 mb-2">ROLE</div>
                  <div className="text-lg font-bold text-white">{currentPlayer?.role}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest text-neutral-400 mb-2">BASE</div>
                  <div className="text-lg font-bold text-orange-500">₹{currentPlayer?.basePrice.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Current Bid Display */}
            <div className="bg-[#0f0f0f] rounded-lg p-6 text-center border border-neutral-800">
              <div className="text-xs uppercase tracking-widest text-neutral-400 mb-3">CURRENT BID</div>
              <div className="text-5xl md:text-6xl font-bold text-orange-500 mb-4 tracking-tight">
                ₹{currentBidAmount.toLocaleString()}
              </div>
              {currentBidderTeam && (
                <div className="text-lg font-bold" style={{ color: currentBidderTeam.color || '#FF8A1F' }}>
                  {currentBidderTeam.name}
                </div>
              )}
            </div>
          </div>

          {/* Bid Buttons + Team Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Bid Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {teams.map((team, idx) => {
                const nextBid = currentBidAmount + (state.rules?.increment || 10000)
                const canBid =
                  !isPaused &&
                  team.budget >= nextBid &&
                  team.squad.length < state.rules?.maxPlayersPerTeam &&
                  team.budget - nextBid >= (state.rules?.maxPlayersPerTeam - team.squad.length) * state.rules?.basePrice

                return (
                  <button
                    key={idx}
                    className="py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider transition-all border-2"
                    style={{
                      background: lastBid?.teamIndex === idx ? team.color || '#FF8A1F' : '#0f0f0f',
                      color: lastBid?.teamIndex === idx ? '#050505' : team.color || '#FF8A1F',
                      borderColor: team.color || '#FF8A1F',
                      opacity: !canBid ? 0.3 : 1,
                      cursor: canBid ? 'pointer' : 'not-allowed',
                      transform: lastBid?.teamIndex === idx ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onClick={() => handlePlaceBid(idx)}
                    disabled={!canBid}
                  >
                    {team.name}
                  </button>
                )
              })}
            </div>

            {/* Teams Status Grid */}
            <div className="bg-[#0a0a0a] rounded-lg p-6 md:p-8 border border-neutral-900">
              <h3 className="text-lg font-bold mb-6 uppercase tracking-wide text-white">TEAM STATUS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="bg-[#0f0f0f] rounded-lg p-4 border-2"
                    style={{ borderColor: team.color || '#FF8A1F' }}
                  >
                    <div className="text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: team.color || '#FF8A1F' }}>
                      {team.name}
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-neutral-300">
                        <span>BUDGET:</span>
                        <span className="font-bold">₹{team.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span>SQUAD:</span>
                        <span className="font-bold">{team.squad.length}/{state.rules?.maxPlayersPerTeam}</span>
                      </div>
                      <div className="flex justify-between text-neutral-300">
                        <span>SPENT:</span>
                        <span className="font-bold">₹{team.spent.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          <button
            onClick={handleSell}
            disabled={!lastBid || isPaused}
            className="py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider text-white bg-green-600 hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-green-600"
          >
            ✅ SOLD
          </button>
          <button
            onClick={handleUnsold}
            disabled={isPaused}
            className="py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-red-600"
          >
            ❌ UNSOLD
          </button>
          <button
            onClick={handleUndo}
            disabled={biddingHistory.length === 0 || isPaused}
            className="py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider text-white bg-gray-700 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-gray-700"
          >
            ↩️ UNDO
          </button>
          <button
            onClick={handlePauseResume}
            className="py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider text-white transition-all border"
            style={{
              background: isPaused ? '#FF8A1F' : '#3b82f6',
              borderColor: isPaused ? '#FF8A1F' : '#3b82f6',
              color: isPaused ? '#050505' : '#ffffff',
            }}
          >
            {isPaused ? '▶️ RESUME' : '⏸️ PAUSE'}
          </button>
          <button
            onClick={handleEndAuction}
            className="py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 transition-all border border-blue-600"
          >
            📊 END
          </button>
        </div>

        {/* Help Info */}
        <div className="mt-8 text-center text-xs uppercase tracking-widest text-neutral-500">
          KEYBOARD: 1-9 = BID | ENTER = SOLD | U = UNSOLD | Z = UNDO | P = PAUSE
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 64px 64px;
        }

        @keyframes fall-confetti {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes fade-in-out {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes scale-up {
          from { transform: scale(0.5); }
          to { transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  )
}
