import { useEffect, useState } from 'react';
import { Team } from '@/types';
import { subscribeToTeam, subscribeToAllTeams, subscribeToTeamsByRoom } from '@/lib/db/teams';

export function useRealtimeTeam(teamId: string | null) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!teamId) {
      setTeam(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTeam(teamId, (data) => {
      setTeam(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [teamId]);

  return { team, loading, error };
}

export function useRealtimeAllTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToAllTeams((data) => {
      setTeams(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { teams, loading, error };
}

export function useRealtimeTeamsByRoom(roomNumber: number) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToTeamsByRoom(roomNumber, (data) => {
      setTeams(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomNumber]);

  return { teams, loading, error };
}
