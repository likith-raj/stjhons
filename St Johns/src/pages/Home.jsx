import { useEffect, useState } from 'react'

export const Home = () => {
  const [cursorColorIndex, setCursorColorIndex] = useState(0)

  const cycleColors = ['#FF3B30', '#A855F7', '#10B981', '#3B82F6', '#FACC15']

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorColorIndex((prev) => (prev + 1) % cycleColors.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  const currentCursorColor = cycleColors[cursorColorIndex]

  const cursorSvg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${currentCursorColor}" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"><path d="M4 2L20 11.5L12.5 13.5L9 21L4 2Z"/></svg>`
  )

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  return (
    <div
      className="home-root"
      style={{
        cursor: `url("data:image/svg+xml,${cursorSvg}") 4 2, auto`,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          width: 100%;
          overflow-x: hidden;
          background-color: #050505;
        }

        .home-root, .home-root * {
          cursor: inherit;
        }

        .home-root {
          width: 100%;
          min-height: 100vh;
          background-color: #050505;
          color: #ffffff;
          font-family: 'Work Sans', system-ui, sans-serif;
          font-weight: 500;
          line-height: 1.6;
          position: relative;
        }

        /* Subtle Edge-to-Edge Grid */
        .bg-grid {
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 64px 64px;
          pointer-events: none;
          z-index: 0;
        }

        /* Top Bar - Full Width */
        .topbar {
          width: 100%;
          padding: 28px clamp(20px, 5vw, 64px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 2;
          animation: fadeDown 0.7s ease forwards;
        }

        .topbar-left {
          font-size: 0.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #a3a3a3;
        }

        .topbar-right {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ffffff;
        }

        /* Hero - Full Width */
        .hero {
          width: 100%;
          min-height: calc(100vh - 82px);
          padding: 64px clamp(20px, 5vw, 64px);
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          z-index: 2;
        }

        .school-block {
          margin-bottom: 28px;
          animation: fadeUp 0.75s ease forwards;
        }

        .school-name {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.05rem, 2vw, 1.35rem);
          font-weight: 600;
          color: #ffffff;
        }

        .school-addr {
          font-size: 0.88rem;
          color: #8a8a8a;
          margin-top: 4px;
        }

        .hero-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(3.2rem, 9.5vw, 7rem);
          font-weight: 700;
          line-height: 0.96;
          letter-spacing: -0.03em;
          color: #ffffff;
          margin-bottom: 24px;
          animation: fadeUp 0.9s ease forwards;
        }

        .hero-sub {
          font-size: clamp(1rem, 2vw, 1.3rem);
          color: #b5b5b5;
          max-width: 620px;
          margin-bottom: 44px;
          animation: fadeUp 1.05s ease forwards;
        }

        .btn-start {
          align-self: flex-start;
          padding: 18px 46px;
          background: #ffffff;
          color: #050505;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.98rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border: 1px solid #ffffff;
          border-radius: 4px;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
          animation: fadeUp 1.15s ease forwards;
        }

        .btn-start:hover {
          background: transparent;
          color: #ffffff;
          transform: translateY(-3px);
        }

        /* Venue Section - Full Width */
        .venue-sec {
          width: 100%;
          padding: 96px clamp(20px, 5vw, 64px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 2;
        }

        .sec-tag {
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a8a8a;
          margin-bottom: 10px;
        }

        .sec-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2rem, 5vw, 3.6rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .sec-sub {
          font-size: 1rem;
          color: #9e9e9e;
          margin-bottom: 52px;
        }

        .venue-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
          align-items: center;
        }

        @media (min-width: 900px) {
          .venue-grid {
            grid-template-columns: 1.35fr 0.65fr;
          }
        }

        .map-wrap {
          position: relative;
          padding: 14px;
        }

        /* Top-Right Corner Line */
        .map-wrap::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 90px;
          height: 90px;
          border-top: 2px solid #ffffff;
          border-right: 2px solid #ffffff;
          pointer-events: none;
          transition: width 0.35s ease, height 0.35s ease;
        }

        /* Bottom-Left Corner Line */
        .map-wrap::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 90px;
          height: 90px;
          border-bottom: 2px solid #ffffff;
          border-left: 2px solid #ffffff;
          pointer-events: none;
          transition: width 0.35s ease, height 0.35s ease;
        }

        .map-wrap:hover::before,
        .map-wrap:hover::after {
          width: 130px;
          height: 130px;
        }

        .map-box {
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 4px;
          overflow: hidden;
          background: #0d0d0d;
        }

        .map-box iframe {
          width: 100%;
          height: 380px;
          display: block;
        }

        .map-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: #0a0a0a;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .map-link {
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.45);
          padding-bottom: 2px;
          transition: border-color 0.25s ease;
        }

        .map-link:hover {
          border-color: #ffffff;
        }

        .venue-info {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .venue-card {
          padding: 32px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.02);
        }

        .venue-label {
          font-size: 0.75rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8a8a8a;
          margin-bottom: 10px;
        }

        .venue-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.25;
          color: #ffffff;
          margin-bottom: 14px;
        }

        .venue-addr {
          font-size: 0.95rem;
          color: #a3a3a3;
          line-height: 1.75;
        }

        .venue-meta-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .meta-box {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.015);
        }

        .meta-lbl {
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7a7a7a;
          margin-bottom: 4px;
        }

        .meta-val {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
        }

        /* Footer - Full Width */
        .footer {
          width: 100%;
          padding: 72px clamp(20px, 5vw, 64px) 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 2;
        }

        .footer-top {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        @media (min-width: 768px) {
          .footer-top {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }

        .footer-tagline {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(1.7rem, 3.5vw, 2.6rem);
          font-weight: 700;
          line-height: 1.15;
          color: #ffffff;
          margin-top: 8px;
        }

        .footer-school {
          font-size: 0.92rem;
          color: #9e9e9e;
        }

        .footer-bottom {
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 0.8rem;
          color: #737373;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="bg-grid" />

      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-left">The Auction Experience · 2026</div>
        <div className="topbar-right">Cricket Auction</div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="school-block">
          <div className="school-name">St. John&apos;s English Medium School</div>
          <div className="school-addr">Subedarpet, Nellore, Andhra Pradesh — 524001</div>
        </div>

        <h1 className="hero-title">
          The Game
          <br />
          Begins Here.
        </h1>

        <p className="hero-sub">
          One stage. A battle for the ultimate squad.
        </p>

        <button className="btn-start" onClick={() => navigate('/setup')}>
          Start Auction
        </button>
      </section>

      {/* Auction Venue Section */}
      <section className="venue-sec">
        <div className="sec-tag">Auction Venue</div>
        <h2 className="sec-title">Welcome to the Big Stage</h2>
        <p className="sec-sub">Where champions are chosen and legends are born</p>

        <div className="venue-grid">
          <div className="map-wrap">
            <div className="map-box">
              <iframe
                title="St. John's English Medium School Location"
                src="https://www.google.com/maps?q=Subedarpet+St.+John%27s+English+Medium+High+School+Nellore&output=embed"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-bar">
                <span>NELLORE · AP 524001</span>
                <a
                  className="map-link"
                  href="https://www.google.com/maps/search/?api=1&query=Subedarpet+St.+John's+English+Medium+High+School+Nellore"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Maps ↗
                </a>
              </div>
            </div>
          </div>

          <div className="venue-info">
            <div className="venue-card">
              <div className="venue-label">Venue</div>
              <h3 className="venue-title">
                St. John&apos;s English
                <br />
                Medium School
              </h3>
              <p className="venue-addr">
                Subedarpet, Nellore
                <br />
                Andhra Pradesh — 524001
                <br />
                India
              </p>
            </div>

            <div className="venue-meta-row">
              <div className="meta-box">
                <div className="meta-lbl">Year</div>
                <div className="meta-val">2026</div>
              </div>
              <div className="meta-box">
                <div className="meta-lbl">Format</div>
                <div className="meta-val">Live Auction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="topbar-left">Cricket Auction · 2026</div>
            <div className="footer-tagline">
              One Stage.
              <br />
              One Champion.
            </div>
          </div>
          <div className="footer-school">
            St. John&apos;s English Medium School · Nellore
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Cricket Auction. All rights reserved.</span>
          <span>Subedarpet, Nellore — 524001</span>
        </div>
      </footer>
    </div>
  )
}