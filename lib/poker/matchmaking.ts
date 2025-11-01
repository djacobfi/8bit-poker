/**
 * MATCHMAKING SYSTEM
 * Handles player matching and AI bot insertion
 */

import { Player, MatchmakingResult, AIPlayer } from '@/types/poker.types';
import { GAME_CONFIG } from '@/config/game.config';

const AI_NAMES = [
  'Ace High',
  'Bluff King',
  'Card Shark',
  'Dealer Dan',
  'Flush Frank',
  'Pocket Pair',
  'River Rat',
  'Showdown Steve',
];

export class MatchmakingManager {
  /**
   * Attempt to match players for a game
   * Returns matched players and how many AI bots are needed
   */
  static matchPlayers(
    queuedPlayers: Player[],
    matchmakingStartTime: number,
    currentTime: number = Date.now()
  ): MatchmakingResult {
    const elapsedSeconds = Math.floor((currentTime - matchmakingStartTime) / 1000);
    const timeoutReached = elapsedSeconds >= GAME_CONFIG.matchmaking.timeoutSeconds;

    // Minimum players needed to start
    const minPlayers = GAME_CONFIG.matchmaking.minPlayersToStart;
    const maxPlayers = GAME_CONFIG.players.maxPerTable;

    // If we have enough real players, start immediately
    if (queuedPlayers.length >= maxPlayers) {
      return {
        matched: true,
        players: queuedPlayers.slice(0, maxPlayers),
        aiNeeded: 0,
        gameStartDelay: 0,
      };
    }

    // If timeout reached, fill with AI
    if (timeoutReached && queuedPlayers.length >= minPlayers) {
      const aiNeeded = maxPlayers - queuedPlayers.length;
      const aiPlayers = this.createAIPlayers(aiNeeded);

      return {
        matched: true,
        players: [...queuedPlayers, ...aiPlayers],
        aiNeeded,
        gameStartDelay: 1000, // 1 second delay before starting
      };
    }

    // Still waiting for players or timeout
    return {
      matched: false,
      players: queuedPlayers,
      aiNeeded: 0,
      gameStartDelay: 0,
    };
  }

  /**
   * Create AI players with random names and difficulty levels
   */
  static createAIPlayers(count: number): AIPlayer[] {
    const aiPlayers: AIPlayer[] = [];
    const usedNames = new Set<string>();

    // Randomly assign difficulty levels
    const difficultyLevels: Array<'beginner' | 'intermediate' | 'advanced'> = [
      'beginner',
      'intermediate',
      'advanced',
    ];

    for (let i = 0; i < count; i++) {
      // Ensure unique names
      let name: string;
      do {
        name = AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
      } while (usedNames.has(name));
      
      usedNames.add(name);

      // Random difficulty
      const difficulty = difficultyLevels[
        Math.floor(Math.random() * difficultyLevels.length)
      ] as 'beginner' | 'intermediate' | 'advanced';

      const config = GAME_CONFIG.ai.difficulty[difficulty];
      
      const aiPlayer: AIPlayer = {
        id: `ai_${Date.now()}_${i}`,
        name,
        chips: GAME_CONFIG.players.startingChips,
        currentBet: 0,
        holeCards: [],
        status: 'active',
        isDealer: false,
        isHuman: false,
        actionHistory: [],
        difficulty,
        personality: {
          aggressionFactor: config.aggressionFactor,
          bluffFrequency: config.bluffFrequency,
          foldTightness: config.foldTightness,
        },
        previousActions: new Map(),
      };

      aiPlayers.push(aiPlayer);
    }

    return aiPlayers;
  }

  /**
   * Calculate matchmaking progress percentage
   */
  static getMatchmakingProgress(
    queuedPlayers: Player[],
    matchmakingStartTime: number,
    currentTime: number = Date.now()
  ): number {
    const elapsedSeconds = Math.floor((currentTime - matchmakingStartTime) / 1000);
    const timeout = GAME_CONFIG.matchmaking.timeoutSeconds;

    // Time-based progress
    const timeProgress = Math.min((elapsedSeconds / timeout) * 100, 100);

    // Player-based progress
    const minPlayers = GAME_CONFIG.matchmaking.minPlayersToStart;
    const maxPlayers = GAME_CONFIG.players.maxPerTable;
    const playerProgress = (queuedPlayers.length / maxPlayers) * 100;

    // Use whichever is higher
    return Math.max(timeProgress, playerProgress);
  }

  /**
   * Check if we should add AI based on current state
   */
  static shouldAddAI(
    queuedPlayers: Player[],
    matchmakingStartTime: number,
    currentTime: number = Date.now()
  ): boolean {
    const elapsedSeconds = Math.floor((currentTime - matchmakingStartTime) / 1000);
    const timeoutReached = elapsedSeconds >= GAME_CONFIG.matchmaking.timeoutSeconds;
    const hasMinPlayers = queuedPlayers.length >= GAME_CONFIG.matchmaking.minPlayersToStart;

    return timeoutReached && hasMinPlayers;
  }

  /**
   * Get estimated wait time
   */
  static getEstimatedWaitTime(
    queuedPlayers: Player[],
    matchmakingStartTime: number,
    currentTime: number = Date.now()
  ): number {
    const elapsedSeconds = Math.floor((currentTime - matchmakingStartTime) / 1000);
    const remaining = Math.max(
      0,
      GAME_CONFIG.matchmaking.timeoutSeconds - elapsedSeconds
    );

    return remaining;
  }
}

