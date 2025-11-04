'use client';

import React, { useState, useEffect } from 'react';
import Button from '@/components/shared/Button';
import { ROOM_NAMES, TOTAL_ROOMS } from '@/constants';
import { getRoomNames, updateRoomName } from '@/lib/db/config';

export default function RoomNameEditor() {
  const [customNames, setCustomNames] = useState<{ [key: number]: string }>({});
  const [editingRoom, setEditingRoom] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCustomNames();
  }, []);

  const loadCustomNames = async () => {
    try {
      const names = await getRoomNames();
      setCustomNames(names);
    } catch (error) {
      console.error('Error loading room names:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (roomNumber: number) => {
    const currentName = customNames[roomNumber] || ROOM_NAMES[roomNumber] || `Room ${roomNumber}`;
    setEditingRoom(roomNumber);
    setNewName(currentName);
  };

  const handleSave = async () => {
    if (editingRoom === null || !newName.trim()) return;

    setSaving(true);
    try {
      await updateRoomName(editingRoom, newName.trim());
      setCustomNames({ ...customNames, [editingRoom]: newName.trim() });
      alert('Room name updated successfully!');
      setEditingRoom(null);
      setNewName('');
    } catch (error) {
      console.error('Error updating room name:', error);
      alert('Error updating room name. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingRoom(null);
    setNewName('');
  };

  const getRoomDisplayName = (roomNumber: number): string => {
    return customNames[roomNumber] || ROOM_NAMES[roomNumber] || `Room ${roomNumber}`;
  };

  if (loading) {
    return (
      <div className="card">
        <p className="text-primary/70">Loading room names...</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2 className="text-2xl font-bold mb-4 text-secondary">
          Room Name Editor
        </h2>

        <div className="space-y-2">
          {Array.from({ length: TOTAL_ROOMS }, (_, i) => i + 1).map((roomNumber) => (
            <div
              key={roomNumber}
              className="flex items-center justify-between p-4 bg-dark/30 rounded border border-primary/20 hover:border-secondary/40 transition-colors"
            >
              <div>
                <p className="text-sm text-primary/50">Room {roomNumber}</p>
                <p className="font-bold text-lg">{getRoomDisplayName(roomNumber)}</p>
                {customNames[roomNumber] && (
                  <p className="text-xs text-secondary">
                    (Default: {ROOM_NAMES[roomNumber]})
                  </p>
                )}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(roomNumber)}
              >
                Rename
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-dark/50 rounded border border-primary/20">
          <p className="text-xs text-primary/70">
            Note: Custom room names are stored in the database and will override the default names.
            Renaming a room will update it across the entire application.
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {editingRoom !== null && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full border-2 border-secondary">
            <h2 className="text-2xl font-bold mb-4 text-secondary">
              Rename Room {editingRoom}
            </h2>

            <div className="mb-6">
              <p className="text-sm text-primary/70 mb-2">
                Default name: <span className="font-bold">{ROOM_NAMES[editingRoom]}</span>
              </p>

              <label className="block text-sm mb-2 mt-4">New Room Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new room name"
                className="w-full bg-dark border border-primary/30 rounded px-4 py-2"
                disabled={saving}
                maxLength={50}
              />

              <p className="text-xs text-primary/50 mt-2">
                {newName.length}/50 characters
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={saving || !newName.trim()}
                className="flex-1"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
