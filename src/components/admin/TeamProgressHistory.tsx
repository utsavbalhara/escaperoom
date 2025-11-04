'use client';

import React, { useEffect, useState } from 'react';
import { getTeamProgressHistory } from '@/lib/db/progress';
import { TeamProgress } from '@/types';
import RoboticText from '@/components/shared/RoboticText';
import { formatDate, formatTime } from '@/lib/utils';
import { ROOM_NAMES } from '@/constants';
import { getRoomNames } from '@/lib/db/config';

interface TeamProgressHistoryProps {
  teamId: string;
  teamName: string;
}

export default function TeamProgressHistory({
  teamId,
  teamName,
}: TeamProgressHistoryProps) {
  const [progressHistory, setProgressHistory] = useState<TeamProgress[]>([]);
  const [customNames, setCustomNames] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const [history, names] = await Promise.all([
          getTeamProgressHistory(teamId),
          getRoomNames(),
        ]);
        // Sort by room number
        const sorted = history.sort((a, b) => a.roomNumber - b.roomNumber);
        setProgressHistory(sorted);
        setCustomNames(names);
      } catch (error) {
        console.error('Error fetching team history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [teamId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400/20 text-green-400 border-green-400/50';
      case 'failed':
        return 'bg-danger/20 text-danger border-danger/50';
      case 'in-progress':
        return 'bg-secondary/20 text-secondary border-secondary/50';
      case 'not-started':
      default:
        return 'bg-primary/10 text-primary/50 border-primary/30';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <RoboticText size="xl" className="mb-4">
          <h3 className="text-2xl font-bold">Team Progress History</h3>
        </RoboticText>
        <p className="text-center text-primary/70 py-8">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <RoboticText size="xl" className="mb-6">
        <h3 className="text-2xl font-bold">Progress History: {teamName}</h3>
      </RoboticText>

      {progressHistory.length === 0 ? (
        <p className="text-center text-primary/50 py-8">
          No progress recorded yet
        </p>
      ) : (
        <div className="space-y-4">
          {progressHistory.map((progress) => (
            <div
              key={progress.id}
              className="card bg-dark/50 border-primary/30"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-xl font-bold text-secondary">
                    {customNames[progress.roomNumber] || ROOM_NAMES[progress.roomNumber] || `Room ${progress.roomNumber}`}
                  </h4>
                  <p className="text-sm text-primary/70">
                    Room #{progress.roomNumber}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded border-2 text-sm font-bold ${getStatusBadge(
                    progress.status
                  )}`}
                >
                  {progress.status.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-primary/70">Total Attempts</p>
                  <p className="text-lg font-bold text-secondary">
                    {progress.attempts.length}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-primary/70">Remaining</p>
                  <p className="text-lg font-bold text-primary">
                    {progress.attemptsRemaining}
                  </p>
                </div>
                {progress.timeElapsed > 0 && (
                  <div>
                    <p className="text-xs text-primary/70">Time Taken</p>
                    <p className="text-lg font-bold text-secondary">
                      {formatTime(progress.timeElapsed)}
                    </p>
                  </div>
                )}
                {progress.status === 'completed' && (
                  <div>
                    <p className="text-xs text-primary/70">Result</p>
                    <p className="text-lg font-bold text-green-400">✓ PASSED</p>
                  </div>
                )}
                {progress.status === 'failed' && (
                  <div>
                    <p className="text-xs text-primary/70">Result</p>
                    <p className="text-lg font-bold text-danger">✗ FAILED</p>
                  </div>
                )}
              </div>

              {progress.attempts.length > 0 && (
                <div className="border-t-2 border-primary/20 pt-3">
                  <p className="text-xs text-primary/70 mb-2">Attempt Details:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {progress.attempts.slice(0, 5).map((attempt, index) => (
                      <div
                        key={index}
                        className={`text-xs p-2 rounded border ${
                          attempt.correct
                            ? 'border-green-400/30 bg-green-400/10'
                            : 'border-danger/30 bg-danger/10'
                        }`}
                      >
                        <span className="font-mono">
                          #{index + 1}: {attempt.code}
                        </span>
                        <span className="ml-2">
                          {attempt.correct ? '✓' : '✗'}
                        </span>
                      </div>
                    ))}
                  </div>
                  {progress.attempts.length > 5 && (
                    <p className="text-xs text-primary/50 mt-1">
                      +{progress.attempts.length - 5} more attempts
                    </p>
                  )}
                </div>
              )}

              {(progress.startTime || progress.endTime) && (
                <div className="border-t-2 border-primary/20 pt-3 mt-3">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {progress.startTime && (
                      <div>
                        <p className="text-primary/70">Started At:</p>
                        <p className="font-mono text-primary/90">
                          {formatDate(progress.startTime)}
                        </p>
                      </div>
                    )}
                    {progress.endTime && (
                      <div>
                        <p className="text-primary/70">Ended At:</p>
                        <p className="font-mono text-primary/90">
                          {formatDate(progress.endTime)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
