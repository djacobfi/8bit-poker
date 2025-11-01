/**
 * ZUSTAND GAME STATE STORE
 * Centralized state management for the poker game
 */

import { create } from 'zustand';
import {
  GameState,
  Player,
  Action,
  GameSession,
  PlayerStatistics,
  AIPlayer,
} from '@/types/poker.types';
import { GameStateManager } from '@/lib/poker/game-state';
import { MatchmakingManager } from '@/lib/poker/matchmaking';
import { AIPlayerManager } from '@/lib/poker/ai-player';
import { PotManager } from '@/lib/poker/pot-manager';
import { GAME_CONFIG } from '@/config/game.config';

interface GameStore {
  // State
  session: GameSession | null;
  statistics: PlayerStatistics | null;
  isMatchmaking: boolean;
  isGameActive: boolean;
  currentView: 'lobby' | 'game' | 'matchmaking';

  // Actions
  startMatchmaking: (user: Player) => void;
  processMatchmaking: () => void;
  startGame: (players: Player[]) => void;
  processPlayerAction: (playerId: string, actionType: Action['type'], amount?: number) => void;
  processAIActions: () => void;
  endGame: () => void;
  resetGame: () => void;
  updateStatistics: (stats: Partial<PlayerStatistics>) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  session: null,
  statistics: null,
  isMatchmaking: false,
  isGameActive: false,
  currentView: 'lobby',

  // Start matchmaking
  startMatchmaking: (user: Player) => {
    set({
      isMatchmaking: true,
      currentView: 'matchmaking',
      session: {
        gameId: `game_${Date.now()}`,
        players: [user],
        gameState: {} as GameState,
        matchmakingStartTime: Date.now(),
        isMatchmaking: true,
      },
    });

    // Start matchmaking tick
    const tick = () => {
      const { session, processMatchmaking } = get();
      if (session?.isMatchmaking) {
        processMatchmaking();
        setTimeout(tick, 1000);
      }
    };
    tick();
  },

  // Process matchmaking
  processMatchmaking: () => {
    const { session } = get();
    if (!session) return;

    const matchResult = MatchmakingManager.matchPlayers(
      session.players,
      session.matchmakingStartTime
    );

    if (matchResult.matched) {
      get().startGame(matchResult.players);
    } else {
      set({
        session: {
          ...session,
          players: matchResult.players,
        },
      });
    }
  },

  // Start the actual game
  startGame: (players: Player[]) => {
    const { session } = get();
    if (!session) return;

    const gameState = GameStateManager.createGame(players, session.gameId);
    const gameStateWithHand = GameStateManager.startHand(gameState);

    set({
      session: {
        ...session,
        players,
        gameState: gameStateWithHand,
        isMatchmaking: false,
      },
      isMatchmaking: false,
      isGameActive: true,
      currentView: 'game',
    });

    // Process AI actions if not human's turn
    setTimeout(() => {
      get().processAIActions();
    }, 500);
  },

  // Process human player action
  processPlayerAction: (playerId: string, actionType: Action['type'], amount?: number) => {
    const { session } = get();
    if (!session) return;

    try {
      const { gameState, action } = GameStateManager.processAction(
        session.gameState,
        playerId,
        actionType,
        amount
      );

      // Update session
      set({
        session: {
          ...session,
          gameState,
          players: gameState.players,
        },
      });

      // Check if game ended
      if (gameState.gamePhase === 'finished') {
        get().endGame();
        return;
      }

      // Process AI actions after delay
      setTimeout(() => {
        get().processAIActions();
      }, GAME_CONFIG.timers.betweenActionsMs);
    } catch (error) {
      console.error('Action failed:', error);
      // TODO: Show error to user
    }
  },

  // Process AI player actions
  processAIActions: () => {
    const { session } = get();
    if (!session) return;

    const currentPlayer = session.gameState.players[session.gameState.currentPlayerIndex];
    
    // Skip if it's a human player
    if (currentPlayer.isHuman) return;

    const aiPlayer = currentPlayer as AIPlayer;
    const decision = AIPlayerManager.makeDecision(aiPlayer, session.gameState);
    
    // Get reaction time
    const reactionTime = AIPlayerManager.getReactionTime(aiPlayer);

    setTimeout(() => {
      get().processPlayerAction(aiPlayer.id, decision.action, decision.amount);
    }, reactionTime);
  },

  // End game and show results
  endGame: () => {
    const { session } = get();
    if (!session) return;

    // Determine winners
    const winners = PotManager.determineWinners(
      session.gameState.pots,
      session.gameState.players,
      session.gameState.communityCards
    );

    console.log('Game ended. Winners:', winners);

    set({ isGameActive: false });

    // After a delay, reset to lobby or start next hand
    setTimeout(() => {
      get().resetGame();
    }, GAME_CONFIG.timers.endOfGameDelayMs);
  },

  // Reset game state
  resetGame: () => {
    set({
      session: null,
      isMatchmaking: false,
      isGameActive: false,
      currentView: 'lobby',
    });
  },

  // Update player statistics
  updateStatistics: (stats: Partial<PlayerStatistics>) => {
    set((state) => ({
      statistics: state.statistics ? { ...state.statistics, ...stats } : null,
    }));
  },
}));

