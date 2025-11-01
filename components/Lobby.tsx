'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/farcaster/sdk';
import { CHIP_PACKAGES, MonetizationCalculator, REWARD_SYSTEM } from '@/config/monetization.config';
import { getUSDCBalance } from '@/lib/farcaster/wallet';
import { GAME_CONFIG } from '@/config/game.config';
import PokerTable from './PokerTable';

export default function Lobby() {
  const [user, setUser] = useState<any>(null);
  const [chips, setChips] = useState<number>(GAME_CONFIG.players.initialChips);
  const [usdcBalance, setUsdcBalance] = useState<string>('0.00');
  const [view, setView] = useState<'lobby' | 'game' | 'shop' | 'stats'>('lobby');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // Load wallet balance
        const balance = await getUSDCBalance();
        setUsdcBalance(parseFloat(balance).toFixed(2));
        
        // TODO: Load chips from backend/contract
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load user data:', error);
        setIsLoading(false);
      }
    }

    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (view === 'game') {
    return <PokerTable onReturnToLobby={() => setView('lobby')} />;
  }

  if (view === 'shop') {
    return <ChipShop onClose={() => setView('lobby')} onChipsPurchased={setChips} />;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-2">🎮 8 Bit Poker</h1>
        <p className="text-gray-300">Texas Hold&apos;em on Farcaster</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-poker-gold">{chips.toLocaleString()}</div>
          <div className="text-sm text-gray-300">Chips</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">${usdcBalance}</div>
          <div className="text-sm text-gray-300">USDC Balance</div>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{user?.username || 'Guest'}</div>
          <div className="text-sm text-gray-300">Player</div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Today&apos;s Bonus</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Daily Login</span>
            <span className="text-poker-gold font-bold">
              +{REWARD_SYSTEM.dailyBonus.amount} chips
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Win Streak (3+ wins)</span>
            <span className="text-poker-gold font-bold">
              +{REWARD_SYSTEM.streak.rewards[0].chips} chips
            </span>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="space-y-4">
        <button
          onClick={() => setView('game')}
          className="w-full btn btn-primary text-xl py-6"
        >
          🎮 Start Playing
        </button>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setView('shop')}
            className="btn btn-secondary py-4"
          >
            💰 Buy Chips
          </button>
          <button
            onClick={() => setView('stats')}
            className="btn btn-secondary py-4"
          >
            📊 Statistics
          </button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-8 bg-black/20 backdrop-blur rounded-lg p-4 text-sm text-gray-300">
        <p className="mb-2">
          💡 <strong>Entry fee:</strong> {GAME_CONFIG.players.minPerTable}-{GAME_CONFIG.players.maxPerTable} players, ${GAME_CONFIG.blinds.bigBlind * 0.01} per hand
        </p>
        <p>
          🎁 <strong>First time bonus:</strong> New players start with {GAME_CONFIG.players.initialChips.toLocaleString()} chips!
        </p>
      </div>
    </div>
  );
}

function ChipShop({ onClose, onChipsPurchased }: { onClose: () => void; onChipsPurchased: (chips: number) => void }) {
  const [processing, setProcessing] = useState(false);

  const handlePurchase = async (packageId: string) => {
    setProcessing(true);
    try {
      const chipPackage = MonetizationCalculator.getChipPackage(packageId);
      if (!chipPackage) {
        alert('Invalid package selected');
        return;
      }

      // TODO: Implement actual purchase flow with wallet
      alert(`Purchase functionality coming soon!\n\n${chipPackage.name}: ${chipPackage.chips} chips for $${chipPackage.usdPrice}`);
      
      setProcessing(false);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">💰 Chip Store</h2>
        <button onClick={onClose} className="btn btn-secondary">
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHIP_PACKAGES.map((pkg) => {
          const totalChips = MonetizationCalculator.getTotalChips(pkg);
          
          return (
            <div
              key={pkg.id}
              className={`bg-white/10 backdrop-blur rounded-lg p-6 cursor-pointer transition-all hover:scale-105 ${
                pkg.popular ? 'ring-2 ring-poker-gold' : ''
              }`}
              onClick={() => handlePurchase(pkg.id)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-poker-gold text-poker-green text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
              )}
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-poker-gold">{totalChips.toLocaleString()}</div>
                <div className="text-sm text-gray-300">chips</div>
              </div>

              <div className="text-center mb-4">
                <div className="text-2xl font-bold">${pkg.usdPrice}</div>
                {pkg.bonusChips > 0 && (
                  <div className="text-green-400 text-sm mt-1">
                    +{pkg.bonusChips} bonus!
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-300 mb-4">
                {pkg.description}
              </div>

              <button
                disabled={processing}
                className="w-full btn btn-primary mt-2"
              >
                {processing ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

