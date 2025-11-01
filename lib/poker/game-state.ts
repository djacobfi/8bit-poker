/**
 * GAME STATE MANAGEMENT
 * Manages the overall game state, player actions, and transitions
 */

import {
  GameState,
  Player,
  Action,
  BettingRound,
  BetValidation,
  InvalidActionError,
  InsufficientChipsError,
  NotPlayerTurnError,
} from '@/types/poker.types';
import { GAME_CONFIG } from '@/config/game.config';
import { createAndShuffleDeck, dealCard } from './card';
import { Card } from '@/types/poker.types';

export class GameStateManager {
  /**
   * Initialize a new game state
   */
  static createGame(
    players: Player[],
    gameId: string,
    bigBlind: number = GAME_CONFIG.blinds.bigBlind
  ): GameState {
    const dealerIndex = Math.floor(Math.random() * players.length);
    
    // Reset players for new game
    const resetPlayers = players.map((p, idx) => ({
      ...p,
      currentBet: 0,
      holeCards: [],
      status: 'active' as const,
      isDealer: idx === dealerIndex,
    }));

    const gameState: GameState = {
      id: gameId,
      bettingRound: 'preFlop',
      communityCards: [],
      pots: [],
      players: resetPlayers,
      currentPlayerIndex: this.getFirstActionPlayerIndex(resetPlayers, dealerIndex, bigBlind),
      dealerIndex,
      bigBlind,
      smallBlind: bigBlind / 2,
      currentBet: bigBlind,
      minRaise: bigBlind,
      startTime: Date.now(),
      lastActionTime: Date.now(),
      gamePhase: 'waiting',
    };

    return gameState;
  }

  /**
   * Start a new hand
   */
  static startHand(gameState: GameState): GameState {
    const deck = createAndShuffleDeck();

    // Assign dealer and blinds
    const newState = this.assignPositions(gameState);
    
    // Post blinds
    const { updatedPlayers: playersWithBlinds, totalPot } = this.postBlinds(
      newState.players,
      newState.dealerIndex,
      newState.smallBlind,
      newState.bigBlind
    );

    // Deal hole cards
    const { players, remainingDeck } = this.dealHoleCards(playersWithBlinds, deck);

    // Update game state
    gameState.players = players;
    gameState.communityCards = [];
    gameState.bettingRound = 'preFlop';
    gameState.currentPlayerIndex = this.getFirstActionPlayerIndex(
      players,
      gameState.dealerIndex,
      gameState.bigBlind
    );
    gameState.currentBet = gameState.bigBlind;
    gameState.minRaise = gameState.bigBlind;
    gameState.pots = [{ type: 'main', amount: totalPot, eligiblePlayers: players.map((p) => p.id) }];
    gameState.gamePhase = 'playing';
    gameState.startTime = Date.now();
    gameState.lastActionTime = Date.now();

    return gameState;
  }

  /**
   * Process a player action
   */
  static processAction(
    gameState: GameState,
    playerId: string,
    actionType: Action['type'],
    amount?: number
  ): { gameState: GameState; action: Action; validation: BetValidation } {
    // Validate action
    const validation = this.validateAction(gameState, playerId, actionType, amount);
    
    if (!validation.valid) {
      throw new InvalidActionError(validation.error || 'Invalid action');
    }

    const player = gameState.players.find((p) => p.id === playerId);
    if (!player) {
      throw new InvalidActionError('Player not found');
    }

    // Execute action
    const action: Action = {
      playerId,
      type: actionType,
      amount: validation.amount,
      timestamp: Date.now(),
      round: gameState.bettingRound,
    };

    const updatedPlayers = this.executeAction(
      gameState.players,
      playerId,
      actionType,
      validation.amount || 0
    );

    // Update game state
    const newGameState = {
      ...gameState,
      players: updatedPlayers,
      lastActionTime: action.timestamp,
    };

    // Check if betting round is complete
    const isRoundComplete = this.isBettingRoundComplete(newGameState);
    
    if (isRoundComplete) {
      // Move to next phase
      return {
        gameState: this.progressToNextPhase(newGameState),
        action,
        validation,
      };
    }

    // Move to next player
    return {
      gameState: { ...newGameState, currentPlayerIndex: this.getNextPlayerIndex(newGameState) },
      action,
      validation,
    };
  }

