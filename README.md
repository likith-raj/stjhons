# St. John's Player Auction - Live Bidding Platform

A complete, production-ready web application for conducting live player auctions in a cricket-style format. Built for St. John's English Medium High School.

## 🚀 Quick Start

```bash
cd "St Johns"
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📋 Features

### ✅ Single-Page Setup Wizard
- **Player Registration:** Flexible CSV/Excel import with smart column detection
- **Auction Rules:** Configure teams, budget, pricing, and bidding parameters
- **Teams & Names:** Visual team setup with color coding
- **Review & Verify:** Validation before auction starts

### ✅ Live Auction Interface
- **Real-time Bidding:** Keyboard shortcuts (1-9) for fast bidding
- **Team Management:** Live budget tracking and squad updates
- **Visual Feedback:** Confetti animations and bidder highlighting
- **Player Control:** SELL, UNSOLD, and UNDO operations

### ✅ Results & Exports
- **Team Squads:** Final squad composition per team
- **Budget Summary:** Spent vs. remaining budget display
- **Multiple Exports:** Excel, CSV, and Print-ready formats
- **Reset:** Start new auction with one click

### ✅ Full-Screen Display
- **Projector View:** Real-time display sync to separate monitor
- **Broadcast Updates:** BroadcastChannel for multi-tab synchronization
- **Large Display:** Optimized for stadium/classroom projection

---

## 🎯 Key Highlights

- **100% Client-Side:** No backend required, pure localStorage
- **Responsive Design:** Works on 360px mobile to 1920px desktop
- **Keyboard Shortcuts:** 1-9 keys + Enter/U/Z for rapid bidding
- **Flexible CSV/Excel:** Auto-detects column names (any order)
- **Zero Fake Data:** Fresh start, no pre-loaded information
- **Floating Animations:** Animated orbs and color-cycling cursor
- **BroadcastChannel Sync:** Multi-tab real-time updates

---

## 📦 Build & Deploy

### Development
```bash
npm run dev
# http://localhost:5173
```

### Production Build
```bash
npm run build
# Output: ./dist/
```

### Deploy (1-click options)
- **Vercel:** Push to GitHub, auto-deploy
- **Netlify:** Drag dist/ folder or GitHub sync
- **GitHub Pages:** `git push`, auto-deploy
- **Traditional Hosting:** Upload dist/ via FTP

**See DEPLOYMENT_GUIDE.md for detailed instructions.**

---

## 📱 Pages & Routes

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Intro | 6.5s cinematic animation |
| `/home` | Home | Hero page with START button |
| `/setup` | Setup | Single-page configuration wizard |
| `/auction` | Auction | Live bidding interface |
| `/display` | Display | Full-screen projector view |
| `/results` | Results | Final results & exports |

---

## ⌨️ Keyboard Shortcuts

**During Auction:**

| Key | Action |
|-----|--------|
| `1-9` | Place bid for Team 1-9 |
| `Enter` | SELL (confirm bid) |
| `U` | Mark as UNSOLD |
| `Z` | UNDO (remove last bid) |

---

## 📊 Data Flow

```
1. Upload CSV/XLSX
   ↓
2. Configure Teams & Rules
   ↓
3. START AUCTION
   ↓
4. Live Bidding (Keyboard: 1-9/Enter/U/Z)
   ↓
5. VIEW RESULTS
   ↓
6. EXPORT (Excel/CSV/Print)
   ↓
