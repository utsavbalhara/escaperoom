'use client';

import React from 'react';
import { Room, ActiveRoom, Team } from '@/types';
import { formatTime } from '@/lib/utils';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import { useTimer } from '@/hooks/useTimer';

interface RoomCardProps {
  room: Room;
  activeRoom: ActiveRoom | null;
  currentTeam: Team | null;
  onSelectRoom: (roomNumber: number) => void;
}

export default function RoomCard({
  room,
  activeRoom,
  currentTeam,
  onSelectRoom,
}: RoomCardProps) {
  const { timeRemaining } = useTimer({
    timerStarted: activeRoom?.timerStarted || null,
    timerDuration: room.timerDuration,
    timerPaused: activeRoom?.timerPaused || false,
  });

  const isActive = activeRoom?.currentTeamId !== null;

  return (
    <div
      className={`card-hover cursor-pointer ${
        isActive ? 'border-secondary' : 'border-primary/30'
      }`}
      onClick={() => onSelectRoom(room.roomNumber)}
    >
      <div className="flex justify-between items-start mb-3">
        <RoboticText size="lg" glow={isActive}>
          <h3 className="text-2xl font-bold">Room {room.roomNumber}</h3>
        </RoboticText>
        <span
          className={`px-3 py-1 rounded text-sm font-bold ${
            isActive
              ? 'bg-secondary/20 text-secondary'
              : 'bg-primary/20 text-primary/50'
          }`}
        >
          {isActive ? '🟢 ACTIVE' : '⚪ IDLE'}
        </span>
      </div>

      {currentTeam ? (
        <div className="space-y-2">
          <div>
            <p className="text-sm text-primary/70">Current Team:</p>
            <p className="text-lg font-bold text-secondary">{currentTeam.name}</p>
          </div>

          {room.timerDuration > 0 && activeRoom?.timerStarted && (
            <div>
              <p className="text-sm text-primary/70">Time Remaining:</p>
              <p
                className={`text-2xl font-bold ${
                  timeRemaining <= 30 ? 'text-danger animate-pulse' : 'text-primary'
                }`}
              >
                {formatTime(timeRemaining)}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-primary/50 italic">No active team</p>
      )}

      <div className="mt-4 pt-4 border-t border-primary/20">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelectRoom(room.roomNumber);
          }}
        >
          Manage Room →
        </Button>
      </div>
    </div>
  );
}
