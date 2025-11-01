'use client';

import { useState } from 'react';
import { GameState, Player } from '@/types/poker.types';
import { GAME_CONFIG } from '@/config/game.config';

interface ActionButtonsProps {
  gameState: GameState;
  player: Player;
  onAction: (actionType: string, amount?: number) => void;
}

export default function ActionButtons({ gameState, player, onAction }: ActionButtonsProps) {
  const [raiseAmount, setRaiseAmount] = useState(gameState.bigBlind * 3);
  
  const toCall = gameState.currentBet - player.currentBet;
  const canCheck = toCall === 0;
  const minRaise = gameState.currentBet + gameState.minRaise;
  const maxRaise = player.chips;

  const handleRaise = () => {
    const clampedRaise = Math.max(minRaise, Math.min(raiseAmount, maxRaise));
    onAction('raise', clampedRaise);
  };

  const handleAllIn = () => {
    onAction('allIn', player.chips);
  };

  return (
    <div className="bg-white/10 backdrop-blur rounded-lg p-6">
      <div className="flex flex-col gap-4">
        {/* Bet Amount Slider for Raise */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Raise Amount: {raiseAmount.toLocaleString()} chips
          </label>
          <input
            type="range"
            min={minRaise}
            max={maxRaise}
            value={raiseAmount}
            onChange={(e) => setRaiseAmount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Min: {minRaise}</span>
            <span>Max: {maxRaise}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => onAction('fold')}
            className="btn btn-danger"
          >
            Fold
          </button>

          {canCheck ? (
            <button
              onClick={() => onAction('check')}
              className="btn btn-secondary md:col-span-2"
            >
              Check
            </button>
          ) : (
            <button
              onClick={() => onAction('call')}
              className="btn btn-secondary md:col-span-2"
            >
              Call {toCall > 0 ? `${toCall}` : ''}
            </button>
          )}

          <button
            onClick={handleRaise}
            className="btn btn-primary md:col-span-2"
            disabled={raiseAmount > player.chips || raiseAmount < minRaise}
          >
            Raise to {raiseAmount.toLocaleString()}
          </button>

          <button
            onClick={handleAllIn}
            className="btn btn-success md:col-span-5"
            disabled={player.chips === 0}
          >
            All-In ({player.chips.toLocaleString()})
          </button>
        </div>

        {/* Quick Raise Buttons */}
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setRaiseAmount(Math.floor(gameState.currentBet * 2))}
            className="btn btn-secondary text-xs px-3 py-1"
          >
            2x
          </button>
          <button
            onClick={() => setRaiseAmount(Math.floor(gameState.currentBet * 3))}
            className="btn btn-secondary text-xs px-3 py-1"
          >
            3x
          </button>
          <button
            onClick={() => setRaiseAmount(Math.floor(gameState.currentBet * 4))}
            className="btn btn-secondary text-xs px-3 py-1"
          >
            4x
          </button>
        </div>
      </div>
    </div>
  );
}

