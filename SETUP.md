# Poker Farcaster Mini App - Setup Guide

## Quick Start

Your poker mini app is now fully implemented! Here's how to set it up and deploy.

## Initial Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Add Real Images

Replace the placeholder images with actual poker-themed graphics:

**Required Images:**
- `public/logo.png` - 200x200px app logo
- `public/og-image.png` - 1200x630px social sharing image (3:2 aspect ratio)

You can create these using any design tool. The og-image should showcase the poker theme.

### 3. Configure Farcaster Manifest

**IMPORTANT:** Before deploying, you MUST generate a valid Farcaster manifest signature.

1. Visit: https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter your domain (e.g., `poker.example.com`)
3. Fill in all required fields
4. Generate the signature
5. Update `public/.well-known/farcaster.json` with your actual signature values:

```json
{
  "accountAssociation": {
    "header": "YOUR_ACTUAL_HEADER",
    "payload": "YOUR_ACTUAL_PAYLOAD",
    "signature": "YOUR_ACTUAL_SIGNATURE"
  },
  ...
}
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your app (won't work fully without Farcaster client).

## Testing in Farcaster

### Option 1: Using Tunnels (Development)

1. Install a tunnel service:
   - **ngrok**: `brew install ngrok` or download from ngrok.com
   - **localtunnel**: `npm install -g localtunnel`

2. Start your dev server:
   ```bash
   npm run dev
   ```

3. Create a tunnel:
   ```bash
   # Using ngrok
   ngrok http 3000
   
   # Using localtunnel
   lt --port 3000
   ```

4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

5. Use the Mini App Preview Tool:
   - Visit: https://farcaster.xyz/~/developers/mini-apps/preview
   - Enter your tunnel URL
   - Click Preview

### Option 2: Deploy to Production

Deploy your app to Vercel, Netlify, or any static hosting:

```bash
npm run build
```

Then follow your hosting provider's deployment instructions.

## Deployment Checklist

- [ ] Replace placeholder images (`logo.png`, `og-image.png`)
- [ ] Generate and add Farcaster manifest signature
- [ ] Update domain in manifest file
- [ ] Set up webhook URL (if using notifications)
- [ ] Configure USDC contract interactions (if using real payments)
- [ ] Test in Farcaster preview tool
- [ ] Submit for Farcaster Mini App directory

## Key Configuration Files

### Game Rules
**File:** `config/game.config.ts`

Edit this to change:
- Number of players
- Starting chips
- Blinds structure
- AI difficulty
- Timers and animations

### Monetization
**File:** `config/monetization.config.ts`

Edit this to change:
- Chip packages and prices
- Entry fees
- Rake percentages
- Daily bonuses
- Win streak rewards

### USDC Integration
**File:** `lib/farcaster/wallet.ts`

The wallet integration is ready, but you need to:
1. Set up your payment contract on Base
2. Implement backend verification
3. Add your contract address

## Architecture Highlights

### Modular Design

The app uses a clean, modular architecture:

```
Configuration → Logic → Integration → UI
     ↓              ↓          ↓        ↓
  config/      lib/poker/  lib/     components/
                      farcaster/
```

**Benefits:**
- Change prices without touching game code
- Update rules without breaking UI
- Test components in isolation
- Easy to extend and maintain

### Key Features Implemented

✅ **Complete Poker Game**
- All 10 hand rankings
- Full betting rounds
- Side pot calculations
- All-in handling
- Split pot support

✅ **Smart AI**
- 3 difficulty levels
- Realistic decision-making
- No cheats (no future cards)
- Personality-based play styles

✅ **Matchmaking**
- 12-second PvP search
- Auto AI fill-in
- 2-4 player tables
- Smooth transitions

✅ **Farcaster Integration**
- Full SDK implementation
- User authentication
- Wallet connection
- Cast sharing ready

✅ **Monetization**
- USDC on Base
- 5 chip packages
- Daily bonuses
- Win streak rewards
- Entry fees & rake

## Next Steps

### Backend Integration (Optional but Recommended)

Currently, chips are stored client-side. For production:

1. **User Accounts**: Store chips and stats on your backend
2. **Purchase Verification**: Verify USDC transactions server-side
3. **Game History**: Track games and outcomes
4. **Leaderboards**: Implement rankings
5. **Notifications**: Set up webhook endpoint

### Example Backend Setup

Create API routes in `app/api/`:

```
app/api/
├── user/
│   ├── route.ts       # Get/update user
│   └── chips/route.ts # Get chips balance
├── purchase/
│   └── route.ts       # Handle chip purchases
└── game/
    ├── start/route.ts # Start new game
    └── end/route.ts   # Record game results
```

### Security Considerations

1. **Validate all actions server-side**
2. **Verify USDC transactions on-chain**
3. **Sanitize user inputs**
4. **Rate limit API calls**
5. **Encrypt sensitive data**

## Customization Examples

### Change Starting Chips

Edit `config/game.config.ts`:
```typescript
players: {
  startingChips: 2000, // Change from 1000
  // ...
}
```

### Adjust Chip Prices

Edit `config/monetization.config.ts`:
```typescript
const CHIP_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    chips: 1000,
    usdPrice: 0.25, // Change from 0.50
    // ...
  },
  // ...
]
```

### Modify Matchmaking Timeout

Edit `config/game.config.ts`:
```typescript
matchmaking: {
  timeoutSeconds: 20, // Change from 12
  // ...
}
```

### Tweak AI Behavior

Edit `config/game.config.ts`:
```typescript
ai: {
  difficulty: {
    advanced: {
      aggressionFactor: 0.9, // More aggressive
      bluffFrequency: 0.35,   // More bluffs
      // ...
    },
  },
}
```

## Troubleshooting

### "Mini app not loading"
- Check browser console for errors
- Verify SDK is properly initialized
- Ensure you're using HTTPS (required by Farcaster)

### "Wallet not connecting"
- Make sure you're testing in Farcaster client
- Check if wallet is set up in your Farcaster account
- Verify USDC contract address is correct for Base

### "Matchmaking timeout"
- Add more AI players during development
- Reduce timeout in config for faster games
- Check network connectivity

### "Hand evaluation errors"
- Verify deck is properly shuffled
- Check all cards are present (52 total)
- Ensure no duplicate cards

## Support

For help:
- Review code comments
- Check README.md for architecture details
- Consult Farcaster Mini App docs
- Open GitHub issue

## License

MIT License - Feel free to use and modify!

---

**Built with ❤️ for Farcaster**

Happy coding! 🎰🃏

