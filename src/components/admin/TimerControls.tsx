'use client';

import React from 'react';
import { ActiveRoom, Room } from '@/types';
import Button from '@/components/shared/Button';
import { formatTime } from '@/lib/utils';
import { useTimer } from '@/hooks/useTimer';
import {
  startTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  triggerManualTTS,
} from '@/lib/db/activeRooms';

interface TimerControlsProps {
  room: Room;
  activeRoom: ActiveRoom;
}

export default function TimerControls({ room, activeRoom }: TimerControlsProps) {
  const { timeRemaining, isRunning } = useTimer({
    timerStarted: activeRoom.timerStarted,
    timerDuration: room.timerDuration,
    timerPaused: activeRoom.timerPaused,
  });

  const handleStart = async () => {
    await startTimer(room.roomNumber);
  };

  const handlePause = async () => {
    await pauseTimer(room.roomNumber);
  };

  const handleResume = async () => {
    await resumeTimer(room.roomNumber);
  };

  const handleReset = async () => {
    if (confirm('Are you sure you want to reset the timer?')) {
      await resetTimer(room.roomNumber);
    }
  };

  const handleManualTTS = async () => {
    await triggerManualTTS(room.roomNumber);
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-secondary mb-6">Timer Controls</h3>

      <div className="mb-6 text-center">
        <p className="text-sm text-primary/70 mb-2">TIME REMAINING</p>
        <p className="text-6xl font-bold text-primary">
          {formatTime(timeRemaining)}
        </p>
        <p className="text-sm text-primary/50 mt-2">
          {isRunning ? (activeRoom.timerPaused ? '⏸ Paused' : '▶ Running') : '⏹ Stopped'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {!activeRoom.timerStarted ? (
          <Button
            variant="success"
            size="md"
            onClick={handleStart}
            className="col-span-2"
          >
            ▶ Start Timer
          </Button>
        ) : (
          <>
            {activeRoom.timerPaused ? (
              <Button variant="success" size="md" onClick={handleResume}>
                ▶ Resume
              </Button>
            ) : (
              <Button variant="secondary" size="md" onClick={handlePause}>
                ⏸ Pause
              </Button>
            )}
            <Button variant="danger" size="md" onClick={handleReset}>
              ⏹ Reset
            </Button>
          </>
        )}

        <Button
          variant="secondary"
          size="md"
          onClick={handleManualTTS}
          className="col-span-2"
        >
          🔊 Trigger TTS Replay
        </Button>
      </div>
    </div>
  );
}
