import React, { useState, useEffect } from 'react';
import {
  addPlayer,
  updatePlayer,
  deletePlayerById,
  listenToPlayers,
  uploadPlayerImage,
} from '../services/firebaseClient';
import PlayerProfile from '../components/PlayerProfile';
import FormationBuilder from '../components/FormationBuilder';
import CompletePlayerEditor from '../components/CompletePlayerEditor';
import { realOCRService } from '../services/realOCRService';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';

const PlayerManagement = ({ user }) => {
  console.log('🎯 PlayerManagement rendering with user:', user);

  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'profile', 'formation'

  // OCR States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [showOCRModal, setShowOCRModal] = useState(false);

  // Editor States
  const [showCompleteEditor, setShowCompleteEditor] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  // Live players from Firestore
  useEffect(() => {
    if (!user) return;
    console.log('🔍 Setting up players listener for user:', user.uid);
    try {
      const unsub = listenToPlayers(user.uid, items => {
        console.log('📊 Players updated:', items);
        setPlayers(items);
      });
      return () => {
        if (typeof unsub === 'function') unsub();
      };
    } catch (error) {
      console.error('❌ Error setting up players listener:', error);
    }
  }, [user]);

  const positions = [
    { value: 'all', label: 'Tutte le posizioni' },
    { value: 'GK', label: 'Portiere' },
    { value: 'CB', label: 'Difensore Centrale' },
    { value: 'LB', label: 'Terzino Sinistro' },
    { value: 'RB', label: 'Terzino Destro' },
    { value: 'DMF', label: 'Centrocampista Difensivo' },
    { value: 'CMF', label: 'Centrocampista' },
    { value: 'AMF', label: 'Trequartista' },
    { value: 'LWF', label: 'Ala Sinistra' },
    { value: 'RWF', label: 'Ala Destra' },
    { value: 'SS', label: 'Seconda Punta' },
    { value: 'CF', label: 'Attaccante' },
    { value: 'ST', label: 'Attaccante' },
  ];

  const filteredPlayers = players
    .filter(player => {
      const matchesSearch = (player.name || '')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPosition =
        filterPosition === 'all' || (player.position || '') === filterPosition;
      return matchesSearch && matchesPosition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'age':
          return (a.age || 25) - (b.age || 25);
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      minHeight: '100vh',
      padding: '2rem',
      color: 'white',
    },
    header: {
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#E5E7EB',
    },
    subtitle: {
      color: '#9CA3AF',
      fontSize: '1rem',
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
    },
    input: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: '1px solid #4B5563',
      backgroundColor: '#374151',
      color: 'white',
      minWidth: '200px',
    },
    select: {
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: '1px solid #4B5563',
      backgroundColor: '#374151',
      color: 'white',
      minWidth: '150px',
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: 'none',
      backgroundColor: '#3B82F6',
      color: 'white',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    buttonSecondary: {
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      border: '1px solid #4B5563',
      backgroundColor: 'transparent',
      color: '#E5E7EB',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    tabs: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '2rem',
    },
    tab: {
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #4B5563',
      backgroundColor: 'transparent',
      color: '#9CA3AF',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    tabActive: {
      backgroundColor: '#3B82F6',
      color: 'white',
      borderColor: '#3B82F6',
    },
    playersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    playerCard: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    playerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    playerName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
    },
    playerRating: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#F59E0B',
    },
    playerInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      marginBottom: '1rem',
    },
    infoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
    },
    infoValue: {
      color: '#E5E7EB',
      fontWeight: '500',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
    },
    statName: {
      color: '#9CA3AF',
    },
    statValue: {
      color: '#E5E7EB',
      fontWeight: '500',
    },
    formBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: 'bold',
    },
    summary: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563',
      marginTop: '2rem',
    },
    summaryTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#E5E7EB',
    },
    summaryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
    },
    summaryItem: {
      textAlign: 'center',
      padding: '1rem',
      backgroundColor: '#4B5563',
      borderRadius: '0.5rem',
    },
    summaryValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#3B82F6',
      marginBottom: '0.5rem',
    },
    summaryLabel: {
      color: '#9CA3AF',
      fontSize: '0.875rem',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#1F2937',
      borderRadius: '0.75rem',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#9CA3AF',
      fontSize: '1.5rem',
      cursor: 'pointer',
    },
    statusMessage: {
      padding: '1rem',
      borderRadius: '0.5rem',
      textAlign: 'center',
      fontWeight: '500',
    },
  };

  const getFormColor = form => {
    switch (form) {
      case 'A':
        return { backgroundColor: '#10B981', color: 'white' };
      case 'B':
        return { backgroundColor: '#F59E0B', color: 'white' };
      case 'C':
        return { backgroundColor: '#EF4444', color: 'white' };
      case 'D':
        return { backgroundColor: '#6B7280', color: 'white' };
      default:
        return { backgroundColor: '#6B7280', color: 'white' };
    }
  };

  const handleAddPlayer = () => {
    console.log('🎯 Adding new player...');
    console.log('🎯 showCompleteEditor before:', showCompleteEditor);
    console.log('🎯 editingPlayer before:', editingPlayer);
    setShowCompleteEditor(true);
    setEditingPlayer(null);
    console.log('🎯 showCompleteEditor after:', true);
    console.log('🎯 editingPlayer after:', null);
  };

  const handleViewPlayer = player => {
    setSelectedPlayer(player);
    setViewMode('profile');
  };

  // Simplified OCR Functions
  const handleImageUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    event.target.value = '';
    setIsUploading(true);
    setUploadStatus('processing');

    try {
      const result = await realOCRService.processImage(file);
      setOcrResult(result);
      setUploadStatus('success');
      setShowOCRModal(true);
    } catch (error) {
      console.error('❌ OCR failed:', error);
      setUploadStatus('error');
      setOcrResult({ error: "Errore durante l'analisi dell'immagine" });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePlayerImageUpload = async (e, kind) => {
    const file = e.target.files[0];
    if (!file || !user || !selectedPlayer?.id) return;

    setIsUploading(true);
    setUploadStatus('uploading');

    try {
      await uploadPlayerImage(user.uid, selectedPlayer.id, file, kind);
      setUploadStatus('success');
    } catch (err) {
      console.error('❌ Player image upload failed:', err);
      setUploadStatus('error');
    } finally {
      e.target.value = '';
      setIsUploading(false);
    }
  };

  const handleAddPlayerFromOCR = () => {
    if (!ocrResult || !user) return;

    const newPlayer = {
      name: ocrResult.playerName || 'Giocatore Sconosciuto',
      position: ocrResult.position || 'Unknown',
      rating: ocrResult.rating || 0,
      age: ocrResult.age || 25,
      nationality: ocrResult.nationality || 'Unknown',
      team: ocrResult.team || 'Unknown',
      stats: ocrResult.stats || {},
      abilities: ocrResult.abilities || [],
      boosters: ocrResult.boosters || [],
      physical: ocrResult.physical || {},
    };

    addPlayer(user.uid, newPlayer);
    setShowOCRModal(false);
    setOcrResult(null);
    setUploadStatus(null);
  };

  // Editor functions
  const handleEditPlayer = player => {
    setEditingPlayer(player);
    setShowCompleteEditor(true);
  };

  const handleSaveEditedPlayer = async editedPlayer => {
    if (!user) return;
    try {
      await updatePlayer(user.uid, editedPlayer.id, editedPlayer);
      setShowCompleteEditor(false);
      setEditingPlayer(null);
    } catch (error) {
      console.error('❌ Error updating player:', error);
    }
  };

  const handleCloseEditor = () => {
    setShowCompleteEditor(false);
    setEditingPlayer(null);
  };

  const handleDeletePlayer = async playerId => {
    if (!user) return;
    try {
      await deletePlayerById(user.uid, playerId);
    } catch (error) {
      console.error('❌ Error deleting player:', error);
    }
  };

  try {
    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>👥 Gestione Rosa</h1>
          <p style={styles.subtitle}>
            Gestisci la tua squadra, statistiche e valutazioni dei giocatori
          </p>
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="Cerca giocatore..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          <select
            value={filterPosition}
            onChange={e => setFilterPosition(e.target.value)}
            style={styles.select}
          >
            {positions.map(pos => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="rating">Per Rating</option>
            <option value="age">Per Età</option>
            <option value="name">Per Nome</option>
          </select>
          <button onClick={handleAddPlayer} style={styles.button}>
            + Aggiungi Giocatore
          </button>
          <button
            onClick={() => document.getElementById('imageUpload').click()}
            style={styles.buttonSecondary}
          >
            <Camera size={16} style={{ marginRight: '0.5rem' }} />
            Carica da Screenshot
          </button>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              ...styles.tab,
              ...(viewMode === 'list' ? styles.tabActive : {}),
            }}
          >
            Lista Giocatori
          </button>
          <button
            onClick={() => setViewMode('formation')}
            style={{
              ...styles.tab,
              ...(viewMode === 'formation' ? styles.tabActive : {}),
            }}
          >
            Formazione
          </button>
        </div>

        {/* Players List */}
        {viewMode === 'list' && (
          <div style={styles.playersGrid}>
            {filteredPlayers.map(player => (
              <div
                key={player.id}
                style={styles.playerCard}
                onClick={() => handleViewPlayer(player)}
              >
                {/* Form Badge */}
                <div
                  style={{
                    ...styles.formBadge,
                    ...getFormColor(player.form || 'B'),
                  }}
                >
                  {player.form || 'B'}
                </div>

                {/* Player Header */}
                <div style={styles.playerHeader}>
                  <div>
                    <div style={styles.playerName}>
                      {player.name || 'Giocatore Sconosciuto'}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                      {player.position || 'N/A'} • {player.age || 25} anni
                    </div>
                  </div>
                  <div style={styles.playerRating}>{player.rating || 0}</div>
                </div>

                {/* Player Info */}
                <div style={styles.playerInfo}>
                  <div style={styles.infoItem}>
                    <div>Nazionalità:</div>
                    <div style={styles.infoValue}>
                      {player.nationality || 'N/A'}
                    </div>
                  </div>
                  <div style={styles.infoItem}>
                    <div>Squadra:</div>
                    <div style={styles.infoValue}>{player.team || 'N/A'}</div>
                  </div>
                  <div style={styles.infoItem}>
                    <div>Altezza:</div>
                    <div style={styles.infoValue}>
                      {player.physical?.height || 180} cm
                    </div>
                  </div>
                  <div style={styles.infoItem}>
                    <div>Peso:</div>
                    <div style={styles.infoValue}>
                      {player.physical?.weight || 75} kg
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={styles.statsGrid}>
                  {Object.entries(player.stats || {})
                    .slice(0, 4)
                    .map(([stat, value]) => (
                      <div key={stat} style={styles.statItem}>
                        <div style={styles.statName}>{stat}</div>
                        <div style={styles.statValue}>{value}</div>
                      </div>
                    ))}
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '1rem',
                  }}
                >
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleEditPlayer(player);
                    }}
                    style={{
                      ...styles.button,
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    Modifica
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDeletePlayer(player.id);
                    }}
                    style={{
                      ...styles.buttonSecondary,
                      padding: '0.5rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Player Profile View */}
        {viewMode === 'profile' && selectedPlayer && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setViewMode('list')}
                style={styles.buttonSecondary}
              >
                ← Torna alla Lista
              </button>
            </div>
            <PlayerProfile
              player={selectedPlayer}
              onEdit={() => handleEditPlayer(selectedPlayer)}
              showEditButton={true}
              onImageUpload={handlePlayerImageUpload}
            />
          </>
        )}

        {/* Formation Builder */}
        {viewMode === 'formation' && (
          <FormationBuilder
            players={filteredPlayers}
            onSave={formationData => {
              console.log('Formation saved:', formationData);
            }}
            onReset={() => {
              console.log('Formation reset');
            }}
          />
        )}

        {/* Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>📊 Riepilogo Squadra</h3>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryItem}>
              <div style={styles.summaryValue}>{players.length}</div>
              <div style={styles.summaryLabel}>Giocatori Totali</div>
            </div>
            <div style={styles.summaryItem}>
              <div style={styles.summaryValue}>
                {players.length > 0
                  ? Math.round(
                      players.reduce((sum, p) => sum + (p.rating || 0), 0) /
                        players.length
                    )
                  : 0}
              </div>
              <div style={styles.summaryLabel}>Rating Medio</div>
            </div>
            <div style={styles.summaryItem}>
              <div style={styles.summaryValue}>
                {players.filter(p => (p.form || 'B') === 'A').length}
              </div>
              <div style={styles.summaryLabel}>In Forma</div>
            </div>
          </div>
        </div>

        {/* OCR Results Modal */}
        {showOCRModal && ocrResult && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>
                  {ocrResult.error ? '❌ Errore OCR' : '🔍 Risultato OCR Giocatore'}
                </h2>
                <button
                  onClick={() => setShowOCRModal(false)}
                  style={styles.closeButton}
                >
                  ✕
                </button>
              </div>

              {ocrResult.error ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <AlertCircle size={48} style={{ color: '#EF4444' }} />
                  <h3 style={{ color: '#EF4444', marginTop: '1rem' }}>
                    Errore nell'analisi dell'immagine
                  </h3>
                  <p style={{ color: '#9CA3AF', marginTop: '0.5rem' }}>
                    {ocrResult.error}
                  </p>
                </div>
              ) : (
                <div>
                  <h3 style={{ color: '#E5E7EB', marginBottom: '1rem' }}>
                    Dati rilevati:
                  </h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Nome:</strong> {ocrResult.playerName || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Posizione:</strong> {ocrResult.position || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Rating:</strong> {ocrResult.rating || 'N/A'}
                  </div>
                  {ocrResult.stats && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>Statistiche:</strong>
                      <div style={{ marginTop: '0.5rem' }}>
                        {Object.entries(ocrResult.stats).map(([stat, value]) => (
                          <div key={stat} style={{ fontSize: '0.875rem' }}>
                            {stat}: {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleAddPlayerFromOCR}
                    style={styles.button}
                  >
                    <CheckCircle size={20} style={{ marginRight: '0.5rem' }} />
                    Aggiungi Giocatore
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Complete Player Editor Modal */}
        {showCompleteEditor && (
          <>
            {console.log('🎯 Rendering CompletePlayerEditor with:', { showCompleteEditor, editingPlayer })}
            <CompletePlayerEditor
              player={editingPlayer}
              onSave={handleSaveEditedPlayer}
              onClose={handleCloseEditor}
              isOpen={showCompleteEditor}
            />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error('❌ Error rendering PlayerManagement:', error);
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>❌ Errore</h1>
          <p style={styles.subtitle}>
            Si è verificato un errore nel caricamento della pagina
          </p>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Errore: {error.message}</p>
          <button onClick={() => window.location.reload()}>
            Ricarica Pagina
          </button>
        </div>
      </div>
    );
  }
};

export default PlayerManagement;