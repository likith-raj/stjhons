# Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Build & Setup Issues

### ❌ "npm command not found"
**Problem:** Node.js not installed  
**Solution:**
1. Download from https://nodejs.org (LTS version)
2. Install to default location
3. Restart terminal/command prompt
4. Run: `node -v` (verify)
5. Run: `npm -v` (verify)

### ❌ "Cannot find module" error
**Problem:** Dependencies not installed  
**Solution:**
```bash
cd "e:\stjhons\St Johns"
rm -r node_modules package-lock.json
npm install
npm run dev
```

### ❌ "Port 5173 already in use"
**Problem:** Another process running on port  
**Solution:**
1. Vite auto-finds next available port
2. Check terminal output for new port
3. Or kill process: `npx kill-port 5173`
4. Or specify different port: `npm run dev -- --port 3000`

### ❌ "Build failed / Vite error"
**Problem:** Compilation error  
**Solution:**
1. Check error message carefully
2. Ensure all files saved
3. Clear cache: `rm -r .vite`
4. Rebuild: `npm run build`
5. If still failing, check for syntax errors in JSX files

---

## 🔴 Setup Page Issues

### ❌ "No players found in file"
**Problem:** CSV/Excel file is empty or invalid  
**Solution:**
- Ensure file has at least 1 data row (not just header)
- Check for empty rows at bottom of spreadsheet
- Verify "Name" column exists
- Try different file format (CSV vs XLSX)
- Check file size is reasonable (<5MB)

**Example valid CSV:**
```csv
Name,Role,Base Price
PLAYER 1,BATSMAN,50000
```

### ❌ "MISSING 'NAME' COLUMN"
**Problem:** Name column not found  
**Solution:**
- Verify column header is exactly "Name", "Player Name", or "Player"
- Check for typos in column name
- Ensure header row is row 1
- Acceptable names:
  - ✅ "Name"
  - ✅ "Player Name"
  - ✅ "Player"
  - ❌ "player name" (case matters)
  - ❌ "Names" (typo)

### ❌ "DUPLICATE PLAYER NAMES"
**Problem:** Same player name appears twice  
**Solution:**
- Remove duplicate rows from CSV/Excel
- Or append number to duplicate: "PLAYER 1" → "PLAYER 1A"
- Excel → Find & Replace to bulk rename

### ❌ "UNSUPPORTED FORMAT. USE CSV OR XLSX"
**Problem:** Wrong file type uploaded  
**Solution:**
- Save as: `.csv` or `.xlsx`
- Not supported: `.txt`, `.pdf`, `.xls` (very old)
- Use Excel or Google Sheets to save:
  - **Excel:** File → Save As → CSV or XLSX
  - **Google Sheets:** File → Download → CSV or XLSX

### ❌ Teams section shows duplicate labels
**Problem:** "TEAM 1 | TEAM 1 input" layout  
**Solution:**
- This is fixed in v1.0.0
- Clear cache: `Ctrl+Shift+Delete` (browser) or `Cmd+Shift+Delete` (Mac)
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- If persists, check browser console for errors

### ❌ Number inputs locked at min=100
**Problem:** Can't edit base price below 100,000  
**Solution:**
- This is fixed in v1.0.0
- Clear cache (see above)
- All number fields now 0-based (unlimited range)

### ❌ "START AUCTION" button disabled
**Problem:** Button grayed out, can't proceed  
**Solution:**
Check error messages:
- ❌ NO PLAYERS LOADED → Upload CSV/Excel file
- ❌ NO TEAMS CREATED → Adjust "Number of Teams" (should auto-populate)
- ❌ SOME TEAM NAMES ARE EMPTY → Fill all team name inputs
- ❌ NOT ENOUGH PLAYERS → Need teams × players minimum
  - Example: 4 teams × 11 players = 44 minimum needed
  - Upload more players or reduce team count

