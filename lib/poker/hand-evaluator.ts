/**
 * HAND EVALUATION SYSTEM
 * Evaluates poker hands and determines winners
 */

import { Card, HandResult, HandType } from '@/types/poker.types';
import { GAME_CONFIG } from '@/config/game.config';

export class HandEvaluator {
  /**
   * Evaluate a hand from 5-7 cards and return the best 5-card hand
   */
  static evaluateHand(cards: Card[]): HandResult {
    if (cards.length < 5) {
      throw new Error('Need at least 5 cards to evaluate hand');
    }

    // Generate all possible 5-card combinations
    const bestHand = this.findBestHand(cards);
    return bestHand;
  }

  /**
   * Compare two hands and determine the winner
   * Returns: 1 if hand1 wins, -1 if hand2 wins, 0 if tie
   */
  static compareHands(hand1: HandResult, hand2: HandResult): number {
    // First compare hand rank
    if (hand1.rank > hand2.rank) return 1;
    if (hand1.rank < hand2.rank) return -1;

    // Same hand type, compare kickers
    for (let i = 0; i < hand1.kicker.length; i++) {
      if (hand1.kicker[i] > hand2.kicker[i]) return 1;
      if (hand1.kicker[i] < hand2.kicker[i]) return -1;
    }

    return 0; // Tie
  }

  /**
   * Find the best 5-card hand from 5-7 cards
   */
  private static findBestHand(cards: Card[]): HandResult {
    let bestHand: HandResult | null = null;

    // Generate all combinations of 5 cards
    const combinations = this.generateCombinations(cards, 5);

    for (const combo of combinations) {
      const evaluated = this.evaluateFiveCardHand(combo);
      if (!bestHand || this.compareHands(evaluated, bestHand) > 0) {
        bestHand = evaluated;
      }
    }

    return bestHand!;
  }

  /**
   * Generate all combinations of r cards from cards array
   */
  private static generateCombinations(cards: Card[], r: number): Card[][] {
    const combinations: Card[][] = [];

    function combine(start: number, combo: Card[]) {
      if (combo.length === r) {
        combinations.push([...combo]);
        return;
      }

      for (let i = start; i < cards.length; i++) {
        combo.push(cards[i]);
        combine(i + 1, combo);
        combo.pop();
      }
    }

    combine(0, []);
    return combinations;
  }

  /**
   * Evaluate a 5-card hand
   */
  private static evaluateFiveCardHand(cards: Card[]): HandResult {
    // Sort cards by value (descending)
    const sorted = [...cards].sort((a, b) => b.value - a.value);
    const values = sorted.map((c) => c.value);
    const suits = sorted.map((c) => c.suit);

    // Check for straight/royal flush
    const straightFlush = this.checkStraightFlush(sorted, values);
    if (straightFlush) {
      const isRoyal = values[0] === 14 && this.isStraight(values);
      return {
        type: isRoyal ? 'ROYAL_FLUSH' : 'STRAIGHT_FLUSH',
        rank: GAME_CONFIG.handRankings[isRoyal ? 'ROYAL_FLUSH' : 'STRAIGHT_FLUSH'].rank,
        name: GAME_CONFIG.handRankings[isRoyal ? 'ROYAL_FLUSH' : 'STRAIGHT_FLUSH'].name,
        cards: sorted,
        kicker: [values[0]],
        handValue: isRoyal ? 10000 + values[0] : 9000 + values[0],
      };
    }

    // Check for four of a kind
    const fourOfAKind = this.getFourOfAKind(values);
    if (fourOfAKind) {
      const kicker = values.find((v) => v !== fourOfAKind);
      return {
        type: 'FOUR_OF_A_KIND',
        rank: GAME_CONFIG.handRankings.FOUR_OF_A_KIND.rank,
        name: GAME_CONFIG.handRankings.FOUR_OF_A_KIND.name,
        cards: sorted,
        kicker: [fourOfAKind, kicker!],
        handValue: 8000 + fourOfAKind,
      };
    }

    // Check for full house
    const fullHouse = this.getFullHouse(values);
    if (fullHouse) {
      return {
        type: 'FULL_HOUSE',
        rank: GAME_CONFIG.handRankings.FULL_HOUSE.rank,
        name: GAME_CONFIG.handRankings.FULL_HOUSE.name,
        cards: sorted,
        kicker: [fullHouse.three, fullHouse.pair],
        handValue: 7000 + fullHouse.three * 100 + fullHouse.pair,
      };
    }

    // Check for flush
    if (this.allSameSuit(suits)) {
      return {
        type: 'FLUSH',
        rank: GAME_CONFIG.handRankings.FLUSH.rank,
        name: GAME_CONFIG.handRankings.FLUSH.name,
        cards: sorted,
        kicker: values.slice(0, 5),
        handValue: 6000 + values[0] * 100 + values[1] * 10 + values[2],
      };
    }

    // Check for straight
    if (this.isStraight(values)) {
      return {
        type: 'STRAIGHT',
        rank: GAME_CONFIG.handRankings.STRAIGHT.rank,
        name: GAME_CONFIG.handRankings.STRAIGHT.name,
        cards: sorted,
        kicker: [values[0]],
        handValue: 5000 + values[0],
      };
    }

    // Check for three of a kind
    const threeOfAKind = this.getThreeOfAKind(values);
    if (threeOfAKind) {
      const kickers = values.filter((v) => v !== threeOfAKind);
      return {
        type: 'THREE_OF_A_KIND',
        rank: GAME_CONFIG.handRankings.THREE_OF_A_KIND.rank,
        name: GAME_CONFIG.handRankings.THREE_OF_A_KIND.name,
        cards: sorted,
        kicker: [threeOfAKind, ...kickers],
        handValue: 4000 + threeOfAKind,
      };
    }

    // Check for two pair
    const twoPair = this.getTwoPair(values);
    if (twoPair) {
      const kicker = values.find((v) => v !== twoPair.first && v !== twoPair.second);
      return {
        type: 'TWO_PAIR',
        rank: GAME_CONFIG.handRankings.TWO_PAIR.rank,
        name: GAME_CONFIG.handRankings.TWO_PAIR.name,
        cards: sorted,
        kicker: [twoPair.first, twoPair.second, kicker!],
        handValue: 3000 + twoPair.first * 100 + twoPair.second,
      };
    }

    // Check for one pair
    const pair = this.getPair(values);
    if (pair) {
      const kickers = values.filter((v) => v !== pair);
      return {
        type: 'ONE_PAIR',
        rank: GAME_CONFIG.handRankings.ONE_PAIR.rank,
        name: GAME_CONFIG.handRankings.ONE_PAIR.name,
        cards: sorted,
        kicker: [pair, ...kickers],
        handValue: 2000 + pair,
      };
    }

    // High card
    return {
      type: 'HIGH_CARD',
      rank: GAME_CONFIG.handRankings.HIGH_CARD.rank,
      name: GAME_CONFIG.handRankings.HIGH_CARD.name,
      cards: sorted,
      kicker: values.slice(0, 5),
      handValue: 1000 + values[0],
    };
  }

