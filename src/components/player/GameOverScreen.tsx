'use client';

import React, { useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import Link from 'next/link';

interface GameOverScreenProps {
  message: string;
  reason: 'timeout' | 'attempts';
}

export default function GameOverScreen({ message, reason }: GameOverScreenProps) {
  const { speak } = useTTS();

  useEffect(() => {
    speak(message, true);
  }, [message, speak]);

  return (
    <div className="fixed inset-0 bg-dark/95 flex items-center justify-center z-50 animate-fadeIn">
      <div className="max-w-3xl w-full p-8">
        <div className="card border-4 border-danger shadow-[0_0_50px_rgba(255,0,64,0.8)]">
          <div className="text-center">
            {/* Game Over Animation */}
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-pulse">💀</div>
              <RoboticText size="2xl" className="mb-4 text-danger">
                <h2 className="text-6xl font-bold flash-alert">GAME OVER</h2>
              </RoboticText>
              <p className="text-2xl text-danger/80 font-bold">
                {reason === 'timeout' ? '⏰ Time Expired' : '❌ No Attempts Remaining'}
              </p>
            </div>

            {/* Message */}
            <div className="card bg-danger/10 border-danger mb-8">
              <RoboticText size="lg" className="leading-relaxed text-danger">
                {message}
              </RoboticText>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="danger" size="lg" className="text-xl px-8">
                  ← Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
