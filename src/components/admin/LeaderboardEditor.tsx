'use client';

import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import { LeaderboardEntry } from '@/types';
import { updateLeaderboard } from '@/lib/db/leaderboard';
import { useRealtimeLeaderboard } from '@/hooks/useRealtimeLeaderboard';
import { Timestamp } from 'firebase/firestore';

export default function LeaderboardEditor() {
  const { leaderboard, loading } = useRealtimeLeaderboard();
  const [editingEntry, setEditingEntry] = useState<LeaderboardEntry | null>(null);
  const [formData, setFormData] = useState({
    currentLevel: 1,
    roomsCompleted: 0,
    totalAttempts: 0,
  });

  const handleEdit = (entry: LeaderboardEntry) => {
    setEditingEntry(entry);
    setFormData({
      currentLevel: entry.currentLevel,
      roomsCompleted: entry.roomsCompleted,
      totalAttempts: entry.totalAttempts,
    });
  };

  const handleSave = async () => {
    if (!editingEntry) return;

    try {
      await updateLeaderboard(
        editingEntry.teamId,
        editingEntry.teamName,
        formData.currentLevel,
        formData.roomsCompleted,
        editingEntry.sessionStartTime,
        formData.totalAttempts
      );
      alert('Leaderboard entry updated successfully!');
      setEditingEntry(null);
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      alert('Error updating leaderboard entry. Check console for details.');
    }
  };

  const handleCancel = () => {
    setEditingEntry(null);
  };

  if (loading) {
    return (
      <div className="card">
        <p className="text-primary/70">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2 className="text-2xl font-bold mb-4 text-secondary">
          Leaderboard Editor
        </h2>

        {leaderboard.length === 0 ? (
          <p className="text-primary/70">No leaderboard entries yet.</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.teamId}
                className="flex items-center justify-between p-4 bg-dark/30 rounded border border-primary/20 hover:border-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-xl font-bold w-8">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </span>
                  <div>
                    <p className="font-bold">{entry.teamName}</p>
                    <p className="text-xs text-primary/70">
                      Level {entry.currentLevel} • {entry.roomsCompleted} completed • {entry.totalAttempts} attempts
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(entry)}
                >
                  Edit
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full border-2 border-secondary">
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              Edit Leaderboard Entry
            </h2>

            <div className="mb-6 space-y-4">
              <div>
                <p className="text-lg font-bold mb-2">{editingEntry.teamName}</p>
                <p className="text-xs text-primary/50">Team ID: {editingEntry.teamId}</p>
              </div>

              <div>
                <label className="block text-sm mb-2">Current Level (Room Number)</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={formData.currentLevel}
                  onChange={(e) => setFormData({ ...formData, currentLevel: parseInt(e.target.value) })}
                  className="w-full bg-dark border border-primary/30 rounded px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Rooms Completed</label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={formData.roomsCompleted}
                  onChange={(e) => setFormData({ ...formData, roomsCompleted: parseInt(e.target.value) })}
                  className="w-full bg-dark border border-primary/30 rounded px-4 py-2"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Total Attempts</label>
                <input
                  type="number"
                  min={0}
                  value={formData.totalAttempts}
                  onChange={(e) => setFormData({ ...formData, totalAttempts: parseInt(e.target.value) })}
                  className="w-full bg-dark border border-primary/30 rounded px-4 py-2"
                />
              </div>

              <div className="text-xs text-primary/50 p-3 bg-dark/50 rounded">
                <p>Note: Session start time cannot be edited manually to preserve first-come-first-serve ordering.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                className="flex-1"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
