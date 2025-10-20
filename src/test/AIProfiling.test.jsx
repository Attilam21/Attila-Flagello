import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { aiProfilingService } from '../services/aiProfilingService';
import PlayerAnalysis from '../components/PlayerAnalysis';
import TeamAnalysis from '../components/TeamAnalysis';

describe('AI Profiling Service', () => {
  const mockPlayer = {
    id: 'player-1',
    name: 'Messi',
    position: 'RW',
    build: 'Finalizzatore',
    boosters: [
      { type: 'Tiro', value: 2 },
      { type: 'Dribbling', value: 1 },
    ],
    skills: ['Dribbling avanzato', 'Tiri a giro', 'Passaggio filtrante'],
    stats: {
      shooting: 95,
      passing: 88,
      dribbling: 92,
      defending: 45,
      physical: 78,
      speed: 89,
    },
  };

  const mockTeamContext = {
    players: [mockPlayer],
    formation: '4-3-3',
    tactics: 'Possesso palla',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should profile a player correctly', () => {
    const analysis = aiProfilingService.profilePlayer(
      mockPlayer,
      'RW',
      mockTeamContext
    );

    expect(analysis).toBeDefined();
    expect(analysis.player).toBe(mockPlayer);
    expect(analysis.assignedPosition).toBe('RW');
    expect(analysis.naturalPosition).toBe('RW');
    expect(analysis.overallRating).toBeGreaterThan(0);
    expect(analysis.overallRating).toBeLessThanOrEqual(100);
  });

  it('should analyze role compatibility', () => {
    const analysis = aiProfilingService.profilePlayer(
      mockPlayer,
      'RW',
      mockTeamContext
    );

    expect(analysis.roleCompatibility).toBeDefined();
    expect(analysis.roleCompatibility.compatibility).toBeGreaterThan(0);
    expect(analysis.roleCompatibility.compatibility).toBeLessThanOrEqual(100);
  });

  it('should analyze build compatibility', () => {
    const analysis = aiProfilingService.profilePlayer(
      mockPlayer,
      'RW',
      mockTeamContext
    );

    expect(analysis.buildAnalysis).toBeDefined();
    expect(analysis.buildAnalysis.compatibility).toBeGreaterThan(0);
    expect(analysis.buildAnalysis.compatibility).toBeLessThanOrEqual(100);
  });

  it('should analyze booster efficiency', () => {
    const analysis = aiProfilingService.profilePlayer(
      mockPlayer,
      'RW',
      mockTeamContext
    );

    expect(analysis.boosterAnalysis).toBeDefined();
    expect(analysis.boosterAnalysis.efficiency).toBeGreaterThan(0);
    expect(analysis.boosterAnalysis.efficiency).toBeLessThanOrEqual(100);
  });

  it('should analyze skills utilization', () => {
    const analysis = aiProfilingService.profilePlayer(
      mockPlayer,
      'RW',
      mockTeamContext
    );

    expect(analysis.skillsAnalysis).toBeDefined();
    expect(analysis.skillsAnalysis.utilization).toBeGreaterThan(0);
    expect(analysis.skillsAnalysis.utilization).toBeLessThanOrEqual(100);
  });

  it('should generate suggestions', () => {
    const analysis = aiProfilingService.profilePlayer(
      mockPlayer,
      'RW',
      mockTeamContext
    );

    expect(analysis.suggestions).toBeDefined();
    expect(Array.isArray(analysis.suggestions)).toBe(true);
  });

  it('should handle out-of-position players', () => {
    const analysis = aiProfilingService.profilePlayer(
      mockPlayer,
      'CB',
      mockTeamContext
    );

    expect(analysis.roleCompatibility.penalty).toBeGreaterThan(0);
    expect(analysis.suggestions.some(s => s.type === 'warning')).toBe(true);
  });

  it('should handle incompatible builds', () => {
    const defenderPlayer = { ...mockPlayer, build: 'Difensore' };
    const analysis = aiProfilingService.profilePlayer(
      defenderPlayer,
      'RW',
      mockTeamContext
    );

    expect(analysis.buildAnalysis.penalty).toBeGreaterThan(0);
  });

  it('should handle inefficient boosters', () => {
    const playerWithBadBoosters = {
      ...mockPlayer,
      boosters: [
        { type: 'Difesa', value: 2 },
        { type: 'Fisico', value: 1 },
      ],
    };
    const analysis = aiProfilingService.profilePlayer(
      playerWithBadBoosters,
      'RW',
      mockTeamContext
    );

    expect(analysis.boosterAnalysis.waste).toBeGreaterThan(0);
  });
});

