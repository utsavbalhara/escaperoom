import { useEffect, useState, useCallback, useRef } from 'react';
import { Timestamp } from 'firebase/firestore';
import { calculateTimeRemaining } from '@/lib/utils';

interface UseTimerOptions {
  timerStarted: Timestamp | null;
  timerDuration: number;
  timerPaused: boolean;
  onTimeout?: () => void;
}

export function useTimer({
  timerStarted,
  timerDuration,
  timerPaused,
  onTimeout,
}: UseTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(timerDuration);
  const [isRunning, setIsRunning] = useState(false);
  const timeoutCalledRef = useRef(false);

  useEffect(() => {
    if (!timerStarted || timerPaused) {
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    timeoutCalledRef.current = false;

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(
        timerStarted,
        timerDuration,
        timerPaused
      );

      setTimeRemaining(remaining);

      if (remaining <= 0 && !timeoutCalledRef.current && onTimeout) {
        timeoutCalledRef.current = true;
        onTimeout();
      }
    }, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(interval);
  }, [timerStarted, timerDuration, timerPaused, onTimeout]);

  const getPercentage = useCallback((): number => {
    return (timeRemaining / timerDuration) * 100;
  }, [timeRemaining, timerDuration]);

  return {
    timeRemaining,
    isRunning,
    percentage: getPercentage(),
  };
}
