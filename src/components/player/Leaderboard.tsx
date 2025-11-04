'use client';

import React from 'react';
import { useRealtimeLeaderboard } from '@/hooks/useRealtimeLeaderboard';
import { formatTime } from '@/lib/utils';
import RoboticText from '@/components/shared/RoboticText';

export default function Leaderboard() {
  const { leaderboard, loading } = useRealtimeLeaderboard();

  if (loading) {
    return (
      <div className="card">
        <RoboticText size="lg" className="text-center">Loading leaderboard...</RoboticText>
      </div>
    );
  }

  return (
    <div className="card h-full overflow-y-auto max-h-[600px]">
      <h3 className="text-2xl font-bold text-secondary mb-4 sticky top-0 bg-dark pb-2">
        🏆 LEADERBOARD
      </h3>

      {leaderboard.length === 0 ? (
        <p className="text-center text-primary/50">No teams yet</p>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.teamId}
              className={`p-3 rounded border-2 ${
                index === 0
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : index === 1
                  ? 'border-gray-400 bg-gray-400/10'
                  : index === 2
                  ? 'border-orange-600 bg-orange-600/10'
                  : 'border-primary/30 bg-primary/5'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold w-8">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <div>
                    <p className="font-bold text-lg">{entry.teamName}</p>
                    <p className="text-sm text-primary/70">
                      Rooms: {entry.roomsCompleted} • Attempts: {entry.totalAttempts}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-secondary">
                    {formatTime(entry.totalTime)}
                  </p>
                  <p className="text-xs text-primary/50">Total Time</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
