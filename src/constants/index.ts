export const TOTAL_ROOMS = 6;

export const DEFAULT_TIMER_DURATION = 300; // 5 minutes in seconds
export const DEFAULT_MAX_ATTEMPTS = 5;

export const ROOM_NAMES: Record<number, string> = {
  1: 'Basecamp',
  2: 'Room 2',
  3: 'Room 3',
  4: 'Room 4',
  5: 'Room 5',
  6: 'Final Room',
};

export const DEFAULT_ROOMS_DATA = [
  {
    roomNumber: 1,
    questionText: 'Welcome to the Escape Room Challenge!',
    ttsText: 'Welcome to the Escape Room Challenge. This is your basecamp. Listen carefully to the rules and instructions.',
    correctCode: '',
    hintText: 'Just click Continue to proceed.',
    timerDuration: 0,
    maxAttempts: 1,
    levelUpMessage: 'Great! Now proceed to Room 2.',
    gameOverMessage: '',
    sequence: 1,
  },
  {
    roomNumber: 2,
    questionText: 'Solve the puzzle to find the numeric code.',
    ttsText: 'Welcome to Room 2. Solve the puzzle carefully and enter the numeric code to proceed.',
    correctCode: '1234',
    hintText: 'Look for patterns in the puzzle.',
    timerDuration: 300,
    maxAttempts: 5,
    levelUpMessage: 'Excellent work! Proceed to Room 3.',
    gameOverMessage: 'Time is up! Better luck next time.',
    sequence: 2,
  },
  {
    roomNumber: 3,
    questionText: 'Decode the cipher to reveal the code.',
    ttsText: 'Welcome to Room 3. Decode the cipher to reveal the numeric code.',
    correctCode: '5678',
    hintText: 'Think about Caesar cipher.',
    timerDuration: 300,
    maxAttempts: 5,
    levelUpMessage: 'Amazing! On to Room 4.',
    gameOverMessage: 'Game Over! You have been eliminated.',
    sequence: 3,
  },
  {
    roomNumber: 4,
    questionText: 'Solve the mathematical equation.',
    ttsText: 'Welcome to Room 4. Solve the mathematical equation to find the code.',
    correctCode: '9012',
    hintText: 'Remember order of operations.',
    timerDuration: 300,
    maxAttempts: 5,
    levelUpMessage: 'Brilliant! Room 5 awaits.',
    gameOverMessage: 'Time ran out! Game Over.',
    sequence: 4,
  },
  {
    roomNumber: 5,
    questionText: 'Crack the logic puzzle.',
    ttsText: 'Welcome to Room 5. Crack the logic puzzle to reveal the final code.',
    correctCode: '3456',
    hintText: 'Each clue eliminates possibilities.',
    timerDuration: 300,
    maxAttempts: 5,
    levelUpMessage: 'Outstanding! Final room is next.',
    gameOverMessage: 'Eliminated! Better luck next time.',
    sequence: 5,
  },
  {
    roomNumber: 6,
    questionText: 'The ultimate challenge awaits.',
    ttsText: 'Welcome to the Final Room. This is your ultimate challenge. Solve this to win the competition.',
    correctCode: '7890',
    hintText: 'Combine all previous patterns.',
    timerDuration: 600,
    maxAttempts: 5,
    levelUpMessage: 'CONGRATULATIONS! You have escaped!',
    gameOverMessage: 'So close! Game Over.',
    sequence: 6,
  },
];

// TTS Voice Settings
export const TTS_VOICE_SETTINGS = {
  rate: 0.9,
  pitch: 1.2,
  volume: 1.0,
  voiceType: 'female',
};

// Collection Names
export const COLLECTIONS = {
  TEAMS: 'teams',
  ROOMS: 'rooms',
  TEAM_PROGRESS: 'teamProgress',
  ACTIVE_ROOMS: 'activeRooms',
  CONFIG: 'config',
  LEADERBOARD: 'leaderboard',
} as const;
