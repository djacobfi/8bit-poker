'use client';

import { Card } from '@/types/poker.types';
import { getCardDisplayName } from '@/lib/poker/card';

interface CommunityCardsProps {
  cards: Card[];
}

export default function CommunityCards({ cards }: CommunityCardsProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <p className="text-lg">Waiting for community cards...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-2 justify-center">
      {cards.map((card, index) => {
        const displayName = getCardDisplayName(card);
        const isRed = displayName[1] === '♥' || displayName[1] === '♦';
        
        return (
          <div
            key={index}
            className={`
              card-front ${isRed ? 'card-red' : 'card-black'}
              animate-flip-card
            `}
          >
            {displayName}
          </div>
        );
      })}
      
      {/* Placeholder for remaining cards */}
      {Array.from({ length: 5 - cards.length }).map((_, index) => (
        <div key={`placeholder-${index}`} className="card-back">
          🂠
        </div>
      ))}
    </div>
  );
}

