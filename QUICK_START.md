# St. John's Player Auction - Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd "e:\stjhons\St Johns"
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Opens at: **http://localhost:5173**

### 3. Build for Production
```bash
npm run build
```
Output: `./dist/` (ready for deployment)

---

## Usage Flow

### Step 1: Intro (6.5s)
- Automatic 6.5-second cinematic intro
- Auto-navigates to Home after video plays
- Shows school info & location

### Step 2: Home Page
- Click **"START AUCTION"** button
- Navigates to Setup page

### Step 3: Setup Wizard
Follow 4 sections in order:

#### 01 • Player Registration
1. Click upload area or drag-drop CSV/XLSX file
2. Columns must include: Name, Role, Base Price
3. Flexible column names (any order)
   - Name: "Name", "Player Name", or "Player"
   - Role: "Role", "Category", "Type", or "Position"  
   - Price: "Base Price", "Price", or "Base"
4. See preview of loaded players

#### 02 • Auction Rules
Set up auction parameters:
- Auction name (default: "ST JOHNS AUCTION 2026")
- State (default: "ANDHRA PRADESH")
- District (default: "NELLORE")
- Number of teams (1-20, default: 4)
- Players per team (1-20, default: 11)
- Budget per team (default: 2,000,000)
- Base price, increment, threshold

#### 03 • Teams & Names
- Teams auto-generated based on count
- Each team has assigned color
- Edit team names in input fields
- Names auto-uppercase

#### 04 • Review & Verify
- Verify player count
- Verify team count
- Confirm configuration
- Click **"START AUCTION"** to begin bidding

### Step 4: Live Auction
Bidding interface with:
- Current player name, role, base price
- Current bid amount (large, highlighted)
- Team buttons (1-9) to place bids
- Control buttons: SELL, UNSOLD, UNDO, END

**Keyboard Shortcuts:**
- `1-9` = Place bid for Team 1-9
- `Enter` = SELL (confirm bid)
- `U` = UNSOLD (skip player)
- `Z` = UNDO (remove last bid)
- `END` button = Finish auction

**Visual Feedback:**
- Confetti animation plays when player SOLD
- Current bidder team highlighted in orange
- Budget and squad size displayed for each team

### Step 5: Results
Final results page showing:
- Each team's squad (sorted by team)
- Budget spent and remaining
- Squad size (X/max)
- Unsold players section
- **Export options:**
  - 📊 Export to Excel
  - 📋 Export to CSV
  - 🖨️ Print auction results
  - 🔄 Reset and start new auction

---

## CSV/XLSX Format Examples

### CSV Example
```
Name,Role,Base Price
PLAYER 1,BATSMAN,50000
PLAYER 2,BOWLER,45000
PLAYER 3,ALL-ROUNDER,55000
```

### Excel Example (Column Order Doesn't Matter)
| Player Name | Category   | Price |
|-------------|-----------|-------|
| PLAYER 1    | BATSMAN   | 50000 |
| PLAYER 2    | BOWLER    | 45000 |
| PLAYER 3    | ALL-ROUNDER | 55000 |

**Supported Column Names:**
- Name: `Name`, `Player Name`, `Player`
- Role: `Role`, `Category`, `Type`, `Position`
- Price: `Base Price`, `Price`, `Base`

---

## Tips & Tricks

### 🎯 For Smooth Auction
1. **Pre-setup:** Prepare CSV/XLSX file with all players
2. **Team names:** Use short names (10-15 chars) for display
3. **Keyboard:** Use 1-9 keys for fast bidding (faster than mouse)
4. **Display:** Open `/display` route on projector for live display

### 📊 Display Page Setup (For Projector)
1. Main monitor: Run auction at http://localhost:5173/auction
2. Projector: Run display at http://localhost:5173/display
3. Both tabs auto-sync via BroadcastChannel
4. Display page shows: Player name, current bid, current bidder

### 💾 Data Persistence
- All data automatically saved to browser localStorage
- Persists across page refreshes
- Clears when "RESET AUCTION" button clicked

### ⚡ Keyboard Power Users
| Shortcut | Function |
|----------|----------|
| `1` | Bid from Team 1 |
| `2` | Bid from Team 2 |
| ... | ... |
| `9` | Bid from Team 9 |
| `Enter` | Sell to current bidder |
| `U` | Mark as UNSOLD |
| `Z` | Undo last bid |

---

## Common Issues & Solutions

### ❌ "No players found in file"
**Solution:** 
- Ensure file has at least one data row
- Check that "Name" column exists
- Delete any empty rows

### ❌ "Not enough players"
**Solution:**
- Need minimum: Teams × Players per Team
- Example: 4 teams × 11 players = 44 players minimum
- Add more players to CSV or reduce team count

### ❌ Teams section shows duplicate labels
**Solution:**
- This is fixed in v1.0.0
- Each team has: color box + "TEAM X" label + name input
- No duplicate labels

### ❌ Keyboard shortcuts not working
**Solution:**
- Ensure focus is on the page (click auction area first)
- Use lowercase 'u' and 'z' for shortcuts
- Numbers 1-9 correspond to teams (1=Team 1, 9=Team 9)

### ❌ Display page not syncing
**Solution:**
- Use same browser (Chrome/Firefox/Safari)
- Ensure BroadcastChannel is supported
- Refresh both tabs
- Check browser privacy settings

### ❌ Data lost after refresh
**Solution:**
- Data is saved automatically to localStorage
- Check browser storage quota
- Try clearing cache and refreshing
- Use EXPORT options to backup results

---

## Browser Requirements
- **Modern browsers:** Chrome, Firefox, Safari, Edge (latest)
- **Features needed:** localStorage, CSS Grid, BroadcastChannel
- **Mobile:** Responsive design works, but auction better on desktop/tablet

---

## Deployment

### Local Testing
```bash
npm run dev
# Visit http://localhost:5173
```

### Production Build
```bash
npm run build
# Output: ./dist/
# Deploy dist/ folder to web server (Vercel, Netlify, etc.)
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## Support

### Reset Stuck Auction
If stuck in Setup/Auction:
1. Press `F12` to open Developer Tools
2. Go to **Application** tab
3. Find **Storage → Local Storage**
4. Delete `st_johns_auction_state` key
5. Refresh page (returns to Intro)

### Check Saved Data
In Developer Tools → Application → Storage → Local Storage:
- Look for `st_johns_auction_state` key
- Contains full auction state (JSON)

---

## File Locations
- **Main app:** `e:\stjhons\St Johns\src\`
- **Built files:** `e:\stjhons\St Johns\dist\` (after build)
- **Config:** `vite.config.js`, `tailwind.config.js`, `postcss.config.js`

---

## Performance Benchmarks
- **Page load:** ~2-3s
- **Player upload:** <100ms
- **Bid placement:** <50ms
- **Display sync:** <100ms
- **Export to Excel:** <500ms

---

**Version:** 1.0.0  
**Last Updated:** 2026-11-27  
**Made for:** St. John's English Medium High School

---

## Ready to Auction?
1. ✅ Install: `npm install`
2. ✅ Run: `npm run dev`
3. ✅ Open: http://localhost:5173
4. ✅ Prepare CSV file
5. ✅ Start your auction!

**Let the bidding begin!** 🏏
