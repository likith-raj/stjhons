import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { AuctionContext } from '../context/AuctionContext'
import * as XLSX from 'xlsx'

export const Results = () => {
  const { state, resetAuction } = useContext(AuctionContext)
  const [showConfirm, setShowConfirm] = useState(false)

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('popstate'))
  }

  const exportToExcel = () => {
    const ws_data = []

    // Header
    ws_data.push(['ST JOHNS PLAYER AUCTION - FINAL RESULTS', '', '', ''])
    ws_data.push([''])

    // For each team
    state.teams.forEach((team) => {
      ws_data.push([team.name, '', '', ''])
      ws_data.push(['PLAYER NAME', 'ROLE', 'CLASS', 'PRICE'])

      team.squad.forEach((player) => {
        const soldPlayer = state.soldPlayers.find((sp) => sp.id === player.id)
        ws_data.push([player.name, player.role, player.section, `₹${soldPlayer?.soldAt || 0}`])
      })

      ws_data.push(['', '', 'TOTAL SPENT', `₹${team.spent}`])
      ws_data.push(['', '', 'REMAINING BUDGET', `₹${team.budget}`])
      ws_data.push(['', '', 'SQUAD SIZE', `${team.squad.length}/${state.rules.maxPlayersPerTeam}`])
      ws_data.push([''])
    })

    // Unsold players
    if (state.unsoldPlayers.length > 0) {
      ws_data.push(['UNSOLD PLAYERS', '', '', ''])
      ws_data.push(['PLAYER NAME', 'ROLE', 'CLASS', ''])
      state.unsoldPlayers.forEach((player) => {
        ws_data.push([player.name, player.role, player.section, ''])
      })
    }

    const ws = XLSX.utils.aoa_to_sheet(ws_data)
    ws['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Results')
    XLSX.writeFile(wb, 'auction_results.xlsx')
  }

  const exportToCSV = () => {
    let csv = 'PLAYER,ROLE,CLASS,TEAM,PRICE\n'

    state.teams.forEach((team) => {
      team.squad.forEach((player) => {
        const soldPlayer = state.soldPlayers.find((sp) => sp.id === player.id)
        csv += `"${player.name}","${player.role}","${player.section}","${team.name}","${soldPlayer?.soldAt || 0}"\n`
      })
    })

    if (state.unsoldPlayers.length > 0) {
      csv += '\nUNSOLD PLAYERS\n'
      state.unsoldPlayers.forEach((player) => {
        csv += `"${player.name}","${player.role}","${player.section}","UNSOLD",""\n`
      })
    }

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'auction_results.csv'
    a.click()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    setShowConfirm(true)
  }

  const confirmReset = () => {
    resetAuction()
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-black mb-2">AUCTION RESULTS</h1>
          <p className="text-gray-400">ST JOHNS PLAYER AUCTION</p>
        </motion.div>

        {/* Export Buttons */}
        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          <button onClick={exportToExcel} className="btn-primary">
            📊 EXPORT EXCEL
          </button>
          <button onClick={exportToCSV} className="btn-primary">
            📋 EXPORT CSV
          </button>
          <button onClick={handlePrint} className="btn-primary">
            🖨️ PRINT
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-all"
          >
            🔄 RESET AUCTION
          </button>
        </div>

        {/* Teams Results */}
        <div className="space-y-8">
          {state.teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border-2 overflow-hidden"
              style={{
                borderColor: team.color,
                backgroundColor: team.color + '15',
              }}
            >
              {/* Team Header */}
              <div className="p-6 flex items-center gap-4 justify-between flex-wrap" style={{ backgroundColor: team.color + '30' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: team.color }}
                  ></div>
                  <h2 className="text-3xl font-black">{team.name}</h2>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">TOTAL SPENT</p>
                    <p className="text-2xl font-bold">₹{team.spent.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">REMAINING</p>
                    <p className="text-2xl font-bold">₹{team.budget.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">PLAYERS</p>
                    <p className="text-2xl font-bold">{team.squad.length}</p>
                  </div>
                </div>
              </div>

              {/* Players Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="p-4">PLAYER</th>
                      <th className="p-4">ROLE</th>
                      <th className="p-4">CLASS</th>
                      <th className="p-4 text-right">PRICE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.squad.map((player, j) => {
                      const soldPlayer = state.soldPlayers.find((sp) => sp.id === player.id)
                      return (
                        <tr key={player.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                          <td className="p-4 font-semibold">{player.name}</td>
                          <td className="p-4">{player.role}</td>
                          <td className="p-4">{player.section}</td>
                          <td className="p-4 text-right font-bold text-neon-green">
                            ₹{soldPlayer?.soldAt.toLocaleString() || 0}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Unsold Players */}
        {state.unsoldPlayers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-lg border-2 border-red-500/50 p-6 bg-red-900/15"
          >
            <h3 className="text-2xl font-bold mb-4 text-red-300">UNSOLD PLAYERS ({state.unsoldPlayers.length})</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {state.unsoldPlayers.map((player) => (
                <div
                  key={player.id}
                  className="p-3 bg-gray-900/50 rounded border border-gray-700"
                >
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-xs text-gray-400">
                    {player.role} • {player.section}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-12 grid md:grid-cols-4 gap-4"
        >
          <div className="bg-gray-900/50 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-2">TOTAL SOLD</p>
            <p className="text-4xl font-bold text-neon-green">{state.soldPlayers.length}</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-2">TOTAL UNSOLD</p>
            <p className="text-4xl font-bold text-red-400">{state.unsoldPlayers.length}</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-2">TOTAL RAISED</p>
            <p className="text-4xl font-bold text-neon-cyan">
              ₹{state.teams.reduce((sum, t) => sum + t.spent, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-6 text-center">
            <p className="text-gray-400 mb-2">TOTAL REMAINING</p>
            <p className="text-4xl font-bold text-neon-magenta">
              ₹{state.teams.reduce((sum, t) => sum + t.budget, 0).toLocaleString()}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 rounded-lg p-8 max-w-md"
          >
            <h3 className="text-2xl font-bold mb-4">RESET AUCTION?</h3>
            <p className="text-gray-300 mb-6">THIS WILL CLEAR ALL DATA AND START OVER. THIS ACTION CANNOT BE UNDONE.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn-secondary flex-1"
              >
                CANCEL
              </button>
              <button
                onClick={confirmReset}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg flex-1 transition-all"
              >
                RESET
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
