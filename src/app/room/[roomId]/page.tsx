'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import TeamSelector from '@/components/player/TeamSelector';
import RoomHeader from '@/components/player/RoomHeader';
import Timer from '@/components/player/Timer';
import QuestionDisplay from '@/components/player/QuestionDisplay';
import TTSPlayer from '@/components/player/TTSPlayer';
import AnswerInput from '@/components/player/AnswerInput';
import HintButton from '@/components/player/HintButton';
import Leaderboard from '@/components/player/Leaderboard';
import LevelUpScreen from '@/components/player/LevelUpScreen';
import GameOverScreen from '@/components/player/GameOverScreen';
import VictoryScreen from '@/components/player/VictoryScreen';
import SessionClock from '@/components/player/SessionClock';
import Loading from '@/components/shared/Loading';
import { useRealtimeRoom } from '@/hooks/useRealtimeRoom';
import { useRealtimeActiveRoom } from '@/hooks/useRealtimeActiveRoom';
import { useRealtimeTeam } from '@/hooks/useRealtimeTeam';
import {
  setActiveTeam,
  startTimer,
  clearActiveRoom,
  getActiveRoom,
} from '@/lib/db/activeRooms';
import {
  createProgress,
  startProgress,
  addAttempt,
  completeProgress,
  failProgress,
  getProgress,
} from '@/lib/db/progress';
import {
  updateTeamStatus,
  moveTeamToNextRoom,
  getTeam,
} from '@/lib/db/teams';
import {
  calculateAndUpdateLeaderboard,
} from '@/lib/db/leaderboard';
import { TOTAL_ROOMS } from '@/constants';
import Button from '@/components/shared/Button';
import {
  saveTeamSession,
  clearTeamSession,
} from '@/lib/auth-storage';

interface PageProps {
  params: Promise<{ roomId: string }>;
}

type GameState = 'team-select' | 'playing' | 'level-up' | 'game-over' | 'victory';

