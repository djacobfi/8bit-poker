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
import GameStatusDisplay from './GameStatusDisplay';
import ActionFeedback from './ActionFeedback';

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
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    return (
      <div className="max-w-6xl mx-auto p-4">
        {/* Game Status Display */}
        <GameStatusDisplay gameState={gameState} />

        {/* Table Layout */}
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          {/* Community Cards Area - Top of table */}
          <div className="flex justify-center mb-6">
            <CommunityCards cards={gameState.communityCards} />
          </div>

          {/* Pot Display - Below community cards */}
          <div className="flex justify-center mb-6">
            <PotDisplay pots={gameState.pots} />
          </div>

          {/* Player Seats - Below pot */}
          <div className="grid grid-cols-4 gap-4">
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


