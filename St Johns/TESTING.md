# Testing Guide - ST JOHNS PLAYER AUCTION

## Pre-Test Setup

1. Navigate to project: `cd "St Johns"`
2. Install (if first time): `npm install`
3. Start server: `npm run dev`
4. Browser 1 opens to: `http://localhost:5173`

## Test Scenario: 30 Players, 4 Teams

### Phase 1: Intro & Home
- [ ] Intro animation plays (letter-by-letter, glowing text)
- [ ] "MADE WITH LOVE BY ST JOHNS" displays
- [ ] SKIP button works (visible after 0.5s)
- [ ] Auto-advances to Home after 3 seconds
- [ ] Home page shows hero title and 8 feature cards
- [ ] START AUCTION button is prominent and clickable

### Phase 2: Setup - Step 1 (Player Registration)

#### CSV Upload
1. Download sample CSV from the button
2. Upload it immediately
3. **Expected Results:**
   - [ ] 30 players parsed successfully
   - [ ] Preview table shows all players
   - [ ] No duplicate name errors
   - [ ] Player data visible (Name, Role, Class/Section, Base Price)

#### Manual Add/Edit
- [ ] Click "+ ADD PLAYER" button
- [ ] New player row added to table
- [ ] Can edit player name by clicking
- [ ] Can delete player (DELETE button)
- [ ] Changes update live in preview

#### Validation
- [ ] Try uploading empty file → shows "NO PLAYERS LOADED" error
- [ ] Try uploading malformed CSV → shows clear parse error
- [ ] Check data integrity in preview table

**Proceed when:** "PREVIEW: 30 PLAYERS LOADED" shows and next button enables

### Phase 3: Setup - Step 2 (Auction Rules)

Default values should be:
- [ ] THRESHOLD: ₹50,000
- [ ] INCREMENT: ₹10,000
- [ ] BUDGET/TEAM: ₹2,000,000

**Edit values:**
- [ ] Change threshold to ₹60,000
- [ ] Change increment to ₹15,000
- [ ] Keep budget at ₹2,000,000
- [ ] Verify info cards update instantly

**Proceed when:** Valid numbers entered (all > 0)

### Phase 4: Setup - Step 3 (Teams)

**Initial Setup:**
- [ ] Set NUMBER OF TEAMS: 4
- [ ] Set PLAYERS PER TEAM: 5
- [ ] Configuration Summary shows: "4 TEAMS", "5 PLAYERS PER TEAM (TOTAL: 20)"

**Team Names:**
- [ ] 4 team name inputs appear with unique colors
- [ ] Enter team names (e.g., "LIONS", "TIGERS", "EAGLES", "HAWKS")
- [ ] Text converts to UPPERCASE automatically
- [ ] Color indicator box shows next to each team
- [ ] Summary updates with team names

**Validation:**
- [ ] Try setting 7 teams with 5 players (need 35, have 30) → error message
- [ ] Error shows: "NOT ENOUGH PLAYERS. NEED 35, HAVE 30"
- [ ] Fix by reducing to 4 teams → error clears

**Budget Validation:**
- [ ] Min budget needed: ₹300,000 (60k × 5 players)
- [ ] Current budget: ₹2,000,000 ✓ (should pass)
- [ ] Try budget of ₹100,000 → error "BUDGET TOO LOW"

**Proceed when:** All 4 teams created with valid names, no errors

### Phase 5: Setup - Step 4 (Review & Start)

**Verify Summary:**
- [ ] PLAYERS section: 30 total
- [ ] TEAMS section: 4 teams
- [ ] AUCTION RULES: Threshold ₹60,000, Increment ₹15,000, Budget ₹2,000,000
- [ ] Team colors match Step 3
- [ ] "✅ ALL SETTINGS VALIDATED. READY TO START!" message shows

**Start Auction:**
- [ ] Click "START AUCTION 🎯" button
- [ ] Page transitions to Auction page

### Phase 6: Live Auction

#### Current Player Display
- [ ] Player name shows in large text
- [ ] Player role shows (BATSMAN, BOWLER, etc.)
- [ ] Player class/section shows
- [ ] Base bid shows (₹60,000 from our custom rules)
- [ ] Player card changes color for each player

#### First Bid
- [ ] Current bid shows as threshold: ₹60,000
- [ ] Click TEAM 1 button
- [ ] Next bid amount shown: ₹60,000 + ₹15,000 = ₹75,000
- [ ] "LEADING BIDDER" updates to show TEAM 1 name and color

#### Multiple Bids
- [ ] Click TEAM 2 → bid becomes ₹90,000, TEAM 2 becomes leading bidder
- [ ] Click TEAM 3 → bid becomes ₹105,000, TEAM 3 becomes leading bidder
- [ ] Click TEAM 1 again → bid becomes ₹120,000, TEAM 1 leading again

#### Keyboard Shortcuts
- [ ] Press 1 → TEAM 1 bids
- [ ] Press 2 → TEAM 2 bids
- [ ] Press 3 → TEAM 3 bids
- [ ] Press 4 → TEAM 4 bids
- [ ] Press Z (or U + Z separately) → UNDO last bid

