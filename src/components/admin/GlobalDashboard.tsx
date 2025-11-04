'use client';

import React from 'react';
import { useRealtimeAllRooms } from '@/hooks/useRealtimeRoom';
import { useRealtimeAllTeams } from '@/hooks/useRealtimeTeam';
import { useRealtimeActiveRoom } from '@/hooks/useRealtimeActiveRoom';
import RoomCard from './RoomCard';
import Loading from '@/components/shared/Loading';
import RoboticText from '@/components/shared/RoboticText';
import { TOTAL_ROOMS } from '@/constants';

interface GlobalDashboardProps {
  onSelectRoom: (roomNumber: number) => void;
}

export default function GlobalDashboard({ onSelectRoom }: GlobalDashboardProps) {
  const { rooms, loading: roomsLoading } = useRealtimeAllRooms();
  const { teams } = useRealtimeAllTeams();

  if (roomsLoading) {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div>
      <div className="mb-8">
        <RoboticText size="2xl" glow className="mb-2">
          <h2 className="text-4xl font-bold">GLOBAL DASHBOARD</h2>
        </RoboticText>
        <p className="text-primary/70">
          {teams.filter(t => t.status === 'active').length} active teams •{' '}
          {teams.filter(t => t.status === 'waiting').length} waiting •{' '}
          {teams.filter(t => t.status === 'eliminated').length} eliminated •{' '}
          {teams.filter(t => t.status === 'completed').length} completed
        </p>
      </div>

      <div className="grid-responsive">
        {rooms.map((room) => (
          <RoomCardWrapper
            key={room.roomNumber}
            room={room}
            teams={teams}
            onSelectRoom={onSelectRoom}
          />
        ))}
      </div>
    </div>
  );
}

function RoomCardWrapper({
  room,
  teams,
  onSelectRoom,
}: {
  room: any;
  teams: any[];
  onSelectRoom: (roomNumber: number) => void;
}) {
  const { activeRoom } = useRealtimeActiveRoom(room.roomNumber);
  const currentTeam = teams.find(t => t.id === activeRoom?.currentTeamId);

  return (
    <RoomCard
      room={room}
      activeRoom={activeRoom}
      currentTeam={currentTeam || null}
      onSelectRoom={onSelectRoom}
    />
  );
}
