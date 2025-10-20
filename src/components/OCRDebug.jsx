import React, { useState } from 'react';

const OCRDebug = ({ imageFile, ocrResult, onRetry }) => {
  const [showDebug, setShowDebug] = useState(false);

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginTop: '1rem',
      border: '1px solid #374151'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    title: {
      color: '#E5E7EB',
      fontSize: '1.1rem',
      fontWeight: '600'
    },
    toggleButton: {
      backgroundColor: '#374151',
      color: '#E5E7EB',
      border: '1px solid #4B5563',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    debugContent: {
      backgroundColor: '#374151',
      padding: '1rem',
      borderRadius: '0.375rem',
      marginTop: '1rem'
    },
    debugSection: {
      marginBottom: '1rem'
    },
    debugLabel: {
      color: '#9CA3AF',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.25rem'
    },
    debugValue: {
      color: '#E5E7EB',
      fontSize: '0.875rem',
      fontFamily: 'monospace',
      backgroundColor: '#1F2937',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      whiteSpace: 'pre-wrap'
    },
    imageInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    infoItem: {
      backgroundColor: '#1F2937',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      textAlign: 'center'
    },
    infoLabel: {
      color: '#9CA3AF',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    infoValue: {
      color: '#E5E7EB',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginTop: '0.25rem'
    },
    retryButton: {
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      marginTop: '1rem'
    }
  };

  const getImageInfo = () => {
    if (!imageFile) return null;
    
    return {
      name: imageFile.name,
      size: `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`,
      type: imageFile.type,
      lastModified: new Date(imageFile.lastModified).toLocaleString()
    };
  };

  const getOCRInfo = () => {
    if (!ocrResult) return null;
    
    return {
      type: ocrResult.type,
      confidence: ocrResult.confidence,
      textLength: ocrResult.rawText?.length || 0,
      playersCount: ocrResult.players?.length || 0,
      formation: ocrResult.formation || 'N/A'
    };
  };

  const imageInfo = getImageInfo();
  const ocrInfo = getOCRInfo();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>🔍 Debug OCR</div>
        <button 
          style={styles.toggleButton}
          onClick={() => setShowDebug(!showDebug)}
        >
          {showDebug ? 'Nascondi' : 'Mostra'} Debug
        </button>
      </div>

      {showDebug && (
        <div style={styles.debugContent}>
          {/* Informazioni Immagine */}
          {imageInfo && (
            <div style={styles.debugSection}>
              <div style={styles.debugLabel}>📁 Informazioni Immagine</div>
              <div style={styles.imageInfo}>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Nome</div>
                  <div style={styles.infoValue}>{imageInfo.name}</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Dimensione</div>
                  <div style={styles.infoValue}>{imageInfo.size}</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Tipo</div>
                  <div style={styles.infoValue}>{imageInfo.type}</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Modificato</div>
                  <div style={styles.infoValue}>{imageInfo.lastModified}</div>
                </div>
              </div>
            </div>
          )}

          {/* Informazioni OCR */}
          {ocrInfo && (
            <div style={styles.debugSection}>
              <div style={styles.debugLabel}>🤖 Risultato OCR</div>
              <div style={styles.imageInfo}>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Tipo</div>
                  <div style={styles.infoValue}>{ocrInfo.type}</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Confidenza</div>
                  <div style={styles.infoValue}>{Math.round(ocrInfo.confidence * 100)}%</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Testo</div>
                  <div style={styles.infoValue}>{ocrInfo.textLength} caratteri</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Giocatori</div>
                  <div style={styles.infoValue}>{ocrInfo.playersCount}</div>
                </div>
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>Formazione</div>
                  <div style={styles.infoValue}>{ocrInfo.formation}</div>
                </div>
              </div>
            </div>
          )}

          {/* Testo OCR Raw */}
          {ocrResult?.rawText && (
            <div style={styles.debugSection}>
              <div style={styles.debugLabel}>📝 Testo OCR Estratto</div>
              <div style={styles.debugValue}>
                {ocrResult.rawText}
              </div>
            </div>
          )}

          {/* Dati Strutturati */}
          {ocrResult?.players && (
            <div style={styles.debugSection}>
              <div style={styles.debugLabel}>👥 Giocatori Rilevati</div>
              <div style={styles.debugValue}>
                {JSON.stringify(ocrResult.players, null, 2)}
              </div>
            </div>
          )}

          {/* Pulsante Riprova */}
          <button 
            style={styles.retryButton}
            onClick={onRetry}
          >
            🔄 Riprova Analisi OCR
          </button>
        </div>
      )}
    </div>
  );
};

export default OCRDebug;
