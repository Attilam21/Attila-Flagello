import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MatchOCR from '../pages/MatchOCR';
import { advancedOCRService } from '../services/advancedOCRService';

// Mock Firebase
vi.mock('../services/firebaseClient', () => ({
  uploadMatchImage: vi.fn(() => Promise.resolve('mock-download-url')),
  listenToOCRResults: vi.fn(() => () => {}),
  listenToMatchStatus: vi.fn(() => () => {})
}));

// Mock advanced OCR service
vi.mock('../services/advancedOCRService', () => ({
  advancedOCRService: {
    processImageWithTesseract: vi.fn(() => Promise.resolve({
      type: 'formation_2d',
      formation: '4-3-3',
      players: [
        { name: 'Messi', position: 'RW', role: 'Ala Destra' },
        { name: 'Neymar', position: 'LW', role: 'Ala Sinistra' },
        { name: 'Mbappé', position: 'ST', role: 'Attaccante' }
      ],
      rawText: 'Formation 2D simulation',
      confidence: 0.90
    })),
    detectImageType: vi.fn(() => Promise.resolve('formation_2d'))
  }
}));

describe('Advanced OCR Integration', () => {
  const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render MatchOCR component with advanced OCR', () => {
    render(<MatchOCR user={mockUser} />);
    
    expect(screen.getByText('📸 Carica Screenshot Tabellino')).toBeInTheDocument();
    expect(screen.getByText('Seleziona un\'immagine (JPG, PNG)')).toBeInTheDocument();
  });

  it('should handle file selection', () => {
    render(<MatchOCR user={mockUser} />);
    
    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(fileInput.files[0]).toBe(file);
  });

  it('should process image with advanced OCR service', async () => {
    render(<MatchOCR user={mockUser} />);
    
    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const analyzeButton = screen.getByText('🔍 Analizza Immagine');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(advancedOCRService.processImageWithTesseract).toHaveBeenCalledWith(file);
    });
  });

  it('should display formation 2D results', async () => {
    render(<MatchOCR user={mockUser} />);
    
    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const analyzeButton = screen.getByText('🔍 Analizza Immagine');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Formazione 2D')).toBeInTheDocument();
      expect(screen.getByText('4-3-3')).toBeInTheDocument();
      expect(screen.getByText('Messi')).toBeInTheDocument();
    });
  });

  it('should handle OCR errors gracefully', async () => {
    advancedOCRService.processImageWithTesseract.mockRejectedValueOnce(new Error('OCR failed'));
    
    render(<MatchOCR user={mockUser} />);
    
    const fileInput = screen.getByDisplayValue('');
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const analyzeButton = screen.getByText('🔍 Analizza Immagine');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Errore durante l\'elaborazione OCR')).toBeInTheDocument();
    });
  });

  it('should show emergency fallback button', () => {
    render(<MatchOCR user={mockUser} />);
    
    expect(screen.getByText('🚨 Usa Dati di Esempio (Bypass OCR)')).toBeInTheDocument();
  });

  it('should handle emergency fallback', () => {
    render(<MatchOCR user={mockUser} />);
    
    const emergencyButton = screen.getByText('🚨 Usa Dati di Esempio (Bypass OCR)');
    fireEvent.click(emergencyButton);
    
    expect(screen.getByText('Dati di emergenza caricati (OCR bypassato)')).toBeInTheDocument();
  });
});
