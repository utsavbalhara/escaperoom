'use client';

import React from 'react';
import { Timestamp } from 'firebase/firestore';
import { useTimer } from '@/hooks/useTimer';
import { formatTime } from '@/lib/utils';
import RoboticText from '@/components/shared/RoboticText';

interface TimerProps {
  timerStarted: Timestamp | null;
  timerDuration: number;
  timerPaused: boolean;
  onTimeout?: () => void;
}

export default function Timer({
  timerStarted,
  timerDuration,
  timerPaused,
  onTimeout,
}: TimerProps) {
  const { timeRemaining, isRunning, percentage } = useTimer({
    timerStarted,
    timerDuration,
    timerPaused,
    onTimeout,
  });

  const isLowTime = timeRemaining <= 30 && timeRemaining > 0;
  const isCritical = timeRemaining <= 10 && timeRemaining > 0;

  return (
    <div className="mb-8">
      <div className="card bg-dark">
        <div className="text-center">
          <p className="text-sm text-primary/70 mb-2">TIME REMAINING</p>
          <RoboticText
            size="2xl"
            glow={isRunning}
            className={`text-6xl font-bold ${
              isCritical ? 'text-danger flash-alert' : isLowTime ? 'text-yellow-400' : ''
            }`}
          >
            {formatTime(timeRemaining)}
          </RoboticText>

          {/* Progress Bar */}
          <div className="mt-4 h-4 bg-dark border-2 border-primary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${
                isCritical
                  ? 'bg-danger'
                  : isLowTime
                  ? 'bg-yellow-400'
                  : 'bg-primary'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {timerPaused && (
            <p className="mt-4 text-yellow-400 font-bold animate-pulse">
              ⏸ PAUSED
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
