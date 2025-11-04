'use client';

import React, { useState } from 'react';
import LoginForm from '@/components/admin/LoginForm';
import GlobalDashboard from '@/components/admin/GlobalDashboard';
import RoomController from '@/components/admin/RoomController';
import TeamManager from '@/components/admin/TeamManager';
import DataResetControls from '@/components/admin/DataResetControls';
import LeaderboardEditor from '@/components/admin/LeaderboardEditor';
import RoomNameEditor from '@/components/admin/RoomNameEditor';
import Button from '@/components/shared/Button';
import Link from 'next/link';

type AdminView = 'dashboard' | 'room' | 'teams' | 'leaderboard' | 'rooms' | 'settings';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setIsLoggedIn(false);
      setCurrentView('dashboard');
      setSelectedRoom(null);
    }
  };

  const handleSelectRoom = (roomNumber: number) => {
    setSelectedRoom(roomNumber);
    setCurrentView('room');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedRoom(null);
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <div className="mb-8 flex items-center justify-between border-b-2 border-primary pb-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="secondary" size="sm">
                🏠 Home
              </Button>
            </Link>

            <div className="flex gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'primary' : 'secondary'}
                size="sm"
                onClick={handleBackToDashboard}
              >
                Dashboard
              </Button>
              <Button
                variant={currentView === 'teams' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentView('teams')}
              >
                Teams
              </Button>
              <Button
                variant={currentView === 'leaderboard' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentView('leaderboard')}
              >
                Leaderboard
              </Button>
              <Button
                variant={currentView === 'rooms' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentView('rooms')}
              >
                Rooms
              </Button>
              <Button
                variant={currentView === 'settings' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentView('settings')}
              >
                Settings
              </Button>
            </div>
          </div>

          <Button variant="danger" size="sm" onClick={handleLogout}>
            🔒 Logout
          </Button>
        </div>

        {/* Main Content */}
        {currentView === 'dashboard' && (
          <GlobalDashboard onSelectRoom={handleSelectRoom} />
        )}

        {currentView === 'room' && selectedRoom && (
          <RoomController
            roomNumber={selectedRoom}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'teams' && <TeamManager />}

        {currentView === 'leaderboard' && <LeaderboardEditor />}

        {currentView === 'rooms' && <RoomNameEditor />}

        {currentView === 'settings' && <DataResetControls />}
      </div>
    </div>
  );
}
