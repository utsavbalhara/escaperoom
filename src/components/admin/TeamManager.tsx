'use client';

import React, { useState } from 'react';
import { useRealtimeAllTeams } from '@/hooks/useRealtimeTeam';
import Button from '@/components/shared/Button';
import RoboticText from '@/components/shared/RoboticText';
import { createTeam, deleteTeam, updateTeamStatus } from '@/lib/db/teams';
import { Team, TeamStatus } from '@/types';

export default function TeamManager() {
  const { teams, loading } = useRealtimeAllTeams();
  const [newTeamName, setNewTeamName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    setCreating(true);
    try {
      await createTeam(newTeamName.trim());
      setNewTeamName('');
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

  return (
    <div className="card">
      <RoboticText size="xl" glow className="mb-6">
        <h3 className="text-2xl font-bold">Team Management</h3>
      </RoboticText>

      {/* Create Team Form */}
      <form onSubmit={handleCreateTeam} className="mb-6">
        <label htmlFor="teamName">Create New Team:</label>
        <div className="flex gap-3">
          <input
            id="teamName"
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Enter team name..."
            className="flex-1"
            disabled={creating}
          />
          <Button
            type="submit"
            variant="success"
            size="md"
            disabled={!newTeamName.trim() || creating}
          >
            {creating ? 'Creating...' : '+ Create'}
          </Button>
        </div>
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
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
