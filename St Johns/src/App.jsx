import { useContext, useEffect, useState } from 'react'
import { AuctionProvider, AuctionContext } from './context/AuctionContext'
import { Intro } from './pages/Intro'
import { Home } from './pages/Home'
import { Setup } from './pages/Setup'
import { Auction } from './pages/Auction'
import { Display } from './pages/Display'
import { Results } from './pages/Results'

const PageRenderer = () => {
  const { state } = useContext(AuctionContext)
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentRoute(path)
  }

  // Add navigate to context for pages to use
  if (!window.__appNavigate) {
    window.__appNavigate = navigate
  }

  // Route table
  if (currentRoute === '/' || currentRoute === '') {
    return <Intro />
  }
  if (currentRoute === '/home') {
    return <Home />
  }
  if (currentRoute === '/setup') {
    return <Setup />
  }
  if (currentRoute === '/auction') {
    return <Auction />
  }
  if (currentRoute === '/display') {
    return <Display />
  }
  if (currentRoute === '/results') {
    return <Results />
  }

  // Default to intro
  return <Intro />
}

function App() {
  return (
    <AuctionProvider>
      <PageRenderer />
    </AuctionProvider>
  )
}

export default App
