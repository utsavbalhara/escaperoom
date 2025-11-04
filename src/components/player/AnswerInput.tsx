'use client';

import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import { isValidCode } from '@/lib/utils';

interface AnswerInputProps {
  attemptsRemaining: number;
  maxAttempts: number;
  onSubmit: (code: string) => void;
  disabled?: boolean;
}

export default function AnswerInput({
  attemptsRemaining,
  maxAttempts,
  onSubmit,
  disabled = false,
}: AnswerInputProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !isValidCode(code)) {
      alert('Please enter a valid numeric code');
      return;
    }
    onSubmit(code);
    setCode('');
  };

  const attemptsUsed = maxAttempts - attemptsRemaining;
  const isLowAttempts = attemptsRemaining <= 2;

  return (
    <div className="card mb-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-secondary">ENTER CODE:</h3>
          <span
            className={`text-lg font-bold ${
              isLowAttempts ? 'text-danger animate-pulse' : 'text-primary'
            }`}
          >
            Attempts: {attemptsRemaining}/{maxAttempts}
          </span>
        </div>

        {/* Attempt Indicators */}
        <div className="flex gap-2 mb-4">
          {Array.from({ length: maxAttempts }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded ${
                i < attemptsUsed
                  ? 'bg-danger'
                  : 'bg-primary'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter numeric code..."
          className="flex-1 text-2xl text-center font-bold tracking-wider"
          disabled={disabled || attemptsRemaining === 0}
          autoFocus
        />
        <Button
          type="submit"
          variant="success"
          size="lg"
          disabled={disabled || !code || attemptsRemaining === 0}
        >
          SUBMIT
        </Button>
      </form>

      {attemptsRemaining === 0 && (
        <p className="mt-4 text-center text-danger font-bold animate-pulse">
          No attempts remaining!
        </p>
      )}
    </div>
  );
}
