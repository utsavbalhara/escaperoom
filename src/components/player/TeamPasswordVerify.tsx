'use client';

import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';

interface TeamPasswordVerifyProps {
  teamName: string;
  onVerify: (password: string) => Promise<boolean>;
  onCancel: () => void;
}

export default function TeamPasswordVerify({
  teamName,
  onVerify,
  onCancel,
}: TeamPasswordVerifyProps) {
  const [password, setPassword] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length !== 4) {
      setError('Password must be 4 digits');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const isValid = await onVerify(password);
      if (!isValid) {
        setError('Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    // Only allow digits and max 4 characters
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setPassword(cleaned);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-dark/95 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full border-2 border-secondary animate-fadeIn">
        <RoboticText size="2xl" glow className="mb-6 text-center">
          <h2 className="text-3xl font-bold">Team Authentication</h2>
        </RoboticText>

        <div className="mb-6 text-center">
          <p className="text-xl text-secondary mb-2">Team: {teamName}</p>
          <p className="text-sm text-primary/70">
            Enter your 4-digit team password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm text-primary/70 mb-2">
              Team Password
            </label>
            <input
              id="password"
              type="password"
              inputMode="numeric"
              pattern="\d*"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="••••"
              className="w-full text-center text-4xl font-mono tracking-widest"
              maxLength={4}
              autoFocus
              disabled={verifying}
            />
            {error && (
              <p className="text-danger text-sm mt-2 animate-flash">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '✓'].map((num) => (
              <button
                key={num}
                type={num === '✓' ? 'submit' : 'button'}
                onClick={() => {
                  if (num === '←') {
                    setPassword(password.slice(0, -1));
                  } else if (num !== '✓' && password.length < 4) {
                    setPassword(password + num.toString());
                  }
                }}
                className={`p-4 text-xl font-bold rounded border-2 transition-all ${
                  num === '✓'
                    ? 'bg-secondary/20 border-secondary text-secondary hover:bg-secondary/30'
                    : num === '←'
                    ? 'bg-danger/20 border-danger text-danger hover:bg-danger/30'
                    : 'bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary'
                }`}
                disabled={verifying || (num === '✓' && password.length !== 4)}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onCancel}
              disabled={verifying}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="success"
              size="lg"
              disabled={password.length !== 4 || verifying}
              className="flex-1"
            >
              {verifying ? 'Verifying...' : 'Continue'}
            </Button>
          </div>
        </form>

        <p className="text-xs text-primary/50 text-center mt-4">
          🔒 Password was provided by the event operator
        </p>
      </div>
    </div>
  );
}
