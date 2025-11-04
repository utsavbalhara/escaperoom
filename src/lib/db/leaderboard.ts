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
  roomsCompleted: number,
  totalAttempts: number,
  totalTime: number
): Promise<void> => {
  const leaderboardData: Omit<LeaderboardEntry, 'teamId'> = {
    teamName,
    roomsCompleted,
    totalAttempts,
    totalTime,
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

  // Sort by roomsCompleted DESC, then totalTime ASC
  return entries.sort((a, b) => {
    if (b.roomsCompleted !== a.roomsCompleted) {
      return b.roomsCompleted - a.roomsCompleted;
    }
    return a.totalTime - b.totalTime;
  });
};

export const subscribeToLeaderboard = (
  callback: (leaderboard: LeaderboardEntry[]) => void
): (() => void) => {
  // Subscribe to all entries and sort in memory to avoid composite index
  return onSnapshot(collection(db, COLLECTIONS.LEADERBOARD), querySnapshot => {
    const entries = querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry);

    // Sort by roomsCompleted DESC, then totalTime ASC
    const sorted = entries.sort((a, b) => {
      if (b.roomsCompleted !== a.roomsCompleted) {
        return b.roomsCompleted - a.roomsCompleted;
      }
      return a.totalTime - b.totalTime;
    });

    callback(sorted);
  });
};

export const calculateAndUpdateLeaderboard = async (
  teamId: string,
  teamName: string
): Promise<void> => {
  // This would typically fetch team progress and calculate stats
  // For now, we'll implement a simplified version
  const team = await getDoc(doc(db, COLLECTIONS.TEAMS, teamId));
  if (!team.exists()) return;

  const teamData = team.data();
  const roomsCompleted = teamData.currentRoom - 1;

  // Get all progress records for this team to calculate totals
  const progressQuery = query(
    collection(db, COLLECTIONS.TEAM_PROGRESS),
    // @ts-ignore
    where('teamId', '==', teamId),
    // @ts-ignore
    where('status', '==', 'completed')
  );

  const progressSnap = await getDocs(progressQuery);
  let totalAttempts = 0;
  let totalTime = 0;

  progressSnap.forEach(doc => {
    const data = doc.data();
    totalAttempts += data.attempts?.length || 0;
    totalTime += data.timeElapsed || 0;
  });

  await updateLeaderboard(teamId, teamName, roomsCompleted, totalAttempts, totalTime);
};
