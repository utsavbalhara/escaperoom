import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, TOTAL_ROOMS } from '@/constants';
import { ActiveRoom } from '@/types';

export const initializeActiveRooms = async (): Promise<void> => {
  for (let i = 1; i <= TOTAL_ROOMS; i++) {
    const activeRoomData: Omit<ActiveRoom, 'roomNumber'> = {
      currentTeamId: null,
      timerStarted: null,
      timerPaused: false,
      manualTTSTrigger: 0,
    };

    await setDoc(
      doc(db, COLLECTIONS.ACTIVE_ROOMS, i.toString()),
      { roomNumber: i, ...activeRoomData }
    );
  }
};

export const getActiveRoom = async (roomNumber: number): Promise<ActiveRoom | null> => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as ActiveRoom;
  }
  return null;
};

export const setActiveTeam = async (
  roomNumber: number,
  teamId: string | null
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  await updateDoc(docRef, {
    currentTeamId: teamId,
  });
};

export const startTimer = async (roomNumber: number): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  await updateDoc(docRef, {
    timerStarted: Timestamp.now(),
    timerPaused: false,
  });
};

export const pauseTimer = async (roomNumber: number): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  await updateDoc(docRef, {
    timerPaused: true,
  });
};

export const resumeTimer = async (roomNumber: number): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  await updateDoc(docRef, {
    timerPaused: false,
  });
};

export const resetTimer = async (roomNumber: number): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  await updateDoc(docRef, {
    timerStarted: null,
    timerPaused: false,
  });
};

export const triggerManualTTS = async (roomNumber: number): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  await updateDoc(docRef, {
    manualTTSTrigger: increment(1),
  });
};

export const clearActiveRoom = async (roomNumber: number): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  await updateDoc(docRef, {
    currentTeamId: null,
    timerStarted: null,
    timerPaused: false,
  });
};

export const subscribeToActiveRoom = (
  roomNumber: number,
  callback: (activeRoom: ActiveRoom | null) => void
): (() => void) => {
  const docRef = doc(db, COLLECTIONS.ACTIVE_ROOMS, roomNumber.toString());
  return onSnapshot(docRef, docSnap => {
    if (docSnap.exists()) {
      callback(docSnap.data() as ActiveRoom);
    } else {
      callback(null);
    }
  });
};
