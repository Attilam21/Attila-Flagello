import { useState, useEffect } from 'react';
import {
  uploadMatchImage,
  listenToOCRResults,
  listenToMatchStatus,
} from '../services/firebaseClient';
import { ocrService } from '../services/ocrService';
import PlayerCard from '../components/PlayerCard';
import MatchStats from '../components/MatchStats';

const MatchOCR = ({ user }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState(null); // processing|done|error
  const [ocrText, setOcrText] = useState('');
  const [ocrError, setOcrError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [analyzedData, setAnalyzedData] = useState(null);
  const [imageType, setImageType] = useState(null);

  if (!user) {
    return (
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '0.375rem',
          }}
        >
          ❌ Devi essere loggato per accedere a questa pagina
        </div>
      </div>
    );
  }

  // Listener per risultati OCR in tempo reale
  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToOCRResults(user.uid, result => {
      console.log('🔍 OCR result received:', result);

      if (result) {
        setOcrStatus(result.status || 'processing');
        setOcrText(result.text || '');
        setOcrError(result.error || null);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user.uid]);

  const handleFileChange = e => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError(null);
      setOcrError(null);
      setOcrStatus(null);
      setOcrText('');
      setAnalyzedData(null);
      setImageType(null);

      // Crea anteprima
      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);

      // Log telemetria
      console.log('📊 OCR upload start:', {
        bytes: selectedFile.size,
        mime: selectedFile.type,
        name: selectedFile.name,
      });
    }
  };

  const handleAnalyzeImage = async () => {
    if (!file) return;
    
    setOcrStatus('processing');
    setOcrError(null);
    
    try {
      console.log('🔍 Starting OCR analysis...');
      
      // Analizza l'immagine con il nuovo servizio OCR
      const result = await ocrService.processImage(file);
      setAnalyzedData(result);
      
      // Determina il tipo di immagine
      const detectedType = await ocrService.detectImageType(file);
      setImageType(detectedType);
      
      setOcrStatus('done');
      console.log('✅ OCR analysis completed:', result);
      
    } catch (error) {
      console.error('❌ OCR analysis failed:', error);
      setOcrError(error.message);
      setOcrStatus('error');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Seleziona un file');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setOcrStatus('processing');
    setOcrText('');
    setOcrError(null);

    try {
      console.log('🚀 Starting upload...', {
        userId: user.uid,
        fileName: file.name,
      });
      const startTime = Date.now();

      // Prima carica l'immagine su Firebase
      const downloadURL = await uploadMatchImage(file, user.uid);
      console.log('✅ Image uploaded to Firebase:', downloadURL);

      // Poi processa con OCR
      const ocrResult = await ocrService.processImageWithFirebase(file, user.uid);
      setAnalyzedData(ocrResult);
      
      const detectedType = await ocrService.detectImageType(file);
      setImageType(detectedType);

      const uploadTime = Date.now() - startTime;
      console.log(`✅ Upload and OCR completed in ${uploadTime}ms`);

      setOcrStatus('done');
      setOcrText('Analisi completata con successo!');

      // Log telemetria success
      console.log('📊 OCR upload success:', {
        bytes: file.size,
        mime: file.type,
        uploadTime,
        ocrResult,
      });
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setUploadError(`Errore upload: ${err.message}`);
      setOcrStatus('error');
      setOcrError(err.message);

      // Log telemetria error
      console.log('📊 OCR upload error:', {
        bytes: file.size,
        mime: file.type,
        error: err.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'processing':
        return '#d97706';
      case 'done':
        return '#16a34a';
      case 'error':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'processing':
        return '⚙️';
      case 'done':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'processing':
        return 'Elaborazione in corso...';
      case 'done':
        return 'Completato';
      case 'error':
        return 'Errore';
      default:
        return 'In attesa';
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1f2937',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      marginBottom: '1rem',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      marginBottom: '1rem',
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed',
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      marginBottom: '1rem',
    },
    statusCard: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      marginBottom: '1.5rem',
    },
    statusTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1f2937',
    },
    statusItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      marginBottom: '0.5rem',
    },
    ocrResult: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
    },
    ocrTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#1f2937',
    },
    ocrText: {
      backgroundColor: '#f9fafb',
      padding: '1rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      maxHeight: '400px',
      overflow: 'auto',
      border: '1px solid #e5e7eb',
    },
  };

  return (
    <div style={styles.container}>
      {/* Upload Section */}
      <div style={styles.card}>
        <h2 style={styles.title}>📸 Carica Screenshot Tabellino</h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={styles.input}
        />

        {file && (
          <div style={{ marginBottom: '1rem' }}>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              📁 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            {preview && (
              <div
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleAnalyzeImage}
            disabled={!file || ocrStatus === 'processing'}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {ocrStatus === 'processing' ? '⏳ Analizzando...' : '🔍 Analizza Immagine'}
          </button>
          
          <button
            onClick={handleUpload}
            disabled={!file || uploading || ocrStatus === 'processing'}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? '⏳ Caricamento...' : '🚀 Carica su Firebase'}
          </button>
        </div>

        {uploadError && <div style={styles.error}>❌ {uploadError}</div>}
      </div>

      {/* OCR Status & Results */}
      {ocrStatus && (
        <div style={styles.ocrResult}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <h3 style={styles.ocrTitle}>🔍 Risultato OCR</h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor:
                  getStatusColor(ocrStatus) === '#d97706'
                    ? '#fef3c7'
                    : getStatusColor(ocrStatus) === '#16a34a'
                      ? '#dcfce7'
                      : getStatusColor(ocrStatus) === '#dc2626'
                        ? '#fef2f2'
                        : '#f3f4f6',
                borderRadius: '0.375rem',
                border: `1px solid ${getStatusColor(ocrStatus)}`,
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>
                {getStatusIcon(ocrStatus)}
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: getStatusColor(ocrStatus),
                }}
              >
                {getStatusText(ocrStatus)}
              </span>
            </div>
          </div>

          {ocrStatus === 'processing' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '0.375rem',
                color: '#92400e',
              }}
            >
              <div
                style={{
                  width: '1rem',
                  height: '1rem',
                  border: '2px solid #f59e0b',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              ></div>
              <span>Elaborazione OCR in corso...</span>
            </div>
          )}

          {ocrStatus === 'done' && analyzedData && (
            <div className="space-y-6">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                ✅ Analisi completata! Tipo rilevato: <strong>{imageType}</strong>
              </div>
              
              {/* Visualizza dati analizzati in base al tipo */}
              {imageType === 'player_profile' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Profilo Giocatore</h3>
                  <PlayerCard player={analyzedData} showDetails={true} />
                </div>
              )}
              
              {imageType === 'match_stats' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiche Partita</h3>
                  <MatchStats match={analyzedData} showPlayerRatings={true} />
                </div>
              )}
              
              {imageType === 'team_formation' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Formazione Squadra</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p><strong>Squadra:</strong> {analyzedData.name}</p>
                    <p><strong>Allenatore:</strong> {analyzedData.coach}</p>
                    <p><strong>Formazione:</strong> {analyzedData.formation}</p>
                    <p><strong>Stile di gioco:</strong> {analyzedData.playStyle}</p>
                    <p><strong>Forza complessiva:</strong> {analyzedData.overallStrength}</p>
                  </div>
                </div>
              )}
              
              {imageType === 'attack_areas' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Aree di Attacco</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Squadra Casa</h4>
                      <p>Sinistra: {analyzedData.home.left}%</p>
                      <p>Centro: {analyzedData.home.center}%</p>
                      <p>Destra: {analyzedData.home.right}%</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Squadra Trasferta</h4>
                      <p>Sinistra: {analyzedData.away.left}%</p>
                      <p>Centro: {analyzedData.away.center}%</p>
                      <p>Destra: {analyzedData.away.right}%</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {ocrStatus === 'done' && ocrText && !analyzedData && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem',
                }}
              >
                Testo Rilevato:
              </label>
              <pre style={styles.ocrText}>{ocrText}</pre>
            </div>
          )}

          {ocrStatus === 'error' && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.375rem',
                color: '#dc2626',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <span>❌</span>
                <span style={{ fontWeight: '500' }}>
                  Errore durante l'elaborazione OCR
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>
                {ocrError || 'Errore sconosciuto'}
              </p>
              <button
                onClick={() => {
                  setOcrStatus(null);
                  setOcrText('');
                  setOcrError(null);
                }}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                🔄 Riprova
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div
        style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #2563eb',
          color: '#1e40af',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginTop: '2rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '0.75rem',
          }}
        >
          ℹ️ Come usare
        </h3>
        <ol
          style={{
            listStyle: 'decimal',
            listStylePosition: 'inside',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
        >
          <li>Seleziona uno screenshot del tabellino eFootball</li>
          <li>Clicca "Carica su Firebase"</li>
          <li>L'immagine viene salvata su Firebase Storage</li>
          <li>Cloud Functions attiva Google Vision OCR automaticamente</li>
          <li>Il testo OCR appare qui sotto in tempo reale</li>
        </ol>
      </div>
    </div>
  );
};

export default MatchOCR;
