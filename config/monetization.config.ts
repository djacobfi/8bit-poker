/**
 * MONETIZATION CONFIGURATION
 * Centralized configuration for all payment-related logic
 * Easily adjust prices, bonuses, and rewards without touching payment logic
 */

import { BigNumberish } from 'ethers';

// USDC contract address on Base
export const USDC_CONTRACT = {
  address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const,
  decimals: 6, // USDC uses 6 decimals on Base
  symbol: 'USDC',
  chainId: 8453, // Base mainnet
};

// Base RPC URL for web3 interactions
export const RPC_URL = 'https://mainnet.base.org';

/**
 * CHIP PRICING & PACKAGES
 */
export const CHIP_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    chips: 1000,
    usdPrice: 0.50,
    bonusChips: 0, // Bonus chips on top
    description: 'Perfect for getting started',
    popular: false,
  },
  {
    id: 'bronze',
    name: 'Bronze Pack',
    chips: 2500,
    usdPrice: 1.00,
    bonusChips: 500,
    description: 'Best value for casual players',
    popular: true,
  },
  {
    id: 'silver',
    name: 'Silver Pack',
    chips: 5000,
    usdPrice: 1.75,
    bonusChips: 1500,
    description: 'Get more, save more',
    popular: false,
  },
  {
    id: 'gold',
    name: 'Gold Pack',
    chips: 10000,
    usdPrice: 3.00,
    bonusChips: 4000,
    description: 'Ultimate value',
    popular: false,
  },
  {
    id: 'platinum',
    name: 'Platinum Pack',
    chips: 25000,
    usdPrice: 6.50,
    bonusChips: 15000,
    description: 'Maximum chips, maximum savings',
    popular: false,
  },
] as const;

/**
 * GAME ENTRY FEES & PAYOUTS
 */
export const GAME_ECONOMY = {
  entryFees: {
    cashGame: {
      usd: 0.01, // $0.01 per hand
      chips: 10, // Equivalent in chips
    },
    tournament: {
      usd: 0.02, // $0.02 per tournament
      chips: 20, // Equivalent in chips
    },
  },

  rake: {
    percentage: 5, // 5% house rake
    minChips: 1, // Minimum rake of 1 chip
    maxChips: 50, // Maximum rake of 50 chips per hand
  },

  payouts: {
    // Payout structure for tournaments
    tournament: [
      { position: 1, percentage: 50 }, // Winner takes 50%
      { position: 2, percentage: 30 }, // Second place takes 30%
      { position: 3, percentage: 20 }, // Third place takes 20%
    ],
  },
} as const;

/**
 * DAILY BONUSES & REWARDS
 */
export const REWARD_SYSTEM = {
  dailyBonus: {
    amount: 100, // 100 free chips per day
    cooldownHours: 24,
    description: 'Daily login bonus',
  },

  streak: {
    // Win streak bonuses
    rewards: [
      { wins: 3, chips: 150, name: '3-Win Streak' },
      { wins: 5, chips: 300, name: '5-Win Streak' },
      { wins: 10, chips: 750, name: '10-Win Streak' },
      { wins: 15, chips: 1500, name: '15-Win Streak' },
      { wins: 20, chips: 3000, name: '20-Win Streak' },
    ],
    description: 'Win streak rewards',
  },

  achievements: {
    firstWin: { chips: 50, name: 'First Victory' },
    royalFlush: { chips: 1000, name: 'Royal Flush Master' },
    straightFlush: { chips: 500, name: 'Straight Flush Ace' },
    fourOfAKind: { chips: 250, name: 'Four of a Kind Pro' },
    fullHouse: { chips: 100, name: 'Full House Expert' },
    winWithHighCard: { chips: 200, name: 'High Card Hero' },
    biggestPot: { chips: 500, name: 'Big Pot Winner' },
  },

  referral: {
    chipsForReferrer: 500, // Bonus chips for you
    chipsForReferree: 500, // Bonus chips for new user
    requiredSignups: 1, // How many signups needed to claim
  },
} as const;

/**
 * CALCULATION HELPERS
 */
export class MonetizationCalculator {
  /**
   * Convert USD price to USDC (6 decimals)
   */
  static usdToUsdc(usdAmount: number): bigint {
    const usdcAmount = Math.round(usdAmount * Math.pow(10, USDC_CONTRACT.decimals));
    return BigInt(usdcAmount);
  }

  /**
   * Convert USDC (6 decimals) to USD
   */
  static usdcToUsd(usdcAmount: bigint): number {
    return Number(usdcAmount) / Math.pow(10, USDC_CONTRACT.decimals);
  }

  /**
   * Calculate total chips including bonus
   */
  static getTotalChips(chipPackage: typeof CHIP_PACKAGES[number]): number {
    return chipPackage.chips + chipPackage.bonusChips;
  }

  /**
   * Calculate rake for a given pot size
   */
  static calculateRake(potSize: number): number {
    const percentageRake = Math.floor((potSize * GAME_ECONOMY.rake.percentage) / 100);
    const rake = Math.max(
      GAME_ECONOMY.rake.minChips,
      Math.min(percentageRake, GAME_ECONOMY.rake.maxChips)
    );
    return rake;
  }

  /**
   * Calculate net payout after rake
   */
  static calculateNetPayout(potSize: number): number {
    const rake = this.calculateRake(potSize);
    return potSize - rake;
  }

  /**
   * Get chip package by ID
   */
  static getChipPackage(id: string): typeof CHIP_PACKAGES[number] | undefined {
    return CHIP_PACKAGES.find((pkg) => pkg.id === id);
  }

  /**
   * Get streak reward for current win count
   */
  static getStreakReward(winStreak: number): typeof REWARD_SYSTEM.streak.rewards[number] | null {
    const sortedRewards = [...REWARD_SYSTEM.streak.rewards].sort((a, b) => b.wins - a.wins);
    return sortedRewards.find((reward) => winStreak >= reward.wins) || null;
  }

  /**
   * Check if streak reward was already claimed
   */
  static isStreakRewardClaimed(
    winStreak: number,
    claimedRewards: number[]
  ): { shouldClaim: boolean; reward: typeof REWARD_SYSTEM.streak.rewards[number] | null } {
    const reward = this.getStreakReward(winStreak);
    if (!reward) return { shouldClaim: false, reward: null };
    
    const alreadyClaimed = claimedRewards.includes(reward.wins);
    return { shouldClaim: !alreadyClaimed, reward };
  }
}

/**
 * Type exports
 */
export type ChipPackageId = typeof CHIP_PACKAGES[number]['id'];
export type GameType = keyof typeof GAME_ECONOMY.entryFees;
export type AchievementId = keyof typeof REWARD_SYSTEM.achievements;

