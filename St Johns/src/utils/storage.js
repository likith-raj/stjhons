const STORAGE_KEY = 'st_johns_auction_state'

export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

export const loadState = () => {
  try {
    const state = localStorage.getItem(STORAGE_KEY)
    return state ? JSON.parse(state) : null
  } catch (e) {
    console.error('Failed to load state:', e)
    return null
  }
}

export const clearState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.error('Failed to clear state:', e)
  }
}
