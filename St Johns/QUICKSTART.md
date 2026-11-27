# Quick Start - ST JOHNS PLAYER AUCTION

## Get Running in 30 Seconds

### Prerequisites
- Node.js 16+ installed (check: `node --version`)

### Commands

```powershell
# 1. Navigate to project
cd "St Johns"

# 2. Install dependencies (first time only - takes ~2 minutes)
npm install

# 3. Start dev server
npm run dev

# 4. Open browser
# Main window: http://localhost:5173
# Display window (projector): http://localhost:5173 (then navigate to Display page)
```

That's it! The app auto-recompiles as you edit.

## First Time Testing

1. **On Home page:** Click "START AUCTION"

2. **Player Registration:** 
   - Click "DOWNLOAD SAMPLE CSV"
   - Upload immediately
   - See 30 players loaded

3. **Rules:** Use defaults, click NEXT

4. **Teams:** Create 4 teams with 5 players each, enter team names

5. **Review:** Check summary, click "START AUCTION 🎯"

6. **Auction:**
   - Click team buttons to bid
   - Press 1-4 for keyboard shortcuts
   - Click SOLD when done
   - Repeat ~5 times

7. **Results:** View final standings, export if desired

8. **Multi-Tab Display:**
   - Open NEW tab: `http://localhost:5173`
   - Navigate to Display page
   - Keep both tabs visible
   - Bidding in main tab updates display tab in real-time!

## Commands Reference

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production (creates ./dist)
npm run preview  # Preview production build
```

## Project Structure

```
St Johns/
├── src/
│   ├── pages/           # Page components (Intro, Home, Setup, Auction, Display, Results)
│   ├── components/      # Reusable components (setup wizard steps)
│   ├── context/         # React Context (AuctionContext)
│   ├── utils/           # Utilities (storage, broadcast, colors)
│   ├── App.jsx          # Main app component
│   └── index.css        # Global styles
├── package.json         # Dependencies
├── vite.config.js       # Vite config
├── tailwind.config.js   # Tailwind CSS config
└── README.md            # Full documentation
```

## Key Features

✅ CSV/Excel player upload  
✅ Real-time live bidding  
✅ Automatic budget tracking  
✅ BroadcastChannel for display sync  
✅ localStorage for persistence  
✅ Keyboard shortcuts (1-9, Enter, U, Z)  
✅ Export to Excel/CSV  
✅ Beautiful responsive UI  

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5173 already in use | Change port: `npm run dev -- --port 3000` |
| npm install fails | Try `npm install --legacy-peer-deps` |
| Build has errors | Check `src/` for syntax errors, restart dev server |
| BroadcastChannel not syncing | Both tabs must be in same browser, same origin |

## Next Steps

1. Read `TESTING.md` for comprehensive test scenarios
2. Read `README.md` for full feature documentation
3. Check `TEST_DATA.md` for sample test data

## Support

- **Build issues?** Check `npm run build` output
- **Display not syncing?** Ensure both tabs are on `localhost:5173`
- **Data lost?** localStorage persists data - refresh should restore

---

**Happy Auctioning!** 🎯
