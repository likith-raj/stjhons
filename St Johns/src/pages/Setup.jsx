import { useContext, useState, useEffect, useRef } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { AuctionContext } from '../context/AuctionContext'

export const Setup = () => {
  const { state, setPlayers, setTeams, setRules } = useContext(AuctionContext)
  const [players, setPlayersLocal] = useState(state.players || [])
  const [teams, setTeamsLocal] = useState(state.teams || [])
  const [auctionName, setAuctionName] = useState('ST JOHNS AUCTION 2026')
  const [state_name, setState_name] = useState('ANDHRA PRADESH')
  const [district, setDistrict] = useState('NELLORE')
  const [numTeams, setNumTeams] = useState(4)
  const [playersPerTeam, setPlayersPerTeam] = useState(11)
  const [budgetType, setBudgetType] = useState('amount')
  const [totalBudget, setTotalBudget] = useState(2000000)
  const [basePrice, setBasePrice] = useState(50000)
  const [increment, setIncrement] = useState(10000)
  const [threshold, setThreshold] = useState(100000)
  const [errors, setErrors] = useState([])
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const fileInputRef = useRef(null)

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const rows = results.data.filter(
            (row) => row && Object.values(row).some((v) => v && String(v).trim())
          )

          if (rows.length === 0) {
            setUploadError('NO PLAYERS FOUND IN FILE')
            return
          }

          const headers = Object.keys(rows[0]).map((h) => h.trim().toUpperCase())
          const nameIdx = headers.findIndex((h) =>
            ['NAME', 'PLAYER NAME', 'PLAYER'].includes(h)
          )
          const roleIdx = headers.findIndex((h) =>
            ['ROLE', 'CATEGORY', 'TYPE', 'POSITION'].includes(h)
          )
          const priceIdx = headers.findIndex((h) =>
            ['BASE PRICE', 'PRICE', 'BASE'].includes(h)
          )

          if (nameIdx === -1) {
            setUploadError(`MISSING 'NAME' COLUMN. COLUMNS FOUND: ${headers.join(', ')}`)
            return
          }

          const players = rows
            .map((row, idx) => {
              const values = Object.values(row)
              const name = String(values[nameIdx] || '').trim().toUpperCase()
              const role = String(values[roleIdx] || 'BATSMAN').trim().toUpperCase()
              const basePrice = parseInt(values[priceIdx] || 50000) || 50000

              if (!name) return null

              return {
                id: `player_${idx}_${Date.now()}`,
                name,
                role,
                basePrice,
              }
            })
            .filter(Boolean)

          const names = players.map((p) => p.name)
          const duplicates = names.filter((n, i) => names.indexOf(n) !== i)
          if (duplicates.length > 0) {
            setUploadError(`DUPLICATE PLAYER NAMES: ${[...new Set(duplicates)].join(', ')}`)
            return
          }

          setUploadError('')
          setUploadSuccess(`✅ LOADED ${players.length} PLAYERS`)
          setPlayersLocal(players)
          setPlayers(players)

          setTimeout(() => setUploadSuccess(''), 3000)
        } catch (e) {
          setUploadError(`FILE PARSING FAILED: ${e.message}`)
        }
      },
      error: (err) => {
        setUploadError(`CSV ERROR: ${err.message}`)
      },
    })
  }

  const parseExcel = (file) => {
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'binary' })
          const sheet = workbook.Sheets[workbook.SheetNames[0]]
          const rows = XLSX.utils.sheet_to_json(sheet)

          if (rows.length === 0) {
            setUploadError('NO PLAYERS FOUND IN FILE')
            return
          }

          const headers = Object.keys(rows[0]).map((h) => h.trim().toUpperCase())
          const nameIdx = headers.findIndex((h) =>
            ['NAME', 'PLAYER NAME', 'PLAYER'].includes(h)
          )
          const roleIdx = headers.findIndex((h) =>
            ['ROLE', 'CATEGORY', 'TYPE', 'POSITION'].includes(h)
          )
          const priceIdx = headers.findIndex((h) =>
            ['BASE PRICE', 'PRICE', 'BASE'].includes(h)
          )

          if (nameIdx === -1) {
            setUploadError(`MISSING 'NAME' COLUMN. COLUMNS FOUND: ${headers.join(', ')}`)
            return
          }

          const players = rows
            .map((row, idx) => {
              const values = Object.values(row)
              const name = String(values[nameIdx] || '').trim().toUpperCase()
              const role = String(values[roleIdx] || 'BATSMAN').trim().toUpperCase()
              const basePrice = parseInt(values[priceIdx] || 50000) || 50000

              if (!name) return null

              return {
                id: `player_${idx}_${Date.now()}`,
                name,
                role,
                basePrice,
              }
            })
            .filter(Boolean)

          const names = players.map((p) => p.name)
          const duplicates = names.filter((n, i) => names.indexOf(n) !== i)
          if (duplicates.length > 0) {
            setUploadError(`DUPLICATE PLAYER NAMES: ${[...new Set(duplicates)].join(', ')}`)
            return
          }

          setUploadError('')
          setUploadSuccess(`✅ LOADED ${players.length} PLAYERS`)
          setPlayersLocal(players)
          setPlayers(players)

          setTimeout(() => setUploadSuccess(''), 3000)
        } catch (e) {
          setUploadError(`FILE PARSING FAILED: ${e.message}`)
        }
      }
      reader.readAsBinaryString(file)
    } catch (e) {
      setUploadError(`EXCEL ERROR: ${e.message}`)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.name.endsWith('.csv')) {
      parseCSV(file)
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      parseExcel(file)
    } else {
      setUploadError('UNSUPPORTED FORMAT. USE CSV OR XLSX.')
    }
  }

  const handleStartAuction = () => {
    const newErrors = []

    if (players.length === 0) newErrors.push('❌ NO PLAYERS LOADED')
    if (teams.length === 0) newErrors.push('❌ NO TEAMS CREATED')
    if (teams.some((t) => !t.name.trim())) newErrors.push('❌ SOME TEAM NAMES ARE EMPTY')
    if (totalBudget <= 0) newErrors.push('❌ BUDGET MUST BE GREATER THAN 0')
    if (increment < 0) newErrors.push('❌ INCREMENT CANNOT BE NEGATIVE')
    if (players.length < numTeams * playersPerTeam)
      newErrors.push(
        `❌ NOT ENOUGH PLAYERS. NEED ${numTeams * playersPerTeam}, HAVE ${players.length}`
      )

    if (newErrors.length > 0) {
      setErrors(newErrors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setErrors([])
    setRules({
      auctionName,
      state: state_name,
      district,
      numTeams,
      maxPlayersPerTeam: playersPerTeam,
      budgetType,
      threshold,
      basePrice,
      increment,
      totalBudget,
    })

    const teamsData = teams.map((t) => ({
      id: t.id,
      name: t.name.toUpperCase(),
      color: t.color,
      budget: totalBudget,
      squad: [],
      spent: 0,
    }))
    setTeams(teamsData)

    navigate('/auction')
  }

  useEffect(() => {
    setTeamsLocal(
      Array(numTeams)
        .fill(null)
        .map((_, i) => ({
          id: `team_${i}`,
          name: `TEAM ${i + 1}`,
          color: ['#FF1744', '#00BCD4', '#FFC400', '#76FF03', '#E040FB', '#00E5FF', '#FF9100', '#F50057'][i % 8],
        }))
    )
  }, [numTeams])

  return (
    <div className="setup">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@500;600;800&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { margin: 0; padding: 0; }
        
        .setup {
          background: #050505;
          color: #ffffff;
          font-family: 'Space Grotesk', 'Work Sans', system-ui, sans-serif;
          text-transform: uppercase;
          min-height: 100vh;
          position: relative;
          margin: 0;
          padding: 0;
          width: 100%;
        }

        .setup-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .setup-orb {
          position: absolute;
          border-radius: 50%;
          opacity: 0.08;
          animation: float-orb 20s ease-in-out infinite;
        }

        @keyframes float-orb {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-40px) translateX(30px); }
          50% { transform: translateY(-80px) translateX(-30px); }
          75% { transform: translateY(-40px) translateX(30px); }
        }

        .setup-container {
          position: relative;
          z-index: 10;
          max-width: 100%;
          margin: 0;
          padding: 60px 40px;
        }

        @media (max-width: 768px) {
          .setup-container {
            padding: 40px 20px;
          }
        }

        .setup-title {
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 700;
          text-align: center;
          margin-bottom: 60px;
          letter-spacing: 0.08em;
          color: #ffffff;
        }

        .setup-errors {
          background: rgba(255, 59, 48, 0.15);
          border: 1px solid #ff6b6b;
          border-radius: 4px;
          padding: 20px;
          margin-bottom: 40px;
          max-width: 100%;
        }

        .setup-error-txt {
          color: #ff6b6b;
          font-weight: 600;
          font-size: 0.95rem;
          line-height: 1.6;
          letter-spacing: 0.02em;
        }

        .setup-section {
          margin-bottom: 60px;
          padding: 40px;
          background: #0a0a0a;
          border-radius: 2px;
          width: 100%;
        }

        .setup-section-title {
          font-size: clamp(1.3rem, 3.5vw, 1.8rem);
          font-weight: 700;
          margin-bottom: 32px;
          letter-spacing: 0.06em;
          color: #ffffff;
        }

        .setup-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .setup-row {
            grid-template-columns: 1fr;
          }
        }

        .setup-field {
          display: flex;
          flex-direction: column;
        }

        .setup-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #d0d0d0;
          margin-bottom: 10px;
          letter-spacing: 0.04em;
        }

        .setup-input {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          color: #ffffff;
          padding: 12px 16px;
          border-radius: 2px;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
        }

        .setup-input:focus {
          outline: none;
          border-color: #FF8A1F;
          box-shadow: 0 0 15px rgba(255, 138, 31, 0.2);
          background: #151515;
        }

        .setup-input[type="number"] {
          -moz-appearance: textfield;
        }

        .setup-input[type="number"]::-webkit-outer-spin-button,
        .setup-input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .setup-upload {
          border: 2px dashed #1a1a1a;
          border-radius: 2px;
          padding: 48px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #0f0f0f;
          margin-bottom: 20px;
        }

        .setup-upload:hover {
          border-color: #FF8A1F;
          background: #151515;
        }

        .setup-upload-txt {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: 0.04em;
        }

        .setup-upload-sub {
          font-size: 0.9rem;
          color: #888;
          font-weight: 500;
        }

        .setup-success {
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid #10b981;
          color: #10b981;
          padding: 12px;
          border-radius: 2px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .setup-upload-error {
          background: rgba(255, 59, 48, 0.15);
          border: 1px solid #ff6b6b;
          color: #ff6b6b;
          padding: 12px;
          border-radius: 2px;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 20px;
        }

        .setup-preview-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: 0.04em;
        }

        .setup-table {
          width: 100%;
          overflow-x: auto;
          margin-bottom: 20px;
        }

        .setup-table table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .setup-table th {
          text-align: left;
          padding: 12px;
          border-bottom: 1px solid #1a1a1a;
          font-weight: 700;
          color: #d0d0d0;
          letter-spacing: 0.04em;
        }

        .setup-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #0f0f0f;
          color: #aaa;
        }

        .setup-teams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .setup-teams-grid {
            grid-template-columns: 1fr;
          }
        }

        .setup-team-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .setup-team-card:hover {
          border-color: #333;
          background: #151515;
        }

        .setup-team-color {
          width: 100%;
          height: 24px;
          border-radius: 2px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .setup-team-label {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 10px;
          letter-spacing: 0.02em;
        }

        .setup-team-input {
          width: 100%;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          color: #ffffff;
          padding: 12px;
          border-radius: 2px;
          font-family: 'Space Grotesk', system-ui, sans-serif;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
        }

        .setup-team-input:focus {
          outline: none;
          border-color: #FF8A1F;
          background: #151515;
          box-shadow: 0 0 10px rgba(255, 138, 31, 0.2);
        }

        .setup-review-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .setup-review-grid {
            grid-template-columns: 1fr;
          }
        }

        .setup-review-card {
          background: #0f0f0f;
          border: 1px solid #1a1a1a;
          border-radius: 2px;
          padding: 24px;
          text-align: center;
        }

        .setup-review-label {
          font-size: 0.75rem;
          color: #666;
          margin-bottom: 12px;
        }

        .setup-review-value {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
        }

        .setup-btn {
          padding: 16px 48px;
          font-weight: 700;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          border: none;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.04em;
          width: 100%;
          margin-top: 40px;
          background: #FF8A1F;
          color: #050505;
        }

        .setup-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(255, 138, 31, 0.4);
        }

        .setup-btn:active {
          transform: scale(0.98);
        }

        .setup-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      {/* Floating Background Orbs */}
      <div className="setup-bg">
        <div className="setup-orb" style={{ width: '300px', height: '300px', background: '#333', top: '10%', left: '10%', animationDelay: '0s' }}></div>
        <div className="setup-orb" style={{ width: '250px', height: '250px', background: '#444', top: '50%', right: '15%', animationDelay: '-5s' }}></div>
        <div className="setup-orb" style={{ width: '350px', height: '350px', background: '#333', bottom: '10%', left: '50%', animationDelay: '-10s' }}></div>
      </div>

      <div className="setup-container">
        {/* Title */}
        <h1 className="setup-title">SETUP AUCTION</h1>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="setup-errors">
            <div className="setup-error-txt">{errors.map((e, i) => <div key={i}>{e}</div>)}</div>
          </div>
        )}

        {/* SECTION A: Player Registration */}
        <div className="setup-section">
          <h2 className="setup-section-title">01 • PLAYER REGISTRATION</h2>

          <div className="setup-upload" onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div className="setup-upload-txt">DRAG & DROP OR CLICK TO UPLOAD</div>
            <div className="setup-upload-sub">CSV OR EXCEL FILE</div>
          </div>

          {uploadSuccess && <div className="setup-success">{uploadSuccess}</div>}
          {uploadError && <div className="setup-upload-error">❌ {uploadError}</div>}

          {players.length > 0 && (
            <div>
              <div className="setup-preview-title">{players.length} PLAYERS LOADED</div>
              <div className="setup-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>NAME</th>
                      <th>ROLE</th>
                      <th>BASE PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.slice(0, 8).map((p, i) => (
                      <tr key={p.id}>
                        <td>{i + 1}</td>
                        <td>{p.name}</td>
                        <td>{p.role}</td>
                        <td>₹{p.basePrice.toLocaleString()}</td>
                      </tr>
                    ))}
                    {players.length > 8 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', color: '#666' }}>
                          ... AND {players.length - 8} MORE
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* SECTION B: Auction Rules */}
        <div className="setup-section">
          <h2 className="setup-section-title">02 • AUCTION RULES & CONFIGURATION</h2>

          <div className="setup-row">
            <div className="setup-field">
              <label className="setup-label">AUCTION NAME</label>
              <input
                type="text"
                value={auctionName}
                onChange={(e) => setAuctionName(e.target.value.toUpperCase())}
                className="setup-input"
                placeholder="ST JOHNS AUCTION 2026"
              />
            </div>
            <div className="setup-field">
              <label className="setup-label">STATE</label>
              <input
                type="text"
                value={state_name}
                onChange={(e) => setState_name(e.target.value.toUpperCase())}
                className="setup-input"
                placeholder="ANDHRA PRADESH"
              />
            </div>
          </div>

          <div className="setup-row">
            <div className="setup-field">
              <label className="setup-label">DISTRICT</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value.toUpperCase())}
                className="setup-input"
                placeholder="NELLORE"
              />
            </div>
            <div className="setup-field">
              <label className="setup-label">NUMBER OF TEAMS</label>
              <input
                type="number"
                value={numTeams}
                onChange={(e) => setNumTeams(Math.max(1, parseInt(e.target.value) || 1))}
                className="setup-input"
                min="1"
                max="20"
              />
            </div>
          </div>

          <div className="setup-row">
            <div className="setup-field">
              <label className="setup-label">PLAYERS PER TEAM</label>
              <input
                type="number"
                value={playersPerTeam}
                onChange={(e) => setPlayersPerTeam(Math.max(1, parseInt(e.target.value) || 1))}
                className="setup-input"
                min="1"
                max="20"
              />
            </div>
            <div className="setup-field">
              <label className="setup-label">TOTAL BUDGET PER TEAM</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseInt(e.target.value) || 0)}
                className="setup-input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="setup-row">
            <div className="setup-field">
              <label className="setup-label">BASE PRICE</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                className="setup-input"
                placeholder="0"
              />
            </div>
            <div className="setup-field">
              <label className="setup-label">BID INCREMENT</label>
              <input
                type="number"
                value={increment}
                onChange={(e) => setIncrement(parseInt(e.target.value) || 0)}
                className="setup-input"
                placeholder="0"
              />
            </div>
          </div>

          <div className="setup-row">
            <div className="setup-field">
              <label className="setup-label">THRESHOLD (MIN BID)</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                className="setup-input"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* SECTION C: Teams */}
        <div className="setup-section">
          <h2 className="setup-section-title">03 • TEAMS & NAMES</h2>

          <div className="setup-teams-grid">
            {teams.map((team, i) => (
              <div key={i} className="setup-team-card">
                <div
                  className="setup-team-color"
                  style={{ backgroundColor: team.color }}
                />
                <div className="setup-team-label">TEAM {i + 1}</div>
                <input
                  type="text"
                  value={team.name}
                  onChange={(e) => {
                    const updated = [...teams]
                    updated[i] = { ...updated[i], name: e.target.value.toUpperCase() }
                    setTeamsLocal(updated)
                  }}
                  className="setup-team-input"
                  placeholder={`TEAM ${i + 1}`}
                  maxLength="30"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION D: Review */}
        <div className="setup-section">
          <h2 className="setup-section-title">04 • REVIEW & VERIFY</h2>

          <div className="setup-review-grid">
            <div className="setup-review-card">
              <div className="setup-review-label">PLAYERS</div>
              <div className="setup-review-value">{players.length}</div>
            </div>
            <div className="setup-review-card">
              <div className="setup-review-label">TEAMS</div>
              <div className="setup-review-value">{numTeams}</div>
            </div>
            <div className="setup-review-card">
              <div className="setup-review-label">TOTAL BUDGET</div>
              <div className="setup-review-value">₹{(totalBudget / 100000).toFixed(1)}L</div>
            </div>
          </div>

          <div style={{ marginTop: '24px', fontSize: '0.9rem', color: '#888', lineHeight: '1.8' }}>
            <strong>CONFIGURATION:</strong><br/>
            {numTeams} TEAMS × {playersPerTeam} PLAYERS = {numTeams * playersPerTeam} TOTAL SLOTS<br/>
            BASE: ₹{basePrice.toLocaleString()} | INCREMENT: ₹{increment.toLocaleString()} | THRESHOLD: ₹{threshold.toLocaleString()}
          </div>
        </div>

        {/* START BUTTON */}
        <button className="setup-btn" onClick={handleStartAuction} disabled={players.length === 0}>
          START AUCTION
        </button>
      </div>
    </div>
  )
}
