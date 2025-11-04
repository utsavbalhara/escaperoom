import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, DEFAULT_ROOMS_DATA } from '@/constants';
import { Room } from '@/types';

export const initializeRooms = async (): Promise<void> => {
  for (const roomData of DEFAULT_ROOMS_DATA) {
    const docRef = doc(db, COLLECTIONS.ROOMS, roomData.roomNumber.toString());
    await setDoc(docRef, roomData);
  }
};

export const getRoom = async (roomNumber: number): Promise<Room | null> => {
  const docRef = doc(db, COLLECTIONS.ROOMS, roomNumber.toString());
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Room;
  }
  return null;
};

export const getAllRooms = async (): Promise<Room[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, COLLECTIONS.ROOMS), orderBy('sequence', 'asc'))
  );
  return querySnapshot.docs.map(doc => doc.data() as Room);
};

export const updateRoom = async (
  roomNumber: number,
  updates: Partial<Room>
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.ROOMS, roomNumber.toString());
  await updateDoc(docRef, updates as any);
};

export const updateRoomContent = async (
  roomNumber: number,
  content: {
    questionText?: string;
    ttsText?: string;
    correctCode?: string;
    hintText?: string;
    timerDuration?: number;
    maxAttempts?: number;
    levelUpMessage?: string;
    gameOverMessage?: string;
  }
): Promise<void> => {
  await updateRoom(roomNumber, content);
};

export const subscribeToRoom = (
  roomNumber: number,
  callback: (room: Room | null) => void
): (() => void) => {
  const docRef = doc(db, COLLECTIONS.ROOMS, roomNumber.toString());
  return onSnapshot(docRef, docSnap => {
    if (docSnap.exists()) {
      callback(docSnap.data() as Room);
    } else {
      callback(null);
    }
  });
};

export const subscribeToAllRooms = (
  callback: (rooms: Room[]) => void
): (() => void) => {
  const q = query(collection(db, COLLECTIONS.ROOMS), orderBy('sequence', 'asc'));
  return onSnapshot(q, querySnapshot => {
    const rooms = querySnapshot.docs.map(doc => doc.data() as Room);
    callback(rooms);
  });
};