7. RESET for Next Auction
```

---

## 🎨 Design

### Theme
- **Monochrome:** Dark black (#050505) + white (#ffffff)
- **Accent:** Orange (#FF8A1F)
- **Style:** Uppercase, modern, sports-focused

### Animations
- 6.5s cinematic intro
- Floating animated background orbs
- Confetti on SOLD
- Color-cycling cursor (5 colors)
- Smooth 0.3s transitions

---

## 📋 CSV/Excel Format

**Required Columns (any order):**

```csv
Name,Role,Base Price
PLAYER 1,BATSMAN,50000
PLAYER 2,BOWLER,45000
PLAYER 3,ALL-ROUNDER,55000
```

**Flexible Column Names:**
- **Name:** "Name", "Player Name", "Player"
- **Role:** "Role", "Category", "Type", "Position"
- **Price:** "Base Price", "Price", "Base"

---

## 🔧 Configuration

### Setup Defaults
- Auction Name: "ST JOHNS AUCTION 2026"
- State: "ANDHRA PRADESH"
- District: "NELLORE"
- Teams: 4
- Players per Team: 11
- Budget per Team: ₹2,000,000
- Base Price: ₹50,000
- Bid Increment: ₹10,000
- Threshold: ₹100,000

**All values are customizable.**

---

## 💾 Data Storage

- **localStorage:** All state persisted locally
- **BroadcastChannel:** Multi-tab real-time sync
- **No Backend:** Works fully offline
- **No External APIs:** Complete privacy

---

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **PRODUCTION_READY_SUMMARY.md** | Complete feature breakdown |
| **QUICK_START.md** | Usage instructions & tips |
| **DEPLOYMENT_GUIDE.md** | 7 platform deployment guides |
| **FEATURE_VERIFICATION.md** | Detailed feature checklist |

---

## 🛠️ Tech Stack

**Frontend Framework:** React 18  
**Build Tool:** Vite  
**Styling:** TailwindCSS + Custom CSS  
**Animations:** Framer Motion  
**File Parsing:** PapaParse (CSV), XLSX (Excel)  
**Storage:** localStorage + BroadcastChannel  

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "vite": "^4.3.9",
  "tailwindcss": "^3.3.0",
  "framer-motion": "^10.16.4",
  "papaparse": "^5.4.1",
  "xlsx": "^0.18.5"
}
```

**Minimal, focused, production-proven packages.**

---

## 🎯 Key Achievements

- ✅ Single-page setup (not multi-step)
- ✅ Flexible CSV/Excel parser (any column names, any order)
- ✅ 0-based editable number inputs (no locks)
- ✅ End-to-edge full-width layout
- ✅ Responsive design (360px-1920px)
- ✅ Floating animated elements (never blocking)
- ✅ Keyboard shortcuts for fast bidding
- ✅ Real-time team budget tracking
- ✅ Confetti on SOLD
- ✅ Multi-export (Excel, CSV, Print)
- ✅ BroadcastChannel display sync
- ✅ Zero fake data
- ✅ No backend required
- ✅ localStorage persistence

---

## 🚀 Deployment Ready

- [x] Build passes without errors
- [x] All pages tested and working
- [x] Responsive design verified
- [x] Keyboard shortcuts functional
- [x] CSV/Excel import tested
- [x] Export options working
- [x] No console errors
- [x] Zero external dependencies for data
- [x] Ready for immediate deployment

---

## 📞 Support

### Quick Help
- **Build issue?** → `npm install && npm run build`
- **Port conflict?** → Vite auto-finds available port
- **Data lost?** → Check localStorage in DevTools
- **CSV not loading?** → Verify "Name" column exists

### Documentation
- See **QUICK_START.md** for usage
- See **DEPLOYMENT_GUIDE.md** for deployment
- See **FEATURE_VERIFICATION.md** for complete checklist

---

## 📜 License

Built for St. John's English Medium High School  
Created: 2026-11-27  
Version: 1.0.0  

---

## ✨ Next Steps

1. **Test Locally:** `npm run dev`
2. **Prepare CSV:** Player list with Name, Role, Base Price
3. **Configure Setup:** Teams, budget, pricing
4. **Run Auction:** Use keyboard shortcuts (1-9/Enter/U/Z)
5. **Export Results:** Excel, CSV, or Print
6. **Deploy:** Choose platform from DEPLOYMENT_GUIDE.md

---

## Made with ❤️

For St. John's English Medium High School - SUBEDARPET, NELLORE, ANDHRA PRADESH - 524001

**Let the auction begin!** 🏏

---

**Questions?** Check the docs:
- 📖 PRODUCTION_READY_SUMMARY.md
- 🚀 QUICK_START.md  
- 🌐 DEPLOYMENT_GUIDE.md
- ✅ FEATURE_VERIFICATION.md