describe('PlayerAnalysis Component', () => {
  const mockAnalysis = {
    player: { name: 'Messi', position: 'RW' },
    assignedPosition: 'RW',
    naturalPosition: 'RW',
    roleCompatibility: {
      compatibility: 100,
      penalty: 0,
      reason: 'Ruolo naturale',
    },
    buildAnalysis: { compatibility: 90, penalty: 0, reason: 'Build ottimale' },
    boosterAnalysis: {
      efficiency: 85,
      waste: 0,
      suggestions: ['Booster ottimale'],
    },
    skillsAnalysis: {
      utilization: 90,
      unused: 0,
      suggestions: ['Abilità ben utilizzate'],
    },
    teamSynergy: {
      synergy: 80,
      connections: 2,
      suggestions: ['Buone sinergie'],
    },
    overallRating: 88,
    suggestions: [
      {
        type: 'suggestion',
        priority: 'medium',
        message: 'Ottima performance',
        action: 'Continua così',
      },
    ],
  };

  it('should render player analysis', () => {
    render(<PlayerAnalysis analysis={mockAnalysis} />);

    expect(screen.getByText('Messi')).toBeInTheDocument();
    expect(screen.getByText('88/100')).toBeInTheDocument();
    expect(screen.getByText('🎯 Compatibilità Ruolo')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Analisi Build')).toBeInTheDocument();
  });

  it('should show expandable sections', () => {
    render(<PlayerAnalysis analysis={mockAnalysis} />);

    expect(screen.getByText('🎯 Compatibilità Ruolo')).toBeInTheDocument();
    expect(screen.getByText('⚙️ Analisi Build')).toBeInTheDocument();
    expect(screen.getByText('🚀 Efficienza Booster')).toBeInTheDocument();
  });

  it('should display suggestions', () => {
    render(<PlayerAnalysis analysis={mockAnalysis} />);

    expect(screen.getByText('💡 Suggerimenti AI')).toBeInTheDocument();
  });
});

describe('TeamAnalysis Component', () => {
  const mockPlayers = [
    {
      id: 'player-1',
      name: 'Messi',
      position: 'RW',
      assignedPosition: 'RW',
      build: 'Finalizzatore',
      boosters: [{ type: 'Tiro', value: 2 }],
      skills: ['Dribbling avanzato', 'Tiri a giro'],
    },
    {
      id: 'player-2',
      name: 'Neymar',
      position: 'LW',
      assignedPosition: 'LW',
      build: 'Trequartista',
      boosters: [{ type: 'Dribbling', value: 1 }],
      skills: ['Dribbling avanzato', 'Passaggio filtrante'],
    },
  ];

  it('should render team analysis', () => {
    render(<TeamAnalysis players={mockPlayers} formation="4-3-3" />);

    expect(screen.getByText('🧠 Analisi AI Squadra')).toBeInTheDocument();
    expect(screen.getByText(/Formazione.*4-3-3/)).toBeInTheDocument();
  });

  it('should show team statistics', async () => {
    render(<TeamAnalysis players={mockPlayers} formation="4-3-3" />);

    await waitFor(() => {
      expect(screen.getByText('Rating Medio')).toBeInTheDocument();
      expect(screen.getByText('Compatibilità Ruoli')).toBeInTheDocument();
      expect(screen.getByText('Efficienza Build')).toBeInTheDocument();
      expect(screen.getByText('Sinergie Squadra')).toBeInTheDocument();
    });
  });

  it('should display player analyses', async () => {
    render(<TeamAnalysis players={mockPlayers} formation="4-3-3" />);

    await waitFor(() => {
      expect(screen.getByText('Messi')).toBeInTheDocument();
      expect(screen.getByText('Neymar')).toBeInTheDocument();
    });
  });
});
