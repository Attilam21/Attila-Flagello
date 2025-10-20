import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MatchOCR from '../pages/MatchOCR';

// Mock Firebase
vi.mock('../services/firebaseClient', () => ({
  uploadMatchImage: vi.fn().mockResolvedValue('https://example.com/image.jpg'),
  listenToOCRResults: vi.fn().mockReturnValue(() => {}),
  listenToMatchStatus: vi.fn().mockReturnValue(() => {}),
}));

// Mock OCR Service
vi.mock('../services/ocrService', () => ({
  ocrService: {
    processImage: vi.fn().mockResolvedValue({
      name: 'Test Player',
      rating: 95,
      position: 'DC',
    }),
    processImageWithFirebase: vi.fn().mockResolvedValue({
      name: 'Test Player',
      rating: 95,
      position: 'DC',
    }),
    detectImageType: vi.fn().mockResolvedValue('player_profile'),
  },
}));

describe('MatchOCR', () => {
  const mockUser = { uid: 'test123', email: 'test@example.com' };

  it('renders upload form correctly', () => {
    render(<MatchOCR user={mockUser} />);

    expect(
      screen.getByText('📸 Carica Screenshot Tabellino')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /analizza immagine/i })
    ).toBeInTheDocument();
  });

  it('shows file input when user is authenticated', () => {
    render(<MatchOCR user={mockUser} />);

    const fileInput = screen.getByDisplayValue('');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
  });

  it('shows analyze and upload buttons when file is selected', async () => {
    render(<MatchOCR user={mockUser} />);

    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('🔍 Analizza Immagine')).toBeInTheDocument();
      expect(screen.getByText('🚀 Carica su Firebase')).toBeInTheDocument();
    });
  });

  it('disables buttons when processing', async () => {
    render(<MatchOCR user={mockUser} />);

    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const analyzeButton = screen.getByText('🔍 Analizza Immagine');
      const uploadButton = screen.getByText('🚀 Carica su Firebase');

      expect(analyzeButton).not.toBeDisabled();
      expect(uploadButton).not.toBeDisabled();
    });
  });
});
