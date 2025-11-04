import { useState, useEffect } from 'react';
import { ROOM_NAMES } from '@/constants';
import { getRoomNames } from '@/lib/db/config';

export const useRoomName = (roomNumber: number): string => {
  const [customNames, setCustomNames] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomNames = async () => {
      try {
        const names = await getRoomNames();
        setCustomNames(names);
      } catch (error) {
        console.error('Error loading custom room names:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCustomNames();
  }, []);

  if (loading) {
    return ROOM_NAMES[roomNumber] || `Room ${roomNumber}`;
  }

  return customNames[roomNumber] || ROOM_NAMES[roomNumber] || `Room ${roomNumber}`;
};
