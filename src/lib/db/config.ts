import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/constants';

export interface Config {
  id: string;
  adminPassword: string;
  roomSequence: number[];
  basecampCompleted: boolean;
  maxTeams?: number;
  allowTeamCreation?: boolean;
  roomNames?: { [key: number]: string }; // Custom room names
  createdAt: Date;
  updatedAt: Date;
}

const CONFIG_DOC_ID = 'global';

export const getConfig = async (): Promise<Config | null> => {
  const docRef = doc(db, COLLECTIONS.CONFIG, CONFIG_DOC_ID);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Config;
  }
  return null;
};

export const initializeConfig = async (): Promise<void> => {
  const configData: Omit<Config, 'id'> = {
    adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'escaperoom2024',
    roomSequence: [1, 2, 3, 4, 5, 6],
    basecampCompleted: false,
    maxTeams: 50,
    allowTeamCreation: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, COLLECTIONS.CONFIG, CONFIG_DOC_ID), configData);
};

export const updateConfig = async (
  updates: Partial<Omit<Config, 'id'>>
): Promise<void> => {
  const docRef = doc(db, COLLECTIONS.CONFIG, CONFIG_DOC_ID);
  // Use setDoc with merge to create document if it doesn't exist
  await setDoc(docRef, {
    ...updates,
    updatedAt: new Date(),
  }, { merge: true });
};

export const validateAdminPassword = async (password: string): Promise<boolean> => {
  const config = await getConfig();
  if (!config) {
    // Fallback to env variable if config doesn't exist
    return password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  }
  return password === config.adminPassword;
};

export const getRoomSequence = async (): Promise<number[]> => {
  const config = await getConfig();
  return config?.roomSequence || [1, 2, 3, 4, 5, 6];
};

export const updateRoomSequence = async (sequence: number[]): Promise<void> => {
  await updateConfig({ roomSequence: sequence });
};

export const getRoomNames = async (): Promise<{ [key: number]: string }> => {
  const config = await getConfig();
  return config?.roomNames || {};
};

export const updateRoomName = async (roomNumber: number, name: string): Promise<void> => {
  const currentNames = await getRoomNames();
  currentNames[roomNumber] = name;
  await updateConfig({ roomNames: currentNames });
};