#### Budget Constraints
- [ ] Try bidding with a team that has insufficient remaining budget
- [ ] Team button should become disabled (opacity 50%)
- [ ] Cannot place bid (button doesn't work)
- [ ] Hover shows it's not clickable

#### Sold Player
- [ ] After 2-3 bids, click "✅ SOLD" or press Enter
- [ ] Player sold to highest bidder
- [ ] Team budget decreases by bid amount
- [ ] Team player count increases
- [ ] Next player displays automatically
- [ ] Bidding history clears
- [ ] Player card changes to new player
- [ ] Smooth transition animation

#### Unsold Player
- [ ] On some player, click "❌ UNSOLD" or press U
- [ ] Player moved to unsold pool
- [ ] Next player displays
- [ ] Bidding history clears

#### Undo Feature
- [ ] Place 3 bids (TEAM 1, TEAM 2, TEAM 3)
- [ ] Click "↩️ UNDO" or press Z
- [ ] Most recent bid (TEAM 3) is removed
- [ ] Current bid reverts to previous bid
- [ ] Can undo multiple times

#### Team Status Panel
- [ ] All 4 teams visible on right/bottom
- [ ] Shows BUDGET, PLAYERS, SPENT for each team
- [ ] Updates in real-time after every SOLD action
- [ ] Team colors match earlier setup

### Phase 7: Display Screen (Projector)

**In a NEW BROWSER TAB:**
1. Open: `http://localhost:5173` (same window/tab)
2. Add `/#/display` to URL or navigate to Display page

**Display Screen Features:**
- [ ] Shows full-screen view optimized for projector
- [ ] Player name in HUGE text (8xl size)
- [ ] CLASS and ROLE clearly visible
- [ ] CURRENT BID in massive glowing green text
- [ ] LEADING BIDDER name and team color
- [ ] All 4 teams shown at bottom with status
- [ ] Live connection indicator (green pulse dot) in top-right

**Sync Testing (BroadcastChannel):**
1. Keep Display tab on-screen
2. Go back to Main tab (Auction page)
3. Place a bid in Main tab
4. **Display tab should update automatically within 100ms**
5. Continue bidding and verify Display updates in real-time
6. Click SOLD in Main tab
7. **Display should show next player immediately**

### Phase 8: Results Page

**After ~10-15 players sold:**
- [ ] Click "📺 DISPLAY" is replaced by results navigation
- [ ] Or auction ends when all players assigned
- [ ] Results page shows:
  - [ ] All 4 teams with their squads
  - [ ] Player names, roles, classes, and prices
  - [ ] Total spent per team
  - [ ] Remaining budget per team
  - [ ] Squad count (e.g., 5/5)
  - [ ] Summary stats at bottom (Total Sold, Total Unsold, etc.)

**Export Functionality:**
- [ ] Click "📊 EXPORT EXCEL"
  - [ ] Downloads `auction_results.xlsx`
  - [ ] Contains all teams and player data
  - [ ] Formatted with headers and colors
- [ ] Click "📋 EXPORT CSV"
  - [ ] Downloads `auction_results.csv`
  - [ ] Contains team, player, role, class, price data
- [ ] Click "🖨️ PRINT"
  - [ ] Opens print dialog
  - [ ] Shows formatted results for printing

**Reset Auction:**
- [ ] Click "🔄 RESET AUCTION"
- [ ] Confirmation modal appears
- [ ] Shows warning: "THIS WILL CLEAR ALL DATA"
- [ ] Click CANCEL → modal closes, auction data preserved
- [ ] Click RESET → returns to Home page, all data cleared

### Phase 9: Data Persistence (localStorage)

**Test Page Refresh:**
1. Mid-auction, refresh browser (F5)
2. **Expected:** Auction state restored
   - [ ] Same current player displayed
   - [ ] Same bid history shown
   - [ ] Same team budgets
   - [ ] Same players already sold

**Test Tab Close & Reopen:**
1. Close the browser tab (or quit browser)
2. Reopen browser to `http://localhost:5173`
3. **Expected:** Auction state from last session restored

### Phase 10: Edge Cases & Validation

#### Empty Squad Fill Check
- [ ] Team gets close to budget limit
- [ ] Try to bid when remaining budget can't fill rest of squad
- [ ] Button should be disabled (can't bid if budget won't allow filling squad)

#### Full Squad Prevention
- [ ] Team reaches 5/5 players
- [ ] All team buttons become disabled
- [ ] Other teams can still bid

#### Duplicate Player Detection
- [ ] Try uploading CSV with duplicate names
- [ ] Should show error: "DUPLICATE PLAYER NAMES DETECTED"

### Phase 11: UI/UX Quality Check

- [ ] All text is UPPERCASE (throughout app)
- [ ] All text uses Work Sans font
- [ ] Black background (#000) everywhere
- [ ] Vibrant neon colors used (green, cyan, magenta, orange, yellow, violet)
- [ ] Each player gets unique accent color
- [ ] Each team gets unique color (consistent throughout)
- [ ] Smooth framer-motion transitions
- [ ] No lag or stuttering
- [ ] Responsive on mobile (shrink window)
- [ ] All buttons have hover effects
- [ ] Glowing effects on key elements

## Test Result Template

```
Test Date: _______________
Tester: _______________
Build Version: _______________

✓ All intro/home tests passed
✓ All setup wizard tests passed
✓ All auction tests passed
✓ All display/sync tests passed
✓ All results/export tests passed
✓ All persistence tests passed
✓ All edge case tests passed
✓ All UI/UX quality checks passed

Issues Found:
[ ] None
[ ] Minor: __________________
[ ] Major: __________________

Ready for Production: [ ] YES [ ] NO
```

## Performance Targets

- Load time: < 2 seconds
- Bid placement: < 100ms
- Display sync: < 100ms
- Export generation: < 1 second
- File upload: handles 200+ players smoothly

## Browser Compatibility

Tested on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)

## Success Criteria

✅ All 11 phases tested and passed
✅ No console errors
✅ All features working as designed
✅ Data persists correctly
✅ Display syncs properly
✅ Export generates valid files
✅ UI is polished and responsive
