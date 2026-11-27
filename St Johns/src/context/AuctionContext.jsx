import { createContext, useState, useCallback, useEffect } from 'react'
import { saveState, loadState, clearState } from '../utils/storage'
import { broadcastAuctionState, initBroadcast, onBroadcastMessage } from '../utils/broadcast'

export const AuctionContext = createContext()

export const AuctionProvider = ({ children }) => {
  const [state, setState] = useState(() => {
    const saved = loadState()
    return saved || {
      page: 'intro',
      introSkipped: false,
      players: [],
      teams: [],
      rules: { threshold: 50000, increment: 10000, budget: 2000000, maxPlayersPerTeam: 5 },
      currentPlayerIndex: 0,
      biddingHistory: [],
      unsoldPlayers: [],
      soldPlayers: [],
    }
  })

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state)
    if (state.page === 'auction' || state.page === 'display') {
      broadcastAuctionState(state)
    }
  }, [state])

  // Listen to broadcasts from other tabs
  useEffect(() => {
    initBroadcast()
    const unsubscribe = onBroadcastMessage((data) => {
      if (data.type === 'AUCTION_STATE_UPDATE') {
        setState(data.payload)
      }
    })
    return unsubscribe
  }, [])

  const updateState = useCallback((updates) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const setPlayers = useCallback((players) => {
    setState((prev) => ({ ...prev, players }))
  }, [])

  const setTeams = useCallback((teams) => {
    setState((prev) => ({ ...prev, teams }))
  }, [])

  const setRules = useCallback((rules) => {
    setState((prev) => ({
      ...prev,
      rules: { ...prev.rules, ...rules },
    }))
  }, [])

  const goToPage = useCallback((page) => {
    setState((prev) => ({ ...prev, page }))
  }, [])

  const skipIntro = useCallback(() => {
    setState((prev) => ({
      ...prev,
      introSkipped: true,
      page: 'home',
    }))
  }, [])

  const startAuction = useCallback(() => {
    const shuffled = [...state.players].sort(() => Math.random() - 0.5)
    setState((prev) => ({
      ...prev,
      page: 'auction',
      currentPlayerIndex: 0,
      biddingHistory: [],
      unsoldPlayers: [],
      soldPlayers: [],
      players: shuffled,
      teams: prev.teams.map((t) => ({
        ...t,
        budget: prev.rules.budget,
        squad: [],
        spent: 0,
      })),
    }))
  }, [state.players, state.rules])

  const placeBid = useCallback((teamIndex, bidAmount) => {
    setState((prev) => {
      const currentPlayer = prev.players[prev.currentPlayerIndex]
      if (!currentPlayer) return prev

      const newTeams = [...prev.teams]
      const currentBid = prev.biddingHistory[prev.biddingHistory.length - 1]

      if (
        newTeams[teamIndex].budget >= bidAmount &&
        newTeams[teamIndex].squad.length < prev.rules.maxPlayersPerTeam
      ) {
        const newBiddingHistory = [...prev.biddingHistory, { teamIndex, amount: bidAmount }]
        return {
          ...prev,
          biddingHistory: newBiddingHistory,
        }
      }
      return prev
    })
  }, [])

  const sellPlayer = useCallback(() => {
    setState((prev) => {
      if (prev.biddingHistory.length === 0) return prev

      const currentPlayer = prev.players[prev.currentPlayerIndex]
      const lastBid = prev.biddingHistory[prev.biddingHistory.length - 1]
      const newTeams = [...prev.teams]

      newTeams[lastBid.teamIndex].budget -= lastBid.amount
      newTeams[lastBid.teamIndex].squad.push(currentPlayer)
      newTeams[lastBid.teamIndex].spent += lastBid.amount

      const newSoldPlayers = [...prev.soldPlayers, { ...currentPlayer, soldTo: lastBid.teamIndex, soldAt: lastBid.amount }]

      return {
        ...prev,
        teams: newTeams,
        soldPlayers: newSoldPlayers,
        currentPlayerIndex: prev.currentPlayerIndex + 1,
        biddingHistory: [],
      }
    })
  }, [])

  const markUnsold = useCallback(() => {
    setState((prev) => {
      const currentPlayer = prev.players[prev.currentPlayerIndex]
      const newUnsoldPlayers = [...prev.unsoldPlayers, currentPlayer]

      return {
        ...prev,
        unsoldPlayers: newUnsoldPlayers,
        currentPlayerIndex: prev.currentPlayerIndex + 1,
        biddingHistory: [],
      }
    })
  }, [])

  const undoLastBid = useCallback(() => {
    setState((prev) => {
      if (prev.biddingHistory.length === 0) return prev
      const newBiddingHistory = prev.biddingHistory.slice(0, -1)
      return { ...prev, biddingHistory: newBiddingHistory }
    })
  }, [])

  const resetAuction = useCallback(() => {
    clearState()
    setState({
      page: 'home',
      introSkipped: false,
      players: [],
      teams: [],
      rules: { threshold: 50000, increment: 10000, budget: 2000000, maxPlayersPerTeam: 5 },
      currentPlayerIndex: 0,
      biddingHistory: [],
      unsoldPlayers: [],
      soldPlayers: [],
    })
  }, [])

  const value = {
    state,
    updateState,
    setPlayers,
    setTeams,
    setRules,
    goToPage,
    skipIntro,
    startAuction,
    placeBid,
    sellPlayer,
    markUnsold,
    undoLastBid,
    resetAuction,
  }

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
}
