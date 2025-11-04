import { Timestamp } from 'firebase/firestore';

export type TeamStatus = 'waiting' | 'active' | 'eliminated' | 'completed';
export type ProgressStatus = 'not-started' | 'in-progress' | 'completed' | 'failed';

export interface Team {
  id: string;
  name: string;
  password: string; // 4-digit code for team authentication
  currentRoom: number;
  status: TeamStatus;
  totalTime: number;
  sessionStartTime: Timestamp | null; // When team entered their password
  createdAt: Timestamp;
}

export interface Room {
  roomNumber: number;
  questionText: string;
  ttsText: string;
  correctCode: string;
  hintText: string;
  timerDuration: number; // in seconds
  maxAttempts: number;
  levelUpMessage: string;
  gameOverMessage: string;
  sequence: number;
}

export interface TeamProgress {
  id: string; // teamId_roomNumber
  teamId: string;
  roomNumber: number;
  attempts: AttemptRecord[];
  attemptsRemaining: number;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  status: ProgressStatus;
  timeElapsed: number; // in seconds
}

export interface AttemptRecord {
  code: string;
  timestamp: Timestamp;
  correct: boolean;
}

export interface ActiveRoom {
  roomNumber: number;
  currentTeamId: string | null;
  timerStarted: Timestamp | null;
  timerPaused: boolean;
  manualTTSTrigger: number;
}

export interface Config {
  adminPassword: string;
  roomSequence: number[];
  basecampCompleted: boolean;
}

export interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  currentLevel: number; // Current room the team is on
  roomsCompleted: number; // Number of rooms completed (for display)
  sessionStartTime: Timestamp | null; // When team started (for first-come-first-serve sorting)
  totalAttempts: number;
  lastUpdated: Timestamp;
}

// UI State Types
export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  timeRemaining: number; // in seconds
  startTime: number | null;
}

export interface GameScreen {
  type: 'game' | 'level-up' | 'game-over' | 'victory' | 'team-select';
  message?: string;
}
