'use client';

import React, { useState, useEffect } from 'react';
import { Team } from '@/types';
import { formatTime } from '@/lib/utils';
import { getTeamSessionTime } from '@/lib/db/teams';

interface SessionClockProps {
  team: Team | null;
}

export default function SessionClock({ team }: SessionClockProps) {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (!team || !team.sessionStartTime) {
      setSessionTime(0);
      return;
    }

    // Update every second
    const interval = setInterval(() => {
      const time = getTeamSessionTime(team);
      setSessionTime(time);
    }, 1000);

    // Initial update
    setSessionTime(getTeamSessionTime(team));

    return () => clearInterval(interval);
  }, [team, team?.sessionStartTime]);

  if (!team || !team.sessionStartTime) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="card border-2 border-secondary bg-dark/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="text-secondary text-2xl animate-pulse">⏱️</div>
          <div>
            <p className="text-xs text-primary/70">Session Time</p>
            <p className="text-2xl font-bold font-mono text-secondary">
              {formatTime(sessionTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
