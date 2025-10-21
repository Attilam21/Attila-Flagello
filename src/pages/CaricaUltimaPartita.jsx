import { useState, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  BarChart3, 
  Target, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CheckCircle, 
  AlertCircle, 
  Brain, 
  Zap,
  Eye,
  Clock,
  Save,
  Play,
  X,
  ArrowLeft,
  ArrowRight,
  Filter,
  Download,
  Share2,
  MessageSquare,
  Lightbulb,
  Shield
} from 'lucide-react';
import { Card, Button, Badge, EmptyState } from '../components/ui';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { auth, storage, db } from '../services/firebaseClient';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';

const CaricaUltimaPartita = ({ onPageChange }) => {
  console.log('📸 CaricaUltimaPartita component rendering');

  // Stati per l'upload delle immagini
  const [uploadImages, setUploadImages] = useState({
    stats: null,
    ratings: null,
    heatmapOffensive: null,
    heatmapDefensive: null
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Stati per i dati della partita
  const [matchData, setMatchData] = useState({
    stats: {},
    ratings: [],
    analysis: null,
    kpis: {}
  });

  // Stati per OCR
  const [ocrResults, setOcrResults] = useState({});
  const [ocrStatus, setOcrStatus] = useState({});
  const [processingImages, setProcessingImages] = useState([]);

  // Stati per le sezioni
  const [activeSection, setActiveSection] = useState('upload');
  const [showBreadcrumb, setShowBreadcrumb] = useState(true);
  const [showAllSections, setShowAllSections] = useState(true); // Sempre visibili
  const [playerFilter, setPlayerFilter] = useState('ultima');

  // Dati mock per il testing
  const [matchKPIs] = useState({
    possesso: { value: 58, trend: 'up', vsAvg: 3 },
    tiri: { value: 12, trend: 'down', vsAvg: -2 },
    tiriInPorta: { value: 7, trend: 'up', vsAvg: 1 },
    precisionePassaggi: { value: 84, trend: 'up', vsAvg: 2 },
    corner: { value: 5, trend: 'down', vsAvg: -1 },
    falli: { value: 8, trend: 'neutral', vsAvg: 0 },
    golFatti: { value: 2, trend: 'up', vsAvg: 1 },
    golSubiti: { value: 1, trend: 'down', vsAvg: -1 },
    diffReti: { value: 1, trend: 'up', vsAvg: 2 }
  });

  const [aiAnalysis] = useState({
    giudizio: "Partita ben gestita con buon controllo del possesso e difesa solida. La squadra ha mostrato efficacia in fase offensiva mantenendo l'equilibrio tattico.",
    puntiForza: [
      "Possesso palla ben controllato (58%)",
      "Difesa compatta con pochi spazi concessi",
      "Transizioni rapide dalla difesa all'attacco"
    ],
    puntiCritici: [
      "Precisione nei tiri da fuori area da migliorare",
      "Pressione alta da intensificare dopo il 70'",
      "Crossing dalla fascia destra poco efficaci"
    ],
    compitiPrioritari: [
      { text: "Migliorare la precisione nei tiri da lontano", impatto: "Alto" },
      { text: "Intensificare la pressione nella fase finale", impatto: "Medio" },
      { text: "Ottimizzare i cross dalla fascia destra", impatto: "Basso" }
    ]
  });

  const [recurringErrors] = useState([
    { 
      error: "Bassa precisione passaggi in uscita", 
      frequency: "67%", 
      trend: "down",
      trendValue: -12,
      suggestion: "Lavorare sui passaggi corti dal portiere"
    },
    { 
      error: "Tiri concessi dal mezzo spazio destro", 
      frequency: "45%", 
      trend: "up",
      trendValue: 8,
      suggestion: "Rafforzare la copertura del terzino destro"
    },
    { 
      error: "Calo dopo il 70° minuto", 
      frequency: "78%", 
      trend: "neutral",
      trendValue: 0,
      suggestion: "Gestire meglio i cambi e il ritmo"
    }
  ]);

  const [bestPlayers] = useState([
    { name: "Jude Bellingham", role: "CC", rating: 8.5, goals: 1, assists: 1, participation: 92, form: "Excellent", mvp: true, growth: false },
    { name: "Vinicius Jr.", role: "AS", rating: 8.2, goals: 1, assists: 0, participation: 88, form: "Good", mvp: false, growth: true },
    { name: "Luka Modric", role: "CC", rating: 7.8, goals: 0, assists: 1, participation: 85, form: "Good", mvp: false, growth: false },
    { name: "Thibaut Courtois", role: "PT", rating: 7.5, goals: 0, assists: 0, participation: 90, form: "Good", mvp: false, growth: false },
    { name: "David Alaba", role: "DC", rating: 7.4, goals: 0, assists: 0, participation: 87, form: "Average", mvp: false, growth: false }
  ]);

  const [matchHistory] = useState([
    { date: "2024-01-15", opponent: "Barcelona", result: "2-1", teamRating: 8.2, status: "W" },
    { date: "2024-01-08", opponent: "Atletico Madrid", result: "1-1", teamRating: 7.5, status: "D" },
    { date: "2024-01-01", opponent: "Sevilla", result: "3-0", teamRating: 8.8, status: "W" },
    { date: "2023-12-28", opponent: "Valencia", result: "2-2", teamRating: 7.8, status: "D" },
    { date: "2023-12-20", opponent: "Real Sociedad", result: "1-0", teamRating: 7.2, status: "W" }
  ]);

  const [aiTasks] = useState([
    { id: 1, title: "Migliorare precisione tiri da fuori", description: "Lavorare sui tiri da lontano in allenamento", role: "Tutti", priority: "Alto", impact: "Alto", status: "pending", assigned: false },
    { id: 2, title: "Intensificare pressione finale", description: "Gestire meglio l'intensità dopo il 70° minuto", role: "Centrocampisti", priority: "Medio", impact: "Medio", status: "pending", assigned: false },
    { id: 3, title: "Ottimizzare cross fascia destra", description: "Migliorare la tecnica dei cross dalla fascia destra", role: "Terzini", priority: "Basso", impact: "Basso", status: "pending", assigned: false }
  ]);

  // Handler per upload immagini
  const handleImageUpload = async (type, file) => {
    if (!file) return;
    if (!auth.currentUser) {
      alert('Devi essere loggato per caricare immagini');
      return;
    }

    // Validazione file
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Formato file non supportato. Usa JPG o PNG.');
      return;
    }

    if (file.size > maxSize) {
      alert('File troppo grande. Massimo 5MB.');
      return;
    }

    try {
      setIsProcessing(true);
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));

      // Genera nome file unico
      const timestamp = Date.now();
      const fileName = `${type}_${timestamp}_${file.name}`;
      const userId = auth.currentUser.uid;

      // Path per Firebase Storage: uploads/{userId}/{fileName}
      const storageRef = ref(storage, `uploads/${userId}/${fileName}`);

      // Upload file
      const uploadTask = uploadBytes(storageRef, file);

      // Simula progresso (in realtà Firebase non fornisce progress callback per uploadBytes)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const current = prev[type] || 0;
          if (current >= 90) {
            clearInterval(progressInterval);
            return { ...prev, [type]: 90 };
          }
          return { ...prev, [type]: current + 10 };
        });
      }, 200);

      await uploadTask;

      // Completa progresso
      setUploadProgress(prev => ({ ...prev, [type]: 100 }));
      setUploadImages(prev => ({ ...prev, [type]: file }));

      // Aggiungi alla lista di immagini in processing
      setProcessingImages(prev => [...prev, { type, fileName, userId }]);

      console.log(`✅ Image uploaded successfully: ${fileName}`);

    } catch (error) {
      console.error('❌ Error uploading image:', error);
      alert('Errore durante l\'upload dell\'immagine');
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler per rimuovere immagine
  const handleRemoveImage = (type) => {
    setUploadImages(prev => ({
      ...prev,
      [type]: null
    }));
    setUploadProgress(prev => ({
      ...prev,
      [type]: 0
    }));
  };

  // Handler per elaborazione OCR
  const handleProcessOCR = async () => {
    const uploadedCount = Object.values(uploadImages).filter(img => img !== null).length;
    
    if (uploadedCount < 4) {
      alert('Carica tutte e 4 le immagini prima di procedere con l\'elaborazione.');
      return;
    }

    if (!auth.currentUser) {
      alert('Devi essere loggato per elaborare le immagini');
      return;
    }

    setIsProcessing(true);
    
    try {
      const userId = auth.currentUser.uid;
      
      console.log('🔄 Processing OCR with images:', uploadImages);
      console.log('📋 Processing images:', processingImages);
      
      // Inizializza stati OCR per ogni immagine
      const initialOcrStatus = {};
      processingImages.forEach(img => {
        initialOcrStatus[img.type] = 'processing';
      });
      setOcrStatus(initialOcrStatus);
      
      // Setup listener per risultati OCR
      const ocrListener = onSnapshot(
        doc(db, 'matches', userId, 'ocr', 'latest'),
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            console.log('📊 OCR Result received:', data);
            
            if (data.status === 'done' && data.text) {
              // Parse OCR text e aggiorna stato
              const parsedData = parseOcrText(data.text, data.filePath);
              setOcrResults(prev => ({
                ...prev,
                [data.filePath]: parsedData
              }));
              
              // Aggiorna stato OCR
              setOcrStatus(prev => ({
                ...prev,
                [data.filePath]: 'completed'
              }));
            } else if (data.status === 'error') {
              console.error('❌ OCR Error:', data.error);
              setOcrStatus(prev => ({
                ...prev,
                [data.filePath]: 'error'
              }));
            }
          }
        },
        (error) => {
          console.error('❌ OCR Listener Error:', error);
        }
      );
      
      // Aspetta che tutte le immagini siano processate
      const maxWaitTime = 60000; // 60 secondi
      const startTime = Date.now();
      
      const checkCompletion = () => {
        const allProcessed = processingImages.every(img => 
          ocrStatus[img.type] === 'completed' || ocrStatus[img.type] === 'error'
        );
        
        if (allProcessed || Date.now() - startTime > maxWaitTime) {
          // Cleanup listener
          ocrListener();
          
          // Aggrega tutti i risultati OCR
          const aggregatedData = aggregateOcrResults();
          setMatchData(aggregatedData);
          
          setActiveSection('analysis');
          setIsProcessing(false);
        } else {
          // Continua a controllare
          setTimeout(checkCompletion, 1000);
        }
      };
      
      // Inizia controllo completamento
      setTimeout(checkCompletion, 2000);
      
    } catch (error) {
      console.error('❌ Errore elaborazione OCR:', error);
      alert('Errore durante l\'elaborazione. Riprova.');
      setIsProcessing(false);
    }
  };

  // Funzione per parsare il testo OCR
  const parseOcrText = (text, filePath) => {
    console.log('🔍 Parsing OCR text for:', filePath);
    console.log('📄 OCR Text:', text);
    
    // Estrai tipo di immagine dal filePath
    const imageType = filePath.includes('stats') ? 'stats' : 
                     filePath.includes('ratings') ? 'ratings' :
                     filePath.includes('heatmapOffensive') ? 'heatmapOffensive' :
                     filePath.includes('heatmapDefensive') ? 'heatmapDefensive' : 'unknown';
    
    switch (imageType) {
      case 'stats':
        return parseStatsFromOcr(text);
      case 'ratings':
        return parseRatingsFromOcr(text);
      case 'heatmapOffensive':
      case 'heatmapDefensive':
        return parseHeatmapFromOcr(text);
      default:
        return { rawText: text };
    }
  };

  // Parser per statistiche partita
  const parseStatsFromOcr = (text) => {
    const stats = {};
    
    // Regex per estrarre numeri dalle statistiche
    const patterns = {
      possesso: /possesso[:\s]*(\d+)/i,
      tiri: /tiri[:\s]*(\d+)/i,
      tiriInPorta: /tiri\s+in\s+porta[:\s]*(\d+)/i,
      precisionePassaggi: /precisione\s+passaggi[:\s]*(\d+)/i,
      corner: /corner[:\s]*(\d+)/i,
      falli: /falli[:\s]*(\d+)/i,
      golFatti: /gol\s+fatti[:\s]*(\d+)/i,
      golSubiti: /gol\s+subiti[:\s]*(\d+)/i
    };
    
    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = text.match(pattern);
      if (match) {
        stats[key] = parseInt(match[1]);
      }
    });
    
    console.log('📊 Parsed stats:', stats);
    return { stats };
  };

  // Parser per ratings giocatori
  const parseRatingsFromOcr = (text) => {
    const ratings = [];
    
    // Regex per estrarre giocatori e rating
    const playerPattern = /([A-Za-z\s]+?)\s+(\d+\.?\d*)/g;
    let match;
    
    while ((match = playerPattern.exec(text)) !== null) {
      const playerName = match[1].trim();
      const rating = parseFloat(match[2]);
      
      if (playerName.length > 2 && rating > 0 && rating <= 10) {
        ratings.push({
          player: playerName,
          rating: rating,
          notes: `Estratto da OCR`
        });
      }
    }
    
    console.log('⭐ Parsed ratings:', ratings);
    return { ratings };
  };

  // Parser per heatmap
  const parseHeatmapFromOcr = (text) => {
    // Per ora restituisce dati mock, in futuro si può implementare parsing specifico
    return {
      type: 'heatmap',
      zones: ['center', 'left', 'right'],
      intensities: [0.7, 0.5, 0.6]
    };
  };

  // Funzione per aggregare tutti i risultati OCR
  const aggregateOcrResults = () => {
    console.log('🔄 Aggregating OCR results:', ocrResults);
    
    const aggregated = {
      stats: {},
      ratings: [],
      heatmaps: {
        offensive: null,
        defensive: null
      }
    };
    
    Object.entries(ocrResults).forEach(([filePath, data]) => {
      if (data.stats) {
        aggregated.stats = { ...aggregated.stats, ...data.stats };
      }
      if (data.ratings) {
        aggregated.ratings = [...aggregated.ratings, ...data.ratings];
      }
      if (data.type === 'heatmap') {
        if (filePath.includes('heatmapOffensive')) {
          aggregated.heatmaps.offensive = data;
        } else if (filePath.includes('heatmapDefensive')) {
          aggregated.heatmaps.defensive = data;
        }
      }
    });
    
    console.log('📋 Final aggregated data:', aggregated);
    return aggregated;
  };

  // Handler per salvataggio
  const handleSave = async () => {
    try {
      console.log('💾 Salvando analisi partita:', matchData);
      // Qui integreremo con Firebase
      alert('Analisi salvata con successo!');
    } catch (error) {
      console.error('❌ Errore salvataggio:', error);
      alert('Errore durante il salvataggio.');
    }
  };

  // Handler per pubblicazione
  const handlePublish = async () => {
    try {
      console.log('📤 Pubblicando analisi partita');
      // Qui integreremo con Firebase
      alert('Analisi pubblicata con successo!');
    } catch (error) {
      console.error('❌ Errore pubblicazione:', error);
      alert('Errore durante la pubblicazione.');
    }
  };

  // Handler per salvataggio bozza
  const handleSaveDraft = async () => {
    try {
      console.log('💾 Salvando bozza partita:', { uploadImages, matchData });
      // Salva in localStorage per ora
      localStorage.setItem('matchDraft', JSON.stringify({ uploadImages, matchData }));
      alert('Bozza salvata con successo!');
    } catch (error) {
      console.error('❌ Errore salvataggio bozza:', error);
      alert('Errore durante il salvataggio della bozza.');
    }
  };

  // Handler per annullamento
  const handleCancel = () => {
    if (confirm('Sei sicuro di voler annullare? Tutte le modifiche non salvate andranno perse.')) {
      setUploadImages({
        stats: null,
        ratings: null,
        heatmapOffensive: null,
        heatmapDefensive: null
      });
      setUploadProgress({});
      setMatchData({
        stats: {},
        ratings: [],
        analysis: null,
        kpis: {}
      });
      setIsProcessing(false);
      console.log('🗑️ Operazione annullata');
    }
  };

  // Handler per generazione task
  const handleGenerateTasks = () => {
    console.log('⚡ Generando task dall\'analisi IA');
    // Qui integreremo con il sistema di task esistente
    alert('Task generati con successo! Controlla la sezione Task & Suggerimenti.');
  };

  // Handler per invio a chat coach
  const handleSendToCoach = () => {
    console.log('💬 Invio analisi a Chat Coach');
    // Qui integreremo con il sistema di chat esistente
    alert('Analisi inviata al Chat Coach!');
  };

  // Handler per aggiungere task da errore
  const handleAddErrorTask = (error) => {
    console.log('🔧 Aggiungendo task per errore:', error);
    // Qui integreremo con il sistema di task esistente
    alert(`Task aggiunto: ${error.error}`);
  };

  // Handler per aprire analisi partita
  const handleOpenMatchAnalysis = (match) => {
    console.log('📊 Aprendo analisi partita:', match);
    // Qui integreremo con il sistema di analisi esistente
    alert(`Apertura analisi per ${match.opponent} - ${match.date}`);
  };

  // Handler per toggle task
  const handleTaskToggle = (taskId) => {
    console.log('🔄 Toggle task:', taskId);
    // Qui integreremo con il sistema di task esistente
    alert(`Task ${taskId} aggiornato!`);
  };

  // Handler per aggiungere ai miei task
  const handleAddToMyTasks = (task) => {
    console.log('➕ Aggiungendo ai miei task:', task);
    // Qui integreremo con il sistema di task esistente
    alert(`Task "${task.title}" aggiunto ai tuoi task!`);
  };

  // Renderizza breadcrumb
  const renderBreadcrumb = () => (
    <div className="breadcrumb">
      <button 
        onClick={() => onPageChange('home')} 
        className="breadcrumb-item"
      >
        Casa
      </button>
      <span className="breadcrumb-separator">→</span>
      <span className="breadcrumb-current">Carica Ultima Partita</span>
    </div>
  );

  // Renderizza uploader immagini
  const renderImageUploader = () => (
    <div className="upload-section">
      <div className="section-header">
        <h2 className="section-title">
          <Camera size={24} />
          Upload Immagini Partita
        </h2>
        <p className="section-description">
          Carica le 4 immagini richieste per l'analisi completa della partita
        </p>
      </div>

      <div className="upload-grid">
        {[
          { key: 'stats', label: 'Statistiche Partita', description: 'Possesso, tiri, corner, falli, ecc.' },
          { key: 'ratings', label: 'Media/Voti Giocatori', description: 'Tabella con voti e note per ogni giocatore' },
          { key: 'heatmapOffensive', label: 'Mappa di Calore - Offensiva', description: 'Zone di attacco e pressione alta' },
          { key: 'heatmapDefensive', label: 'Mappa di Calore - Difensiva', description: 'Recuperi e pressione difensiva' }
        ].map(({ key, label, description }) => (
          <div key={key} className="upload-card">
            <div className="upload-header">
              <Camera size={20} />
              <h4>{label}</h4>
            </div>
            <div className="upload-content">
              <p className="upload-description">{description}</p>
              <div 
                className="upload-area"
                onClick={() => document.getElementById(`${key}-input`).click()}
              >
                {uploadImages[key] ? (
                  <div className="image-preview">
                    <img 
                      src={URL.createObjectURL(uploadImages[key])} 
                      alt={label}
                      className="preview-image"
                    />
                    <div className="image-actions">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById(`${key}-input`).click();
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        Sostituisci
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(key);
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        Rimuovi
                      </button>
                    </div>
                    {uploadProgress[key] && uploadProgress[key] < 100 && (
                      <div className="upload-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${uploadProgress[key]}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{uploadProgress[key]}%</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={32} />
                    <span>Carica immagine</span>
                    <p className="upload-hint">PNG/JPG, max 5MB</p>
                  </div>
                )}
                <input
                  id={`${key}-input`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(key, e.target.files[0])}
                  className="file-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="upload-actions">
        <button 
          onClick={handleProcessOCR}
          disabled={isProcessing || Object.values(uploadImages).filter(img => img !== null).length < 4}
          className="btn btn-primary"
        >
          {isProcessing ? (
            <>
              <div className="loading-spinner"></div>
              Elaborazione in corso...
            </>
          ) : (
            <>
              <Brain size={16} />
              Elabora con OCR
            </>
          )}
        </button>
        <button 
          onClick={handleSaveDraft}
          className="btn btn-secondary"
        >
          <Save size={16} />
          Salva Bozza
        </button>
        <button 
          onClick={handleCancel}
          className="btn btn-ghost"
        >
          <X size={16} />
          Annulla
        </button>
      </div>
    </div>
  );

  // Renderizza KPI della partita
  const renderMatchKPIs = () => (
    <div className="kpi-section">
      <div className="section-header">
        <h2 className="section-title">
          <BarChart3 size={24} />
          Statistiche Partita
        </h2>
      </div>

      <div className="kpi-grid">
        {Object.entries(matchKPIs).map(([key, data]) => (
          <div key={key} className="kpi-card">
            <div className="kpi-header">
              <span className="kpi-label">
                {key === 'possesso' ? 'Possesso' :
                 key === 'tiri' ? 'Tiri' :
                 key === 'tiriInPorta' ? 'Tiri in Porta' :
                 key === 'precisionePassaggi' ? 'Precisione Passaggi' :
                 key === 'corner' ? 'Corner' :
                 key === 'falli' ? 'Falli' :
                 key === 'golFatti' ? 'Gol Fatti' :
                 key === 'golSubiti' ? 'Gol Subiti' :
                 key === 'diffReti' ? 'Diff. Reti' : key}
              </span>
              <div className="kpi-trend">
                {data.trend === 'up' ? (
                  <TrendingUp size={16} className="trend-up" />
                ) : data.trend === 'down' ? (
                  <TrendingDown size={16} className="trend-down" />
                ) : (
                  <div className="trend-neutral">—</div>
                )}
              </div>
            </div>
            <div className="kpi-value">
              {key === 'possesso' || key === 'precisionePassaggi' ? `${data.value}%` : data.value}
            </div>
            <div className="kpi-comparison">
              {data.trend !== 'neutral' && (
                <span className={`comparison ${data.trend === 'up' ? 'positive' : 'negative'}`}>
                  {data.trend === 'up' ? '+' : ''}{data.vsAvg} vs media
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Renderizza analisi IA
  const renderAIAnalysis = () => (
    <div className="ai-analysis-section">
      <div className="section-header">
        <h2 className="section-title">
          <Brain size={24} />
          Analisi IA - Ultima Partita
        </h2>
      </div>

      <div className="analysis-grid">
        <Card className="analysis-card">
          <div className="card-header">
            <h3>Giudizio Sintetico</h3>
          </div>
          <div className="card-content">
            <p className="analysis-text">{aiAnalysis.giudizio}</p>
          </div>
        </Card>

        <Card className="analysis-card">
          <div className="card-header">
            <h3>Punti di Forza</h3>
            <CheckCircle size={20} className="icon-success" />
          </div>
          <div className="card-content">
            <ul className="analysis-list">
              {aiAnalysis.puntiForza.map((point, index) => (
                <li key={index} className="analysis-item">
                  <CheckCircle size={16} className="icon-success" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="analysis-card">
          <div className="card-header">
            <h3>Punti Critici</h3>
            <AlertCircle size={20} className="icon-warning" />
          </div>
          <div className="card-content">
            <ul className="analysis-list">
              {aiAnalysis.puntiCritici.map((point, index) => (
                <li key={index} className="analysis-item">
                  <AlertCircle size={16} className="icon-warning" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="analysis-card">
          <div className="card-header">
            <h3>Compiti Prioritari</h3>
            <Target size={20} className="icon-primary" />
          </div>
          <div className="card-content">
            <div className="tasks-list">
              {aiAnalysis.compitiPrioritari.map((task, index) => (
                <div key={index} className="task-item">
                  <div className="task-content">
                    <span className="task-text">{task.text}</span>
                    <Badge 
                      variant={task.impatto === 'Alto' ? 'danger' : task.impatto === 'Medio' ? 'warning' : 'secondary'}
                    >
                      {task.impatto}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="task-actions">
              <button 
                onClick={handleGenerateTasks}
                className="btn btn-primary btn-sm"
              >
                <Zap size={16} />
                Genera Task
              </button>
              <button 
                onClick={handleSendToCoach}
                className="btn btn-secondary btn-sm"
              >
                <MessageSquare size={16} />
                Invia a Chat Coach
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // Renderizza errori ricorrenti
  const renderRecurringErrors = () => (
    <div className="errors-section">
      <div className="section-header">
        <h2 className="section-title">
          <AlertCircle size={24} />
          Errori Ricorrenti
        </h2>
        <p className="section-description">
          Top 3 errori più frequenti basati sullo storico recente
        </p>
      </div>

      <div className="errors-grid">
        {recurringErrors.map((error, index) => (
          <Card key={index} className="error-card">
            <div className="card-header">
              <div className="error-rank">
                <span className="rank-number">#{index + 1}</span>
              </div>
              <div className="error-frequency">
                <span className="frequency-value">{error.frequency}</span>
                <span className="frequency-label">frequenza</span>
              </div>
            </div>
            <div className="card-content">
              <h4 className="error-title">{error.error}</h4>
              <div className="error-trend">
                <span className={`trend ${error.trend}`}>
                  {error.trend === 'up' ? (
                    <>
                      <TrendingUp size={16} />
                      +{error.trendValue}%
                    </>
                  ) : error.trend === 'down' ? (
                    <>
                      <TrendingDown size={16} />
                      {error.trendValue}%
                    </>
                  ) : (
                    <>
                      <div className="trend-neutral">—</div>
                      Stabile
                    </>
                  )}
                </span>
                <span className="trend-label">vs ultime 5 partite</span>
              </div>
              <p className="error-suggestion">{error.suggestion}</p>
              <button 
                onClick={() => handleAddErrorTask(error)}
                className="btn btn-primary btn-sm"
              >
                <Lightbulb size={16} />
                Aggiungi Task
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Renderizza migliori giocatori
  const renderBestPlayers = () => (
    <div className="players-section">
      <div className="section-header">
        <h2 className="section-title">
          <Users size={24} />
          Migliori Giocatori
        </h2>
        <div className="section-filters">
          <button 
            onClick={() => setPlayerFilter('ultima')}
            className={`btn btn-sm ${playerFilter === 'ultima' ? 'btn-secondary' : 'btn-ghost'}`}
          >
            <Filter size={16} />
            Ultima
          </button>
          <button 
            onClick={() => setPlayerFilter('5')}
            className={`btn btn-sm ${playerFilter === '5' ? 'btn-secondary' : 'btn-ghost'}`}
          >
            5 partite
          </button>
          <button 
            onClick={() => setPlayerFilter('10')}
            className={`btn btn-sm ${playerFilter === '10' ? 'btn-secondary' : 'btn-ghost'}`}
          >
            10 partite
          </button>
        </div>
      </div>

      <div className="players-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Giocatore</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Gol</TableHead>
              <TableHead>Assist</TableHead>
              <TableHead>Partecipazione</TableHead>
              <TableHead>Forma</TableHead>
              <TableHead>Badge</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bestPlayers.map((player, index) => (
              <TableRow key={index} className="player-row">
                <TableCell>
                  <div className="player-info">
                    <span className="player-name">{player.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{player.role}</Badge>
                </TableCell>
                <TableCell>
                  <span className="rating-value">{player.rating}</span>
                </TableCell>
                <TableCell>{player.goals}</TableCell>
                <TableCell>{player.assists}</TableCell>
                <TableCell>
                  <div className="participation-bar">
                    <div 
                      className="participation-fill" 
                      style={{ width: `${player.participation}%` }}
                    ></div>
                    <span className="participation-text">{player.participation}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      player.form === 'Excellent' ? 'success' : 
                      player.form === 'Good' ? 'primary' : 
                      'secondary'
                    }
                  >
                    {player.form}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="player-badges">
                    {player.mvp && <Badge variant="warning">MVP</Badge>}
                    {player.growth && <Badge variant="success">Crescita</Badge>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Renderizza storico partite
  const renderMatchHistory = () => (
    <div className="history-section">
      <div className="section-header">
        <h2 className="section-title">
          <Clock size={24} />
          Storico Partite
        </h2>
      </div>

      <div className="history-list">
        {matchHistory.map((match, index) => (
          <Card key={index} className="history-card">
            <div className="match-info">
              <div className="match-date">
                {new Date(match.date).toLocaleDateString('it-IT')}
              </div>
              <div className="match-details">
                <div className="match-opponent">{match.opponent}</div>
                <div className="match-result">
                  <span className={`result-badge ${match.status}`}>
                    {match.result}
                  </span>
                </div>
                <div className="match-rating">
                  <span className="rating-label">Voto squadra:</span>
                  <span className="rating-value">{match.teamRating}</span>
                </div>
              </div>
            </div>
            <div className="match-actions">
              <button 
                onClick={() => handleOpenMatchAnalysis(match)}
                className="btn btn-primary btn-sm"
              >
                <Eye size={16} />
                Apri Analisi
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Renderizza task e suggerimenti
  const renderTasksSuggestions = () => (
    <div className="tasks-section">
      <div className="section-header">
        <h2 className="section-title">
          <Lightbulb size={24} />
          Task & Suggerimenti
        </h2>
        <p className="section-description">
          Task generati dall'IA per questa partita
        </p>
      </div>

      <div className="tasks-list">
        {aiTasks.map((task) => (
          <Card key={task.id} className="task-card">
            <div className="task-header">
              <div className="task-priority">
                <Badge 
                  variant={
                    task.priority === 'Alto' ? 'danger' : 
                    task.priority === 'Medio' ? 'warning' : 
                    'secondary'
                  }
                >
                  {task.priority}
                </Badge>
                <Badge variant="primary">{task.impact}</Badge>
              </div>
              <div className="task-status">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={task.status === 'done'}
                    onChange={() => handleTaskToggle(task.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <div className="task-content">
              <h4 className="task-title">{task.title}</h4>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <span className="task-role">Ruolo: {task.role}</span>
              </div>
            </div>
            <div className="task-actions">
              <button 
                onClick={() => handleAddToMyTasks(task)}
                className="btn btn-primary btn-sm"
              >
                <CheckCircle size={16} />
                Aggiungi ai miei Task
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  // Renderizza header con pulsanti globali
  const renderGlobalActions = () => (
    <div className="global-actions">
      <div className="actions-left">
        {showBreadcrumb && renderBreadcrumb()}
      </div>
      <div className="actions-right">
        <button 
          onClick={handleSave}
          className="btn btn-secondary"
        >
          <Save size={16} />
          Salva
        </button>
        <button 
          onClick={handlePublish}
          className="btn btn-primary"
        >
          <Share2 size={16} />
          Pubblica Analisi
        </button>
        <button 
          onClick={() => onPageChange('contromisure')}
          className="btn btn-ghost"
        >
          <Shield size={16} />
          Crea Contromisure
        </button>
      </div>
    </div>
  );

  return (
    <div className="carica-partita-page">
      {/* Header con azioni globali */}
      <div className="page-header">
        {renderGlobalActions()}
      </div>

      {/* Contenuto principale */}
      <div className="page-content">
        {/* Sezione Upload - sempre visibile */}
        {renderImageUploader()}
        
        {/* Sezioni di analisi - visibili dopo l'elaborazione o per demo */}
        {(activeSection === 'analysis' || showAllSections) && (
          <>
            {renderMatchKPIs()}
            {renderAIAnalysis()}
            {renderRecurringErrors()}
            {renderBestPlayers()}
            {renderMatchHistory()}
            {renderTasksSuggestions()}
          </>
        )}
        
        {/* Sezione vuota se nessuna immagine caricata */}
        {!showAllSections && Object.values(uploadImages).every(img => img === null) && (
          <div className="empty-state">
            <EmptyState
              icon={Upload}
              title="Carica le 4 immagini per iniziare"
              description="Seleziona le immagini della partita per iniziare l'analisi completa"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CaricaUltimaPartita;