export default function RoomPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const roomNumber = parseInt(resolvedParams.roomId);
  const router = useRouter();

  const [currentTeamId, setCurrentTeamId] = useState<string | null>(null);
  const [currentTeamName, setCurrentTeamName] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>('team-select');
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [gameOverReason, setGameOverReason] = useState<'timeout' | 'attempts'>('timeout');
  const [teamStats, setTeamStats] = useState({ totalTime: 0, totalAttempts: 0 });

  const { room, loading: roomLoading } = useRealtimeRoom(roomNumber);
  const { activeRoom } = useRealtimeActiveRoom(roomNumber);
  const { team } = useRealtimeTeam(currentTeamId);

  // Room 1 (Basecamp) - special handling
  const isBasecamp = roomNumber === 1;

  // Auto-resume existing session from database on mount
  useEffect(() => {
    const checkForActiveSession = async () => {
      // Check if there's already an active team in this room
      const activeRoomData = await getActiveRoom(roomNumber);

      if (activeRoomData && activeRoomData.currentTeamId) {
        // There's an active team, verify it still exists and is valid
        const teamData = await getTeam(activeRoomData.currentTeamId);

        if (teamData && teamData.status !== 'eliminated') {
          // Get the existing progress to restore attempts remaining
          const progressData = await getProgress(teamData.id, roomNumber);

          // Resume the existing session WITHOUT restarting anything
          setCurrentTeamId(teamData.id);
          setCurrentTeamName(teamData.name);
          setGameState('playing');

          // Restore attempts remaining from existing progress
          if (progressData) {
            setAttemptsRemaining(progressData.attemptsRemaining);
          }

          // Save to localStorage for convenience
          saveTeamSession(teamData.id, teamData.name);
        } else {
          // Team is invalid, clear the active room
          await clearActiveRoom(roomNumber);
          clearTeamSession();
        }
      }
    };

    checkForActiveSession();
  }, []); // Only run on mount

  const handleTeamSelect = async (teamId: string, teamName: string) => {
    try {
      setCurrentTeamId(teamId);
      setCurrentTeamName(teamName);

      // Set active team in room
      await setActiveTeam(roomNumber, teamId);

      // Create progress record
      if (room) {
        await createProgress(teamId, roomNumber, room.maxAttempts);
        setAttemptsRemaining(room.maxAttempts); // Initialize attempts for new session
      }

      // Update team status
      await updateTeamStatus(teamId, 'active');

      // Start progress tracking
      await startProgress(teamId, roomNumber);

      // Start timer (unless basecamp)
      if (!isBasecamp && room && room.timerDuration > 0) {
        await startTimer(roomNumber);
      }

      // Start game
      setGameState('playing');
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Error starting game. Check console for details.');
    }
  };

  const handleCodeSubmit = async (code: string) => {
    if (!room || !currentTeamId) return;

    const isCorrect = code === room.correctCode;

    // Record attempt
    await addAttempt(currentTeamId, roomNumber, code, isCorrect);

    if (isCorrect) {
      // Correct code!
      await handleSuccess();
    } else {
      // Wrong code
      const newAttemptsRemaining = attemptsRemaining - 1;
      setAttemptsRemaining(newAttemptsRemaining);

      if (newAttemptsRemaining === 0) {
        // No attempts left
        await handleFailure('attempts');
      }
    }
  };

  const handleSuccess = async () => {
    if (!room || !currentTeamId) return;

    try {
      // For basecamp (room 1), time elapsed is 0
      const timeElapsed = isBasecamp ? 0 : (() => {
        if (activeRoom?.timerStarted) {
          const startTime = activeRoom.timerStarted.toMillis();
          const now = Date.now();
          return Math.floor((now - startTime) / 1000);
        }
        return 0;
      })();

      // Mark progress as complete
      await completeProgress(currentTeamId, roomNumber, timeElapsed);

      // Update leaderboard
      await calculateAndUpdateLeaderboard(currentTeamId, currentTeamName);

      // Check if this is the final room
      if (roomNumber === TOTAL_ROOMS) {
        // Victory!
        setTeamStats({
          totalTime: timeElapsed,
          totalAttempts: room.maxAttempts - attemptsRemaining,
        });
        setGameState('victory');
      } else {
        // Move to next room
        await moveTeamToNextRoom(currentTeamId);
        setGameState('level-up');
      }

      // Clear active room
      await clearActiveRoom(roomNumber);
    } catch (error) {
      console.error('Error completing room:', error);
      alert('Error completing room. Check console for details.');
    }
  };

  const handleFailure = async (reason: 'timeout' | 'attempts') => {
    if (!currentTeamId) return;

    // Mark progress as failed
    const progress = await getProgress(currentTeamId, roomNumber);
    const timeElapsed = progress?.timeElapsed || 0;
    await failProgress(currentTeamId, roomNumber, timeElapsed);

    // Update team status
    await updateTeamStatus(currentTeamId, 'eliminated');

    // Update leaderboard
    await calculateAndUpdateLeaderboard(currentTeamId, currentTeamName);

    // Clear active room
    await clearActiveRoom(roomNumber);

    // Clear stored session (team is eliminated)
    clearTeamSession();

    // Show game over
    setGameOverReason(reason);
    setGameState('game-over');
  };

  const handleTimeout = async () => {
    await handleFailure('timeout');
  };

  const handleContinue = () => {
    router.push('/');
  };

  const handleBasecampContinue = async () => {
    if (!currentTeamId) return;

    await handleSuccess();
  };

  if (roomLoading || !room) {
    return <Loading message="Loading room..." fullScreen />;
  }

  // Team Selection Screen
  if (gameState === 'team-select') {
    return <TeamSelector roomNumber={roomNumber} onTeamSelect={handleTeamSelect} />;
  }

  // Level Up Screen
  if (gameState === 'level-up') {
    return (
      <LevelUpScreen
        message={room.levelUpMessage}
        roomNumber={roomNumber}
        onContinue={handleContinue}
      />
    );
  }

  // Game Over Screen
  if (gameState === 'game-over') {
    return (
      <GameOverScreen
        message={room.gameOverMessage}
        reason={gameOverReason}
      />
    );
  }

  // Victory Screen
  if (gameState === 'victory') {
    return (
      <VictoryScreen
        teamName={currentTeamName}
        totalTime={teamStats.totalTime}
        totalAttempts={teamStats.totalAttempts}
      />
    );
  }

  // Main Game Screen
  return (
    <div className="min-h-screen p-6">
      {/* Session Clock */}
      <SessionClock team={team} />

      {/* Main Content Grid */}
      <div className="flex gap-6 max-w-[1600px] mx-auto">
        {/* Main Game Area */}
        <div className="flex-1 max-w-4xl">
          <RoomHeader roomNumber={roomNumber} teamName={currentTeamName} />

          {/* Timer (not for basecamp) */}
          {!isBasecamp && activeRoom && room.timerDuration > 0 && (
            <Timer
              timerStarted={activeRoom.timerStarted}
              timerDuration={room.timerDuration}
              timerPaused={activeRoom.timerPaused}
              onTimeout={handleTimeout}
            />
          )}

          {/* TTS Player */}
          <TTSPlayer
            text={room.ttsText}
            autoPlay={true}
            manualTrigger={activeRoom?.manualTTSTrigger}
          />

          {/* Question Display */}
          <QuestionDisplay questionText={room.questionText} />

          {/* Basecamp Special: Just Continue Button */}
          {isBasecamp ? (
            <div className="text-center mt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={handleBasecampContinue}
                className="text-2xl px-12"
              >
                CONTINUE TO CHALLENGES →
              </Button>
            </div>
          ) : (
            <>
              {/* Hint Button */}
              <HintButton hintText={room.hintText} />

              {/* Answer Input */}
              <AnswerInput
                attemptsRemaining={attemptsRemaining}
                maxAttempts={room.maxAttempts}
                onSubmit={handleCodeSubmit}
              />
            </>
          )}
        </div>

        {/* Leaderboard Box - Right Side */}
        <div className="w-[400px] shrink-0">
          <div className="sticky top-6">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
