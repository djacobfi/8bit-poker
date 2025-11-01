/**
 * CARD MANAGEMENT
 * Handles card creation, deck shuffling, and dealing
 */

import { Card, Suit, Rank } from '@/types/poker.types';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

/**
 * Get numeric value of a rank (2-14, where Ace is 14)
 */
function getRankValue(rank: Rank): number {
  const rankMap: Record<Rank, number> = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };
  return rankMap[rank];
}

/**
 * Create a single card
 */
export function createCard(suit: Suit, rank: Rank): Card {
  return {
    suit,
    rank,
    value: getRankValue(rank),
  };
}

/**
 * Create a complete deck of 52 cards
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(createCard(suit, rank));
    }
  }
  return deck;
}

/**
 * Shuffle deck using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deal a single card from the top of the deck
 */
export function dealCard(deck: Card[]): { card: Card; remainingDeck: Card[] } {
  if (deck.length === 0) {
    throw new Error('Cannot deal from empty deck');
  }
  const card = deck[0];
  const remainingDeck = deck.slice(1);
  return { card, remainingDeck };
}

/**
 * Deal multiple cards at once
 */
export function dealCards(deck: Card[], count: number): { cards: Card[]; remainingDeck: Card[] } {
  const cards: Card[] = [];
  let remainingDeck = deck;
  
  for (let i = 0; i < count; i++) {
    const { card, remainingDeck: newDeck } = dealCard(remainingDeck);
    cards.push(card);
    remainingDeck = newDeck;
  }
  
  return { cards, remainingDeck };
}

/**
 * Get card display name
 */
export function getCardDisplayName(card: Card): string {
  const suitSymbols: Record<Suit, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
  };
  
  const suitColor = card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
  return `${card.rank}${suitSymbols[card.suit]}`;
}

/**
 * Get card color for display
 */
export function getCardColor(card: Card): 'red' | 'black' {
  return card.suit === 'hearts' || card.suit === 'diamonds' ? 'red' : 'black';
}

/**
 * Get card filename for image
 */
export function getCardImageName(card: Card): string {
  const rank = card.rank === '10' ? 'T' : card.rank;
  const suitMap: Record<Suit, string> = {
    hearts: 'H',
    diamonds: 'D',
    clubs: 'C',
    spades: 'S',
  };
  return `${rank}${suitMap[card.suit]}`;
}

/**
 * Create and shuffle a new deck
 */
export function createAndShuffleDeck(): Card[] {
  const deck = createDeck();
  return shuffleDeck(deck);
}

