/**
 * AI DECISION SYSTEM
 * Intelligent AI that makes decisions like a human player without future card knowledge
 */

import {
  AIPlayer,
  GameState,
  Action,
  AIDecision,
  AIHandEvaluation,
  HandResult,
  BettingRound,
} from '@/types/poker.types';
import { GAME_CONFIG } from '@/config/game.config';
import { HandEvaluator } from './hand-evaluator';
import { Card } from '@/types/poker.types';

export class AIPlayerManager {
  /**
   * Make a decision for an AI player
   */
  static makeDecision(aiPlayer: AIPlayer, gameState: GameState): AIDecision {
    const evaluation = this.evaluateHand(aiPlayer, gameState);
    const decision = this.decideAction(evaluation, aiPlayer, gameState);

    return decision;
  }

  /**
   * Evaluate AI's current hand strength and situation
   */
  private static evaluateHand(aiPlayer: AIPlayer, gameState: GameState): AIHandEvaluation {
    const { holeCards } = aiPlayer;
    const { communityCards, currentBet, bettingRound } = gameState;

    // Calculate current hand strength
    const allCards = [...holeCards, ...communityCards];
    let handStrength = 0.5; // Default neutral strength

    if (communityCards.length >= 3) {
      // Can evaluate actual hand
      const handResult = HandEvaluator.evaluateHand(allCards);
      handStrength = this.handStrengthToProbability(handResult);
    } else {
      // Pre-flop or early post-flop - use hole card strength
      handStrength = this.evaluateHoleCards(holeCards);
    }

    // Calculate outs (potential improving cards)
    const outs = this.calculateOuts(allCards, communityCards.length);

    // Calculate pot odds
    const potSize = this.calculatePotSize(gameState);
    const toCall = currentBet - aiPlayer.currentBet;
    const potOdds = toCall > 0 ? potSize / toCall : 0;

    // Calculate implied odds (simplified)
    const impliedOdds = this.calculateImpliedOdds(
      handStrength,
      outs,
      bettingRound,
      gameState
    );

    // Determine recommendation
    let recommendation: 'fold' | 'call' | 'raise' | 'allIn';
    
    if (handStrength < 0.2 && potOdds < 0.1) {
      recommendation = 'fold';
    } else if (handStrength > 0.8) {
      recommendation = 'raise';
    } else if (handStrength > 0.95 || (potOdds > 5 && handStrength > 0.5)) {
      recommendation = 'allIn';
    } else if (potOdds > 3 && handStrength > 0.4) {
      recommendation = 'call';
    } else if (potOdds < 2 && handStrength < 0.6) {
      recommendation = 'fold';
    } else if (handStrength > 0.6 && potOdds > 1.5) {
      recommendation = 'raise';
    } else {
      recommendation = 'call';
    }

    // Apply personality modifiers
    recommendation = this.applyPersonalityFilters(
      recommendation,
      aiPlayer,
      handStrength,
      potOdds
    );

    return {
      handStrength,
      outs,
      potOdds,
      impliedOdds,
      recommendation,
    };
  }

  /**
   * Decide on specific action and bet amount
   */
  private static decideAction(
    evaluation: AIHandEvaluation,
    aiPlayer: AIPlayer,
    gameState: GameState
  ): AIDecision {
    const { recommendation, handStrength, potOdds } = evaluation;
    const { currentBet, bigBlind, minRaise } = gameState;
    const chips = aiPlayer.chips;
    const toCall = currentBet - aiPlayer.currentBet;

    let action: Action['type'];
    let amount: number | undefined;
    let reasoning: string;
    let confidence: number;

    switch (recommendation) {
      case 'fold':
        action = 'fold';
        reasoning = `Weak hand (${(handStrength * 100).toFixed(0)}% strength), poor pot odds (${potOdds.toFixed(2)})`;
        confidence = 0.7;

        // Small chance to bluff instead
        if (Math.random() < aiPlayer.personality.bluffFrequency) {
          action = 'call';
          reasoning = 'Bluffing with weak hand';
          amount = toCall;
          confidence = 0.3;
        }
        break;

      case 'call':
        action = 'call';
        amount = toCall;
        reasoning = `Decent hand (${(handStrength * 100).toFixed(0)}% strength), reasonable pot odds (${potOdds.toFixed(2)})`;
        confidence = 0.6;
        break;

      case 'raise':
        // Calculate raise amount based on hand strength and aggression
        const baseRaise = currentBet + minRaise;
        const aggressionMultiplier = aiPlayer.personality.aggressionFactor * 2;
        const strengthMultiplier = handStrength * 2;
        const raiseFactor = 1 + aggressionMultiplier + strengthMultiplier;

        let raiseAmount = Math.floor(baseRaise * raiseFactor);
        raiseAmount = Math.min(raiseAmount, chips);

        action = raiseAmount >= chips ? 'allIn' : 'raise';
        amount = raiseAmount;
        reasoning = `Strong hand (${(handStrength * 100).toFixed(0)}% strength), applying pressure`;
        confidence = 0.8;
        break;

      case 'allIn':
        action = 'allIn';
        amount = chips;
        reasoning = `Excellent hand (${(handStrength * 100).toFixed(0)}% strength), maximizing value`;
        confidence = 0.9;
        break;
    }

    return {
      action,
      amount: amount!,
      reasoning,
      confidence,
    };
  }

