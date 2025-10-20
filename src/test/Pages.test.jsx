import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Rosa from '../pages/Rosa';
import Match from '../pages/Match';
import MatchOCR from '../pages/MatchOCR';
import Statistiche from '../pages/Statistiche';
import Avversario from '../pages/Avversario';

// Mock Firebase
vi.mock('../services/firebaseClient', () => ({
  auth: { currentUser: null },
  listenToOCRResults: vi.fn().mockReturnValue(() => {}),
  listenToMatchStatus: vi.fn().mockReturnValue(() => {}),
  listenToMatchHistory: vi.fn().mockReturnValue(() => {}),
  uploadMatchImage: vi.fn().mockResolvedValue('https://example.com/image.jpg'),
  saveMatchStats: vi.fn().mockResolvedValue(),
}));

vi.mock('../services/ocrService', () => ({
  ocrService: {
    processImage: vi.fn(),
    detectImageType: vi.fn(),
  },
}));

describe('Pages', () => {
  const mockUser = { uid: 'test123', email: 'test@example.com' };

  it('renders Home page', () => {
    render(<Home user={mockUser} />);
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('renders Dashboard page', () => {
    render(<Dashboard />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders Rosa page', () => {
    render(<Rosa />);
    expect(screen.getByText('Rosa')).toBeInTheDocument();
  });

  it('renders Match page', () => {
    render(<Match />);
    expect(screen.getByText('Match')).toBeInTheDocument();
  });

  it('renders MatchOCR page', () => {
    render(<MatchOCR user={mockUser} />);
    expect(screen.getByText(/carica screenshot/i)).toBeInTheDocument();
  });

  it('renders Statistiche page', () => {
    render(<Statistiche />);
    expect(screen.getByText('Statistiche')).toBeInTheDocument();
  });

  it('renders Avversario page', () => {
    render(<Avversario />);
    expect(screen.getByText('Avversario')).toBeInTheDocument();
  });
});
