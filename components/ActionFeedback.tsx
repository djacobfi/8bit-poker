'use client';

import { useState, useEffect } from 'react';

interface ActionFeedbackProps {
  playerName: string;
  action: string;
  amount?: number;
}

export default function ActionFeedback({ playerName, action, amount }: ActionFeedbackProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [action]);

  if (!isVisible) return null;

  const getActionIcon = () => {
    switch (action) {
      case 'fold':
        return '❌';
      case 'check':
        return '✅';
      case 'call':
        return '📞';
      case 'bet':
      case 'raise':
        return '💰';
      case 'allIn':
        return '🔥';
      default:
        return '🎲';
    }
  };

  const getActionColor = () => {
    switch (action) {
      case 'fold':
        return 'text-red-400';
      case 'check':
        return 'text-blue-400';
      case 'call':
        return 'text-yellow-400';
      case 'bet':
      case 'raise':
        return 'text-poker-gold';
      case 'allIn':
        return 'text-orange-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-black/90 backdrop-blur-md rounded-lg p-4 shadow-2xl border border-white/20">
        <div className="flex items-center gap-3">
          <span className="text-3xl animate-bounce">{getActionIcon()}</span>
          <div>
            <span className="font-bold text-white">{playerName}</span>
            <span className="ml-2">
              <span className={getActionColor()}>
                {action === 'fold' && 'folded'}
                {action === 'check' && 'checked'}
                {action === 'call' && `called ${amount || ''}`}
                {action === 'bet' && `bet ${amount}`}
                {action === 'raise' && `raised to ${amount}`}
                {action === 'allIn' && 'went ALL-IN!'}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

