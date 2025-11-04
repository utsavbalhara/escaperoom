'use client';

import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import {
  resetAllTeamData,
  resetAllTeamProgress,
  resetLeaderboard,
  resetAllData,
} from '@/lib/db/reset';

export default function DataResetControls() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetType, setResetType] = useState<'teams' | 'progress' | 'leaderboard' | 'all'>('teams');
  const [confirmText, setConfirmText] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const resetActions = {
    teams: {
      title: 'Reset All Team Data',
      description: 'This will permanently delete ALL teams, their progress, and clear active rooms. This cannot be undone!',
      confirmWord: 'DELETE TEAMS',
      action: resetAllTeamData,
      buttonClass: 'bg-red-600 hover:bg-red-700',
    },
    progress: {
      title: 'Reset Team Progress',
      description: 'This will reset all team progress to the beginning while keeping team accounts. Teams will start from Room 1.',
      confirmWord: 'RESET PROGRESS',
      action: resetAllTeamProgress,
      buttonClass: 'bg-orange-600 hover:bg-orange-700',
    },
    leaderboard: {
      title: 'Reset Leaderboard',
      description: 'This will clear all leaderboard data. Teams and progress will remain intact.',
      confirmWord: 'RESET LEADERBOARD',
      action: resetLeaderboard,
      buttonClass: 'bg-yellow-600 hover:bg-yellow-700',
    },
    all: {
      title: 'Reset Everything',
      description: 'This is the nuclear option. It will delete ALL data: teams, progress, and leaderboard. This CANNOT be undone!',
      confirmWord: 'DELETE EVERYTHING',
      action: resetAllData,
      buttonClass: 'bg-red-900 hover:bg-red-950',
    },
  };

  const handleResetClick = (type: typeof resetType) => {
    setResetType(type);
    setConfirmText('');
    setShowConfirm(true);
  };

  const handleConfirmReset = async () => {
    const action = resetActions[resetType];

    if (confirmText !== action.confirmWord) {
      alert('Confirmation text does not match!');
      return;
    }

    setIsResetting(true);
    try {
      await action.action();
      alert('Reset completed successfully!');
      setShowConfirm(false);
      setConfirmText('');
      window.location.reload(); // Reload to reflect changes
    } catch (error) {
      console.error('Reset error:', error);
      alert('Error during reset. Check console for details.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setConfirmText('');
  };

  const currentAction = resetActions[resetType];

  return (
    <>
      <div className="card">
        <h2 className="text-2xl font-bold mb-4 text-secondary">
          ⚠️ Data Reset Controls
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-dark/30 rounded border border-primary/20">
            <div>
              <h3 className="font-bold">Reset Team Progress</h3>
              <p className="text-sm text-primary/70">Clear progress, keep teams</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleResetClick('progress')}
            >
              Reset Progress
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-dark/30 rounded border border-primary/20">
            <div>
              <h3 className="font-bold">Reset Leaderboard</h3>
              <p className="text-sm text-primary/70">Clear leaderboard only</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleResetClick('leaderboard')}
            >
              Reset Leaderboard
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-900/20 rounded border border-red-600/30">
            <div>
              <h3 className="font-bold text-red-400">Delete All Teams</h3>
              <p className="text-sm text-primary/70">Delete everything team-related</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleResetClick('teams')}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Teams
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-950/40 rounded border border-red-700/50">
            <div>
              <h3 className="font-bold text-red-500">Reset Everything</h3>
              <p className="text-sm text-red-400/80">Nuclear option - wipes all data</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleResetClick('all')}
              className="bg-red-900 hover:bg-red-950"
            >
              Reset All
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-lg w-full border-2 border-red-600">
            <h2 className="text-2xl font-bold mb-4 text-red-500">
              {currentAction.title}
            </h2>

            <div className="mb-6">
              <p className="text-primary/90 mb-4">{currentAction.description}</p>
              <p className="text-sm text-red-400 mb-2">
                To confirm, please type: <span className="font-bold">{currentAction.confirmWord}</span>
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type "${currentAction.confirmWord}" to confirm`}
                className="w-full bg-dark border border-red-600/50 rounded px-4 py-2 text-primary"
                disabled={isResetting}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={isResetting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmReset}
                disabled={isResetting || confirmText !== currentAction.confirmWord}
                className={`flex-1 ${currentAction.buttonClass}`}
              >
                {isResetting ? 'Processing...' : 'Confirm Reset'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
