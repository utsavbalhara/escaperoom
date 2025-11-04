'use client';

import React, { useState } from 'react';
import { Team } from '@/types';
import Button from '@/components/shared/Button';
import { useRealtimeTeamsByRoom } from '@/hooks/useRealtimeTeam';
import Loading from '@/components/shared/Loading';

interface TeamSelectorProps {
  roomNumber: number;
  onTeamSelect: (teamId: string, teamName: string) => void;
}

export default function TeamSelector({ roomNumber, onTeamSelect }: TeamSelectorProps) {
  const { teams, loading } = useRealtimeTeamsByRoom(roomNumber);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');

  const handleStart = () => {
    if (!selectedTeamId) return;
    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (selectedTeam) {
      onTeamSelect(selectedTeamId, selectedTeam.name);
    }
  };

  if (loading) {
    return <Loading message="Loading teams..." />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="card max-w-2xl w-full">
        <h2 className="text-4xl font-bold text-center mb-8 text-secondary">
          Room {roomNumber}
        </h2>

        <div className="mb-6">
          <label htmlFor="team-select" className="text-xl mb-4">
            Select Your Team:
          </label>
          <select
            id="team-select"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="w-full text-lg py-3"
          >
            <option value="">-- Choose Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {teams.length === 0 && (
          <p className="text-center text-primary/70 mb-6">
            No teams are currently eligible for this room.
          </p>
        )}

        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            disabled={!selectedTeamId}
          >
            START CHALLENGE
          </Button>
        </div>
      </div>
    </div>
  );
}
