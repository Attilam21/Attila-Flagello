import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  ArrowRight,
  Users,
  Target,
  BarChart3,
  Brain,
  Camera,
  Settings,
} from 'lucide-react';

const UXFlowManager = ({ currentPage, onPageChange, user }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Definizione del flusso UX ottimale
  const uxFlow = [
    {
      id: 'dashboard',
      title: 'Pannello di controllo',
      description: 'Panoramica generale della tua squadra',
      icon: <BarChart3 size={24} />,
      color: '#3B82F6',
      required: true,
    },
    {
      id: 'rosa',
      title: 'Rosa',
      description: 'Aggiungi e gestisci i tuoi giocatori',
      icon: <Users size={24} />,
      color: '#10B981',
      required: true,
    },
    {
      id: 'matchocr',
      title: 'Analisi Partite',
      description: 'Carica screenshot e analizza le prestazioni',
      icon: <Camera size={24} />,
      color: '#F59E0B',
      required: false,
    },
    {
      id: 'statistiche',
      title: 'Statistiche Avanzate',
      description: 'Analisi dettagliate delle prestazioni',
      icon: <BarChart3 size={24} />,
      color: '#8B5CF6',
      required: false,
    },
    {
      id: 'avversario',
      title: 'Analisi Avversari',
      description: 'Studia le formazioni degli avversari',
      icon: <Target size={24} />,
      color: '#EF4444',
      required: false,
    },
  ];

  // Simula completamento passi basato su dati esistenti
  useEffect(() => {
    const mockCompletedSteps = [];

    // Simula che l'utente abbia già completato alcuni passi
    if (user) {
      mockCompletedSteps.push('dashboard');

      // Simula che abbia giocatori nella rosa
      const hasPlayers = true; // In una vera app, controllerebbe i dati
      if (hasPlayers) {
        mockCompletedSteps.push('rosa');
      }
    }

    setCompletedSteps(mockCompletedSteps);
  }, [user]);

  // Determina il passo corrente
  useEffect(() => {
    const currentIndex = uxFlow.findIndex(step => step.id === currentPage);
    setCurrentStep(currentIndex >= 0 ? currentIndex : 0);
  }, [currentPage]);

  const getStepStatus = stepId => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentPage) return 'current';
    return 'pending';
  };

  const getNextStep = () => {
    const nextIndex = currentStep + 1;
    return nextIndex < uxFlow.length ? uxFlow[nextIndex] : null;
  };

  const getPreviousStep = () => {
    const prevIndex = currentStep - 1;
    return prevIndex >= 0 ? uxFlow[prevIndex] : null;
  };

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '2rem',
      border: '1px solid #4B5563',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    progressBar: {
      width: '100%',
      height: '4px',
      backgroundColor: '#374151',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '1rem',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10B981',
      borderRadius: '2px',
      transition: 'width 0.3s ease',
    },
    stepsContainer: {
      display: 'flex',
      gap: '1rem',
      overflowX: 'auto',
      paddingBottom: '0.5rem',
    },
    step: {
      minWidth: '200px',
      padding: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #4B5563',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    },
    stepCompleted: {
      backgroundColor: '#10B981',
      borderColor: '#10B981',
      color: 'white',
    },
    stepCurrent: {
      backgroundColor: '#3B82F6',
      borderColor: '#3B82F6',
      color: 'white',
    },
    stepPending: {
      backgroundColor: '#374151',
      borderColor: '#4B5563',
      color: '#9CA3AF',
    },
    stepHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    stepTitle: {
      fontSize: '0.875rem',
      fontWeight: '600',
    },
    stepDescription: {
      fontSize: '0.75rem',
      opacity: 0.8,
    },
    stepIcon: {
      display: 'flex',
      alignItems: 'center',
    },
    stepStatus: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
    },
    navigationButtons: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #4B5563',
    },
    navButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    prevButton: {
      backgroundColor: '#6B7280',
      color: 'white',
    },
    nextButton: {
      backgroundColor: '#10B981',
      color: 'white',
    },
    skipButton: {
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      border: '1px solid #4B5563',
    },
    progressText: {
      fontSize: '0.875rem',
      color: '#9CA3AF',
      textAlign: 'center',
    },
  };

  const progressPercentage = (completedSteps.length / uxFlow.length) * 100;
  const nextStep = getNextStep();
  const previousStep = getPreviousStep();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          <Brain size={20} />
          Flusso eFootballLab
        </h3>
        <div style={styles.progressText}>
          {completedSteps.length}/{uxFlow.length} completati
        </div>
      </div>

      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progressPercentage}%`,
          }}
        />
      </div>

      <div style={styles.stepsContainer}>
        {uxFlow.map((step, index) => {
          const status = getStepStatus(step.id);
          const stepStyle = {
            ...styles.step,
            ...(status === 'completed'
              ? styles.stepCompleted
              : status === 'current'
                ? styles.stepCurrent
                : styles.stepPending),
          };

          return (
            <div
              key={step.id}
              style={stepStyle}
              onClick={() => onPageChange(step.id)}
            >
              <div style={styles.stepStatus}>
                {status === 'completed'
                  ? '✓'
                  : status === 'current'
                    ? '●'
                    : '○'}
              </div>

              <div style={styles.stepHeader}>
                <div style={styles.stepIcon}>{step.icon}</div>
                <div style={styles.stepTitle}>{step.title}</div>
              </div>

              <div style={styles.stepDescription}>{step.description}</div>
            </div>
          );
        })}
      </div>

      <div style={styles.navigationButtons}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {previousStep && (
            <button
              style={{ ...styles.navButton, ...styles.prevButton }}
              onClick={() => onPageChange(previousStep.id)}
            >
              ← {previousStep.title}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {nextStep && (
            <button
              style={{ ...styles.navButton, ...styles.nextButton }}
              onClick={() => onPageChange(nextStep.id)}
            >
              {nextStep.title} →
            </button>
          )}

          {!nextStep && (
            <button
              style={{ ...styles.navButton, ...styles.skipButton }}
              onClick={() => onPageChange('dashboard')}
            >
              <Settings size={16} />
              Impostazioni
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UXFlowManager;
