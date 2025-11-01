# 🎮 Running 8 Bit Poker Locally

## ✅ Server is Running!

### Open in Browser:
```
http://localhost:3001
```

---

## What You Can Test

### ✅ Works Locally:
- UI components
- Game lobby
- Navigation
- Styling and animations
- Basic layout

### ⚠️ Limited Locally:
- Farcaster SDK (needs production environment)
- Wallet integration (needs HTTPS)
- User authentication (needs Farcaster context)
- Game state persistence

---

## Commands

### Start Dev Server:
```bash
npm run dev
```

### Stop Dev Server:
Press `Ctrl+C` in the terminal

### Build for Production:
```bash
npm run build
npm start
```

### Run Linter:
```bash
npm run lint
```

---

## What You'll See

When you open `http://localhost:3001`:

1. **Main Lobby**
   - Header: "🎮 8 Bit Poker"
   - User stats display
   - Chip count
   - USDC balance
   - Player name

2. **Available Actions**
   - Play Game button
   - Shop button
   - Stats view

3. **Game Features**
   - Poker table UI
   - Player seats
   - Community cards area
   - Action buttons

---

## Testing Full Features

For complete testing including:
- Farcaster authentication
- Wallet connections
- Real game flow

**You need to deploy to production!**

Follow: `QUICK_FLAPPYX_DEPLOY.txt`

---

## Troubleshooting

### "Port already in use"
```bash
# Kill existing servers
pkill -f "next dev"

# Start fresh
npm run dev
```

### "Module not found"
```bash
npm install
```

### "Build errors"
```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### "Can't connect"
- Make sure dev server is running
- Check correct port (3001 if 3000 is busy)
- Try `http://localhost:3001` (not 3000)

---

## Next Steps

**Local is good for:**
- ✅ UI testing
- ✅ Layout adjustments
- ✅ Styling changes
- ✅ Basic interactions

**Production is needed for:**
- ✅ Farcaster SDK
- ✅ Wallet features
- ✅ Real users
- ✅ Full game flow

---

**Ready to go live?**

Deploy to: **https://vercel.com/new**

See: **QUICK_FLAPPYX_DEPLOY.txt**

---

🎰 **Enjoy your Poker app!**

