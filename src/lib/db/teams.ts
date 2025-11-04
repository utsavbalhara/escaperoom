import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/constants';
import { Team, TeamStatus } from '@/types';

export const createTeam = async (name: string, password: string): Promise<string> => {
  const teamData = {
    name,
    password, // 4-digit code
    currentRoom: 1,
    status: 'waiting' as TeamStatus,
    totalTime: 0,
    sessionStartTime: null, // Set when team first enters password
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTIONS.TEAMS), teamData);
  return docRef.id;
};

export const getTeam = async (teamId: string): Promise<Team | null> => {
  const docRef = doc(db, COLLECTIONS.TEAMS, teamId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Team;
  }
  return null;
};

export const getAllTeams = async (): Promise<Team[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, COLLECTIONS.TEAMS), orderBy('createdAt', 'desc'))
  );
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
};

export const getTeamsByRoom = async (roomNumber: number): Promise<Team[]> => {
  const q = query(
    collection(db, COLLECTIONS.TEAMS),
    where('currentRoom', '==', roomNumber),
    where('status', 'in', ['waiting', 'active'])
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
};

export const updateTeam = async (
  teamId: string,
  updates: Partial<Team>
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.TEAMS, teamId);
  await updateDoc(docRef, updates as any);
};

export const updateTeamStatus = async (
  teamId: string,
  status: TeamStatus
): Promise<void> => {
  await updateTeam(teamId, { status });
};

export const moveTeamToNextRoom = async (teamId: string): Promise<void> => {
  const team = await getTeam(teamId);
  if (team) {
    await updateTeam(teamId, {
      currentRoom: team.currentRoom + 1,
      status: 'waiting',
    });
  }
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.TEAMS, teamId);
  await deleteDoc(docRef);
};

export const subscribeToTeam = (
  teamId: string,
  callback: (team: Team | null) => void
): (() => void) => {
  const docRef = doc(db, COLLECTIONS.TEAMS, teamId);
  return onSnapshot(docRef, docSnap => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as Team);
    } else {
      callback(null);
    }
  });
};

export const subscribeToAllTeams = (
  callback: (teams: Team[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.TEAMS), orderBy('createdAt', 'desc'));
  return onSnapshot(q, querySnapshot => {
    const teams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    callback(teams);
  });
};

export const subscribeToTeamsByRoom = (
  roomNumber: number,
  callback: (teams: Team[]) => void
): (() => void) => {
  const q = query(
    collection(db, COLLECTIONS.TEAMS),
    where('currentRoom', '==', roomNumber),
    where('status', 'in', ['waiting', 'active'])
  );
  return onSnapshot(q, querySnapshot => {
    const teams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
    callback(teams);
  });
};

export const validateTeamPassword = async (
  teamId: string,
  password: string
): Promise<boolean> => {
  const team = await getTeam(teamId);
  if (!team) return false;
  return team.password === password;
};

export const startTeamSession = async (teamId: string): Promise<void> => {
  const team = await getTeam(teamId);
  if (!team) return;

  // Only set sessionStartTime if not already set
  if (!team.sessionStartTime) {
    await updateDoc(doc(db, COLLECTIONS.TEAMS, teamId), {
      sessionStartTime: Timestamp.now(),
    });
  }
};

export const getTeamSessionTime = (team: Team): number => {
  if (!team.sessionStartTime) return 0;

  const now = Date.now();
  const startTime = team.sessionStartTime.toMillis();
  return Math.floor((now - startTime) / 1000); // Return seconds
};