### ❌ Teams not saving / cleared after refresh
**Problem:** Team configuration lost  
**Solution:**
1. Check if localStorage enabled:
   - Open DevTools (F12)
   - Application → Storage → Local Storage
   - Should have `st_johns_auction_state` key
2. If missing, localStorage might be disabled:
   - Chrome: Settings → Privacy → Cookies → Allow all
   - Firefox: about:config → dom.storage.enabled = true
   - Safari: Preferences → Privacy → Check cookies allowed
3. Try private/incognito mode (sometimes cleaner)

---

## 🔴 Auction Page Issues

### ❌ Keyboard shortcuts not working
**Problem:** 1-9 keys, Enter, U, Z don't respond  
**Solution:**
1. Click on auction page first (ensure focus)
2. Try again with keys
3. Check for browser extensions interfering
4. Use lowercase 'u' and 'z' (uppercase sometimes doesn't work)
5. Numbers must be 1-9 (not numpad)
6. If only one shortcut broken, specific key might be mapped elsewhere

### ❌ Can't place bid / button disabled
**Problem:** Team buttons grayed out  
**Solution:**
Check validation:
- **Insufficient budget:** Current bid too high for team's remaining budget
  - Reduce bid increment in Setup
  - Or reduce total budget requirements
- **Squad size limit:** Team already has max players
  - Reduce "Players per Team" in Setup
  - Or mark current player UNSOLD

### ❌ Confetti animation not showing
**Problem:** No animation when SOLD clicked  
**Solution:**
1. Confetti only shows when SELL button pressed
2. Check browser console (F12) for errors
3. Try different browser (Chrome, Firefox, Safari)
4. If still missing, canvas-confetti library might be blocked
5. Try disabling browser extensions

### ❌ Can't see player information
**Problem:** Player name, role, price not displayed  
**Solution:**
1. Ensure players were uploaded successfully (see Setup issues)
2. Check if on correct page (/auction)
3. Refresh page
4. If still blank, players might be empty array:
   - Go back to Setup (should navigate to /setup)
   - Upload CSV again
   - Restart auction

### ❌ Bid won't increase
**Problem:** Clicking team button doesn't update bid amount  
**Solution:**
1. Ensure team has sufficient budget
2. Check if team already has max squad size
3. Verify bid increment is set > 0 in Setup
4. Try different team
5. If no team can bid, all may have exhausted budget or squad size

### ❌ Player doesn't advance after SOLD/UNSOLD
**Problem:** Same player stays on screen  
**Solution:**
1. Click SELL or UNSOLD button (not just bid buttons)
2. Wait 1 second for state update
3. If still stuck, refresh page (state saved)
4. Check browser console for JS errors

### ❌ Team budget shows negative
**Problem:** Budget goes below 0  
**Solution:**
- This shouldn't happen (validation prevents it)
- If occurs, refresh page
- Check localStorage: `localStorage.clear()` to reset

---

## 🔴 Results Page Issues

### ❌ Results page blank
**Problem:** No teams or results showing  
**Solution:**
1. Run auction first (must have sold players)
2. Click END button to go to Results
3. If Results was accessed directly:
   - Go to Home → Setup → Auction → Results (proper flow)

### ❌ Export to Excel fails
**Problem:** .xlsx file not downloaded  
**Solution:**
1. Check browser's download settings
2. Allow pop-ups/downloads for this site
3. Try different browser
4. Check browser console for errors
5. Ensure JavaScript enabled

### ❌ CSV export has wrong format
**Problem:** Column names or data format incorrect  
**Solution:**
1. CSV format is: `PLAYER,ROLE,CLASS,TEAM,PRICE`
2. If fields missing, verify auction completed properly
3. Try opening in different app (Excel, Google Sheets)
4. Manual export:
   - Copy from Results page
   - Paste into Excel
   - Save as CSV

### ❌ Print page looks bad
**Problem:** Formatting, colors, or layout wrong  
**Solution:**
1. Browser Print Preview (Ctrl+P) to see before printing
2. Adjust print settings:
   - Enable "Background graphics" to show colors
   - Set margins to minimum
   - Landscape orientation often better
3. Try different browser's print function
4. Export to PDF instead (save as file)

### ❌ RESET button doesn't work
**Problem:** Clicking RESET doesn't clear data  
**Solution:**
1. Confirm dialog should appear
2. Click "Yes" to confirm
3. If nothing happens, refresh page
4. Manual reset: `localStorage.clear()` in DevTools console
5. Close and reopen browser tab

---

## 🔴 Display Page Issues

### ❌ Display page not syncing with Auction
**Problem:** Display page doesn't update when bidding  
**Solution:**
1. BroadcastChannel only works in same browser/instance
2. Ensure both tabs open in same browser
3. Not supported in Safari private mode
4. Check browser compatibility:
   - Chrome: ✅ Full support
   - Firefox: ✅ Full support
   - Safari: ⚠️ Limited (private mode blocked)
   - Edge: ✅ Full support
5. Manual sync: Refresh Display page to see latest

### ❌ Display page shows old data
**Problem:** Player hasn't updated  
**Solution:**
1. Refresh Display page (F5)
2. Ensure Auction page is active (not minimized)
3. Check both tabs in same window
4. Try opening Display page again from /display route

### ❌ Can't navigate to Display page
**Problem:** URL change doesn't work  
**Solution:**
1. Type directly: `http://localhost:5173/display`
2. Or from Auction page, manually navigate
3. If /display route not working, restart dev server:
   ```bash
   npm run dev
   ```

---

## 🔴 Data & Storage Issues

### ❌ Data lost after closing browser
**Problem:** Auction state cleared  
**Solution:**
1. This shouldn't happen - state is saved to localStorage
2. Check if localStorage enabled (see Setup section)
3. Browser storage quota might be exceeded
4. Private/Incognito mode disables localStorage - use normal mode
5. Clear browser cache:
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Shift+Delete

### ❌ State keeps reverting to old data
**Problem:** Undo happens unexpectedly  
**Solution:**
1. Check if UNDO key (Z) is being pressed accidentally
2. Ensure no keyboard shortcuts interfering
3. Try different browser/device
4. Clear localStorage: `localStorage.clear()`
5. Fresh start

### ❌ localStorage quota exceeded
**Problem:** "Failed to save state" error  
**Solution:**
1. This is rare (state is <1MB)
2. Clear other site data:
   - DevTools → Application → Storage → Local Storage
   - Delete entries for other sites
3. Try export/reset to clear current auction
4. Use different browser (might have more space)

---

## 🔴 Browser & System Issues

### ❌ App very slow / laggy
**Problem:** Performance issues  
**Solution:**
1. Close unnecessary browser tabs/extensions
2. Try different browser (Chrome usually fastest)
3. Check computer CPU/RAM:
   - Windows: Ctrl+Shift+Esc (Task Manager)
   - Mac: Cmd+Space → Activity Monitor
4. Restart browser completely
5. Update browser to latest version

### ❌ Audio/Video not working (Intro page)
**Problem:** Intro video doesn't play  
**Solution:**
1. Video is optional (falls back gracefully)
2. Check if intro.mp4 file exists: `/public/intro.mp4`
3. Try different browser
4. Check browser media permissions
5. Can proceed manually (intro auto-navigates at 6.5s)

### ❌ Font looks weird / text not uppercase
**Problem:** Typography issues  
**Solution:**
1. Browser might not have loaded fonts
2. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. Clear cache (see Data & Storage section)
4. Try different browser
5. Check if CSS loaded: DevTools → Network tab

### ❌ Colors look different on mobile
**Problem:** Orange appears red, blacks look gray  
**Solution:**
1. Check display brightness/settings
2. Try different mobile device/browser
3. Some phones have color filters enabled:
   - iPhone: Settings → Display & Brightness → Color Filters
   - Android: Settings → Display → Color adjustment
4. Try landscape orientation
5. Check if browser dark mode affecting display

---

## 🔴 Deployment Issues

### ❌ 404 on page refresh (deployed site)
**Problem:** Page works, but refresh shows 404  
**Solution:**
This is SPA routing issue - server should route all to index.html:

**Vercel:** ✅ Auto-configured  
**Netlify:** ✅ Auto-configured  
**GitHub Pages:** May need redirects  
**Traditional host:** Add `.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### ❌ CORS error on deployed site
**Problem:** "No 'Access-Control-Allow-Origin' header"  
**Solution:**
- This app is fully client-side, shouldn't get CORS errors
- If error occurs, it's likely from browser extension
- Try private/incognito mode
- Check if deployed correctly (see DEPLOYMENT_GUIDE.md)

### ❌ Blank page after deployment
**Problem:** Deployed URL shows white page  
**Solution:**
1. Check browser console (F12) for errors
2. Verify dist/ folder uploaded correctly
3. Check server logs
4. Ensure index.html is in root or correct folder
5. Try hard refresh (Ctrl+Shift+F5)

---

## 🔴 Advanced Troubleshooting

### Reset Complete State
```javascript
// In browser console (F12):
localStorage.clear()
location.reload()
```

### Check Saved State
```javascript
// In browser console (F12):
console.log(JSON.parse(localStorage.getItem('st_johns_auction_state')))
```

### Monitor BroadcastChannel
```javascript
// In browser console (F12):
const ch = new BroadcastChannel('st_johns_auction')
ch.onmessage = (e) => console.log('Broadcast:', e.data)
```

### Check File Upload Details
1. Right-click CSV/Excel file → Properties
2. Verify:
   - Format: .csv or .xlsx
   - Size: < 5MB
   - Modified date: Recent
3. Try opening in spreadsheet app first
4. Save again, re-upload

---

## 📞 Still Stuck?

### Check These Files
1. **PRODUCTION_READY_SUMMARY.md** - Feature details
2. **QUICK_START.md** - Usage instructions
3. **DEPLOYMENT_GUIDE.md** - Deployment help
4. **FEATURE_VERIFICATION.md** - Feature checklist

### Browser DevTools (F12)
- **Console tab:** Error messages with line numbers
- **Network tab:** File load failures
- **Application tab:** localStorage contents
- **Performance tab:** Identify slow operations

### Restart Everything
```bash
# Terminal
npm run build
npm run dev

# Browser
Ctrl+Shift+Delete (clear cache)
Ctrl+F5 (hard refresh)
```

---

## 🎯 Quick Reference

| Issue | Solution |
|-------|----------|
| npm not found | Install Node.js from nodejs.org |
| Port in use | Vite auto-finds next port |
| CSV won't upload | Verify "Name" column exists |
| Keyboard shortcuts broken | Click page first, ensure focus |
| Data lost | Check localStorage enabled |
| Display not syncing | Use same browser for both tabs |
| 404 on deploy | Add .htaccess (traditional hosting) |
| Slow performance | Close tabs, restart browser |
| Colors wrong | Hard refresh, check display settings |

---

## 📝 Before Reporting Issues

1. **Clear cache & refresh**
   ```
   Ctrl+Shift+Delete → Clear cache
   Ctrl+F5 → Hard refresh
   ```

2. **Check DevTools**
   - F12 → Console
   - Look for red error messages
   - Note exact error text

3. **Try different browser**
   - Chrome, Firefox, Safari, Edge
   - Isolate browser-specific issues

4. **Check documentation**
   - PRODUCTION_READY_SUMMARY.md
   - QUICK_START.md
   - DEPLOYMENT_GUIDE.md

---

**Version:** 1.0.0  
**Last Updated:** 2026-11-27  
Made for St. John's English Medium High School