  /**
   * Validate an action before executing it
   */
  static validateAction(
    gameState: GameState,
    playerId: string,
    actionType: Action['type'],
    amount?: number
  ): BetValidation {
    const player = gameState.players.find((p) => p.id === playerId);
    
    if (!player) {
      return { valid: false, error: 'Player not found' };
    }

    if (player.status === 'folded') {
      return { valid: false, error: 'Player has already folded' };
    }

    if (player.status === 'allIn') {
      return { valid: false, error: 'Player is all-in' };
    }

    // Check if it's player's turn
    if (gameState.players[gameState.currentPlayerIndex].id !== playerId) {
      throw new NotPlayerTurnError('Not your turn');
    }

    const toCall = gameState.currentBet - player.currentBet;

    switch (actionType) {
      case 'fold':
        return { valid: true, action: 'fold' };

      case 'check':
        if (toCall > 0) {
          return { valid: false, error: 'Cannot check when there is a bet to call' };
        }
        return { valid: true, action: 'check' };

      case 'call':
        if (toCall === 0) {
          return { valid: false, error: 'Nothing to call' };
        }
        if (player.chips < toCall) {
          return { valid: false, error: 'Insufficient chips to call' };
        }
        return { valid: true, action: 'call', amount: toCall };

      case 'bet':
        if (toCall > 0) {
          return { valid: false, error: 'Cannot bet when there is already a bet' };
        }
        if (!amount || amount < gameState.currentBet) {
          return { valid: false, error: 'Bet must be at least big blind' };
        }
        if (player.chips < amount) {
          return { valid: false, error: 'Insufficient chips to bet' };
        }
        return { valid: true, action: 'bet', amount };

      case 'raise':
        if (!amount || amount <= gameState.currentBet) {
          return { valid: false, error: 'Raise must be greater than current bet' };
        }
        const totalNeeded = amount - player.currentBet;
        if (player.chips < totalNeeded) {
          return { valid: false, error: 'Insufficient chips to raise' };
        }
        // Check minimum raise
        const minRaise = gameState.currentBet + gameState.minRaise;
        if (amount < minRaise) {
          return { valid: false, error: `Minimum raise is ${minRaise}` };
        }
        return { valid: true, action: 'raise', amount };

      case 'allIn':
        if (player.chips === 0) {
          return { valid: false, error: 'No chips to go all-in' };
        }
        return { valid: true, action: 'allIn', amount: player.chips };

      default:
        return { valid: false, error: 'Unknown action type' };
    }
  }

  /**
   * Execute an action on a player
   */
  private static executeAction(
    players: Player[],
    playerId: string,
    actionType: Action['type'],
    amount: number
  ): Player[] {
    return players.map((p) => {
      if (p.id !== playerId) return p;

      const actionRecord: Action = {
        playerId: p.id,
        type: actionType,
        amount: actionType === 'bet' || actionType === 'raise' || actionType === 'call' ? amount : undefined,
        timestamp: Date.now(),
        round: 'preFlop', // This will be updated by caller
      };

      switch (actionType) {
        case 'fold':
          return { ...p, status: 'folded', currentBet: p.currentBet, actionHistory: [...p.actionHistory, actionRecord] };

        case 'check':
          return { ...p, currentBet: p.currentBet, actionHistory: [...p.actionHistory, actionRecord] };

        case 'call':
          return {
            ...p,
            chips: p.chips - amount,
            currentBet: p.currentBet + amount,
            actionHistory: [...p.actionHistory, actionRecord],
          };

        case 'bet':
        case 'raise':
          return {
            ...p,
            chips: p.chips - amount,
            currentBet: p.currentBet + amount,
            actionHistory: [...p.actionHistory, actionRecord],
          };

        case 'allIn':
          return {
            ...p,
            chips: 0,
            currentBet: p.currentBet + amount,
            status: 'allIn',
            actionHistory: [...p.actionHistory, actionRecord],
          };

        default:
          return p;
      }
    });
  }

  /**
   * Check if betting round is complete
   */
  private static isBettingRoundComplete(gameState: GameState): boolean {
    const activePlayers = gameState.players.filter((p) => p.status === 'folded');
    
    if (activePlayers.length === 1) {
      return true; // Only one player left
    }

    // All players have acted and bets are equal
    const playersInHand = gameState.players.filter(
      (p) => p.status === 'active' || p.status === 'allIn'
    );
    
    if (playersInHand.length <= 1) {
      return true;
    }

    // Check if all players have matched the current bet
    const allMatched = playersInHand.every(
      (p) => p.currentBet === gameState.currentBet || p.status === 'allIn' || p.chips === 0
    );

    return allMatched;
  }

