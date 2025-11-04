/**
 * Database functions for resetting/clearing data
 */

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, TOTAL_ROOMS } from '@/constants';
import { initializeActiveRooms } from './activeRooms';

/**
 * Reset all team data (teams, progress, active rooms)
 * WARNING: This is destructive and cannot be undone
 */
export const resetAllTeamData = async (): Promise<void> => {
  const batch = writeBatch(db);

  // Delete all teams
  const teamsSnapshot = await getDocs(collection(db, COLLECTIONS.TEAMS));
  teamsSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Delete all team progress
  const progressSnapshot = await getDocs(collection(db, COLLECTIONS.TEAM_PROGRESS));
  progressSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // Reset all active rooms
  await initializeActiveRooms();
};

/**
 * Reset only team progress (keeps teams, clears their progress)
 */
export const resetAllTeamProgress = async (): Promise<void> => {
  const batch = writeBatch(db);

  // Delete all team progress
  const progressSnapshot = await getDocs(collection(db, COLLECTIONS.TEAM_PROGRESS));
  progressSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  // Reset all teams to initial state
  const teamsSnapshot = await getDocs(collection(db, COLLECTIONS.TEAMS));
  teamsSnapshot.forEach((teamDoc) => {
    batch.update(teamDoc.ref, {
      currentRoom: 1,
      status: 'waiting',
      totalTime: 0,
      sessionStartTime: null,
    });
  });

  await batch.commit();

  // Reset all active rooms
  await initializeActiveRooms();
};

/**
 * Reset leaderboard data
 */
export const resetLeaderboard = async (): Promise<void> => {
  const leaderboardSnapshot = await getDocs(collection(db, COLLECTIONS.LEADERBOARD));

  const batch = writeBatch(db);
  leaderboardSnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};

/**
 * Reset everything (nuclear option)
 */
export const resetAllData = async (): Promise<void> => {
  await Promise.all([
    resetAllTeamData(),
    resetLeaderboard(),
  ]);
};

/**
 * Delete a specific team and all related data
 */
export const deleteTeam = async (teamId: string): Promise<void> => {
  const batch = writeBatch(db);

  // Delete team
  batch.delete(doc(db, COLLECTIONS.TEAMS, teamId));

  // Delete team's progress
  const progressSnapshot = await getDocs(collection(db, COLLECTIONS.TEAM_PROGRESS));
  progressSnapshot.forEach((progressDoc) => {
    const data = progressDoc.data();
    if (data.teamId === teamId) {
      batch.delete(progressDoc.ref);
    }
  });

  // Delete from leaderboard
  const leaderboardDoc = doc(db, COLLECTIONS.LEADERBOARD, teamId);
  batch.delete(leaderboardDoc);

  await batch.commit();

  // Clear from active rooms if present
  const activeRoomsSnapshot = await getDocs(collection(db, COLLECTIONS.ACTIVE_ROOMS));
  const clearBatch = writeBatch(db);
  activeRoomsSnapshot.forEach((activeRoomDoc) => {
    const data = activeRoomDoc.data();
    if (data.currentTeamId === teamId) {
      clearBatch.update(activeRoomDoc.ref, {
        currentTeamId: null,
        timerStarted: null,
        timerPaused: false,
      });
    }
  });
  await clearBatch.commit();
};
