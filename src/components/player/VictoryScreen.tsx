'use client';

import React, { useEffect } from 'react';
import { useTTS } from '@/hooks/useTTS';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import Link from 'next/link';

interface VictoryScreenProps {
  teamName: string;
  totalTime: number;
  totalAttempts: number;
}

export default function VictoryScreen({ teamName, totalTime, totalAttempts }: VictoryScreenProps) {
  const { speak } = useTTS();

  useEffect(() => {
    speak(`Congratulations ${teamName}! You have successfully completed all challenges and escaped! You are the champions!`, true);
  }, [teamName, speak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="fixed inset-0 bg-dark/95 flex items-center justify-center z-50 animate-fadeIn">
      <div className="max-w-4xl w-full p-8">
        <div className="card border-4 border-yellow-400 shadow-[0_0_100px_rgba(255,215,0,0.8)]">
          <div className="text-center">
            {/* Victory Animation */}
            <div className="mb-8">
              <div className="text-9xl mb-4 animate-bounce">🏆</div>
              <RoboticText size="2xl" glow className="mb-4 text-yellow-400">
                <h2 className="text-7xl font-bold">VICTORY!</h2>
              </RoboticText>
              <p className="text-4xl text-secondary font-bold mb-4">
                {teamName}
              </p>
              <p className="text-2xl text-primary">
                You have escaped all rooms!
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="card bg-primary/10 border-primary">
                <p className="text-sm text-primary/70 mb-2">Total Time</p>
                <p className="text-4xl font-bold text-primary">{formatTime(totalTime)}</p>
              </div>
              <div className="card bg-secondary/10 border-secondary">
                <p className="text-sm text-secondary/70 mb-2">Total Attempts</p>
                <p className="text-4xl font-bold text-secondary">{totalAttempts}</p>
              </div>
            </div>

            {/* Congratulations Message */}
            <div className="card bg-yellow-400/10 border-yellow-400 mb-8">
              <RoboticText size="xl" className="leading-relaxed text-yellow-400">
                CONGRATULATIONS! You have proven yourselves as true escape artists!
                Your teamwork, problem-solving skills, and determination have led you to victory!
              </RoboticText>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Link href="/">
                <Button variant="success" size="lg" className="text-2xl px-12">
                  🏠 Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
