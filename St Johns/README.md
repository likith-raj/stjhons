# ST JOHNS PLAYER AUCTION

A live cricket-style player auction web app for Subedarpet St. John's English Medium High School. Teams bid on players in real time with automatic budget tracking and squad management.

## Features

✅ **Player Registration** - Upload players via CSV or Excel  
✅ **Team Management** - Create teams with unique colors and budgets  
✅ **Live Bidding** - Real-time auction with bid validation  
✅ **Budget Tracking** - Automatic tracking of team spending and remaining budget  
✅ **Squad Management** - Track squad size and remaining spots  
✅ **Live Display Screen** - Use BroadcastChannel to sync a projector display  
✅ **Keyboard Shortcuts** - 1-9 for teams, Enter = SOLD, U = UNSOLD, Z = UNDO  
✅ **Data Persistence** - All auction state saved to localStorage  
✅ **Export Results** - Download results as Excel or CSV  
✅ **Responsive Design** - Works on desktop and mobile  

## Tech Stack

- **Frontend**: Vite + React (JavaScript)
- **Styling**: Tailwind CSS
- **UI Animation**: Framer Motion
- **File Handling**: PapaParse (CSV), XLSX (Excel)
- **State Management**: React Context + localStorage
- **Real-time Sync**: BroadcastChannel API

## Installation & Running

### Prerequisites
- Node.js 16+ and npm installed

### Quick Start

1. **Navigate to the project directory:**
```bash
cd "St Johns"
```

2. **Install dependencies (first time only):**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open in your browser:**
   - Main tab: `http://localhost:5173`
   - Display tab (projector): `http://localhost:5173/#/display`

That's it! The app will auto-compile as you make changes.

## Usage

### Setup Auction

1. **Player Registration**: Upload a CSV or Excel file with player data
   - Columns: `Name`, `Class/Section`, `Role`, `Photo URL` (optional), `Base Price` (optional)
   - Sample files are available for download

2. **Auction Rules**: Set the base price (threshold), bid increment, and total budget per team

3. **Teams**: Create teams, assign names, and set squad size

4. **Review & Start**: Confirm all settings and start the auction

### During Auction

- **Bid**: Click team buttons or press `1-9` to place bids
- **Sold**: Click SOLD or press `Enter` to sell player to highest bidder
- **Unsold**: Click UNSOLD or press `U` to mark player as unsold
- **Undo**: Click UNDO or press `Z` to undo last bid
- **Display Screen**: Press DISPLAY button to open /display route for projector

### Live Display Screen

Open the **DISPLAY** route in a separate browser window/tab on a projector:
- Shows current player name in large text
- Displays current bid amount
- Shows leading bidder and team
- Updates in real-time via BroadcastChannel API

### View Results

- See final squads for each team
- Track total spent, remaining budget, and squad size
- Export results as Excel or CSV
- Print results
- Reset auction to start over

## Sample Data

To test the app with dummy data:

1. Click "DOWNLOAD SAMPLE CSV" on the Player Registration step
2. Upload it immediately
3. Set up 4 teams with 5 players each
4. Click START AUCTION

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| 1-9 | Place bid for Team 1-9 |
| Enter | Sell player (SOLD) |
| U | Mark player unsold (UNSOLD) |
| Z | Undo last bid |

## Data Persistence

- All auction state is automatically saved to `localStorage`
- Page refresh will restore the auction state
- Data persists across browser sessions until manually reset

## Multi-Tab Display

- **Main Tab**: Run the auction from this tab
- **Display Tab**: Open `/display` route in another tab/window
- **BroadcastChannel**: Automatically syncs real-time updates between tabs
- Perfect for a projector setup: main tab on a laptop, display tab on a projector

## Responsive Design

- Works on all screen sizes
- Mobile-optimized controls
- Touch-friendly buttons
- Fully responsive layout

## Error Handling

- File validation with clear error messages
- Budget constraints enforced
- Squad size limits enforced
- Duplicate player detection
- Empty file detection

## Limitations

- BroadcastChannel only works within the same browser on the same machine
- For multi-device support (internet), use the Supabase version (ask for separate setup)

## Future Enhancements

- Supabase real-time sync for internet display
- Player images display
- Countdown timer
- Random vs. sequential player order
- Bid history log
- Player statistics

## License

Made with ❤️ by St Johns

## Support

For issues or questions, check the error messages displayed in the app. All validation errors are shown clearly.
