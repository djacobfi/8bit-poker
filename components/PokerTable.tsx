'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/farcaster/sdk';
import { useGameStore } from '@/lib/store/game-store';
import { GAME_CONFIG } from '@/config/game.config';
import { Player } from '@/types/poker.types';
import PlayerSeat from './PlayerSeat';
import CommunityCards from './CommunityCards';
import ActionButtons from './ActionButtons';
import PotDisplay from './PotDisplay';

interface PokerTableProps {
  onReturnToLobby: () => void;
}

export default function PokerTable({ onReturnToLobby }: PokerTableProps) {
  const [user, setUser] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { 
    session, 
    isMatchmaking, 
    isGameActive, 
    startMatchmaking,
    processPlayerAction 
  } = useGameStore();

  useEffect(() => {
    async function initializeGame() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Create human player
        const humanPlayer: Player = {
          id: `human_${currentUser.fid || 'dev_user'}`,
          name: currentUser.username || currentUser.displayName || 'Player',
          avatarUrl: currentUser.pfpUrl || '',
          chips: GAME_CONFIG.players.initialChips,
          currentBet: 0,
          holeCards: [],
          status: 'active',
          isDealer: false,
          isHuman: true,
          actionHistory: [],
        };

        // Start matchmaking
        startMatchmaking(humanPlayer);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    }

    initializeGame();
  }, [startMatchmaking]);

  const handleAction = (actionType: string, amount?: number) => {
    if (!session?.gameState.players.find(p => p.isHuman)) return;
    
    const humanPlayer = session.gameState.players.find(p => p.isHuman);
    if (!humanPlayer) return;

    processPlayerAction(
      humanPlayer.id,
      actionType as any,
      amount
    );
  };

  // Matchmaking screen
  if (isMatchmaking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Finding opponents...</h2>
          <p className="text-gray-300">
            Waiting for players to join ({session?.players.length || 0}/{GAME_CONFIG.players.maxPerTable})
          </p>
        </div>
      </div>
    );
  }

  // Game screen
  if (isGameActive && session) {
    const gameState = session.gameState;
    const humanPlayer = gameState.players.find(p => p.isHuman);

    return (
      <div className="max-w-6xl mx-auto">
        {/* Table Layout */}
        <div className="relative">
          <PotDisplay pots={gameState.pots} />
          
          {/* Community Cards Area */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <CommunityCards cards={gameState.communityCards} />
          </div>

          {/* Player Seats */}
          <div className="grid grid-cols-4 gap-4 min-h-[500px] p-8">
            {gameState.players.map((player, index) => (
              <PlayerSeat
                key={player.id}
                player={player}
                position={index}
                isCurrentPlayer={index === gameState.currentPlayerIndex}
                showCards={player.isHuman}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons (Human Player Only) */}
        {humanPlayer && gameState.currentPlayerIndex === gameState.players.indexOf(humanPlayer) && (
          <div className="mt-8">
            <ActionButtons
              gameState={gameState}
              player={humanPlayer}
              onAction={handleAction}
            />
          </div>
        )}

        {/* Betting Info */}
        <div className="mt-4 text-center text-gray-300">
          <p>
            Current Bet: <span className="text-poker-gold font-bold">{gameState.currentBet}</span> chips
          </p>
          <p className="text-sm">
            Round: <span className="font-semibold">{GAME_CONFIG.bettingRounds[gameState.bettingRound].name}</span>
          </p>
        </div>

        {/* Return Button */}
        <div className="mt-8 text-center">
          <button onClick={onReturnToLobby} className="btn btn-secondary">
            ← Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner"></div>
    </div>
  );
}

