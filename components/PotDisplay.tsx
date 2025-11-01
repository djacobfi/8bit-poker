'use client';

import { Pot } from '@/types/poker.types';

interface PotDisplayProps {
  pots: Pot[];
}

export default function PotDisplay({ pots }: PotDisplayProps) {
  const totalPot = pots.reduce((sum, pot) => sum + pot.amount, 0);
  const mainPot = pots.find(p => p.type === 'main')?.amount || 0;
  const sidePots = pots.filter(p => p.type === 'side');

  if (totalPot === 0) return null;

  return (
    <div className="bg-black/80 backdrop-blur rounded-lg p-4 text-center">
      <div className="text-poker-gold text-3xl font-bold mb-1">
        {totalPot.toLocaleString()}
      </div>
      <div className="text-sm text-gray-300">Chips in Pot</div>
      
      {sidePots.length > 0 && (
        <div className="mt-2 text-xs text-gray-400">
          Main: {mainPot} | Side: {sidePots.length} pot{sidePots.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

