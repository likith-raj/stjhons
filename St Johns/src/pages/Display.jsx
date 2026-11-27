import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AuctionContext } from '../context/AuctionContext'
import { onBroadcastMessage } from '../utils/broadcast'
import { getPlayerColor } from '../utils/colors'

export const Display = () => {
  const { state: initialState, goToPage } = useContext(AuctionContext)
  const [state, setState] = useState(initialState)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  useEffect(() => {
    // Listen to broadcast updates
    onBroadcastMessage((data) => {
      if (data.type === 'AUCTION_STATE_UPDATE') {
        setState(data.payload)
        setLastUpdate(Date.now())
      }
    })
  }, [])

  const currentPlayer = state.players[state.currentPlayerIndex]
  const lastBid = state.biddingHistory[state.biddingHistory.length - 1]
  const currentBidAmount = lastBid ? lastBid.amount : state.rules.threshold
  const currentBidder = lastBid ? state.teams[lastBid.teamIndex] : null

  if (!currentPlayer) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-black mb-6">AUCTION COMPLETE!</h1>
          <p className="text-4xl text-gray-300">ALL PLAYERS SOLD</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Player Name - Large */}
      <motion.h1
        key={currentPlayer.id}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-8xl font-black mb-6"
        style={{ color: getPlayerColor(state.players.indexOf(currentPlayer)) }}
      >
        {currentPlayer.name}
      </motion.h1>

      {/* Player Info Row */}
      <div className="flex gap-12 mb-8 text-4xl font-bold">
        <div>
          <p className="text-gray-400 text-2xl mb-2">CLASS</p>
          <p>{currentPlayer.section}</p>
        </div>
        <div>
          <p className="text-gray-400 text-2xl mb-2">ROLE</p>
          <p>{currentPlayer.role}</p>
        </div>
      </div>

      {/* Current Bid - HUGE */}
      <div className="mb-12">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center"
        >
          <p className="text-gray-400 text-3xl mb-2">CURRENT BID</p>
          <p className="text-9xl font-black text-neon-green" style={{ textShadow: '0 0 30px rgba(57, 255, 20, 0.8)' }}>
            ₹{currentBidAmount.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Leading Bidder */}
      {currentBidder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="text-gray-400 text-2xl mb-3">LEADING BIDDER</p>
          <p className="text-6xl font-black" style={{ color: currentBidder.color }}>
            {currentBidder.name}
          </p>
        </motion.div>
      )}

      {/* Teams Status - Bottom */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between gap-4 flex-wrap">
        {state.teams.map((team) => (
          <div
            key={team.id}
            className="text-center px-4 py-2 rounded-lg flex-1 min-w-max"
            style={{
              backgroundColor: team.color + '30',
              borderLeft: `4px solid ${team.color}`,
            }}
          >
            <p className="font-bold" style={{ color: team.color }}>
              {team.name}
            </p>
            <p className="text-xs text-gray-300">
              {team.squad.length}/{state.rules.maxPlayersPerTeam} | ₹{team.budget.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Connection Indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-2 text-sm">
        <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
        <span className="text-gray-400">LIVE</span>
      </div>
    </div>
  )
}
