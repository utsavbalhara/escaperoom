import React from 'react';
import { ROOM_NAMES } from '@/constants';
import RoboticText from '@/components/shared/RoboticText';

interface RoomHeaderProps {
  roomNumber: number;
  teamName: string;
}

export default function RoomHeader({ roomNumber, teamName }: RoomHeaderProps) {
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
          <p className="text-sm text-primary/70">Team:</p>
          <p className="text-xl font-bold text-secondary">{teamName}</p>
        </div>
      </div>
    </div>
  );
}
