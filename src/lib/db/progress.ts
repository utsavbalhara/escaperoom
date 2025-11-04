import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/constants';
import { TeamProgress, AttemptRecord, ProgressStatus } from '@/types';

const getProgressId = (teamId: string, roomNumber: number): string => {
  return `${teamId}_${roomNumber}`;
};

export const createProgress = async (
  teamId: string,
  roomNumber: number,
  maxAttempts: number
): Promise<void> => {
  const progressId = getProgressId(teamId, roomNumber);
  const progressData: Omit<TeamProgress, 'id'> = {
    teamId,
    roomNumber,
    attempts: [],
    attemptsRemaining: maxAttempts,
    startTime: null,
    endTime: null,
    status: 'not-started',
    timeElapsed: 0,
  };

  await setDoc(doc(db, COLLECTIONS.TEAM_PROGRESS, progressId), progressData);
};

export const getProgress = async (
  teamId: string,
  roomNumber: number
): Promise<TeamProgress | null> => {
  const progressId = getProgressId(teamId, roomNumber);
  const docRef = doc(db, COLLECTIONS.TEAM_PROGRESS, progressId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as TeamProgress;
  }
  return null;
};

export const getTeamProgressHistory = async (
  teamId: string
): Promise<TeamProgress[]> => {
  const q = query(
    collection(db, COLLECTIONS.TEAM_PROGRESS),
    where('teamId', '==', teamId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamProgress));
};

export const startProgress = async (
  teamId: string,
  roomNumber: number
): Promise<void> => {
  const progressId = getProgressId(teamId, roomNumber);
  const docRef = doc(db, COLLECTIONS.TEAM_PROGRESS, progressId);

  await updateDoc(docRef, {
    startTime: Timestamp.now(),
    status: 'in-progress',
  });
};

export const addAttempt = async (
  teamId: string,
  roomNumber: number,
  code: string,
  correct: boolean
): Promise<void> => {
  const progressId = getProgressId(teamId, roomNumber);
  const docRef = doc(db, COLLECTIONS.TEAM_PROGRESS, progressId);

  const progress = await getProgress(teamId, roomNumber);
  if (!progress) return;

  const attempt: AttemptRecord = {
    code,
    timestamp: Timestamp.now(),
    correct,
  };

  await updateDoc(docRef, {
    attempts: arrayUnion(attempt),
    attemptsRemaining: progress.attemptsRemaining - 1,
  });
};

export const completeProgress = async (
  teamId: string,
  roomNumber: number,
  timeElapsed: number
): Promise<void> => {
  const progressId = getProgressId(teamId, roomNumber);
  const docRef = doc(db, COLLECTIONS.TEAM_PROGRESS, progressId);

  await updateDoc(docRef, {
    endTime: Timestamp.now(),
    status: 'completed',
    timeElapsed,
  });
};

export const failProgress = async (
  teamId: string,
  roomNumber: number,
  timeElapsed: number
): Promise<void> => {
  const progressId = getProgressId(teamId, roomNumber);
  const docRef = doc(db, COLLECTIONS.TEAM_PROGRESS, progressId);

  await updateDoc(docRef, {
    endTime: Timestamp.now(),
    status: 'failed',
    timeElapsed,
  });
};

export const subscribeToProgress = (
  teamId: string,
  roomNumber: number,
  callback: (progress: TeamProgress | null) => void
): (() => void) => {
  const progressId = getProgressId(teamId, roomNumber);
  const docRef = doc(db, COLLECTIONS.TEAM_PROGRESS, progressId);

  return onSnapshot(docRef, docSnap => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as TeamProgress);
    } else {
      callback(null);
    }
  });
};
