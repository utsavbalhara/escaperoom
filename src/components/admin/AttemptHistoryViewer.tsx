'use client';

import React, { useEffect, useState } from 'react';
import { getProgress } from '@/lib/db/progress';
import { TeamProgress, AttemptRecord } from '@/types';
import RoboticText from '@/components/shared/RoboticText';
import { formatDate } from '@/lib/utils';

interface AttemptHistoryViewerProps {
  teamId: string | null;
  teamName: string;
  roomNumber: number;
}

export default function AttemptHistoryViewer({
  teamId,
  teamName,
  roomNumber,
}: AttemptHistoryViewerProps) {
  const [progress, setProgress] = useState<TeamProgress | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!teamId) {
      setProgress(null);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);
      try {
        const data = await getProgress(teamId, roomNumber);
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [teamId, roomNumber]);

  if (!teamId) {
    return (
      <div className="card bg-dark/50">
        <RoboticText size="lg" className="mb-4">
          <h4 className="text-xl font-bold">Attempt History</h4>
        </RoboticText>
        <p className="text-center text-primary/50 py-4">
          No team selected
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card bg-dark/50">
        <RoboticText size="lg" className="mb-4">
          <h4 className="text-xl font-bold">Attempt History</h4>
        </RoboticText>
        <p className="text-center text-primary/70">Loading...</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="card bg-dark/50">
        <RoboticText size="lg" className="mb-4">
          <h4 className="text-xl font-bold">Attempt History</h4>
        </RoboticText>
        <p className="text-center text-primary/50 py-4">
          No progress recorded yet
        </p>
      </div>
    );
  }

  return (
    <div className="card bg-dark/50">
      <RoboticText size="lg" className="mb-4">
        <h4 className="text-xl font-bold">Attempt History - {teamName}</h4>
      </RoboticText>

      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-primary/70">Status:</p>
          <p className={`font-bold text-lg ${
            progress.status === 'completed' ? 'text-green-400' :
            progress.status === 'failed' ? 'text-danger' :
            progress.status === 'in-progress' ? 'text-secondary' :
            'text-primary/50'
          }`}>
            {progress.status.toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-primary/70">Attempts Remaining:</p>
          <p className="font-bold text-lg text-secondary">
            {progress.attemptsRemaining}
          </p>
        </div>
      </div>

      {progress.attempts.length === 0 ? (
        <p className="text-center text-primary/50 py-4">
          No attempts made yet
        </p>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {progress.attempts.map((attempt: AttemptRecord, index: number) => (
            <div
              key={index}
              className={`p-3 border-2 rounded ${
                attempt.correct
                  ? 'border-green-400/50 bg-green-400/10'
                  : 'border-danger/50 bg-danger/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-primary/70">
                    Attempt #{index + 1}
                  </p>
                  <p className="font-bold text-lg font-mono">
                    Code: {attempt.code}
                  </p>
                  <p className="text-xs text-primary/50 mt-1">
                    {formatDate(attempt.timestamp)}
                  </p>
                </div>
                <div>
                  {attempt.correct ? (
                    <span className="text-green-400 text-2xl">✓</span>
                  ) : (
                    <span className="text-danger text-2xl">✗</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {progress.startTime && (
        <div className="mt-4 pt-4 border-t-2 border-primary/20 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-primary/70">Started:</p>
              <p className="font-mono text-xs">
                {formatDate(progress.startTime)}
              </p>
            </div>
            {progress.endTime && (
              <div>
                <p className="text-primary/70">Ended:</p>
                <p className="font-mono text-xs">
                  {formatDate(progress.endTime)}
                </p>
              </div>
            )}
          </div>
          {progress.timeElapsed > 0 && (
            <div className="mt-2">
              <p className="text-primary/70">Time Elapsed:</p>
              <p className="font-bold text-secondary">
                {Math.floor(progress.timeElapsed / 60)}m {progress.timeElapsed % 60}s
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
