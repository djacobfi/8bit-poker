'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeMiniApp, getCurrentUser } from '@/lib/farcaster/sdk';
import { GAME_CONFIG } from '@/config/game.config';
import Lobby from '@/components/Lobby';

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        // Initialize Farcaster SDK
        const context = await initializeMiniApp();
        console.log('Mini app initialized:', context);
        
        setIsInitialized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize mini app:', err);
        setError('Failed to initialize. Please refresh and try again.');
        setIsLoading(false);
      }
    }

    init();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-lg">Loading poker app...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4">
      <Lobby />
    </main>
  );
}

