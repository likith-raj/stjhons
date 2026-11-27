import { useState, useEffect, useRef, useMemo, useContext } from 'react'
import { AuctionContext } from '../context/AuctionContext'
import * as XLSX from 'xlsx'

const CURSOR_COLORS = ['#FF3B30', '#A855F7', '#10B981', '#3B82F6', '#FACC15']

const STATE_DISTRICTS = {
  'Andhra Pradesh': ['Nellore', 'Tirupati', 'Guntur', 'Vijayawada', 'Visakhapatnam', 'Kurnool'],
  'Kerala': ['Kannur', 'Kozhikode', 'Kochi', 'Thiruvananthapuram', 'Thrissur', 'Malappuram'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi']
}

const ALLOWED_ROLES = ['Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper']

function normalizeRole(rawRole) {
  if (!rawRole) return 'All-Rounder'
  const cleaned = String(rawRole).trim().toLowerCase()
  if (cleaned.includes('bat')) return 'Batsman'
  if (cleaned.includes('bowl')) return 'Bowler'
  if (cleaned.includes('wk') || cleaned.includes('keeper') || cleaned.includes('wicket')) {
    return 'Wicket-Keeper'
  }
  if (cleaned.includes('all')) return 'All-Rounder'
  return ALLOWED_ROLES.includes(rawRole.trim()) ? rawRole.trim() : 'All-Rounder'
}

function parseFlexibleNumber(val) {
  if (val === '' || val === null || val === undefined) return ''
  const num = Number(val)
  if (Number.isNaN(num)) return ''
  return num < 0 ? 0 : num
}

export const SetupMerged = () => {
  const { state, setPlayers, setTeams, setRules } = useContext(AuctionContext)
  const [cursorIdx, setCursorIdx] = useState(0)
  const orbRefs = useRef([])
  const teamFolderInputRef = useRef(null)
  const teamExcelInputRef = useRef(null)
  const playerExcelInputRef = useRef(null)
  const playerPhotosInputRef = useRef(null)

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

  const activeCursorColor = CURSOR_COLORS[cursorIdx]
  const cursorDataUrl = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${activeCursorColor}" stroke="#000000" stroke-width="1.5" stroke-linejoin="round"><path d="M4 2L20 11.5L12.5 13.5L9 21L4 2Z"/></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 4 2, auto`
  }, [activeCursorColor])

  // STATE - BASICS
  const [auctionName, setAuctionName] = useState('')
  const [stateName, setStateName] = useState('Kerala')
  const [districtName, setDistrictName] = useState('Kannur')
  const [publiclyDiscoverable, setPubliclyDiscoverable] = useState(false)

  useEffect(() => {
    const districts = STATE_DISTRICTS[stateName] || []
    if (!districts.includes(districtName)) {
      setDistrictName(districts[0] || '')
    }
  }, [stateName])

  // STATE - LEAGUE SETTINGS
  const [numTeams, setNumTeams] = useState(2)
  const [playersPerTeam, setPlayersPerTeam] = useState(11)
  const [iconsOwnersCount, setIconsOwnersCount] = useState(0)
  const [extraPlayersAllowed, setExtraPlayersAllowed] = useState(false)

  // STATE - BUDGET & RULES
  const [budgetType, setBudgetType] = useState('amount')
  const [totalPerTeam, setTotalPerTeam] = useState(50000)
  const [basePerPlayer, setBasePerPlayer] = useState(500)
  const [incrementVal, setIncrementVal] = useState(500)
  const [thresholdVal, setThresholdVal] = useState(10000)
  const [incrementAfterVal, setIncrementAfterVal] = useState(1000)
  const [rulesCleared, setRulesCleared] = useState(false)
  const [bidTimerEnabled, setBidTimerEnabled] = useState(false)
  const [firstBidWindow, setFirstBidWindow] = useState(true)
  const [afterEachBid, setAfterEachBid] = useState(true)
  const [tickLastFiveSec, setTickLastFiveSec] = useState(true)

  // STATE - TEAMS
  const [teams, setTeamsLocal] = useState(state.teams || [
    { id: 1, name: 'Team 1', whatsapp: '', logoUrl: '', logoName: '' },
    { id: 2, name: 'Team 2', whatsapp: '', logoUrl: '', logoName: '' },
  ])
  const [teamNotice, setTeamNotice] = useState('')

  // STATE - PLAYERS
  const [players, setPlayersLocal] = useState(state.players || [])
  const [playerMode, setPlayerMode] = useState('excel')
  const [manualText, setManualText] = useState('')
  const [manualName, setManualName] = useState('')
  const [manualAge, setManualAge] = useState('')
  const [manualPhone, setManualPhone] = useState('')
  const [manualRole, setManualRole] = useState('Batsman')
  const [playerNotice, setPlayerNotice] = useState('')
  const [playerError, setPlayerError] = useState('')
  const [photoNotice, setPhotoNotice] = useState('')
  const [validationErrors, setValidationErrors] = useState([])

  // Derived
  const safeNumTeams = Number(numTeams) || 0
  const safePlayersPerTeam = Number(playersPerTeam) || 0
  const safeIconsOwners = Number(iconsOwnersCount) || 0
  const auctionSlotsPerTeam = Math.max(0, safePlayersPerTeam - safeIconsOwners)
  const totalPlayersNeeded = safeNumTeams * auctionSlotsPerTeam
  const currencySymbol = budgetType === 'amount' ? '₹' : '★'
  const unitLabel = budgetType === 'amount' ? 'Amount (₹)' : 'Points'

  const budgetIsZeroOrInvalid =
    totalPerTeam === '' || Number(totalPerTeam) <= 0 ||
    basePerPlayer === '' || Number(basePerPlayer) <= 0

  const budgetExceedsPurse =
    auctionSlotsPerTeam > 0 &&
    Number(basePerPlayer || 0) * auctionSlotsPerTeam > Number(totalPerTeam || 0)

  const rulesAreUnsetOrInvalid =
    rulesCleared ||
    incrementVal === '' ||
    thresholdVal === '' ||
    incrementAfterVal === '' ||
    Number(incrementVal) < 0 ||
    Number(thresholdVal) < 0 ||
    Number(incrementAfterVal) < 0

  const teamCountMatches = teams.length === safeNumTeams && safeNumTeams > 0

  // HANDLERS - RULES
  const handleClearBiddingRules = () => {
    setIncrementVal('')
    setThresholdVal('')
    setIncrementAfterVal('')
    setRulesCleared(true)
  }

  const handleRestoreDefaultRules = () => {
    setIncrementVal(500)
    setThresholdVal(10000)
    setIncrementAfterVal(1000)
    setRulesCleared(false)
  }

  // HANDLERS - TEAMS
  const handleAddTeam = () => {
    const nextId = teams.length > 0 ? Math.max(...teams.map((t) => t.id)) + 1 : 1
    setTeamsLocal([
      ...teams,
      { id: nextId, name: '', whatsapp: '', logoUrl: '', logoName: '' },
    ])
    setTeamNotice('')
  }

  const handleRemoveTeam = (id) => {
    setTeamsLocal((prev) => prev.filter((t) => t.id !== id))
  }

  const handleUpdateTeam = (id, field, value) => {
    setTeamsLocal((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    )
  }

  const handleClearTeams = () => {
    setTeamsLocal([])
    setTeamNotice('All team rows cleared.')
  }

  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const imageFiles = files
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f.name))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))

    if (!imageFiles.length) {
      setTeamNotice('No image files (.jpg, .png, .webp) found in selected folder.')
      return
    }

    setTeamsLocal((prev) => {
      const baseList = prev.length > 0 ? [...prev] : []
      while (baseList.length < imageFiles.length) {
        baseList.push({
          id: baseList.length + 1,
          name: `Team ${baseList.length + 1}`,
          whatsapp: '',
          logoUrl: '',
          logoName: '',
        })
      }

      return baseList.map((team, index) => {
        const matchedFile = imageFiles[index]
        if (!matchedFile) return team
        return {
          ...team,
          logoUrl: URL.createObjectURL(matchedFile),
          logoName: matchedFile.name,
        }
      })
    })

    setTeamNotice(`Arranged ${imageFiles.length} logo image(s) from folder sequentially.`)
    e.target.value = ''
  }

  // HANDLERS - PLAYERS EXCEL/CSV
  const extractPlayersFromRows = (rows) => {
    const extracted = []
    rows.forEach((row, idx) => {
      if (!row || typeof row !== 'object') return

      const entries = Object.entries(row)
      const findVal = (patterns) => {
        for (const [k, v] of entries) {
          const normKey = String(k).trim().toLowerCase().replace(/[^a-z0-9]/g, '')
          if (patterns.some((p) => normKey.includes(p))) {
            return v
          }
        }
        return ''
      }

      const rawName = findVal(['playername', 'name', 'player'])
      const nameStr = rawName !== undefined && rawName !== null ? String(rawName).trim() : ''
      if (!nameStr) return

      const rawNo = findVal(['playerno', 'player number', 'no', 'slno', 'serial', 'id'])
      const parsedNo = Number(String(rawNo || '').replace(/[^0-9]/g, ''))
      const playerNo = parsedNo > 0 ? parsedNo : extracted.length + 1

      const rawAge = findVal(['age', 'yrs', 'years'])
      const ageNum = Number(String(rawAge || '').replace(/[^0-9]/g, ''))
      const age = ageNum > 0 ? ageNum : ''

      const rawPhone = findVal(['phone', 'mobile', 'contact', 'whatsapp', 'number'])
      const phone = rawPhone !== undefined && rawPhone !== null ? String(rawPhone).trim() : ''

      const rawRole = findVal(['role', 'category', 'type', 'position', 'skill'])
      const role = normalizeRole(rawRole)

      extracted.push({
        id: `${playerNo}-${idx}-${Date.now()}`,
        playerNo,
        name: nameStr,
        age,
        phone,
        role,
        basePrice: Number(basePerPlayer) || 0,
        photoUrl: '',
        status: 'AVAILABLE',
      })
    })
    return extracted
  }

  const handlePlayerExcelUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPlayerError('')
    setPlayerNotice('')

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

        const parsedPlayers = extractPlayersFromRows(jsonRows)
        if (!parsedPlayers.length) {
          setPlayerError('No valid player names found in file.')
          return
        }

        setPlayersLocal(parsedPlayers)
        setPlayerNotice(`Extracted ${parsedPlayers.length} player(s) from "${file.name}".`)
      } catch (err) {
        setPlayerError('Could not read file. Please upload a valid .xlsx, .xls, or .csv sheet.')
      }
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  const handleTeamExcelUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setTeamNotice('')

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

        const importedTeams = rows
          .map((r, i) => {
            const entries = Object.entries(r)
            let tName = ''
            let tPhone = ''
            for (const [k, v] of entries) {
              const key = String(k).toLowerCase()
              if (!tName && (key.includes('team') || key.includes('name'))) {
                tName = String(v).trim()
              }
              if (!tPhone && (key.includes('whatsapp') || key.includes('phone') || key.includes('mobile'))) {
                tPhone = String(v).trim()
              }
            }
            if (!tName) return null
            return {
              id: i + 1,
              name: tName,
              whatsapp: tPhone,
              logoUrl: '',
              logoName: '',
            }
          })
          .filter(Boolean)

        if (importedTeams.length) {
          setTeamsLocal(importedTeams)
          setTeamNotice(`Imported ${importedTeams.length} team(s) from "${file.name}".`)
        } else {
          setTeamNotice('No team names found in Excel file.')
        }
      } catch {
        setTeamNotice('Failed to import teams file.')
      }
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  const handleAddManualRow = (e) => {
    e.preventDefault()
    setPlayerError('')
    if (!manualName.trim()) {
      setPlayerError('Please enter player name.')
      return
    }
    const nextNo = players.length + 1
    setPlayersLocal((prev) => [
      ...prev,
      {
        id: `${nextNo}-${Date.now()}`,
        playerNo: nextNo,
        name: manualName.trim(),
        age: manualAge ? Number(manualAge) : '',
        phone: manualPhone.trim(),
        role: normalizeRole(manualRole),
        basePrice: Number(basePerPlayer) || 0,
        photoUrl: '',
        status: 'AVAILABLE',
      },
    ])
    setManualName('')
    setManualAge('')
    setManualPhone('')
    setPlayerNotice(`Added Player #${nextNo} (${manualName.trim()}).`)
  }

  const handleParsePastedList = () => {
    setPlayerError('')
    const lines = manualText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    if (!lines.length) {
      setPlayerError('Paste at least one player line first.')
      return
    }

    const parsed = lines.map((line, idx) => {
      const cleanLine = line.replace(/^\d+[\).\-\s]+/, '')
      const parts = cleanLine.split(/[,|\t]+/).map((p) => p.trim())
      const name = parts[0] || `Player ${players.length + idx + 1}`
      const ageCandidate = parts.find((p) => /^\d{1,2}$/.test(p))
      const phoneCandidate = parts.find((p) => /^\d{7,15}$/.test(p.replace(/[^0-9]/g, '')))
      const roleCandidate = parts.find((p) => /bat|bowl|all|wk|keep/i.test(p))

      return {
        id: `${players.length + idx + 1}-${Date.now()}-${idx}`,
        playerNo: players.length + idx + 1,
        name,
        age: ageCandidate ? Number(ageCandidate) : '',
        phone: phoneCandidate || '',
        role: normalizeRole(roleCandidate || 'All-Rounder'),
        basePrice: Number(basePerPlayer) || 0,
        photoUrl: '',
        status: 'AVAILABLE',
      }
    })

    setPlayersLocal((prev) => [...prev, ...parsed])
    setManualText('')
    setPlayerNotice(`Added ${parsed.length} player(s) from pasted list.`)
  }

  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    let matchedCount = 0
    const fileMap = new Map()

    files.forEach((file) => {
      const baseName = file.name.replace(/\.[^/.]+$/, '').trim()
      fileMap.set(baseName, file)
    })

    setPlayersLocal((prev) =>
      prev.map((p) => {
        const key = String(p.playerNo)
        const matched = fileMap.get(key)
        if (matched) {
          matchedCount += 1
          return {
            ...p,
            photoUrl: URL.createObjectURL(matched),
          }
        }
        return p
      })
    )

    setPhotoNotice(`Matched ${matchedCount} photo(s) by serial number.`)
    e.target.value = ''
  }

  const handleDownloadTemplate = () => {
    const sampleRows = [
      {
        'Player No': 1,
        'Player Name': 'Aarav Sharma',
        'Age': 17,
        'Phone Number': '9876543210',
        'Role': 'Batsman',
      },
      {
        'Player No': 2,
        'Player Name': 'Rohan Verma',
        'Age': 16,
        'Phone Number': '9876543211',
        'Role': 'Bowler',
      },
    ]
    const worksheet = XLSX.utils.json_to_sheet(sampleRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Players')
    XLSX.writeFile(workbook, 'BidArena_Players_Template.xlsx')
  }

  // NAVIGATION
  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  // START AUCTION
  const handleStartAuction = () => {
    const errors = []
    
    // Basic validation
    if (!auctionName.trim()) errors.push('Auction Name is required.')
    if (safeNumTeams <= 0) errors.push('Number of Teams must be greater than 0.')
    if (safePlayersPerTeam <= 0) errors.push('Players Per Team must be greater than 0.')
    
    // Budget validation
    if (budgetIsZeroOrInvalid) {
      errors.push(`Total ${unitLabel} per Team and Base ${unitLabel} per Player must be greater than 0.`)
    }
    if (budgetExceedsPurse) {
      errors.push('Base price × auction slots exceeds Total Purse per Team.')
    }
    
    // Rules validation
    if (rulesAreUnsetOrInvalid) {
      errors.push('Bidding Rules (Increment, Threshold, Increment After) are unset or invalid.')
    }
    
    // Team validation
    if (!teamCountMatches) {
      errors.push(`Team count mismatch: need ${safeNumTeams}, have ${teams.length}.`)
    }
    if (teams.some((t) => !t.name.trim())) {
      errors.push('Every team must have a name.')
    }
    
    // Player validation - RELAXED
    if (players.length === 0) {
      errors.push('Please add at least 1 player.')
    } else if (!extraPlayersAllowed && players.length < totalPlayersNeeded) {
      errors.push(`Need ${totalPlayersNeeded} players, have ${players.length}. Enable "Extra players allowed" or add more players.`)
    } else if (extraPlayersAllowed && players.length < totalPlayersNeeded) {
      // Warn but allow
      console.warn(`Warning: Only ${players.length} players for ${totalPlayersNeeded} slots. Using extra players mode.`)
    }

    setValidationErrors(errors)
    if (errors.length > 0) return

    // Save to context
    setPlayers(players)
    setTeams(teams.map((t) => ({
      ...t,
      budget: totalPerTeam,
      squad: [],
      spent: 0,
    })))
    setRules({
      auctionName: auctionName.trim(),
      state: stateName,
      district: districtName,
      numTeams: safeNumTeams,
      maxPlayersPerTeam: safePlayersPerTeam,
      budgetType,
      totalBudget: totalPerTeam,
      basePrice: basePerPlayer,
      increment: incrementVal,
      threshold: thresholdVal,
      incrementAfter: incrementAfterVal,
    })

    navigate('/auction')
  }

  const availableDistricts = STATE_DISTRICTS[stateName] || []

  return (
    <div
      className="w-full min-h-screen bg-[#050505] text-white relative overflow-x-hidden"
      style={{ cursor: cursorDataUrl }}
    >
      {/* Background Grid */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0" />

      {/* Floating Orbs */}
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

      {/* HEADER */}
      <header className="w-full bg-[#090909] px-5 sm:px-10 lg:px-16 py-6 flex flex-wrap items-center justify-between gap-4 relative z-10 border-b border-neutral-900">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white text-black font-bold font-display flex items-center justify-center text-sm tracking-tight">
            BA
          </div>
          <div>
            <div className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              BidArena
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-400">
              Auction Setup
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#151515] text-white font-display font-semibold text-xs flex items-center justify-center">
            ST
          </div>
          <div className="text-sm font-medium text-neutral-200">St. John's</div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-10 space-y-10">
        {/* VALIDATION ERRORS */}
        {validationErrors.length > 0 && (
          <div className="bg-[#170909] rounded-lg p-5 space-y-2 border border-red-900/50">
            {validationErrors.map((err, i) => (
              <div key={i} className="text-xs font-semibold text-red-500">
                ⚠ {err}
              </div>
            ))}
          </div>
        )}

        {/* 1. BASICS SECTION */}
        <section className="bg-[#0a0a0a] rounded-lg p-6 sm:p-8 border border-neutral-900">
          <h2 className="font-display text-2xl font-bold tracking-tight mb-6">Basics</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                Auction Name
              </label>
              <input
                type="text"
                value={auctionName}
                onChange={(e) => setAuctionName(e.target.value)}
                placeholder="e.g. BidArena Premier League 2025"
                className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                State
              </label>
              <select
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition"
              >
                {Object.keys(STATE_DISTRICTS).map((st) => (
                  <option key={st} value={st} className="bg-[#0d0d0d] text-white">
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                District
              </label>
              <select
                value={districtName}
                onChange={(e) => setDistrictName(e.target.value)}
                className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition"
              >
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist} className="bg-[#0d0d0d] text-white">
                    {dist}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 rounded bg-[#060606] border border-neutral-900">
            <div>
              <div className="text-sm font-semibold text-white">Publicly Discoverable</div>
              <div className="text-xs text-neutral-400 mt-0.5">
                List this auction on the public directory (4+ teams required)
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPubliclyDiscoverable((prev) => !prev)}
              className={`w-13 h-7 rounded-full p-1 transition flex items-center ${
                publiclyDiscoverable ? 'bg-white justify-end' : 'bg-[#222222] justify-start'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full transition ${
                  publiclyDiscoverable ? 'bg-black' : 'bg-neutral-400'
                }`}
              />
            </button>
          </div>
        </section>

        {/* 2. LEAGUE SETTINGS SECTION */}
        <section className="bg-[#0a0a0a] rounded-lg p-6 sm:p-8 border border-neutral-900">
          <h2 className="font-display text-2xl font-bold tracking-tight mb-6">League Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-7">
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                Number of Teams
              </label>
              <input
                type="number"
                min="0"
                value={numTeams}
                onChange={(e) => setNumTeams(parseFlexibleNumber(e.target.value))}
                className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm font-display focus:outline-none focus:border-neutral-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                Players Per Team
              </label>
              <input
                type="number"
                min="0"
                value={playersPerTeam}
                onChange={(e) => setPlayersPerTeam(parseFlexibleNumber(e.target.value))}
                className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm font-display focus:outline-none focus:border-neutral-600 transition"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-3">
              Icons + Owners Per Team
            </label>
            <div className="grid grid-cols-4 gap-3 max-w-md">
              {[0, 1, 2, 3].map((val) => {
                const active = iconsOwnersCount === val
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setIconsOwnersCount(val)}
                    className={`py-3 rounded font-display text-base font-bold transition border ${
                      active
                        ? 'bg-white text-black border-white'
                        : 'bg-[#0e0e0e] text-neutral-300 border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 rounded bg-[#060606] border border-neutral-900 mb-6">
            <div>
              <div className="text-sm font-semibold text-white">Extra players allowed</div>
              <div className="text-xs text-neutral-400 mt-0.5">
                Unsold players return to pool until all teams are full
              </div>
            </div>
            <button
              type="button"
              onClick={() => setExtraPlayersAllowed((prev) => !prev)}
              className={`w-13 h-7 rounded-full p-1 transition flex items-center ${
                extraPlayersAllowed ? 'bg-white justify-end' : 'bg-[#222222] justify-start'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full transition ${
                  extraPlayersAllowed ? 'bg-black' : 'bg-neutral-400'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#060606] rounded-lg p-5 border border-neutral-900">
            <div>
              <div className="text-xs text-neutral-400">Each team bids for</div>
              <div className="font-display text-xl font-bold mt-0.5">{auctionSlotsPerTeam} players</div>
            </div>
            <div>
              <div className="text-xs text-neutral-400">Icons/Owners</div>
              <div className="font-display text-xl font-bold mt-0.5">{safeIconsOwners} per team</div>
            </div>
            <div className="sm:text-right">
              <div className="font-display text-2xl font-bold text-white">{totalPlayersNeeded}</div>
              <div className="text-xs text-neutral-400">total needed</div>
            </div>
          </div>
        </section>

        {/* 3. BUDGET & BIDDING RULES SECTION */}
        <section className="bg-[#0a0a0a] rounded-lg p-6 sm:p-8 border border-neutral-900">
          <h2 className="font-display text-2xl font-bold tracking-tight mb-6">Budget &amp; Bidding Rules</h2>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
              Budget Type
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => setBudgetType('amount')}
                className={`py-3 px-4 rounded font-display text-sm font-semibold transition border ${
                  budgetType === 'amount'
                    ? 'bg-white text-black border-white'
                    : 'bg-[#0d0d0d] text-neutral-300 border-neutral-800 hover:border-neutral-600'
                }`}
              >
                ₹ Amount
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('points')}
                className={`py-3 px-4 rounded font-display text-sm font-semibold transition border ${
                  budgetType === 'points'
                    ? 'bg-white text-black border-white'
                    : 'bg-[#0d0d0d] text-neutral-300 border-neutral-800 hover:border-neutral-600'
                }`}
              >
                ★ Points
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                Total {unitLabel} per Team
              </label>
              <input
                type="number"
                min="0"
                value={totalPerTeam}
                onChange={(e) => setTotalPerTeam(parseFlexibleNumber(e.target.value))}
                className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm font-display focus:outline-none focus:border-neutral-600 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                Base {unitLabel} per Player
              </label>
              <input
                type="number"
                min="0"
                value={basePerPlayer}
                onChange={(e) => setBasePerPlayer(parseFlexibleNumber(e.target.value))}
                className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm font-display focus:outline-none focus:border-neutral-600 transition"
              />
            </div>
          </div>

          {(budgetIsZeroOrInvalid || budgetExceedsPurse) && (
            <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-red-500 bg-[#1a0a0a] rounded-lg p-3 border border-red-900/50">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
              <span>
                {budgetExceedsPurse
                  ? 'Base price × auction slots exceeds Total Purse per Team.'
                  : `Enter positive values above 0 for Total and Base ${unitLabel}.`}
              </span>
            </div>
          )}

          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="font-display text-base font-bold uppercase tracking-wide">
                Bidding Rules
              </div>
              <div className="flex items-center gap-2">
                {rulesCleared && (
                  <button
                    type="button"
                    onClick={handleRestoreDefaultRules}
                    className="px-3 py-1.5 rounded bg-[#151515] text-xs font-semibold text-neutral-200 hover:bg-[#222] transition border border-neutral-800"
                  >
                    Reset to Default
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClearBiddingRules}
                  className="px-3 py-1.5 rounded bg-[#1a0a0a] text-xs font-semibold text-red-400 hover:bg-[#221111] transition border border-red-900/50"
                >
                  ✕ Remove Rules
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                  Increment
                </label>
                <input
                  type="number"
                  min="0"
                  value={incrementVal}
                  onChange={(e) => {
                    setRulesCleared(false)
                    setIncrementVal(parseFlexibleNumber(e.target.value))
                  }}
                  placeholder="0"
                  className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm font-display focus:outline-none focus:border-neutral-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                  Threshold
                </label>
                <input
                  type="number"
                  min="0"
                  value={thresholdVal}
                  onChange={(e) => {
                    setRulesCleared(false)
                    setThresholdVal(parseFlexibleNumber(e.target.value))
                  }}
                  placeholder="0"
                  className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm font-display focus:outline-none focus:border-neutral-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">
                  Increment After
                </label>
                <input
                  type="number"
                  min="0"
                  value={incrementAfterVal}
                  onChange={(e) => {
                    setRulesCleared(false)
                    setIncrementAfterVal(parseFlexibleNumber(e.target.value))
                  }}
                  placeholder="0"
                  className="w-full px-4 py-3.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm font-display focus:outline-none focus:border-neutral-600 transition"
                />
              </div>
            </div>

            {rulesAreUnsetOrInvalid && (
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-500 bg-[#1a0a0a] rounded-lg p-3 border border-red-900/50">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
                <span>Bidding rules are not set. Enter values in Increment, Threshold, and Increment After.</span>
              </div>
            )}
          </div>

          {/* Bid Timer */}
          <div className="py-5 px-5 rounded-lg bg-[#060606] border border-neutral-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-white">⏱ Bid Timer</div>
                <div className="text-xs text-neutral-400 mt-0.5">
                  Countdown while bidding (you always control tap to sell/unsold)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBidTimerEnabled((prev) => !prev)}
                className={`w-13 h-7 rounded-full p-1 transition flex items-center ${
                  bidTimerEnabled ? 'bg-white justify-end' : 'bg-[#222222] justify-start'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full transition ${
                    bidTimerEnabled ? 'bg-black' : 'bg-neutral-400'
                  }`}
                />
              </button>
            </div>

            {bidTimerEnabled && (
              <div className="mt-5 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0a0a0a] rounded-lg p-4 border border-neutral-900">
                <button
                  type="button"
                  onClick={() => setFirstBidWindow((p) => !p)}
                  className={`py-2.5 px-3.5 rounded text-xs font-semibold flex items-center justify-between transition border ${
                    firstBidWindow
                      ? 'bg-white text-black border-white'
                      : 'bg-[#141414] text-neutral-300 border-neutral-800'
                  }`}
                >
                  <span>First Bid Window</span>
                  <span>{firstBidWindow ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAfterEachBid((p) => !p)}
                  className={`py-2.5 px-3.5 rounded text-xs font-semibold flex items-center justify-between transition border ${
                    afterEachBid
                      ? 'bg-white text-black border-white'
                      : 'bg-[#141414] text-neutral-300 border-neutral-800'
                  }`}
                >
                  <span>After Each Bid</span>
                  <span>{afterEachBid ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTickLastFiveSec((p) => !p)}
                  className={`py-2.5 px-3.5 rounded text-xs font-semibold flex items-center justify-between transition border ${
                    tickLastFiveSec
                      ? 'bg-white text-black border-white'
                      : 'bg-[#141414] text-neutral-300 border-neutral-800'
                  }`}
                >
                  <span>Tick Sound (Last 5s)</span>
                  <span>{tickLastFiveSec ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 4. TEAMS SECTION */}
        <section className="bg-[#0a0a0a] rounded-lg p-6 sm:p-8 border border-neutral-900">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold">Teams</h2>
              <span
                className={`font-display text-sm font-bold px-2.5 py-1 rounded border ${
                  teamCountMatches
                    ? 'bg-[#141414] text-white border-neutral-800'
                    : 'bg-[#1c0909] text-red-500 border-red-900/50'
                }`}
              >
                {teams.length} / {safeNumTeams}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <input
                ref={teamExcelInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleTeamExcelUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => teamExcelInputRef.current?.click()}
                className="px-3.5 py-2 rounded bg-[#141414] text-xs font-semibold text-neutral-200 hover:bg-[#1f1f1f] transition border border-neutral-800"
              >
                Import Excel
              </button>

              <input
                ref={teamFolderInputRef}
                type="file"
                webkitdirectory=""
                directory=""
                multiple
                onChange={handleFolderSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => teamFolderInputRef.current?.click()}
                className="px-3.5 py-2 rounded bg-[#141414] text-xs font-semibold text-neutral-200 hover:bg-[#1f1f1f] transition border border-neutral-800"
              >
                📁 Logo Folder
              </button>

              <button
                type="button"
                onClick={handleClearTeams}
                className="px-3.5 py-2 rounded bg-[#141414] text-xs font-semibold text-red-400 hover:text-red-300 transition border border-neutral-800"
              >
                ✕ Clear
              </button>
            </div>
          </div>

          {teamNotice && (
            <div className="mb-4 text-xs text-neutral-300 bg-[#060606] rounded-lg p-3 border border-neutral-900">
              {teamNotice}
            </div>
          )}

          {/* Team Rows */}
          <div className="space-y-3 mb-5">
            {teams.map((team, idx) => (
              <div
                key={team.id}
                className="grid grid-cols-12 gap-3 items-center bg-[#060606] rounded-lg px-3.5 py-2.5 border border-neutral-900 hover:border-neutral-800 transition"
              >
                <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                  <span className="font-display text-sm font-bold text-neutral-400">
                    {idx + 1}
                  </span>
                  {team.logoUrl ? (
                    <img
                      src={team.logoUrl}
                      alt={team.name || `Team ${idx + 1}`}
                      className="w-7 h-7 rounded-full object-cover bg-[#181818]"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-[#141414] text-[10px] font-display flex items-center justify-center text-neutral-500 border border-neutral-800">
                      L{idx + 1}
                    </span>
                  )}
                </div>

                <div className="col-span-5 sm:col-span-6">
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => handleUpdateTeam(team.id, 'name', e.target.value)}
                    placeholder="Team name"
                    className="w-full px-3 py-2 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition"
                  />
                </div>

                <div className="col-span-4 sm:col-span-4">
                  <input
                    type="text"
                    value={team.whatsapp}
                    onChange={(e) => handleUpdateTeam(team.id, 'whatsapp', e.target.value)}
                    placeholder="WhatsApp"
                    className="w-full px-3 py-2 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition"
                  />
                </div>

                <div className="col-span-1 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveTeam(team.id)}
                    className="px-2 py-1 text-neutral-400 hover:text-red-500 font-bold transition"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddTeam}
            className="px-4 py-2.5 rounded bg-white text-black font-display text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 transition border border-white"
          >
            + Add Team
          </button>

          {!teamCountMatches && (
            <div className="mt-3 text-xs font-semibold text-red-500">
              Team count must match number of teams (need {safeNumTeams}, got {teams.length}).
            </div>
          )}
        </section>

        {/* 5. PLAYERS SECTION */}
        <section className="bg-[#0a0a0a] rounded-lg p-6 sm:p-8 border border-neutral-900">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-2xl font-bold">Players</h2>
              <span className="font-display text-sm font-bold px-2.5 py-1 rounded bg-[#0d0d0d] text-white border border-neutral-800">
                {players.length} / {totalPlayersNeeded}
              </span>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="px-3 py-1.5 rounded bg-[#0d0d0d] text-xs font-semibold text-neutral-200 hover:bg-[#171717] transition border border-neutral-800"
            >
              ↓ Download Template
            </button>
          </div>

          <div className="text-xs text-neutral-400 mb-6">
            {safeNumTeams} × {auctionSlotsPerTeam} = {totalPlayersNeeded} players · Roles: Batsman, Bowler, All-Rounder, Wicket-Keeper
          </div>

          <div className="text-sm font-semibold mb-3">Add Players</div>

          {/* Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div
              onClick={() => {
                setPlayerMode('excel')
                playerExcelInputRef.current?.click()
              }}
              className="p-5 rounded-lg cursor-pointer transition bg-[#060606] border border-neutral-900 hover:border-neutral-700"
            >
              <input
                ref={playerExcelInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handlePlayerExcelUpload}
                className="hidden"
              />
              <div className="font-display text-sm font-bold text-white mb-1">
                Import from Excel
              </div>
              <div className="text-xs text-neutral-400">
                Upload .xlsx / .xls / .csv file — extracts player data in order
              </div>
            </div>

            <div
              onClick={() => setPlayerMode('manual')}
              className="p-5 rounded-lg cursor-pointer transition bg-[#060606] border border-neutral-900 hover:border-neutral-700"
            >
              <div className="font-display text-sm font-bold text-white mb-1">
                Paste or Type
              </div>
              <div className="text-xs text-neutral-400">
                Paste WhatsApp list or add rows by hand
              </div>
            </div>
          </div>

          {/* Manual Entry Panel */}
          {playerMode === 'manual' && (
            <div className="bg-[#060606] rounded-lg p-5 mb-6 space-y-5 border border-neutral-900">
              <form onSubmit={handleAddManualRow} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Player Name"
                  className="sm:col-span-2 px-3.5 py-2.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition"
                />
                <input
                  type="number"
                  min="0"
                  value={manualAge}
                  onChange={(e) => setManualAge(parseFlexibleNumber(e.target.value))}
                  placeholder="Age"
                  className="px-3.5 py-2.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition"
                />
                <input
                  type="text"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="Phone"
                  className="px-3.5 py-2.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition"
                />
                <div className="flex gap-2">
                  <select
                    value={manualRole}
                    onChange={(e) => setManualRole(e.target.value)}
                    className="flex-1 px-2.5 py-2.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-xs focus:outline-none focus:border-neutral-600 transition"
                  >
                    {ALLOWED_ROLES.map((r) => (
                      <option key={r} value={r} className="bg-[#0d0d0d]">
                        {r}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded bg-white text-black font-display text-xs font-bold uppercase border border-white hover:bg-neutral-200 transition"
                  >
                    Add
                  </button>
                </div>
              </form>

              <div>
                <textarea
                  rows={3}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste: 1. Rahul Kumar, 17, 9876543210, Batsman"
                  className="w-full px-3.5 py-2.5 rounded bg-[#0d0d0d] border border-neutral-800 text-white text-sm focus:outline-none focus:border-neutral-600 transition mb-2.5"
                />
                <button
                  type="button"
                  onClick={handleParsePastedList}
                  className="px-4 py-2 rounded bg-[#181818] text-xs font-semibold text-white hover:bg-[#242424] transition border border-neutral-800"
                >
                  Extract Pasted Players
                </button>
              </div>
            </div>
          )}

          {playerError && (
            <div className="mb-4 text-xs font-semibold text-red-500 bg-[#1a0a0a] rounded-lg p-3 border border-red-900/50">
              {playerError}
            </div>
          )}
          {playerNotice && (
            <div className="mb-4 text-xs text-neutral-300 bg-[#060606] rounded-lg p-3 border border-neutral-900">
              {playerNotice}
            </div>
          )}

          {/* Players Table */}
          {players.length > 0 && (
            <div className="overflow-x-auto bg-[#060606] rounded-lg p-4 mb-6 border border-neutral-900">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-neutral-400 border-b border-neutral-800">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Photo</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Age</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((p) => (
                    <tr key={p.id} className="border-b border-neutral-900/80 text-neutral-200 hover:bg-[#0d0d0d]">
                      <td className="py-2.5 px-3 font-display font-bold">{p.playerNo}</td>
                      <td className="py-2.5 px-3">
                        {p.photoUrl ? (
                          <img
                            src={p.photoUrl}
                            alt={p.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="inline-flex w-8 h-8 rounded-full bg-[#151515] items-center justify-center text-xs text-neutral-500 border border-neutral-800">
                            —
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-medium">{p.name}</td>
                      <td className="py-2.5 px-3 text-neutral-400">{p.age || '—'}</td>
                      <td className="py-2.5 px-3 text-neutral-400">{p.phone || '—'}</td>
                      <td className="py-2.5 px-3 text-xs font-semibold">{p.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Photos Upload */}
          <div className="bg-[#060606] rounded-lg p-5 border border-neutral-900">
            <div className="text-sm font-semibold mb-3">Photos (Optional)</div>
            <input
              ref={playerPhotosInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              multiple
              onChange={handlePhotosUpload}
              className="hidden"
            />
            <div
              onClick={() => playerPhotosInputRef.current?.click()}
              className="py-7 px-4 rounded-lg bg-[#050505] text-center cursor-pointer hover:bg-[#0c0c0c] transition border border-dashed border-neutral-800 hover:border-neutral-600"
            >
              <div className="text-sm font-medium text-white">Upload Player Photos</div>
              <div className="text-xs text-neutral-400 mt-1">JPG · PNG only</div>
            </div>
            <div className="text-xs text-neutral-400 mt-3">
              Auto-match by filename: "1", "1.jpg", or "1.png" for player #1
            </div>
            {photoNotice && (
              <div className="mt-2 text-xs text-neutral-200">{photoNotice}</div>
            )}
          </div>
        </section>

        {/* START AUCTION BUTTON */}
        <section className="bg-[#0a0a0a] rounded-lg p-6 sm:p-8 border border-neutral-900">
          {/* Errors at bottom */}
          {validationErrors.length > 0 && (
            <div className="bg-[#170909] rounded-lg p-4 mb-6 space-y-2 border border-red-900/50">
              <div className="text-sm font-bold text-red-400 mb-2">❌ CANNOT START - Fix these issues:</div>
              {validationErrors.map((err, i) => (
                <div key={i} className="text-xs font-semibold text-red-500">
                  • {err}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-neutral-400">
              All parameters set · Teams: {teams.length}/{safeNumTeams} · Players: {players.length}/{totalPlayersNeeded}
            </div>

            <button
              type="button"
              onClick={handleStartAuction}
              className="px-8 py-4 rounded-lg bg-white text-black font-display text-sm font-bold uppercase tracking-widest hover:bg-neutral-200 transition border border-white disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={validationErrors.length > 0 || !teamCountMatches}
            >
              Start Auction →
            </button>
          </div>
        </section>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          background-size: 64px 64px;
        }
      `}</style>
    </div>
  )
}

export default SetupMerged
