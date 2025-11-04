import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/constants';
import { LeaderboardEntry } from '@/types';

export const updateLeaderboard = async (
  teamId: string,
  teamName: string,
  currentLevel: number,
  roomsCompleted: number,
  sessionStartTime: Timestamp | null,
  totalAttempts: number
): Promise<void> => {
  const leaderboardData: Omit<LeaderboardEntry, 'teamId'> = {
    teamName,
    currentLevel,
    roomsCompleted,
    sessionStartTime,
    totalAttempts,
    lastUpdated: Timestamp.now(),
  };

  await setDoc(
    doc(db, COLLECTIONS.LEADERBOARD, teamId),
    { teamId, ...leaderboardData }
  );
};

export const getLeaderboardEntry = async (
  teamId: string
): Promise<LeaderboardEntry | null> => {
  const docRef = doc(db, COLLECTIONS.LEADERBOARD, teamId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as LeaderboardEntry;
  }
  return null;
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Get all entries and sort in memory to avoid composite index
  const querySnapshot = await getDocs(collection(db, COLLECTIONS.LEADERBOARD));
  const entries = querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry);

  // Sort by currentLevel DESC (higher level = better rank)
  // Then by sessionStartTime ASC (first come first serve)
  return entries.sort((a, b) => {
    if (b.currentLevel !== a.currentLevel) {
      return b.currentLevel - a.currentLevel;
    }
    // First-come-first-serve: earlier sessionStartTime ranks higher
    const aTime = a.sessionStartTime?.toMillis() || Number.MAX_VALUE;
    const bTime = b.sessionStartTime?.toMillis() || Number.MAX_VALUE;
    return aTime - bTime;
  });
};

export const subscribeToLeaderboard = (
  callback: (leaderboard: LeaderboardEntry[]) => void
): (() => void) => {
  // Subscribe to all entries and sort in memory to avoid composite index
  return onSnapshot(collection(db, COLLECTIONS.LEADERBOARD), querySnapshot => {
    const entries = querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry);

    // Sort by currentLevel DESC (higher level = better rank)
    // Then by sessionStartTime ASC (first come first serve)
    const sorted = entries.sort((a, b) => {
      if (b.currentLevel !== a.currentLevel) {
        return b.currentLevel - a.currentLevel;
      }
      // First-come-first-serve: earlier sessionStartTime ranks higher
      const aTime = a.sessionStartTime?.toMillis() || Number.MAX_VALUE;
      const bTime = b.sessionStartTime?.toMillis() || Number.MAX_VALUE;
      return aTime - bTime;
    });

    callback(sorted);
  });
};

export const calculateAndUpdateLeaderboard = async (
  teamId: string,
  teamName: string
): Promise<void> => {
  const teamDoc = await getDoc(doc(db, COLLECTIONS.TEAMS, teamId));
  if (!teamDoc.exists()) return;

  const teamData = teamDoc.data();
  const currentLevel = teamData.currentRoom; // Current room team is on
  const roomsCompleted = Math.max(0, teamData.currentRoom - 1); // Rooms actually completed

  // Get all progress records for this team
  const progressQuery = query(
    collection(db, COLLECTIONS.TEAM_PROGRESS),
    // @ts-ignore
    where('teamId', '==', teamId),
    // @ts-ignore
    where('status', '==', 'completed')
  );

  const progressSnap = await getDocs(progressQuery);
  let totalAttempts = 0;

  progressSnap.forEach(doc => {
    const data = doc.data();
    totalAttempts += data.attempts?.length || 0;
  });

  await updateLeaderboard(
    teamId,
    teamName,
    currentLevel,
    roomsCompleted,
    teamData.sessionStartTime || null,
    totalAttempts
  );
};
