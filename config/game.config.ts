/**
 * CORE GAME CONFIGURATION
 * All game rules, timings, and mechanics are defined here
 * This allows easy tuning without touching game logic
 */

export const GAME_CONFIG = {
  // === PLAYER CONFIGURATION ===
  players: {
    minPerTable: 2,
    maxPerTable: 4,
    startingChips: 1000,
    initialChips: 1000, // New users start with this many chips
  },

  // === MATCHMAKING ===
  matchmaking: {
    timeoutSeconds: 12,
    minPlayersToStart: 1, // Can start with just yourself + AI
  },

  // === HAND PHASES ===
  bettingRounds: {
    preFlop: { name: 'Pre-Flop', cards: 0 },
    flop: { name: 'The Flop', cards: 3 },
    turn: { name: 'The Turn', cards: 1 },
    river: { name: 'The River', cards: 1 },
    showdown: { name: 'Showdown', cards: 0 },
  },

  // === BETTING STRUCTURE ===
  blinds: {
    smallBlind: 5,
    bigBlind: 10,
    anteAmount: 0, // Not used in standard Texas Hold'em
  },

  betting: {
    minRaise: 2, // Minimum raise is 2x current bet
    minBetMultiplier: 1, // Minimum bet is equal to big blind
    allowAllIn: true,
    allowStringBetting: false,
  },

  // === TIMING ===
  timers: {
    turnDurationMs: 20000, // 20 seconds per action
    betweenActionsMs: 100, // Small delay between actions for smooth UX
    showdownReviewMs: 15000, // 15 seconds to review winning hands
    endOfGameDelayMs: 10000, // 10 seconds before next hand
    connectionTimeoutMs: 30000, // 30 seconds before auto-fold on disconnect
  },

  // === AI CONFIGURATION ===
  ai: {
    difficulty: {
      beginner: {
        name: 'Beginner',
        aggressionFactor: 0.3,
        bluffFrequency: 0.05,
        foldTightness: 0.6,
        reactionTimeMs: { min: 2000, max: 5000 },
      },
      intermediate: {
        name: 'Intermediate',
        aggressionFactor: 0.5,
        bluffFrequency: 0.15,
        foldTightness: 0.4,
        reactionTimeMs: { min: 1500, max: 4000 },
      },
      advanced: {
        name: 'Advanced',
        aggressionFactor: 0.7,
        bluffFrequency: 0.25,
        foldTightness: 0.3,
        reactionTimeMs: { min: 1000, max: 3000 },
      },
    },
    // AI can NEVER see upcoming cards
    hasFutureCardKnowledge: false,
  },

  // === POKER HAND RANKINGS ===
  handRankings: {
    ROYAL_FLUSH: { rank: 10, name: 'Royal Flush' },
    STRAIGHT_FLUSH: { rank: 9, name: 'Straight Flush' },
    FOUR_OF_A_KIND: { rank: 8, name: 'Four of a Kind' },
    FULL_HOUSE: { rank: 7, name: 'Full House' },
    FLUSH: { rank: 6, name: 'Flush' },
    STRAIGHT: { rank: 5, name: 'Straight' },
    THREE_OF_A_KIND: { rank: 4, name: 'Three of a Kind' },
    TWO_PAIR: { rank: 3, name: 'Two Pair' },
    ONE_PAIR: { rank: 2, name: 'One Pair' },
    HIGH_CARD: { rank: 1, name: 'High Card' },
  },

  // === ANIMATIONS ===
  animations: {
    cardDealDurationMs: 500,
    cardFlipDurationMs: 600,
    chipMoveDurationMs: 800,
    winningHighlightDurationMs: 2000,
  },

  // === UI DISPLAY ===
  ui: {
    showPlayerAvatars: true,
    showChipAnimations: true,
    showCardAnimations: true,
    enableSound: true,
    enableHaptics: true,
  },
} as const;

export type GameConfig = typeof GAME_CONFIG;
export type AIDifficulty = keyof typeof GAME_CONFIG.ai.difficulty;
export type BettingRound = keyof typeof GAME_CONFIG.bettingRounds;

