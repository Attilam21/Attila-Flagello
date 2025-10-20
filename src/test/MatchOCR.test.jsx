import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MatchOCR from '../pages/MatchOCR';

// Mock Firebase
vi.mock('../services/firebaseClient', () => ({
  uploadMatchImage: vi.fn().mockResolvedValue('https://example.com/image.jpg'),
  listenToOCRResults: vi.fn().mockReturnValue(() => {}),
  listenToMatchStatus: vi.fn().mockReturnValue(() => {}),
  listenToMatchHistory: vi.fn().mockReturnValue(() => {}),
  saveMatchStats: vi.fn().mockResolvedValue(),
}));

// Mock OCR Service
vi.mock('../services/ocrService', () => ({
  ocrService: {
    processImage: vi.fn().mockResolvedValue({
      name: 'Test Player',
      rating: 95,
      position: 'DC',
    }),
  },
}));

describe('MatchOCR', () => {
  const mockUser = { uid: 'test123', email: 'test@example.com' };

  it('renders upload form correctly', () => {
    render(<MatchOCR user={mockUser} />);

    expect(
      screen.getByText('📸 Carica Statistica Partita')
    ).toBeInTheDocument();
    expect(
      screen.getAllByText('Modalità Manuale: OFF')[0]
    ).toBeInTheDocument();
  });

  it('displays manual input section', () => {
    render(<MatchOCR user={mockUser} />);

    expect(
      screen.getAllByText('Modalità Manuale: OFF')[0]
    ).toBeInTheDocument();
  });
});
