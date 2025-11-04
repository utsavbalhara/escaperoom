import { useEffect, useState } from 'react';
import { ActiveRoom } from '@/types';
import { subscribeToActiveRoom } from '@/lib/db/activeRooms';

export function useRealtimeActiveRoom(roomNumber: number) {
  const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToActiveRoom(roomNumber, (data) => {
      setActiveRoom(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomNumber]);

  return { activeRoom, loading, error };
}
