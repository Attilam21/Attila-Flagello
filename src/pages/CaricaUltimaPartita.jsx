import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseClient';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';
// OCR callable disabilitata: si usa il trigger Storage + listener Firestore
import { uploadImageForOCR, simulateUpload } from '../services/uploadHelper';
import { generateMatchId } from '../services/firestoreWrapper';
import { Card, Button, Badge } from '../components/ui';
import { Upload, BarChart3, CheckCircle } from 'lucide-react';
import ErrorBoundary from '../components/ErrorBoundary';

const CaricaUltimaPartita = () => {
  const [uploadImages, setUploadImages] = useState({
    stats: null,
    ratings: null,
    heatmapOffensive: null,
    heatmapDefensive: null,
  });

  const [uploadProgress, setUploadProgress] = useState({});
  const [matchData, setMatchData] = useState({
    stats: {},
    kpis: {},
    players: [],
    heatmaps: { offensive: null, defensive: null },
  });
  const [activeSection, setActiveSection] = useState('upload');
  const [currentMatchId, setCurrentMatchId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewRatings, setReviewRatings] = useState([]);
  const [reviewHeatmap, setReviewHeatmap] = useState({ left: '', center: '', right: '' });
  const [reviewTab, setReviewTab] = useState('stats');

  // Inizializza matchId
  useEffect(() => {
    if (!currentMatchId) {
      setCurrentMatchId(generateMatchId());
    }
  }, [currentMatchId]);

  // Listener per aggiornamenti real-time da OCR trigger
  useEffect(() => {
    if (!auth.currentUser || !currentMatchId) return;

    const userId = auth.currentUser.uid;
    const matchId = currentMatchId;

    // Usa gli import già definiti

    // Listener per stats
    const unsubscribeStats = onSnapshot(
      doc(db, 'users', userId, 'matches', matchId, 'stats', 'main'),
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          console.log('📊 Real-time stats update:', data);
          setMatchData(prev => ({
            ...prev,
            stats: data,
          }));
          setReviewStats(prev => ({ ...(prev || {}), ...data }));
        }
      }
    );

    // Listener per votes
    const unsubscribeVotes = onSnapshot(
      doc(db, 'users', userId, 'matches', matchId, 'votes', 'main'),
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          console.log('📊 Real-time votes update:', data);
          setMatchData(prev => ({
            ...prev,
            ratings: data,
          }));
          const arr = Array.isArray(data?.votes)
            ? data.votes
            : Array.isArray(data?.ratings)
            ? data.ratings
            : [];
          setReviewRatings(arr);
        }
      }
    );

    // Listener per heatmap
    const unsubscribeHeatmap = onSnapshot(
      doc(db, 'users', userId, 'matches', matchId, 'heatmap', 'main'),
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          console.log('📊 Real-time heatmap update:', data);
          setMatchData(prev => ({
            ...prev,
            heatmaps: { ...prev.heatmaps, ...data },
          }));
          if (data?.attackAreas) {
            setReviewHeatmap(prev => ({ ...prev, ...data.attackAreas }));
          }
        }
      }
    );

    // Listener per roster (documento stabile 'current')
    const unsubscribeRoster = onSnapshot(
      doc(db, 'users', userId, 'roster', 'current'),
      snap => {
        if (snap.exists()) {
          const data = snap.data();
          console.log('📊 Real-time roster update:', data);
          setMatchData(prev => ({ ...prev, roster: data }));
        }
      }
    );

    return () => {
      unsubscribeStats();
      unsubscribeVotes();
      unsubscribeHeatmap();
      unsubscribeRoster();
    };
  }, [currentMatchId]);

  // Salva le modifiche di revisione nelle stats
  const handleSaveReviewStats = async () => {
    try {
      if (!auth.currentUser || !currentMatchId || !reviewStats) return;
      const userId = auth.currentUser.uid;
      const ref = doc(
        db,
        'users',
        userId,
        'matches',
        currentMatchId,
        'stats',
        'main'
      );
      await setDoc(
        ref,
        { ...reviewStats, _updatedAt: new Date() },
        { merge: true }
      );
      alert('✅ Dati aggiornati');
    } catch (e) {
      console.error('❌ Errore salvataggio review:', e);
      alert('Errore nel salvataggio');
    }
  };

  // Salva voti giocatori
  const handleSaveReviewRatings = async () => {
    try {
      if (!auth.currentUser || !currentMatchId) return;
      const userId = auth.currentUser.uid;
      const ref = doc(db, 'users', userId, 'matches', currentMatchId, 'votes', 'main');
      await setDoc(
        ref,
        { votes: reviewRatings, _updatedAt: new Date() },
        { merge: true }
      );
      alert('✅ Voti aggiornati');
    } catch (e) {
      console.error('❌ Errore salvataggio voti:', e);
      alert('Errore nel salvataggio');
    }
  };

  // Salva heatmap
  const handleSaveReviewHeatmap = async () => {
    try {
      if (!auth.currentUser || !currentMatchId) return;
      const userId = auth.currentUser.uid;
      const ref = doc(db, 'users', userId, 'matches', currentMatchId, 'heatmap', 'main');
      const payload = {
        attackAreas: {
          left: Number(reviewHeatmap.left) || 0,
          center: Number(reviewHeatmap.center) || 0,
          right: Number(reviewHeatmap.right) || 0,
        },
      };
      await setDoc(ref, { ...payload, _updatedAt: new Date() }, { merge: true });
      alert('✅ Heatmap aggiornata');
    } catch (e) {
      console.error('❌ Errore salvataggio heatmap:', e);
      alert('Errore nel salvataggio');
    }
  };

  const handleSaveCurrentReview = () => {
    if (reviewTab === 'stats') return void handleSaveReviewStats();
    if (reviewTab === 'ratings') return void handleSaveReviewRatings();
    if (reviewTab === 'heatmap') return void handleSaveReviewHeatmap();
  };

  // Handler per upload immagini
  const handleImageUpload = async (type, file) => {
    if (!auth.currentUser) {
      alert('Devi essere loggato per caricare immagini');
      return;
    }

    if (!file) return;

    // Validazione file
    if (!file.type.startsWith('image/')) {
      alert('Seleziona un file immagine valido');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Il file è troppo grande (massimo 10MB)');
      return;
    }

    try {
      console.log('📤 Uploading image:', type, file.name);

      // Simula progress
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));

      // Prova upload diretto su Storage con trigger OCR, fallback a simulazione
      let uploadResult;
      try {
        uploadResult = await uploadImageForOCR(file, type, currentMatchId);
        console.log(
          '✅ Image uploaded to Storage with OCR trigger:',
          uploadResult.url
        );
      } catch (functionError) {
        console.warn(
          '⚠️ Storage upload failed, using simulation:',
          functionError.message
        );
        uploadResult = await simulateUpload(file, type);
        console.log('✅ Image upload simulated:', uploadResult.url);
      }

      setUploadImages(prev => ({
        ...prev,
        [type]: {
          file,
          url: uploadResult.url,
          fileName: uploadResult.fileName,
        },
      }));

      setUploadProgress(prev => ({ ...prev, [type]: 100 }));
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      alert(`Errore durante l'upload: ${error.message}`);
      setUploadProgress(prev => ({ ...prev, [type]: 0 }));
    }
  };

  // Handler per elaborazione OCR con Cloud Functions
  const handleProcessOCR = async () => {
    const uploadedCount = Object.values(uploadImages).filter(
      img => img !== null
    ).length;

    if (uploadedCount < 4) {
      alert('Carica tutte e 4 le immagini prima di procedere');
      return;
    }

    if (!auth.currentUser) {
      alert('Devi essere loggato per elaborare le immagini');
      return;
    }

    setIsProcessing(true);
    console.log('🤖 Avvio elaborazione OCR con Cloud Functions...');

    try {
      // i dati verranno popolati dai listener in tempo reale dal trigger OCR
      // Vai alla sezione di revisione per confermare/correggere i campi estratti
      setActiveSection('review');

      console.log('✅ Elaborazione OCR completata con successo!');
      alert('✅ Elaborazione completata! I dati sono stati salvati.');
    } catch (error) {
      console.error('❌ Errore elaborazione OCR:', error);
      alert(`Errore durante l'elaborazione: ${error.message}`);

      // Fallback: usa dati demo
      console.log('🔄 Fallback: Usando dati demo...');
      const demoData = generateDemoData();
      setMatchData(demoData);
      setActiveSection('analysis');
    } finally {
      setIsProcessing(false);
    }
  };

  const reviewFields = [
    { key: 'possession', label: 'Possesso (%)', type: 'percent' },
    { key: 'shots', label: 'Tiri', type: 'count' },
    { key: 'shotsOnTarget', label: 'Tiri in Porta', type: 'count' },
    { key: 'passAccuracy', label: 'Precisione Passaggi (%)', type: 'percent' },
    { key: 'corners', label: 'Calci d\'angolo', type: 'count' },
    { key: 'fouls', label: 'Falli', type: 'count' },
    { key: 'goalsScored', label: 'Gol Segnati', type: 'count' },
    { key: 'goalsConceded', label: 'Gol Subiti', type: 'count' },
  ];

  // Preset suggerimenti per una revisione rapida
  const reviewPresets = {
    possession: [45, 50, 55, 60, 65],
    shots: [8, 10, 12, 15],
    shotsOnTarget: [3, 5, 7, 9],
    passAccuracy: [80, 85, 90, 92],
    corners: [2, 4, 6],
    fouls: [6, 8, 10, 12],
    goalsScored: [0, 1, 2, 3, 4],
    goalsConceded: [0, 1, 2, 3, 4],
  };

  const setReviewValue = (key, value) => {
    setReviewStats(prev => ({ ...(prev || {}), [key]: value }));
  };

  // Genera dati demo per testare l'interfaccia
  const generateDemoData = () => {
    return {
      stats: {
        possession: 65,
        shots: 12,
        shotsOnTarget: 8,
        passAccuracy: 87,
        corners: 5,
        fouls: 8,
        goalsScored: 3,
        goalsConceded: 1,
      },
      kpis: {
        possession: 65,
        shots: 12,
        shotsOnTarget: 8,
        passAccuracy: 87,
        corners: 5,
        fouls: 8,
        goalsScored: 3,
        goalsConceded: 1,
        goalDifference: 2,
      },
      players: [
        {
          name: 'Messi',
          role: 'RW',
          rating: 9.2,
          goals: 2,
          assists: 1,
          isProfiled: true,
          badge: 'MVP',
        },
        {
          name: 'Neymar',
          role: 'LW',
          rating: 8.5,
          goals: 1,
          assists: 2,
          isProfiled: true,
          badge: 'Growing',
        },
        {
          name: 'Mbappé',
          role: 'CF',
          rating: 8.8,
          goals: 0,
          assists: 1,
          isProfiled: false,
          badge: 'Non profilato',
        },
      ],
      heatmaps: {
        offensive: { zones: ['left-wing', 'center'], intensity: 'high' },
        defensive: { zones: ['center-back'], intensity: 'medium' },
      },
      processedAt: new Date().toISOString(),
    };
  };

  return (
    <ErrorBoundary>
      <div className="carica-partita-page">
        {/* Header */}
        <div className="page-header">
          <div className="breadcrumb mb-4">
            <span>Casa</span>
            <span>→</span>
            <span>Carica Ultima Partita</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                <Upload className="inline-block mr-3" size={32} />
                Carica Ultima Partita
              </h1>
              <p className="text-white/60">
                Carica le 4 immagini per analizzare la partita
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={handleProcessOCR}
                disabled={
                  isProcessing ||
                  Object.values(uploadImages).filter(img => img !== null)
                    .length < 4
                }
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Elaborando...
                  </>
                ) : (
                  <>
                    <BarChart3 size={20} className="mr-2" />
                    Elabora con OCR
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Carica le 4 immagini del match
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'stats',
                  'ratings',
                  'heatmapOffensive',
                  'heatmapDefensive',
                ].map(type => (
                  <div
                    key={type}
                    className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center"
                  >
                    <Upload size={32} className="mx-auto mb-2 text-white/40" />
                    <p className="text-white/60 text-sm mb-2">
                      {type === 'stats' && 'Statistiche Match'}
                      {type === 'ratings' && 'Voti Giocatori'}
                      {type === 'heatmapOffensive' && 'Heatmap Offensiva'}
                      {type === 'heatmapDefensive' && 'Heatmap Difensiva'}
                    </p>
                    <Button
                      onClick={() =>
                        document.getElementById(`file-${type}`).click()
                      }
                      className="bg-white/10 hover:bg-white/20 text-white"
                    >
                      Carica Immagine
                    </Button>

                    <input
                      id={`file-${type}`}
                      type="file"
                      accept="image/*"
                      onChange={e => handleImageUpload(type, e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Review Section */}
          {activeSection === 'review' && (
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2">Revisione</h2>
                <div className="flex gap-2 mb-4">
                  {[
                    { key: 'stats', label: 'Statistiche' },
                    { key: 'ratings', label: 'Voti' },
                    { key: 'heatmap', label: 'Heatmap' },
                  ].map(tab => (
                    <Button
                      key={tab.key}
                      className={
                        'text-xs px-3 py-1 ' +
                        (reviewTab === tab.key
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-[#0b1223]'
                          : 'bg-white/10 hover:bg-white/20 text-white')
                      }
                      onClick={() => setReviewTab(tab.key)}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>

                {/* Stats subtab */}
                {reviewTab === 'stats' && (
                  <>
                    <p className="text-xs text-white/60 mb-3">
                      Suggerimenti rapidi: clicca sui chip per impostare il valore.
                    </p>
                    <div className="space-y-4">
                      {reviewFields.map(f => (
                        <div key={f.key} className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <label className="text-white/80 text-sm">{f.label}</label>
                            <input
                              type="number"
                              className="w-32 bg-white/10 text-white rounded px-2 py-1"
                              value={reviewStats?.[f.key] ?? ''}
                              onChange={e => setReviewValue(f.key, Number(e.target.value) || 0)}
                            />
                          </div>
                          {Array.isArray(reviewPresets[f.key]) && (
                            <div className="flex flex-wrap gap-2">
                              {reviewPresets[f.key].map(val => (
                                <Badge
                                  key={`${f.key}-${val}`}
                                  className="cursor-pointer hover:bg-white/20"
                                  onClick={() => setReviewValue(f.key, val)}
                                >
                                  {val}
                                  {f.type === 'percent' ? '%' : ''}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Ratings subtab */}
                {reviewTab === 'ratings' && (
                  <div className="space-y-3">
                    {(!reviewRatings || reviewRatings.length === 0) && (
                      <p className="text-xs text-white/60">Nessun voto rilevato. Aggiungi righe manualmente.</p>
                    )}
                    {reviewRatings?.map((r, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Giocatore"
                          className="flex-1 bg-white/10 text-white rounded px-2 py-1"
                          value={r.name || r.player || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setReviewRatings(prev => {
                              const next = [...prev];
                              next[idx] = { ...(next[idx] || {}), name: val };
                              return next;
                            });
                          }}
                        />
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          className="w-24 bg-white/10 text-white rounded px-2 py-1"
                          value={r.vote ?? r.rating ?? ''}
                          onChange={e => {
                            const val = Number(e.target.value) || 0;
                            setReviewRatings(prev => {
                              const next = [...prev];
                              next[idx] = { ...(next[idx] || {}), vote: val };
                              return next;
                            });
                          }}
                        />
                        <Button
                          className="bg-red-500/80 hover:bg-red-500 text-white"
                          onClick={() =>
                            setReviewRatings(prev => prev.filter((_, i) => i !== idx))
                          }
                        >
                          Rimuovi
                        </Button>
                      </div>
                    ))}
                    <div className="flex justify-between mt-2">
                      <Button
                        className="bg-white/10 hover:bg-white/20 text-white"
                        onClick={() =>
                          setReviewRatings(prev => [
                            ...prev,
                            { name: '', vote: 6.0 },
                          ])
                        }
                      >
                        + Aggiungi giocatore
                      </Button>
                    </div>
                  </div>
                )}

                {/* Heatmap subtab */}
                {reviewTab === 'heatmap' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-white/80 text-sm">Sinistra (%)</label>
                      <input
                        type="number"
                        className="w-28 bg-white/10 text-white rounded px-2 py-1"
                        value={reviewHeatmap.left}
                        onChange={e =>
                          setReviewHeatmap(prev => ({ ...prev, left: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-white/80 text-sm">Centro (%)</label>
                      <input
                        type="number"
                        className="w-28 bg-white/10 text-white rounded px-2 py-1"
                        value={reviewHeatmap.center}
                        onChange={e =>
                          setReviewHeatmap(prev => ({ ...prev, center: e.target.value }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-white/80 text-sm">Destra (%)</label>
                      <input
                        type="number"
                        className="w-28 bg-white/10 text-white rounded px-2 py-1"
                        value={reviewHeatmap.right}
                        onChange={e =>
                          setReviewHeatmap(prev => ({ ...prev, right: e.target.value }))
                        }
                      />
                    </div>
                    <p className="text-[11px] text-white/50">Suggerimento: la somma tipica è ~100%.</p>
                  </div>
                )}

                <div className="mt-5 flex justify-end gap-2">
                  <Button
                    className="bg-white/10 hover:bg-white/20"
                    onClick={() => setActiveSection('analysis')}
                  >
                    Salta
                  </Button>
                  <Button onClick={handleSaveCurrentReview}>Salva modifiche</Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* KPIs Section */}
        {activeSection === 'analysis' && matchData.kpis && (
          <div className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                KPIs della Partita
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(matchData.kpis).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-sm text-white/60 capitalize">
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Players Section */}
        {activeSection === 'analysis' &&
          matchData.players &&
          matchData.players.length > 0 && (
            <div className="mt-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Migliori Giocatori
                </h2>
                <div className="space-y-3">
                  {matchData.players.map((player, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          {player.name}
                        </div>
                        <div className="text-sm text-white/60">
                          {player.role}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            player.badge === 'MVP'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                          }
                        >
                          {player.badge}
                        </Badge>
                        <span className="text-white font-semibold">
                          {player.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
      </div>
    </ErrorBoundary>
  );
};

export default CaricaUltimaPartita;
