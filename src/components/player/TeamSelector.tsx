'use client';

import React, { useState } from 'react';
import { Team } from '@/types';
import Button from '@/components/shared/Button';
import TeamPasswordVerify from './TeamPasswordVerify';
import { useRealtimeTeamsByRoom } from '@/hooks/useRealtimeTeam';
import { validateTeamPassword, startTeamSession } from '@/lib/db/teams';
import { saveTeamSession } from '@/lib/auth-storage';
import Loading from '@/components/shared/Loading';

interface TeamSelectorProps {
  roomNumber: number;
  onTeamSelect: (teamId: string, teamName: string) => void;
}

export default function TeamSelector({ roomNumber, onTeamSelect }: TeamSelectorProps) {
  const { teams, loading } = useRealtimeTeamsByRoom(roomNumber);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);

  const handleStart = () => {
    if (!selectedTeamId) return;
    // Show password verification
    setShowPasswordVerify(true);
  };

  const handlePasswordVerify = async (password: string): Promise<boolean> => {
    if (!selectedTeamId) return false;

    const isValid = await validateTeamPassword(selectedTeamId, password);

    if (isValid) {
      // Start the team's session timer
      await startTeamSession(selectedTeamId);

      const selectedTeam = teams.find(t => t.id === selectedTeamId);
      if (selectedTeam) {
        // Save authenticated session to localStorage for persistence across refreshes
        saveTeamSession(selectedTeamId, selectedTeam.name);

        onTeamSelect(selectedTeamId, selectedTeam.name);
      }
      return true;
    }

    return false;
  };

  const handlePasswordCancel = () => {
    setShowPasswordVerify(false);
  };

  if (loading) {
    return <Loading message="Loading teams..." />;
  }

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  return (
    <>
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

          <p className="text-xs text-primary/50 text-center mt-4">
            🔒 You will need your team password to continue
          </p>
        </div>
      </div>

      {/* Password Verification Modal */}
      {showPasswordVerify && selectedTeam && (
        <TeamPasswordVerify
          teamName={selectedTeam.name}
          onVerify={handlePasswordVerify}
          onCancel={handlePasswordCancel}
        />
      )}
    </>
  );
}
