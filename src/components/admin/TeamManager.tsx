'use client';

import React, { useState } from 'react';
import { useRealtimeAllTeams } from '@/hooks/useRealtimeTeam';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import TeamProgressHistory from './TeamProgressHistory';
import AdvancedTeamControls from './AdvancedTeamControls';
import { createTeam, deleteTeam, updateTeamStatus } from '@/lib/db/teams';
import { Team, TeamStatus } from '@/types';

export default function TeamManager() {
  const { teams, loading } = useRealtimeAllTeams();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamPassword, setNewTeamPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<Team | null>(null);
  const [expandedTeamId, setExpandedTeamId] = useState<string | null>(null);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      alert('Please enter a team name');
      return;
    }
    if (!newTeamPassword.trim()) {
      alert('Please enter a 4-digit password');
      return;
    }
    if (!/^\d{4}$/.test(newTeamPassword.trim())) {
      alert('Password must be exactly 4 digits');
      return;
    }

    setCreating(true);
    try {
      await createTeam(newTeamName.trim(), newTeamPassword.trim());
      setNewTeamName('');
      setNewTeamPassword('');
      alert(`Team created! Password: ${newTeamPassword.trim()} (Share this with the team)`);
    } catch (error) {
      console.error('Error creating team:', error);
      alert('Error creating team');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (confirm(`Are you sure you want to delete team "${teamName}"?`)) {
      try {
        await deleteTeam(teamId);
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Error deleting team');
      }
    }
  };

  const handleChangeStatus = async (teamId: string, newStatus: TeamStatus) => {
    try {
      await updateTeamStatus(teamId, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating team status');
    }
  };

  const getStatusColor = (status: TeamStatus) => {
    switch (status) {
      case 'active':
        return 'text-secondary';
      case 'waiting':
        return 'text-primary';
      case 'eliminated':
        return 'text-danger';
      case 'completed':
        return 'text-green-400';
      default:
        return 'text-primary/50';
    }
  };

  const getStatusBadge = (status: TeamStatus) => {
    switch (status) {
      case 'active':
        return 'bg-secondary/20 text-secondary';
      case 'waiting':
        return 'bg-primary/20 text-primary';
      case 'eliminated':
        return 'bg-danger/20 text-danger';
      case 'completed':
        return 'bg-green-400/20 text-green-400';
      default:
        return 'bg-primary/10 text-primary/50';
    }
  };

  if (loading) {
    return (
      <div className="card">
        <p className="text-center text-primary/70">Loading teams...</p>
      </div>
    );
  }

  // If viewing history, show history component
  if (viewingHistory) {
    return (
      <div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setViewingHistory(null)}
          className="mb-4"
        >
          ← Back to Teams
        </Button>
        <TeamProgressHistory
          teamId={viewingHistory.id}
          teamName={viewingHistory.name}
        />
      </div>
    );
  }

  return (
    <div className="card">
      <RoboticText size="xl" glow className="mb-6">
        <h3 className="text-2xl font-bold">Team Management</h3>
      </RoboticText>

      {/* Create Team Form */}
      <form onSubmit={handleCreateTeam} className="mb-6">
        <label className="block mb-2">Create New Team:</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="teamName" className="text-sm text-primary/70">
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Enter team name..."
              className="w-full"
              disabled={creating}
            />
          </div>
          <div>
            <label htmlFor="teamPassword" className="text-sm text-primary/70">
              4-Digit Password
            </label>
            <input
              id="teamPassword"
              type="text"
              value={newTeamPassword}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                setNewTeamPassword(val);
              }}
              placeholder="0000"
              maxLength={4}
              className="w-full font-mono text-xl"
              disabled={creating}
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="success"
          size="md"
          disabled={!newTeamName.trim() || newTeamPassword.length !== 4 || creating}
          className="w-full"
        >
          {creating ? 'Creating...' : '+ Create Team'}
        </Button>
        <p className="text-xs text-primary/50 mt-2">
          💡 The 4-digit password will be shared with the team for login.
        </p>
      </form>

      {/* Teams List */}
      <div>
        <h4 className="font-bold text-lg text-primary mb-3">
          All Teams ({teams.length})
        </h4>

        {teams.length === 0 ? (
          <p className="text-center text-primary/50 py-8">
            No teams created yet. Create one above.
          </p>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {teams.map((team) => (
              <div
                key={team.id}
                className="card bg-dark/50 border-primary/30 hover:border-primary transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-lg font-bold">{team.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className={getStatusColor(team.status)}>
                        Status: {team.status.toUpperCase()}
                      </span>
                      <span className="text-primary/50">
                        Room: {team.currentRoom}
                      </span>
                      <span className="text-secondary font-mono">
                        🔒 {team.password}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={team.status}
                      onChange={(e) =>
                        handleChangeStatus(team.id, e.target.value as TeamStatus)
                      }
                      className="text-sm py-1 px-2"
                    >
                      <option value="waiting">Waiting</option>
                      <option value="active">Active</option>
                      <option value="eliminated">Eliminated</option>
                      <option value="completed">Completed</option>
                    </select>

                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
                    >
                      {expandedTeamId === team.id ? 'Hide' : 'Controls'}
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setViewingHistory(team)}
                    >
                      History
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Advanced Controls - Expandable */}
                {expandedTeamId === team.id && (
                  <div className="mt-3 pt-3 border-t-2 border-primary/20">
                    <AdvancedTeamControls team={team} onUpdate={() => {}} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
