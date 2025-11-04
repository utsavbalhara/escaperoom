import { useEffect, useState } from 'react';
import { LeaderboardEntry } from '@/types';
import { subscribeToLeaderboard } from '@/lib/db/leaderboard';

export function useRealtimeLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToLeaderboard((data) => {
      setLeaderboard(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { leaderboard, loading, error };
}
