'use client';

import React, { useState, useEffect } from 'react';
import { Room } from '@/types';
import Button from '@/components/shared/Button';
import { updateRoomContent } from '@/lib/db/rooms';

interface ContentEditorProps {
  room: Room;
}

export default function ContentEditor({ room }: ContentEditorProps) {
  const [formData, setFormData] = useState({
    questionText: room.questionText,
    ttsText: room.ttsText,
    correctCode: room.correctCode,
    hintText: room.hintText,
    timerDuration: room.timerDuration,
    maxAttempts: room.maxAttempts,
    levelUpMessage: room.levelUpMessage,
    gameOverMessage: room.gameOverMessage,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData({
      questionText: room.questionText,
      ttsText: room.ttsText,
      correctCode: room.correctCode,
      hintText: room.hintText,
      timerDuration: room.timerDuration,
      maxAttempts: room.maxAttempts,
      levelUpMessage: room.levelUpMessage,
      gameOverMessage: room.gameOverMessage,
    });
  }, [room]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'timerDuration' || name === 'maxAttempts'
        ? parseInt(value) || 0
        : value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRoomContent(room.roomNumber, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-secondary mb-6">Content Editor</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="questionText">Question Text:</label>
          <textarea
            id="questionText"
            name="questionText"
            value={formData.questionText}
            onChange={handleChange}
            rows={3}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="ttsText">TTS Text (Voice):</label>
          <textarea
            id="ttsText"
            name="ttsText"
            value={formData.ttsText}
            onChange={handleChange}
            rows={3}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="correctCode">Correct Code:</label>
            <input
              id="correctCode"
              name="correctCode"
              type="text"
              value={formData.correctCode}
              onChange={handleChange}
              className="w-full font-bold text-2xl text-center"
            />
          </div>

          <div>
            <label htmlFor="maxAttempts">Max Attempts:</label>
            <input
              id="maxAttempts"
              name="maxAttempts"
              type="number"
              value={formData.maxAttempts}
              onChange={handleChange}
              className="w-full text-center"
              min="1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="hintText">Hint Text:</label>
          <textarea
            id="hintText"
            name="hintText"
            value={formData.hintText}
            onChange={handleChange}
            rows={2}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="timerDuration">Timer Duration (seconds):</label>
          <input
            id="timerDuration"
            name="timerDuration"
            type="number"
            value={formData.timerDuration}
            onChange={handleChange}
            className="w-full text-center"
            min="0"
          />
        </div>

        <div>
          <label htmlFor="levelUpMessage">Level Up Message:</label>
          <textarea
            id="levelUpMessage"
            name="levelUpMessage"
            value={formData.levelUpMessage}
            onChange={handleChange}
            rows={2}
            className="w-full"
          />
        </div>

        <div>
          <label htmlFor="gameOverMessage">Game Over Message:</label>
          <textarea
            id="gameOverMessage"
            name="gameOverMessage"
            value={formData.gameOverMessage}
            onChange={handleChange}
            rows={2}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <Button
            variant="success"
            size="lg"
            onClick={handleSave}
            disabled={saving}
            className="flex-1"
          >
            {saving ? 'Saving...' : saved ? '✓ Saved!' : '💾 Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
