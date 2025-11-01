'use client';

import { useState, useEffect } from 'react';
import { GameState } from '@/types/poker.types';
import { GAME_CONFIG } from '@/config/game.config';

interface GameStatusDisplayProps {
  gameState: GameState;
  currentAction?: string;
}

export default function GameStatusDisplay({ gameState, currentAction }: GameStatusDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.timers.turnDurationMs / 1000);
  const activePlayers = gameState.players.filter(p => p.status === 'active').length;
  const totalPot = gameState.pots.reduce((sum, pot) => sum + pot.amount, 0);
  const roundName = GAME_CONFIG.bettingRounds[gameState.bettingRound].name;
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  // Reset timer when current player changes
  useEffect(() => {
    setTimeLeft(GAME_CONFIG.timers.turnDurationMs / 1000);
    
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.currentPlayerIndex, gameState.bettingRound]);

  // Get recent actions from all players
  const recentActions = gameState.players
    .flatMap(p => p.actionHistory.map(a => ({ ...a, playerName: p.name })))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  // Get game phase status message
  const getPhaseMessage = () => {
    switch (gameState.bettingRound) {
      case 'preFlop':
        return {
          title: 'Pre-Flop Round',
          description: 'Hole cards dealt. Make your first decision.',
          icon: '🃏',
        };
      case 'flop':
        return {
          title: 'The Flop',
          description: '3 community cards revealed. Build your hand.',
          icon: '🃑🃒🃓',
        };
      case 'turn':
        return {
          title: 'The Turn',
          description: '4th community card revealed.',
          icon: '🃔',
        };
      case 'river':
        return {
          title: 'The River',
          description: 'Final community card. Last chance to bet!',
          icon: '🃕',
        };
      case 'showdown':
        return {
          title: 'Showdown',
          description: 'Revealing hands...',
          icon: '👑',
        };
      default:
        return {
          title: 'Playing',
          description: '',
          icon: '🎰',
        };
    }
  };

  const phase = getPhaseMessage();

  return (
    <div className="bg-black/40 backdrop-blur-lg rounded-lg p-6 mb-6 border border-white/20">
      {/* Current Phase Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{phase.icon}</div>
          <div>
            <h2 className="text-2xl font-bold">{phase.title}</h2>
            <p className="text-sm text-gray-300">{phase.description}</p>
          </div>
        </div>
        
        {/* Game Stats */}
        <div className="text-right">
          <div className="text-3xl font-bold text-poker-gold">{totalPot.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Pot</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
        <div className="flex-1">
          {currentAction ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold">{currentAction}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-lg">Waiting for {currentPlayer.name} to act...</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div>
            <span className="text-gray-400">Active Players:</span>
            <span className="font-bold ml-2">{activePlayers}</span>
          </div>
          <div>
            <span className="text-gray-400">Current Bet:</span>
            <span className="font-bold ml-2 text-poker-gold">{gameState.currentBet}</span>
          </div>
          <div>
            <span className="text-gray-400">Blinds:</span>
            <span className="font-bold ml-2">{gameState.smallBlind}/{gameState.bigBlind}</span>
          </div>
        </div>
      </div>

      {/* Recent Actions */}
      {recentActions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h3 className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Recent Actions</h3>
          <div className="flex gap-3 flex-wrap">
            {recentActions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs bg-white/5 px-3 py-1 rounded">
                <span className="font-semibold text-poker-gold">{action.playerName}</span>
                <span className="text-gray-300">
                  {action.type === 'fold' && 'folded'}
                  {action.type === 'check' && 'checked'}
                  {action.type === 'call' && `called ${action.amount || ''}`}
                  {action.type === 'bet' && `bet ${action.amount}`}
                  {action.type === 'raise' && `raised to ${action.amount}`}
                  {action.type === 'allIn' && 'went ALL-IN'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Turn Timer Progress */}
      {gameState.currentPlayerIndex !== undefined && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Turn Time Limit</span>
            <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-gray-300'}`}>
              {timeLeft}s remaining
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 relative overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${
                timeLeft <= 5 ? 'bg-red-500' : 'bg-poker-gold'
              }`}
              style={{ width: `${(timeLeft / (GAME_CONFIG.timers.turnDurationMs / 1000)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

