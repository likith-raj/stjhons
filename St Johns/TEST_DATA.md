# Test Data

Download this CSV sample and upload it to test with 30 dummy players:

```
Name,Class/Section,Role,Photo URL,Base Price
Rohit Sharma,10A,BATSMAN,,50000
Virat Kohli,10B,BATSMAN,,55000
Jasprit Bumrah,10C,BOWLER,,45000
Hardik Pandya,11A,ALL-ROUNDER,,52000
Rishabh Pant,11B,WICKET KEEPER,,48000
Suryakumar Yadav,10D,BATSMAN,,46000
Mohammed Shami,10E,BOWLER,,44000
Ashish Nehra,11C,BOWLER,,40000
KL Rahul,10F,BATSMAN,,51000
Yuzvendra Chahal,11D,BOWLER,,43000
Deepak Chahar,10G,BOWLER,,42000
Ravichandran Ashwin,11E,BOWLER,,47000
Dinesh Karthik,10H,WICKET KEEPER,,49000
Krunal Pandya,11F,ALL-ROUNDER,,45000
Navdeep Saini,10I,BOWLER,,41000
Ishan Kishan,11G,BATSMAN,,50000
Siraj Mohammed,10J,BOWLER,,43000
Prithvi Shaw,11H,BATSMAN,,54000
Axar Patel,10K,ALL-ROUNDER,,46000
Bhuvneshwar Kumar,11I,BOWLER,,48000
Avesh Khan,10L,BOWLER,,40000
Shreyas Iyer,11J,BATSMAN,,53000
Arshdeep Singh,10M,BOWLER,,39000
Rishabh Desai,11K,BATSMAN,,47000
Tanmay Agarwal,10N,BATSMAN,,45000
Mukesh Kumar,11L,BOWLER,,42000
Abhijit Malla,10O,ALL-ROUNDER,,44000
Deepak Chopra,11M,BOWLER,,41000
Rahul Tripathi,10P,BATSMAN,,49000
Siddhesh Pande,11N,ALL-ROUNDER,,46000
```

## Test Flow

1. **Home Page**: Click "START AUCTION"
2. **Setup - Step 1**: Download this CSV or manually copy-paste the data above
3. **Setup - Step 2**: Use default rules (₹50,000 threshold, ₹10,000 increment, ₹2,000,000 budget)
4. **Setup - Step 3**: Create 4 teams with 5 players each. Teams will be:
   - TEAM 1: Red (#FF1744)
   - TEAM 2: Cyan (#00BCD4)
   - TEAM 3: Amber (#FFC400)
   - TEAM 4: Lime (#76FF03)
5. **Setup - Step 4**: Review and start
6. **Auction**: Bid on players, test keyboard shortcuts (1-9, Enter, U, Z)
7. **Display**: Open `/display` route in another tab to see synced display
8. **Results**: View final squads and export

## Expected Behavior

✅ 30 players loaded  
✅ CSV parsing works  
✅ 4 teams created with unique colors  
✅ Budget constraints enforced  
✅ Squad size limits enforced  
✅ Real-time bidding works  
✅ BroadcastChannel syncs between tabs  
✅ localStorage persists on refresh  
✅ Export to Excel/CSV works  
