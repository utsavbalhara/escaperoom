import React from 'react';
import { ROOM_NAMES } from '@/constants';
import RoboticText from '@/components/shared/RoboticText';
import { clearTeamSession } from '@/lib/auth-storage';

interface RoomHeaderProps {
  roomNumber: number;
  teamName: string;
  onLogout?: () => void;
}

export default function RoomHeader({ roomNumber, teamName, onLogout }: RoomHeaderProps) {
  const handleLogout = () => {
    clearTeamSession();
    if (onLogout) {
      onLogout();
    } else {
      // Reload page to show team selector
      window.location.reload();
    }
  };

  return (
    <div className="border-b-2 border-primary pb-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <RoboticText size="xl" glow>
            <span className="text-2xl font-bold">{ROOM_NAMES[roomNumber]}</span>
          </RoboticText>
          <p className="text-secondary mt-1">Room {roomNumber}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-primary/70">Team:</p>
              <p className="text-xl font-bold text-secondary">{teamName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-primary/50 hover:text-secondary transition-colors underline"
              title="Switch Team"
            >
              Switch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
