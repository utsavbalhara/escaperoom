'use client';

import React from 'react';
import { useRealtimeRoom } from '@/hooks/useRealtimeRoom';
import { useRealtimeActiveRoom } from '@/hooks/useRealtimeActiveRoom';
import { useRealtimeTeam } from '@/hooks/useRealtimeTeam';
import { useRealtimeTeamsByRoom } from '@/hooks/useRealtimeTeam';
import ContentEditor from './ContentEditor';
import TimerControls from './TimerControls';
import AttemptHistoryViewer from './AttemptHistoryViewer';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import { setActiveTeam, clearActiveRoom } from '@/lib/db/activeRooms';
import { updateTeamStatus } from '@/lib/db/teams';
import Loading from '@/components/shared/Loading';

interface RoomControllerProps {
  roomNumber: number;
  onBack: () => void;
}

export default function RoomController({ roomNumber, onBack }: RoomControllerProps) {
  const { room, loading: roomLoading } = useRealtimeRoom(roomNumber);
  const { activeRoom } = useRealtimeActiveRoom(roomNumber);
  const { teams: eligibleTeams } = useRealtimeTeamsByRoom(roomNumber);
  const { team: currentTeam } = useRealtimeTeam(activeRoom?.currentTeamId || null);

  const handleSelectTeam = async (teamId: string) => {
    if (confirm('Start this team in this room?')) {
      try {
        await setActiveTeam(roomNumber, teamId);
        await updateTeamStatus(teamId, 'active');
      } catch (error) {
        console.error('Error selecting team:', error);
        alert('Error selecting team');
      }
    }
  };

  const handleClearRoom = async () => {
    if (confirm('Are you sure you want to clear this room?')) {
      try {
        if (activeRoom?.currentTeamId) {
          await updateTeamStatus(activeRoom.currentTeamId, 'waiting');
        }
        await clearActiveRoom(roomNumber);
      } catch (error) {
        console.error('Error clearing room:', error);
        alert('Error clearing room');
      }
    }
  };

  if (roomLoading || !room) {
    return <Loading message="Loading room..." />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <RoboticText size="2xl" glow className="mb-2">
            <h2 className="text-4xl font-bold">Room {roomNumber} Control</h2>
          </RoboticText>
          <Button variant="secondary" size="sm" onClick={onBack}>
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Team Selection */}
        <div className="card">
          <h3 className="text-2xl font-bold text-secondary mb-4">Team Selection</h3>

          {currentTeam ? (
            <div className="mb-4">
              <p className="text-sm text-primary/70">Current Team:</p>
              <p className="text-2xl font-bold text-secondary mb-4">
                {currentTeam.name}
              </p>
              <Button
                variant="danger"
                size="md"
                onClick={handleClearRoom}
                className="w-full"
              >
                Clear Room
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-primary/70 mb-3">
                Eligible Teams ({eligibleTeams.length}):
              </p>

              {eligibleTeams.length === 0 ? (
                <p className="text-center text-primary/50 py-8">
                  No eligible teams for this room
                </p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {eligibleTeams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between p-3 border-2 border-primary/30 rounded hover:border-primary transition-all"
                    >
                      <span className="font-bold">{team.name}</span>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleSelectTeam(team.id)}
                      >
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timer Controls */}
        {activeRoom && (
          <TimerControls room={room} activeRoom={activeRoom} />
        )}
      </div>

      {/* Attempt History */}
      {currentTeam && (
        <div className="mb-6">
          <AttemptHistoryViewer
            teamId={currentTeam.id}
            teamName={currentTeam.name}
            roomNumber={roomNumber}
          />
        </div>
      )}

      {/* Content Editor */}
      <ContentEditor room={room} />
    </div>
  );
}
