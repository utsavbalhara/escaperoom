import { useEffect, useState } from 'react';
import { Room } from '@/types';
import { subscribeToRoom, subscribeToAllRooms } from '@/lib/db/rooms';

export function useRealtimeRoom(roomNumber: number) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToRoom(
      roomNumber,
      (data) => {
        setRoom(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomNumber]);

  return { room, loading, error };
}

export function useRealtimeAllRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToAllRooms((data) => {
      setRooms(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { rooms, loading, error };
}
