'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { initializeMiniApp } from '@/lib/farcaster/sdk';

function ShareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initializeMiniApp();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize mini app:', error);
      }
    }
    init();
  }, []);

  // Get cast information from URL parameters
  const castHash = searchParams.get('castHash');
  const castFid = searchParams.get('castFid');
  const viewerFid = searchParams.get('viewerFid');

  useEffect(() => {
    if (isInitialized && !castHash) {
      // No cast shared, redirect to lobby
      router.push('/');
    }
  }, [isInitialized, castHash, router]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!castHash) {
    return null; // Redirecting
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🎮 Share 8 Bit Poker</h1>
        <p className="text-gray-300">Cast shared successfully!</p>
      </div>

      {/* Cast Information */}
      <div className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Shared Cast Details</h2>
        <div className="space-y-3 text-left">
          <div>
            <span className="text-gray-400">Cast Hash:</span>
            <span className="ml-2 font-mono text-sm">{castHash}</span>
          </div>
          <div>
            <span className="text-gray-400">Author FID:</span>
            <span className="ml-2">{castFid || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-gray-400">Viewer FID:</span>
            <span className="ml-2">{viewerFid || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <button
          onClick={() => router.push('/')}
          className="w-full btn btn-primary text-xl py-6"
        >
          🎮 Start Playing Poker
        </button>

        <div className="bg-black/20 backdrop-blur rounded-lg p-4 text-sm text-gray-300">
          <p className="mb-2">
            💡 <strong>Share Extension Active!</strong>
          </p>
          <p>
            Users can now share casts to your poker app from anywhere in Farcaster!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    }>
      <ShareContent />
    </Suspense>
  );
}
