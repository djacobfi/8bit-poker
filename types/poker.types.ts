/**
 * POKER GAME TYPE DEFINITIONS
 * All TypeScript types for the poker game logic
 */

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number; // Numeric value for comparison (2-14, where Ace is 14)
}

export type HandType =
  | 'ROYAL_FLUSH'
  | 'STRAIGHT_FLUSH'
  | 'FOUR_OF_A_KIND'
  | 'FULL_HOUSE'
  | 'FLUSH'
  | 'STRAIGHT'
  | 'THREE_OF_A_KIND'
  | 'TWO_PAIR'
  | 'ONE_PAIR'
  | 'HIGH_CARD';

export interface HandResult {
  type: HandType;
  rank: number;
  name: string;
  cards: Card[];
  kicker: number[]; // High cards for tie-breaking
  handValue: number; // Numeric value for comparison
}

export type PlayerStatus = 'active' | 'folded' | 'allIn' | 'sittingOut';

export interface Player {
  id: string;
  name: string;
  avatarUrl?: string;
  chips: number;
  currentBet: number;
  holeCards: Card[];
  status: PlayerStatus;
  position?: PlayerPosition;
  isDealer: boolean;
  isHuman: boolean; // false for AI players
  actionHistory: Action[];
}

export type PlayerPosition =
  | 'dealer'
  | 'smallBlind'
  | 'bigBlind'
  | 'underTheGun'
  | 'middle'
  | 'cutoff'
  | 'button'
  | null;

export type ActionType = 'fold' | 'check' | 'call' | 'bet' | 'raise' | 'allIn';

export interface Action {
  playerId: string;
  type: ActionType;
  amount?: number;
  timestamp: number;
  round: BettingRound;
}

export type BettingRound = 'preFlop' | 'flop' | 'turn' | 'river' | 'showdown';

export interface Pot {
  type: 'main' | 'side';
  amount: number;
  eligiblePlayers: string[]; // Player IDs who can win this pot
}

export interface GameState {
  id: string;
  bettingRound: BettingRound;
  communityCards: Card[];
  pots: Pot[];
  players: Player[];
  currentPlayerIndex: number;
  dealerIndex: number;
  bigBlind: number;
  smallBlind: number;
  currentBet: number;
  minRaise: number;
  startTime: number;
  lastActionTime: number;
  gamePhase: 'waiting' | 'playing' | 'finished' | 'showdown';
  winner?: WinnerInfo;
  remainingDeck?: Card[]; // Deck after dealing hole cards
}

export interface WinnerInfo {
  playerId: string;
  hand: HandResult;
  potWon: number;
  pots: Pot[];
}

export interface MatchmakingResult {
  matched: boolean;
  players: Player[];
  aiNeeded: number;
  gameStartDelay: number;
}

export interface AIPlayer extends Player {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  personality: {
    aggressionFactor: number;
    bluffFrequency: number;
    foldTightness: number;
  };
  previousActions: Map<string, Action[]>;
}

export interface GameSession {
  gameId: string;
  players: Player[];
  gameState: GameState;
  matchmakingStartTime: number;
  isMatchmaking: boolean;
}

export interface PlayerStatistics {
  playerId: string;
  handsPlayed: number;
  handsWon: number;
  winRate: number;
  totalWinnings: number;
  totalLosses: number;
  biggestPotWon: number;
  bestHand: HandResult | null;
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
  lastDailyBonus: number | null;
  chips: number;
}

// Utility types
export type GameEventType =
  | 'playerJoined'
  | 'playerLeft'
  | 'handStarted'
  | 'actionTaken'
  | 'bettingRoundComplete'
  | 'showdown'
  | 'handFinished'
  | 'gameFinished';

export interface GameEvent {
  type: GameEventType;
  timestamp: number;
  data: Record<string, unknown>;
}

// Betting validation
export interface BetValidation {
  valid: boolean;
  error?: string;
  action?: ActionType;
  amount?: number;
}

// AI decision making
export interface AIDecision {
  action: ActionType;
  amount?: number;
  reasoning: string;
  confidence: number;
}

export interface AIHandEvaluation {
  handStrength: number; // 0-1 scale
  outs: number; // Possible cards that improve hand
  potOdds: number; // Ratio of pot to call amount
  impliedOdds: number; // Additional bets after calling
  recommendation: 'fold' | 'call' | 'raise' | 'allIn';
}

// Matchmaking types
export interface QueuedPlayer {
  playerId: string;
  joinedAt: number;
  preferences?: {
    tableSize?: number;
    blinds?: number;
    gameSpeed?: 'fast' | 'normal' | 'slow';
  };
}

// Error types
export class PokerGameError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = false
  ) {
    super(message);
    this.name = 'PokerGameError';
  }
}

export class InvalidActionError extends PokerGameError {
  constructor(message: string, action?: string) {
    super(message, 'INVALID_ACTION', true);
    this.name = 'InvalidActionError';
  }
}

export class InsufficientChipsError extends PokerGameError {
  constructor(message: string) {
    super(message, 'INSUFFICIENT_CHIPS', true);
    this.name = 'InsufficientChipsError';
  }
}

export class NotPlayerTurnError extends PokerGameError {
  constructor(message: string) {
    super(message, 'NOT_PLAYER_TURN', true);
    this.name = 'NotPlayerTurnError';
  }
}

