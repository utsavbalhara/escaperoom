import { useState, useEffect } from 'react';

const LEADERBOARD_VISIBILITY_KEY = 'leaderboard-visible';

export const useLeaderboardVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(LEADERBOARD_VISIBILITY_KEY);
    if (saved !== null) {
      setIsVisible(saved === 'true');
    }

    // Listen for storage changes from other tabs/components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LEADERBOARD_VISIBILITY_KEY && e.newValue !== null) {
        setIsVisible(e.newValue === 'true');
      }
    };

    // Listen for custom events from the same page
    const handleCustomEvent = () => {
      const saved = localStorage.getItem(LEADERBOARD_VISIBILITY_KEY);
      if (saved !== null) {
        setIsVisible(saved === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('leaderboard-visibility-changed', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('leaderboard-visibility-changed', handleCustomEvent);
    };
  }, []);

  return isVisible;
};
