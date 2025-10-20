import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MatchOCR from '../pages/MatchOCR';

// Mock Firebase
vi.mock('../services/firebaseClient', () => ({
  uploadMatchImage: vi.fn(() => Promise.resolve('mock-download-url')),
  listenToOCRResults: vi.fn(() => () => {}),
  listenToMatchStatus: vi.fn(() => () => {}),
  listenToMatchHistory: vi.fn(() => () => {}),
  saveMatchStats: vi.fn(() => Promise.resolve()),
}));

// Mock advanced OCR service
vi.mock('../services/advancedOCRService', () => ({
  advancedOCRService: {
    processImageWithGoogleVision: vi.fn(() =>
      Promise.resolve({
        type: 'formation_2d',
        formation: '4-3-3',
        players: [
          { name: 'Messi', position: 'RW', role: 'Ala Destra' },
          { name: 'Neymar', position: 'LW', role: 'Ala Sinistra' },
          { name: 'Mbappé', position: 'ST', role: 'Attaccante' },
        ],
        rawText: 'Formation 2D simulation',
        confidence: 0.9,
      })
    ),
    detectImageType: vi.fn(() => Promise.resolve('formation_2d')),
  },
}));

describe('Advanced OCR Integration', () => {
  const mockUser = { uid: 'test123', email: 'test@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render MatchOCR component', () => {
    render(<MatchOCR user={mockUser} />);
    
    expect(screen.getByText('📸 Carica Screenshot Tabellino')).toBeInTheDocument();
    expect(screen.getByText('✍️ Inserimento Manuale Statistiche Partita')).toBeInTheDocument();
  });

  it('should display upload interface', () => {
    render(<MatchOCR user={mockUser} />);
    
    expect(screen.getByText('📸 Carica Screenshot Tabellino')).toBeInTheDocument();
    expect(screen.getByText('Seleziona un\'immagine (JPG, PNG)')).toBeInTheDocument();
  });
});