'use client';

import React, { useEffect } from 'react';
import { useRealtimeLeaderboard } from '@/hooks/useRealtimeLeaderboard';
import { useRealtimeAllTeams } from '@/hooks/useRealtimeTeam';
import { calculateAndUpdateLeaderboard } from '@/lib/db/leaderboard';
import RoboticText from '@/components/shared/RoboticText';

export default function Leaderboard() {
  const { leaderboard, loading } = useRealtimeLeaderboard();
  const { teams } = useRealtimeAllTeams();

  // Auto-refresh leaderboard every 5 seconds to sync with actual player stats
  useEffect(() => {
    const refreshLeaderboard = async () => {
      for (const team of teams) {
        await calculateAndUpdateLeaderboard(team.id, team.name);
      }
    };

    // Initial refresh
    refreshLeaderboard();

    // Set interval for every 5 seconds
    const interval = setInterval(refreshLeaderboard, 5000);

    return () => clearInterval(interval);
  }, [teams]);

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
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl font-bold w-8">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{entry.teamName}</p>
                    <p className="text-xs text-primary/50">
                      {entry.totalAttempts} attempts
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-secondary/20 border-2 border-secondary rounded px-4 py-2">
                    <p className="text-xs text-primary/70">LEVEL</p>
                    <p className="text-3xl font-bold text-secondary font-mono">
                      {entry.currentLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
