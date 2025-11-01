# 8 Bit Poker - Farcaster Mini App

A complete Texas Hold'em Poker game in 8-bit style, built as a Farcaster mini app. Play against AI opponents, buy chips with USDC on Base, and win real crypto!

## Features

✅ **Full Poker Logic**
- Complete Texas Hold'em implementation
- Hand evaluation system
- Betting rounds (pre-flop, flop, turn, river, showdown)
- Side pots and all-in handling
- Real-time game state management

✅ **AI Opponents**
- Three difficulty levels (beginner, intermediate, advanced)
- Realistic decision-making without future card knowledge
- Personality-based playing styles
- Natural reaction times

✅ **Matchmaking**
- 12-second matchmaking window
- PvP first, AI fill-in when needed
- 2-4 players per table
- Auto-start with sufficient players

✅ **Monetization**
- Buy chips with USDC on Base
- Multiple package options (1,000 to 25,000 chips)
- Daily bonuses and win streak rewards
- Entry fees and rake system
- Real USDC payouts

✅ **Farcaster Integration**
- Full SDK integration
- User authentication via Farcaster ID
- Wallet integration for payments
- Cast sharing and social features
- Notifications support

## Tech Stack

- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Web3**: ethers.js, Farcaster Wallet
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 22.11.0 or higher
- npm, pnpm, or yarn
- Farcaster account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Poker
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Set up environment variables (create `.env.local`):
```env
# Add any environment variables here if needed
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing in Farcaster

1. Enable Developer Mode in Farcaster settings
2. Use a tunnel service (ngrok, localtunnel) to expose your local server
3. Use the [Mini App Preview Tool](https://farcaster.xyz/~/developers/mini-apps/preview)
4. Test your app with a valid tunnel URL

## Configuration

### Game Rules

All game mechanics are configurable in `config/game.config.ts`:
- Player limits and starting chips
- Matchmaking timeout
- Blinds and betting structure
- AI difficulty parameters
- Hand rankings
- Timing settings

### Monetization

All payment logic is centralized in `config/monetization.config.ts`:
- Chip pricing and packages
- Entry fees
- Rake percentages
- Daily bonuses
- Win streak rewards
- Achievements

**Modify these files to adjust game balance and economics without touching core logic.**

## Project Structure

```
Poker/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Lobby.tsx         # Main lobby screen
│   ├── PokerTable.tsx    # Game table
│   ├── PlayerSeat.tsx    # Individual player display
│   ├── CommunityCards.tsx # Community cards
│   ├── ActionButtons.tsx  # Betting controls
│   └── PotDisplay.tsx     # Pot information
├── config/               # Configuration files
│   ├── game.config.ts    # Game rules and settings
│   └── monetization.config.ts # Payment settings
├── lib/                  # Core logic libraries
│   ├── poker/           # Poker game logic
│   │   ├── card.ts      # Card/deck management
│   │   ├── hand-evaluator.ts # Hand evaluation
│   │   ├── game-state.ts # Game state management
│   │   ├── pot-manager.ts # Pot calculations
│   │   ├── matchmaking.ts # Player matching
│   │   └── ai-player.ts  # AI decision making
│   ├── farcaster/       # Farcaster integration
│   │   ├── sdk.ts       # SDK wrapper
│   │   └── wallet.ts    # Wallet utilities
│   └── store/           # State management
│       └── game-store.ts # Zustand store
├── types/               # TypeScript types
│   └── poker.types.ts   # All poker-related types
├── public/              # Static assets
│   ├── logo.png         # App logo
│   └── og-image.png     # Social sharing image
└── package.json         # Dependencies
```

## Architecture

### Modular Design

The app is built with a clear separation of concerns:

1. **Configuration Layer** (`config/`): All game rules and economics in one place
2. **Game Logic Layer** (`lib/poker/`): Pure poker logic, no UI dependencies
3. **Integration Layer** (`lib/farcaster/`): Farcaster SDK and wallet wrappers
4. **State Layer** (`lib/store/`): Zustand store for global state
5. **UI Layer** (`components/`): React components for presentation

### Why This Structure?

- **Easy Updates**: Change prices, rules, or mechanics by editing config files only
- **Testable**: Pure functions in game logic layer are easily unit testable
- **Maintainable**: Clear boundaries between concerns
- **Scalable**: Add new features without breaking existing code

## Monetization Details

### Chip Purchases

- **Starter**: 1,000 chips for $0.50
- **Bronze**: 2,500 chips (500 bonus) for $1.00
- **Silver**: 5,000 chips (1,500 bonus) for $1.75
- **Gold**: 10,000 chips (4,000 bonus) for $3.00
- **Platinum**: 25,000 chips (15,000 bonus) for $6.50

### Bonuses

- **Daily Login**: 100 chips per day
- **Win Streaks**: 
  - 3 wins: 150 chips
  - 5 wins: 300 chips
  - 10 wins: 750 chips
  - 15 wins: 1,500 chips
  - 20 wins: 3,000 chips

### Entry Fees

- **Cash Games**: $0.01 per hand (10 chips)
- **Tournaments**: $0.02 per tournament (20 chips)
- **Rake**: 5% with min 1 chip, max 50 chips per pot

## Development Workflow

### Making Changes

1. **Game Mechanics**: Edit `config/game.config.ts`
2. **Economics**: Edit `config/monetization.config.ts`
3. **UI**: Edit components in `components/`
4. **Game Logic**: Edit libraries in `lib/poker/`
5. **Types**: Edit `types/poker.types.ts` for new data structures

### Testing

Run the linter:
```bash
npm run lint
```

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Manual Deployment

1. Build: `npm run build`
2. Start: `npm start`
3. Ensure environment variables are set

### Farcaster Manifest

Before deploying, update `public/.well-known/farcaster.json`:
1. Generate your signature using [Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Replace placeholder values with your actual signature
3. Update domain URLs

## License

MIT License - feel free to use this project as a starting point for your own poker game!

## Support

For issues or questions:
- Check the [Farcaster Mini App Docs](https://miniapps.farcaster.xyz)
- Review the code structure and comments
- Open an issue on GitHub

---

Built with ❤️ for the Farcaster ecosystem

