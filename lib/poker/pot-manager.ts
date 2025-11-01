/**
 * POT MANAGEMENT
 * Handles pot creation, side pots, and winnings distribution
 */

import { Player, Pot, WinnerInfo } from '@/types/poker.types';
import { MonetizationCalculator } from '@/config/monetization.config';
import { HandEvaluator } from './hand-evaluator';
import { Card } from '@/types/poker.types';

export class PotManager {
  /**
   * Calculate all pots (main + side pots) from current betting state
   */
  static calculatePots(players: Player[]): Pot[] {
    const pots: Pot[] = [];
    const activePlayers = players.filter((p) => p.status !== 'folded');

    // Get all unique bet amounts to determine side pots
    const betAmounts = [...new Set(activePlayers.map((p) => p.currentBet))].sort((a, b) => a - b);

    // Create main pot
    const mainPotContribution = betAmounts[0] * activePlayers.length;
    const mainPot: Pot = {
      type: 'main',
      amount: mainPotContribution,
      eligiblePlayers: activePlayers.map((p) => p.id),
    };
    pots.push(mainPot);

    // Create side pots if needed
    for (let i = 1; i < betAmounts.length; i++) {
      const previousBet = betAmounts[i - 1];
      const currentBet = betAmounts[i];
      const diff = currentBet - previousBet;

      // Only eligible players who bet at least currentBet can win this pot
      const eligiblePlayers = activePlayers.filter((p) => p.currentBet >= currentBet);

      if (eligiblePlayers.length > 0 && diff > 0) {
        const sidePotAmount = diff * eligiblePlayers.length;
        const sidePot: Pot = {
          type: 'side',
          amount: sidePotAmount,
          eligiblePlayers: eligiblePlayers.map((p) => p.id),
        };
        pots.push(sidePot);
      }
    }

    return pots;
  }

  /**
   * Determine winners for each pot and distribute winnings
   */
  static determineWinners(
    pots: Pot[],
    players: Player[],
    communityCards: Card[]
  ): WinnerInfo[] {
    const winners: WinnerInfo[] = [];

    for (const pot of pots) {
      // Get eligible players still in the hand
      const eligiblePlayers = players.filter(
        (p) => pot.eligiblePlayers.includes(p.id) && p.status !== 'folded'
      );

      if (eligiblePlayers.length === 0) {
        continue;
      }

      if (eligiblePlayers.length === 1) {
        // Single winner takes entire pot
        const player = eligiblePlayers[0];
        winners.push({
          playerId: player.id,
          hand: HandEvaluator.evaluateHand([...player.holeCards, ...communityCards]),
          potWon: pot.amount,
          pots: [pot],
        });
        continue;
      }

      // Multiple players - need showdown
      const playerHands = eligiblePlayers.map((player) => ({
        playerId: player.id,
        hand: HandEvaluator.evaluateHand([...player.holeCards, ...communityCards]),
        player,
      }));

      // Sort by hand strength (best first)
      playerHands.sort((a, b) => HandEvaluator.compareHands(a.hand, b.hand) * -1);

      // Find all winners (handling ties)
      const bestHand = playerHands[0].hand;
      const winnersForPot = playerHands.filter(
        (ph) => HandEvaluator.compareHands(ph.hand, bestHand) === 0
      );

      // Distribute pot equally among winners
      const potPerWinner = Math.floor(pot.amount / winnersForPot.length);
      const remainder = pot.amount % winnersForPot.length;

      winnersForPot.forEach((winner, index) => {
        const potWon = potPerWinner + (index < remainder ? 1 : 0);
        winners.push({
          playerId: winner.playerId,
          hand: winner.hand,
          potWon,
          pots: [pot],
        });
      });
    }

    return winners;
  }

  /**
   * Apply rake to pots and calculate net payout
   */
  static applyRake(pots: Pot[]): { potsWithRake: Pot[]; totalRake: number } {
    let totalRake = 0;

    const potsWithRake = pots.map((pot) => {
      const rake = MonetizationCalculator.calculateRake(pot.amount);
      totalRake += rake;
      return {
        ...pot,
        amount: pot.amount - rake,
      };
    });

    return { potsWithRake, totalRake };
  }

  /**
   * Consolidate winners into single winner info per player
   */
  static consolidateWinners(winners: WinnerInfo[]): WinnerInfo[] {
    const consolidated = new Map<string, WinnerInfo>();

    for (const winner of winners) {
      const existing = consolidated.get(winner.playerId);
      if (existing) {
        // Merge pots and add winnings
        existing.potWon += winner.potWon;
        existing.pots.push(...winner.pots);
      } else {
        consolidated.set(winner.playerId, { ...winner });
      }
    }

    return Array.from(consolidated.values());
  }

  /**
   * Calculate total pot size
   */
  static calculateTotalPot(pots: Pot[]): number {
    return pots.reduce((sum, pot) => sum + pot.amount, 0);
  }

  /**
   * Get pot breakdown for display
   */
  static getPotBreakdown(pots: Pot[]): { main: number; side: number; total: number } {
    const main = pots.find((p) => p.type === 'main')?.amount || 0;
    const side = pots.filter((p) => p.type === 'side').reduce((sum, p) => sum + p.amount, 0);
    return { main, side, total: main + side };
  }
}

