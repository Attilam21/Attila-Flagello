import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Users, Target, BarChart3, Brain, Camera, X, Play } from 'lucide-react';

const OnboardingGuide = ({ user, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Benvenuto in eFootballLab! 🎮',
      description: 'Il tuo assistente AI per analizzare e migliorare le prestazioni della tua squadra eFootball.',
      content: (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚽</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E5E7EB' }}>
            Iniziamo il tuo viaggio verso la vittoria!
          </h2>
          <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>
            eFootballLab ti aiuterà a:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#374151', borderRadius: '0.5rem' }}>
              <Brain size={24} color="#3B82F6" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E5E7EB' }}>Analisi AI</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Analizza automaticamente le tue prestazioni</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#374151', borderRadius: '0.5rem' }}>
              <Target size={24} color="#EF4444" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E5E7EB' }}>Contro-misure</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Suggerimenti tattici personalizzati</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#374151', borderRadius: '0.5rem' }}>
              <BarChart3 size={24} color="#10B981" style={{ marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E5E7EB' }}>Statistiche</h3>
              <p style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>Analisi dettagliate delle prestazioni</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'players',
      title: 'Gestisci la tua Rosa 👥',
      description: 'Aggiungi i tuoi giocatori e crea la formazione perfetta.',
      content: (
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Users size={32} color="#10B981" style={{ marginRight: '1rem' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#E5E7EB', marginBottom: '0.5rem' }}>
                Gestione Giocatori
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Aggiungi i tuoi giocatori con statistiche dettagliate e crea formazioni personalizzate.
              </p>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E5E7EB', marginBottom: '0.75rem' }}>
              📋 Cosa puoi fare:
            </h4>
            <ul style={{ color: '#CBD5E0', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Aggiungere giocatori con statistiche complete</li>
              <li style={{ marginBottom: '0.5rem' }}>Creare formazioni drag & drop</li>
              <li style={{ marginBottom: '0.5rem' }}>Analizzare compatibilità e sinergie</li>
              <li style={{ marginBottom: '0.5rem' }}>Gestire contratti e forma giocatori</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'analysis',
      title: 'Analisi Partite 📸',
      description: 'Carica screenshot e ottieni analisi automatiche delle tue partite.',
      content: (
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Camera size={32} color="#F59E0B" style={{ marginRight: '1rem' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#E5E7EB', marginBottom: '0.5rem' }}>
                OCR Avanzato
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Carica screenshot delle tue partite e ottieni analisi automatiche con AI.
              </p>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E5E7EB', marginBottom: '0.75rem' }}>
              🔍 Tipi di analisi supportati:
            </h4>
            <ul style={{ color: '#CBD5E0', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Formazioni 2D degli avversari</li>
              <li style={{ marginBottom: '0.5rem' }}>Statistiche post-partita</li>
              <li style={{ marginBottom: '0.5rem' }}>Mappe di calore e zone di gioco</li>
              <li style={{ marginBottom: '0.5rem' }}>Analisi prestazioni giocatori</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'opponents',
      title: 'Studia gli Avversari 🎯',
      description: 'Analizza le formazioni degli avversari e trova le contro-misure perfette.',
      content: (
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <Target size={32} color="#EF4444" style={{ marginRight: '1rem' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#E5E7EB', marginBottom: '0.5rem' }}>
                Analisi Avversari
              </h3>
              <p style={{ color: '#9CA3AF' }}>
                Studia le formazioni degli avversari e ottieni suggerimenti tattici personalizzati.
              </p>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#E5E7EB', marginBottom: '0.75rem' }}>
              🧠 Funzionalità AI:
            </h4>
            <ul style={{ color: '#CBD5E0', paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Analisi automatica punti forti/deboli</li>
              <li style={{ marginBottom: '0.5rem' }}>Suggerimenti contro-misure tattiche</li>
              <li style={{ marginBottom: '0.5rem' }}>Identificazione giocatori chiave</li>
              <li style={{ marginBottom: '0.5rem' }}>Consigli per formazione ottimale</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'Pronto per la Vittoria! 🏆',
      description: 'Hai completato la guida. Inizia a utilizzare eFootballLab per migliorare le tue prestazioni.',
      content: (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E5E7EB' }}>
            Perfetto! Sei pronto per iniziare!
          </h2>
          <p style={{ color: '#9CA3AF', marginBottom: '2rem' }}>
            Ora puoi utilizzare tutte le funzionalità di eFootballLab per analizzare e migliorare le prestazioni della tua squadra.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#10B981', borderRadius: '0.5rem', color: 'white' }}>
              <Users size={24} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 'bold' }}>Rosa</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Gestisci giocatori</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#3B82F6', borderRadius: '0.5rem', color: 'white' }}>
              <Camera size={24} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 'bold' }}>Analisi</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Carica screenshot</div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#EF4444', borderRadius: '0.5rem', color: 'white' }}>
              <Target size={24} style={{ marginBottom: '0.5rem' }} />
              <div style={{ fontWeight: 'bold' }}>Avversari</div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Studia formazioni</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    if (onSkip) {
      onSkip();
    }
  };

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: isVisible ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: '#1F2937',
      borderRadius: '1rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'hidden',
      border: '1px solid #4B5563',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
    },
    header: {
      padding: '1.5rem',
      borderBottom: '1px solid #4B5563',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#9CA3AF',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    progressBar: {
      height: '4px',
      backgroundColor: '#374151',
      width: '100%'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10B981',
      transition: 'width 0.3s ease'
    },
    content: {
      maxHeight: '60vh',
      overflowY: 'auto'
    },
    footer: {
      padding: '1.5rem',
      borderTop: '1px solid #4B5563',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      transition: 'all 0.2s'
    },
    primaryButton: {
      backgroundColor: '#10B981',
      color: 'white'
    },
    secondaryButton: {
      backgroundColor: '#6B7280',
      color: 'white'
    },
    skipButton: {
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      border: '1px solid #4B5563'
    },
    stepIndicator: {
      display: 'flex',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    stepDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: '#4B5563'
    },
    stepDotActive: {
      backgroundColor: '#10B981'
    }
  };

  if (!isVisible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{currentStepData.title}</h2>
          <button style={styles.closeButton} onClick={handleSkip}>
            <X size={20} />
          </button>
        </div>
        
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        
        <div style={styles.content}>
          {currentStepData.content}
        </div>
        
        <div style={styles.footer}>
          <div style={styles.stepIndicator}>
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                style={{
                  ...styles.stepDot,
                  ...(index === currentStep ? styles.stepDotActive : {})
                }}
              />
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {currentStep > 0 && (
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={handlePrevious}
              >
                ← Indietro
              </button>
            )}
            
            <button
              style={{ ...styles.button, ...styles.skipButton }}
              onClick={handleSkip}
            >
              Salta
            </button>
            
            <button
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleNext}
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  <CheckCircle size={16} />
                  Inizia!
                </>
              ) : (
                <>
                  Avanti
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