  /**
   * Progress to next betting phase
   */
  private static progressToNextPhase(gameState: GameState): GameState {
    const phaseOrder: BettingRound[] = ['preFlop', 'flop', 'turn', 'river', 'showdown'];
    const currentIndex = phaseOrder.indexOf(gameState.bettingRound);
    
    if (currentIndex === -1 || currentIndex === phaseOrder.length - 1) {
      gameState.gamePhase = 'finished';
      return gameState;
    }

    const nextPhase = phaseOrder[currentIndex + 1];
    
    // Deal community cards if needed
    if (nextPhase === 'flop') {
      // Deal 3 flop cards
      gameState.communityCards = [];
    } else if (nextPhase === 'turn' || nextPhase === 'river') {
      // Already dealt in previous phase
    }

    // Reset betting state
    gameState.bettingRound = nextPhase;
    gameState.currentBet = 0;
    gameState.minRaise = gameState.bigBlind;
    gameState.players = gameState.players.map((p) => ({ ...p, currentBet: 0 }));

    // Set first player to act
    const activePlayers = gameState.players.filter(
      (p) => p.status === 'active' || p.status === 'allIn'
    );
    
    if (activePlayers.length <= 1) {
      gameState.gamePhase = 'finished';
    } else {
      gameState.currentPlayerIndex = this.getFirstActionPlayerIndex(
        gameState.players,
        gameState.dealerIndex,
        gameState.bigBlind
      );
    }

    return gameState;
  }

  /**
   * Assign dealer and blind positions
   */
  private static assignPositions(gameState: GameState): GameState {
    // Dealer button rotates
    const nextDealerIndex = (gameState.dealerIndex + 1) % gameState.players.length;
    
    gameState.players = gameState.players.map((p, idx) => ({
      ...p,
      isDealer: idx === nextDealerIndex,
    }));
    
    gameState.dealerIndex = nextDealerIndex;
    return gameState;
  }

  /**
   * Post small blind and big blind
   */
  private static postBlinds(
    players: Player[],
    dealerIndex: number,
    smallBlind: number,
    bigBlind: number
  ): { updatedPlayers: Player[]; totalPot: number } {
    let totalPot = 0;

    const updatedPlayers = players.map((player, index) => {
      const smallBlindIndex = (dealerIndex + 1) % players.length;
      const bigBlindIndex = (dealerIndex + 2) % players.length;

      if (index === smallBlindIndex && player.chips >= smallBlind) {
        totalPot += smallBlind;
        return {
          ...player,
          chips: player.chips - smallBlind,
          currentBet: smallBlind,
        };
      }
      
      if (index === bigBlindIndex && player.chips >= bigBlind) {
        totalPot += bigBlind;
        return {
          ...player,
          chips: player.chips - bigBlind,
          currentBet: bigBlind,
        };
      }

      return player;
    });

    return { updatedPlayers, totalPot };
  }

  /**
   * Deal hole cards to all players
   */
  private static dealHoleCards(players: Player[], deck: Card[]): {
    players: Player[];
    remainingDeck: Card[];
  } {
    let remainingDeck = deck;
    const updatedPlayers = players.map((player) => {
      const { card: card1, remainingDeck: deck1 } = dealCard(remainingDeck);
      const { card: card2, remainingDeck: deck2 } = dealCard(deck1);
      remainingDeck = deck2;
      return {
        ...player,
        holeCards: [card1, card2],
      };
    });

    return { players: updatedPlayers, remainingDeck };
  }

  /**
   * Get first player to act in betting round
   */
  private static getFirstActionPlayerIndex(
    players: Player[],
    dealerIndex: number,
    bigBlind: number
  ): number {
    // First to act is left of big blind (or left of dealer if 2 players)
    const bigBlindIndex = (dealerIndex + 2) % players.length;
    return (bigBlindIndex + 1) % players.length;
  }

  /**
   * Get next active player index
   */
  private static getNextPlayerIndex(gameState: GameState): number {
    const players = gameState.players;
    let nextIndex = (gameState.currentPlayerIndex + 1) % players.length;
    
    // Skip folded and all-in players
    while (
      players[nextIndex].status === 'folded' ||
      (players[nextIndex].status === 'allIn' && players[nextIndex].chips === 0)
    ) {
      nextIndex = (nextIndex + 1) % players.length;
    }

    return nextIndex;
  }
}

