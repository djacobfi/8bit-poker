'use client';

import Image from 'next/image';
import { Player } from '@/types/poker.types';
import { getCardDisplayName } from '@/lib/poker/card';

interface PlayerSeatProps {
  player: Player;
  position: number;
  isCurrentPlayer: boolean;
  showCards: boolean;
}

export default function PlayerSeat({ player, position, isCurrentPlayer, showCards }: PlayerSeatProps) {
  return (
    <div 
      className={`
        relative bg-white/10 backdrop-blur rounded-lg p-4
        transition-all duration-300
        ${isCurrentPlayer ? 'ring-2 ring-poker-gold animate-pulse-glow' : ''}
        ${player.status === 'folded' ? 'opacity-50' : ''}
      `}
    >
      {/* Player Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {player.avatarUrl && (
            <Image 
              src={player.avatarUrl} 
              alt={player.name}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span className="font-semibold">{player.name}</span>
          {!player.isHuman && <span className="text-xs text-gray-400">🤖 AI</span>}
        </div>
      </div>

      {/* Chips */}
      <div className="text-lg font-bold text-poker-gold mb-2">
        {player.chips.toLocaleString()} chips
      </div>

      {/* Current Bet */}
      {player.currentBet > 0 && (
        <div className="text-sm text-red-400 mb-2">
          Bet: {player.currentBet}
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-2 right-2">
        {player.isDealer && (
          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded">D</div>
        )}
        {player.status === 'allIn' && (
          <div className="bg-poker-red text-white text-xs px-2 py-1 rounded">ALL-IN</div>
        )}
        {player.status === 'folded' && (
          <div className="bg-gray-600 text-white text-xs px-2 py-1 rounded">FOLDED</div>
        )}
      </div>

      {/* Hole Cards */}
      <div className="flex gap-2 mt-3">
        {player.holeCards.map((card, idx) => (
          <div
            key={idx}
            className={`
              card-front ${showCards || player.status === 'folded' ? 'card-visible' : 'card-back'}
              ${showCards ? (getCardDisplayName(card)[1] === '♥' || getCardDisplayName(card)[1] === '♦' ? 'card-red' : 'card-black') : ''}
            `}
          >
            {showCards || player.status === 'folded' ? getCardDisplayName(card) : '🂠'}
          </div>
        ))}
      </div>
    </div>
  );
}

