'use client';

import React, { useState } from 'react';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import { initializeDatabase } from '@/lib/db/init';
import Link from 'next/link';

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleInitialize = async () => {
    setStatus('loading');
    setMessage('Initializing database...');

    const result = await initializeDatabase();

    if (result.success) {
      setStatus('success');
      setMessage(result.message);
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="card">
          <div className="text-center mb-8">
            <RoboticText size="2xl" glow className="mb-4">
              <h1 className="text-5xl font-bold">DATABASE SETUP</h1>
            </RoboticText>
            <p className="text-primary/70 text-lg">
              Initialize Firebase Firestore with default data
            </p>
          </div>

          {status === 'idle' && (
            <div>
              <div className="card bg-primary/10 border-primary mb-6">
                <h3 className="text-xl font-bold text-secondary mb-3">
                  ⚠️ Before you begin:
                </h3>
                <ul className="space-y-2 text-primary/80">
                  <li>✓ Make sure you have configured Firebase in .env.local</li>
                  <li>✓ Ensure you have created a Firestore database in your Firebase project</li>
                  <li>✓ This will create 6 rooms and active room records</li>
                  <li>✓ You can run this multiple times to reset data</li>
                </ul>
              </div>

              <Button
                variant="success"
                size="lg"
                onClick={handleInitialize}
                className="w-full text-2xl"
              >
                🚀 Initialize Database
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <RoboticText size="lg" className="animate-pulse">
                {message}
              </RoboticText>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="text-8xl mb-6">✅</div>
              <RoboticText size="xl" glow className="mb-4 text-green-400">
                <h2 className="text-4xl font-bold">SUCCESS!</h2>
              </RoboticText>
              <p className="text-xl text-primary mb-8">{message}</p>

              <div className="space-y-4">
                <div className="card bg-green-400/10 border-green-400">
                  <h3 className="text-lg font-bold text-green-400 mb-2">
                    ✓ Database Initialized
                  </h3>
                  <p className="text-sm text-primary/70">
                    6 rooms and active room records have been created
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link href="/">
                    <Button variant="primary" size="lg">
                      🏠 Go to Home
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="secondary" size="lg">
                      ⚙️ Admin Panel
                    </Button>
                  </Link>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setStatus('idle')}
                  className="mt-4"
                >
                  Run Again
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="text-8xl mb-6">❌</div>
              <RoboticText size="xl" className="mb-4 text-danger">
                <h2 className="text-4xl font-bold">ERROR</h2>
              </RoboticText>
              <p className="text-lg text-danger mb-8">{message}</p>

              <div className="card bg-danger/10 border-danger mb-6">
                <h3 className="text-lg font-bold text-danger mb-2">
                  Troubleshooting:
                </h3>
                <ul className="space-y-2 text-sm text-primary/70 text-left">
                  <li>• Check your Firebase configuration in .env.local</li>
                  <li>• Make sure Firestore is enabled in your Firebase project</li>
                  <li>• Check the browser console for detailed error messages</li>
                  <li>• Verify your Firestore security rules allow writes</li>
                </ul>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={() => setStatus('idle')}
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
