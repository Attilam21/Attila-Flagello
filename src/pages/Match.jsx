import { useState, useEffect } from 'react';
import { uploadMatchImage, listenToOCRResults, listenToMatchStatus } from '../services/firebaseClient';

const Match = ({ user }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [matchStatus, setMatchStatus] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ❌ Devi essere loggato per accedere a questa pagina
        </div>
      </div>
    );
  }

  // Listener per stato match
  useEffect(() => {
    const unsubscribe = listenToMatchStatus(user.uid, (status) => {
      setMatchStatus(status);
      console.log('📊 Match status updated:', status);
    });

    return () => unsubscribe();
  }, [user.uid]);

  // Listener per risultati OCR
  useEffect(() => {
    const unsubscribe = listenToOCRResults(user.uid, (result) => {
      setOcrResult(result);
      console.log('🔍 OCR result received:', result);
    });

    return () => unsubscribe();
  }, [user.uid]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Seleziona un file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('🚀 Starting upload...', { userId: user.uid, fileName: file.name });
      const startTime = Date.now();

      const result = await uploadMatchImage(file, user.uid);
      
      const uploadTime = Date.now() - startTime;
      console.log(`✅ Upload completed in ${uploadTime}ms:`, result);

    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError(`Errore upload: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded': return 'text-blue-600';
      case 'processing': return 'text-yellow-600';
      case 'processed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'uploaded': return '📤';
      case 'processing': return '⚙️';
      case 'processed': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🏆 eFootballLab - Match OCR
      </h1>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📸 Carica Screenshot Tabellino</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleziona Immagine
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                📁 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? '⏳ Caricamento...' : '🚀 Carica su Firebase'}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ {error}
            </div>
          )}
        </div>
      </div>

      {/* Status Card */}
      {matchStatus && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">📊 Stato Match</h3>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getStatusIcon(matchStatus.status)}</span>
            <div>
              <p className={`font-medium ${getStatusColor(matchStatus.status)}`}>
                {matchStatus.status?.toUpperCase() || 'UNKNOWN'}
              </p>
              {matchStatus.createdAt && (
                <p className="text-sm text-gray-600">
                  Creato: {new Date(matchStatus.createdAt.seconds * 1000).toLocaleString()}
                </p>
              )}
              {matchStatus.filePath && (
                <p className="text-sm text-gray-600">
                  File: {matchStatus.filePath}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OCR Results */}
      {ocrResult && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">🔍 Risultato OCR</h3>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Confidenza:</span>
              <span className="text-sm text-gray-600">
                {Math.round((ocrResult.confidence || 0) * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Tempo elaborazione:</span>
              <span className="text-sm text-gray-600">
                {ocrResult.processingTimeMs || 0}ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Parole rilevate:</span>
              <span className="text-sm text-gray-600">
                {ocrResult.words?.length || 0}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Testo Rilevato:
            </label>
            <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto max-h-96 whitespace-pre-wrap">
              {ocrResult.text || 'Nessun testo rilevato'}
            </pre>
          </div>

          {ocrResult.words && ocrResult.words.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parole Individuali:
              </label>
              <div className="flex flex-wrap gap-2">
                {ocrResult.words.slice(0, 20).map((word, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                  >
                    {word.text}
                  </span>
                ))}
                {ocrResult.words.length > 20 && (
                  <span className="text-gray-500 text-sm">
                    +{ocrResult.words.length - 20} altre...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">ℹ️ Come usare</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
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

export default Match;
