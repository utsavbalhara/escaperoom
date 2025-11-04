'use client';

import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import { validateAdminPassword } from '@/lib/utils';

interface LoginFormProps {
  onLogin: () => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateAdminPassword(password)) {
      onLogin();
    } else {
      setError('Invalid password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <RoboticText size="2xl" glow className="mb-2">
            <h1 className="text-4xl font-bold">ADMIN PANEL</h1>
          </RoboticText>
          <p className="text-primary/70">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password..."
              className="w-full"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-danger text-center mb-4 animate-pulse font-bold">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!password}
          >
            🔐 LOGIN
          </Button>
        </form>

        <p className="text-center text-primary/50 text-sm mt-6">
          Password hint: Check .env.local file
        </p>
      </div>
    </div>
  );
}
