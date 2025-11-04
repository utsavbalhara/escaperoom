'use client';

import React, { useState } from 'react';
import { Team } from '@/types';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import { updateTeam } from '@/lib/db/teams';
import { TOTAL_ROOMS } from '@/constants';

interface AdvancedTeamControlsProps {
  team: Team;
  onUpdate: () => void;
}

export default function AdvancedTeamControls({ team, onUpdate }: AdvancedTeamControlsProps) {
  const [newRoom, setNewRoom] = useState(team.currentRoom);
  const [updating, setUpdating] = useState(false);

  const handleSetRoom = async () => {
    if (!confirm(`Move ${team.name} to Room ${newRoom}?`)) return;

    setUpdating(true);
    try {
      await updateTeam(team.id, { currentRoom: newRoom });
      alert(`Team moved to Room ${newRoom}`);
      onUpdate();
    } catch (error) {
      console.error('Error updating team room:', error);
      alert('Error updating team room');
    } finally {
      setUpdating(false);
    }
  };

  const handleResetProgress = async () => {
    if (!confirm(`Reset ${team.name} to Room 1? This will clear their progress.`)) return;

    setUpdating(true);
    try {
      await updateTeam(team.id, {
        currentRoom: 1,
        status: 'waiting',
        totalTime: 0,
        sessionStartTime: null,
      });
      alert('Team progress reset');
      onUpdate();
    } catch (error) {
      console.error('Error resetting team:', error);
      alert('Error resetting team');
    } finally {
      setUpdating(false);
    }
  };

  const handleResetSessionTime = async () => {
    if (!confirm(`Reset session timer for ${team.name}?`)) return;

    setUpdating(true);
    try {
      await updateTeam(team.id, { sessionStartTime: null });
      alert('Session timer reset');
      onUpdate();
    } catch (error) {
      console.error('Error resetting session time:', error);
      alert('Error resetting session time');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="card bg-dark/50 border-secondary/50">
      <RoboticText size="lg" className="mb-4">
        <h4 className="text-xl font-bold">Advanced Controls</h4>
      </RoboticText>

      {/* Manual Room Assignment */}
      <div className="mb-4">
        <label className="text-sm text-primary/70 block mb-2">
          Manually Set Team Room:
        </label>
        <div className="flex gap-2">
          <select
            value={newRoom}
            onChange={(e) => setNewRoom(parseInt(e.target.value))}
            className="flex-1"
            disabled={updating}
          >
            {Array.from({ length: TOTAL_ROOMS }, (_, i) => i + 1).map((room) => (
              <option key={room} value={room}>
                Room {room}
              </option>
            ))}
          </select>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSetRoom}
            disabled={newRoom === team.currentRoom || updating}
          >
            {updating ? 'Updating...' : 'Set Room'}
          </Button>
        </div>
      </div>

      {/* Reset Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="danger"
          size="sm"
          onClick={handleResetProgress}
          disabled={updating}
        >
          Reset Progress
        </Button>
        <Button
          variant="danger"
          size="sm"
          onClick={handleResetSessionTime}
          disabled={updating}
        >
          Reset Timer
        </Button>
      </div>

      <p className="text-xs text-primary/50 mt-3">
        ⚠️ Use these controls carefully. They directly modify team state.
      </p>
    </div>
  );
}