  // Helper methods for hand detection

  private static allSameSuit(suits: Suit[]): boolean {
    return suits.every((suit) => suit === suits[0]);
  }

  private static isStraight(values: number[]): boolean {
    // Check for regular straight (2-6, 3-7, etc.)
    let isRegularStraight = true;
    for (let i = 1; i < values.length; i++) {
      if (values[i] !== values[i - 1] - 1) {
        isRegularStraight = false;
        break;
      }
    }

    // Check for ace-low straight (A-2-3-4-5)
    const isAceLowStraight =
      values[0] === 14 &&
      values[1] === 5 &&
      values[2] === 4 &&
      values[3] === 3 &&
      values[4] === 2;

    return isRegularStraight || isAceLowStraight;
  }

  private static checkStraightFlush(cards: Card[], values: number[]): boolean {
    return this.allSameSuit(cards.map((c) => c.suit)) && this.isStraight(values);
  }

  private static getFourOfAKind(values: number[]): number | null {
    const counts = new Map<number, number>();
    for (const value of values) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    for (const [value, count] of counts) {
      if (count === 4) return value;
    }
    return null;
  }

  private static getFullHouse(values: number[]): { three: number; pair: number } | null {
    const counts = new Map<number, number>();
    for (const value of values) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    let three: number | null = null;
    let pair: number | null = null;
    for (const [value, count] of counts) {
      if (count === 3) three = value;
      if (count === 2) pair = value;
    }
    return three && pair ? { three, pair } : null;
  }

  private static getThreeOfAKind(values: number[]): number | null {
    const counts = new Map<number, number>();
    for (const value of values) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    for (const [value, count] of counts) {
      if (count === 3) return value;
    }
    return null;
  }

  private static getTwoPair(values: number[]): { first: number; second: number } | null {
    const counts = new Map<number, number>();
    for (const value of values) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    const pairs: number[] = [];
    for (const [value, count] of counts) {
      if (count === 2) pairs.push(value);
    }
    if (pairs.length === 2) {
      return { first: Math.max(...pairs), second: Math.min(...pairs) };
    }
    return null;
  }

  private static getPair(values: number[]): number | null {
    const counts = new Map<number, number>();
    for (const value of values) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
    for (const [value, count] of counts) {
      if (count === 2) return value;
    }
    return null;
  }
}

// Re-export Suit type for internal use
type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