  /**
   * Convert hand result to win probability (0-1)
   */
  private static handStrengthToProbability(handResult: HandResult): number {
    // Hand ranking to approximate win probability
    const strengthMap: Record<string, number> = {
      ROYAL_FLUSH: 0.99,
      STRAIGHT_FLUSH: 0.95,
      FOUR_OF_A_KIND: 0.90,
      FULL_HOUSE: 0.85,
      FLUSH: 0.75,
      STRAIGHT: 0.70,
      THREE_OF_A_KIND: 0.65,
      TWO_PAIR: 0.55,
      ONE_PAIR: 0.40,
      HIGH_CARD: 0.20,
    };

    return strengthMap[handResult.type] || 0.5;
  }

  /**
   * Evaluate pre-flop hole card strength
   */
  private static evaluateHoleCards(holeCards: Card[]): number {
    if (holeCards.length !== 2) return 0.5;

    const [card1, card2] = holeCards;
    const isPair = card1.value === card2.value;
    const suited = card1.suit === card2.suit;
    const highCard = Math.max(card1.value, card2.value);
    const lowCard = Math.min(card1.value, card2.value);
    const connected = Math.abs(card1.value - card2.value) <= 4;

    // Premium pairs
    if (isPair && highCard >= 11) return 0.85;
    if (isPair && highCard >= 7) return 0.70;
    if (isPair) return 0.55;

    // High cards
    if (highCard === 14 && lowCard >= 10) return 0.80; // Ace with face card
    if (highCard === 13 && lowCard >= 10) return 0.75; // King with face card
    if (highCard === 14 && suited) return 0.70; // Ace suited
    if (suited && connected && highCard >= 10) return 0.65; // Suited connectors

    return 0.45; // Default average strength
  }

  /**
   * Calculate potential outs
   */
  private static calculateOuts(allCards: Card[], communityCardCount: number): number {
    // Simplified outs calculation
    if (communityCardCount === 0) return 0;
    
    const evaluation = HandEvaluator.evaluateHand(allCards);
    const rank = evaluation.rank;

    // Estimated outs based on hand strength
    if (rank >= 9) return 0; // Straight flush or better - no improvement needed
    if (rank === 8) return 0; // Four of a kind
    if (rank === 7) return 0; // Full house
    if (rank === 6) return 9; // Flush draw
    if (rank === 5) return 8; // Straight draw
    if (rank === 4) return 2; // Trips
    if (rank === 3) return 4; // Two pair
    if (rank === 2) return 5; // One pair
    return 9; // High card or weak hand
  }

  /**
   * Calculate pot size
   */
  private static calculatePotSize(gameState: GameState): number {
    return gameState.pots.reduce((sum, pot) => sum + pot.amount, 0);
  }

  /**
   * Calculate implied odds (simplified)
   */
  private static calculateImpliedOdds(
    handStrength: number,
    outs: number,
    bettingRound: BettingRound,
    gameState: GameState
  ): number {
    const potSize = this.calculatePotSize(gameState);
    const streetMultiplier: Record<BettingRound, number> = {
      preFlop: 1.5,
      flop: 1.3,
      turn: 1.1,
      river: 1.0,
      showdown: 1.0,
    };

    const multiplier = streetMultiplier[bettingRound] || 1.0;
    const expectedValue = handStrength * potSize * multiplier;

    return expectedValue;
  }

  /**
   * Apply personality filters to decision
   */
  private static applyPersonalityFilters(
    recommendation: 'fold' | 'call' | 'raise' | 'allIn',
    aiPlayer: AIPlayer,
    handStrength: number,
    potOdds: number
  ): 'fold' | 'call' | 'raise' | 'allIn' {
    const { personality } = aiPlayer;

    // Tight players fold more often
    if (recommendation === 'call' && handStrength < personality.foldTightness) {
      return 'fold';
    }

    // Aggressive players raise more
    if (recommendation === 'call' && handStrength > 0.6 && personality.aggressionFactor > 0.6) {
      return 'raise';
    }

    // Passive players call instead of raise
    if (recommendation === 'raise' && personality.aggressionFactor < 0.4) {
      return 'call';
    }

    return recommendation;
  }

  /**
   * Get reaction time for AI based on difficulty
   */
  static getReactionTime(aiPlayer: AIPlayer): number {
    const { min, max } = GAME_CONFIG.ai.difficulty[aiPlayer.difficulty].reactionTimeMs;
    return Math.random() * (max - min) + min;
  }
}

