let channel = null

export const initBroadcast = () => {
  if (!channel && typeof window !== 'undefined') {
    try {
      channel = new BroadcastChannel('st_johns_auction')
    } catch (e) {
      console.warn('BroadcastChannel not available:', e)
    }
  }
  return channel
}

export const broadcastAuctionState = (state) => {
  if (channel) {
    channel.postMessage({
      type: 'AUCTION_STATE_UPDATE',
      payload: state,
      timestamp: Date.now(),
    })
  }
}

export const onBroadcastMessage = (callback) => {
  const ch = initBroadcast()
  if (ch) {
    ch.onmessage = (event) => {
      callback(event.data)
    }
  }
}

export const closeBroadcast = () => {
  if (channel) {
    channel.close()
    channel = null
  }
}
