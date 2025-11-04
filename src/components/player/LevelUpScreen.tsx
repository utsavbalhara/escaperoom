'use client';

import React, { useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';

interface LevelUpScreenProps {
  message: string;
  roomNumber: number;
  onContinue: () => void;
}

export default function LevelUpScreen({ message, roomNumber, onContinue }: LevelUpScreenProps) {
  const { speak } = useTTS();

  useEffect(() => {
    speak(message, true);
  }, [message, speak]);

  return (
    <div className="fixed inset-0 bg-dark/95 flex items-center justify-center z-50 animate-fadeIn">
      <div className="max-w-3xl w-full p-8">
        <div className="card border-4 border-primary shadow-[0_0_50px_rgba(0,255,65,0.8)]">
          <div className="text-center">
            {/* Success Animation */}
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <RoboticText size="2xl" glow className="mb-4">
                <h2 className="text-6xl font-bold">LEVEL COMPLETE!</h2>
              </RoboticText>
              <p className="text-3xl text-secondary font-bold">
                Room {roomNumber} Cleared
              </p>
            </div>

            {/* Message */}
            <div className="card bg-primary/10 border-primary mb-8">
              <RoboticText size="lg" className="leading-relaxed">
                {message}
              </RoboticText>
            </div>

            {/* Continue Button */}
            <Button
              variant="success"
              size="lg"
              onClick={onContinue}
              className="text-2xl px-12 py-4"
            >
              CONTINUE TO NEXT ROOM →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
