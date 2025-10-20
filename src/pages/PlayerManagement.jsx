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
    { value: 'CDM', label: 'Mediano' },
    { value: 'CM', label: 'Centrocampista' },
    { value: 'CAM', label: 'Trequartista' },
    { value: 'LW', label: 'Ala Sinistra' },
    { value: 'RW', label: 'Ala Destra' },
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
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '0.5rem',
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#9CA3AF',
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    searchInput: {
      flex: 1,
      minWidth: '200px',
      padding: '0.75rem',
      backgroundColor: '#374151',
      border: '1px solid #4B5563',
      borderRadius: '0.5rem',
      color: '#E5E7EB',
      fontSize: '0.875rem',
    },
    select: {
      padding: '0.75rem',
      backgroundColor: '#374151',
      border: '1px solid #4B5563',
      borderRadius: '0.5rem',
      color: '#E5E7EB',
      fontSize: '0.875rem',
    },
    // Base button used for view-mode tabs
    button: {
      padding: '0.5rem 0.875rem',
      borderRadius: '0.6rem',
      border: '1px solid rgba(255,255,255,0.08)',
      color: 'white',
      fontSize: '0.875rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 1px 1px rgba(0,0,0,0.04)',
    },
    tabActive: {
      background: 'linear-gradient(180deg, #3B82F6 0%, #2563EB 100%)',
      boxShadow:
        '0 6px 12px rgba(37, 99, 235, 0.25), inset 0 1px 0 rgba(255,255,255,0.06)',
      transform: 'translateY(-1px)',
    },
    tabIdle: {
      background: '#6B7280',
      opacity: 0.95,
    },
    addButton: {
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.75rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      textTransform: 'none',
      letterSpacing: '0.025em',
      ':hover': {
        backgroundColor: '#059669',
        transform: 'translateY(-1px)',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
    playersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    playerCard: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
    },
    playerCardHover: {
      backgroundColor: '#4B5563',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },

    // OCR Styles
    uploadSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },

    uploadButtons: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
    },

    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },

    modalContent: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },

    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
      borderBottom: '1px solid #E5E7EB',
      paddingBottom: '1rem',
    },

    modalTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1F2937',
      margin: 0,
    },

    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#6B7280',
      padding: '0.5rem',
      borderRadius: '0.5rem',
    },

    ocrResults: {
      marginBottom: '1.5rem',
    },

    ocrSection: {
      marginBottom: '1.5rem',
    },

    ocrSectionTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '0.75rem',
    },

    ocrData: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '0.75rem',
    },

    ocrItem: {
      padding: '0.75rem',
      backgroundColor: '#F9FAFB',
      borderRadius: '0.5rem',
      border: '1px solid #E5E7EB',
    },

    ocrStatsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '0.5rem',
    },

    ocrStatItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem',
      backgroundColor: '#F3F4F6',
      borderRadius: '0.375rem',
    },

    ocrStatLabel: {
      fontWeight: '500',
      color: '#374151',
    },

    ocrStatValue: {
      fontWeight: 'bold',
      color: '#1F2937',
    },

    abilitiesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },

    abilityTag: {
      backgroundColor: '#DBEAFE',
      color: '#1E40AF',
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },

    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '1rem',
      borderTop: '1px solid #E5E7EB',
      paddingTop: '1rem',
    },

    cancelButton: {
      backgroundColor: '#F3F4F6',
      color: '#374151',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
    },

    confirmButton: {
      backgroundColor: '#10B981',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },

    statusOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },

    statusContent: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    },

    loadingSpinner: {
      width: '40px',
      height: '40px',
      border: '4px solid #E5E7EB',
      borderTop: '4px solid #10B981',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 1rem',
    },

    statusText: {
      fontSize: '1.125rem',
      color: '#374151',
      margin: 0,
    },

    errorOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },

    errorContent: {
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
    },

    errorTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1F2937',
      margin: '1rem 0 0.5rem',
    },

    errorText: {
      color: '#6B7280',
      marginBottom: '1.5rem',
    },

    retryButton: {
      backgroundColor: '#EF4444',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
    },

    errorSection: {
      textAlign: 'center',
      padding: '2rem',
    },

    errorIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },

    errorMessage: {
      fontSize: '1rem',
      color: '#6B7280',
      marginBottom: '1.5rem',
      lineHeight: '1.5',
    },

    errorTips: {
      backgroundColor: '#F9FAFB',
      borderRadius: '0.5rem',
      padding: '1rem',
      border: '1px solid #E5E7EB',
      textAlign: 'left',
    },

    tipsTitle: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#374151',
      marginBottom: '0.5rem',
    },

    tipsList: {
      margin: 0,
      paddingLeft: '1.5rem',
      color: '#6B7280',
      lineHeight: '1.5',
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
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#10B981',
    },
    playerInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem',
      marginBottom: '1rem',
    },
    infoItem: {
      fontSize: '0.875rem',
      color: '#9CA3AF',
    },
    infoValue: {
      color: '#E5E7EB',
      fontWeight: '500',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.5rem',
      marginTop: '1rem',
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.25rem 0',
    },
    statName: {
      fontSize: '0.75rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    statValue: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
    },
    statBar: {
      width: '100%',
      height: '4px',
      backgroundColor: '#1F2937',
      borderRadius: '2px',
      marginTop: '0.25rem',
      overflow: 'hidden',
    },
    statBarFill: {
      height: '100%',
      borderRadius: '2px',
      transition: 'width 0.3s ease',
    },
    formBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    excellent: { backgroundColor: '#10B981', color: 'white' },
    good: { backgroundColor: '#3B82F6', color: 'white' },
    average: { backgroundColor: '#F59E0B', color: 'white' },
    poor: { backgroundColor: '#EF4444', color: 'white' },
    uploadStatus: {
      backgroundColor: '#374151',
      border: '1px solid #4B5563',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    statusMessage: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid #4B5563',
      borderTop: '2px solid #3B82F6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  const getFormColor = form => {
    switch (form) {
      case 'Excellent':
        return styles.excellent;
      case 'Good':
        return styles.good;
      case 'Average':
        return styles.average;
      case 'Poor':
        return styles.poor;
      default:
        return styles.average;
    }
  };

  const getStatColor = value => {
    if (value >= 90) return '#10B981';
    if (value >= 80) return '#3B82F6';
    if (value >= 70) return '#F59E0B';
    if (value >= 60) return '#EF4444';
    return '#6B7280';
  };

  const handleAddPlayer = () => {
    console.log('Adding new player...');
    setShowCompleteEditor(true);
    setEditingPlayer(null);
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
          style={styles.searchInput}
          type="text"
          placeholder="Cerca giocatore..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <select
          style={styles.select}
          value={filterPosition}
          onChange={e => setFilterPosition(e.target.value)}
        >
          {positions.map(pos => (
            <option key={pos.value} value={pos.value}>
              {pos.label}
            </option>
          ))}
        </select>

        <select
          style={styles.select}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="rating">Rating</option>
          <option value="age">Età</option>
          <option value="name">Nome</option>
        </select>

        <div style={styles.uploadSection}>
          <div style={styles.uploadButtons}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="player-profile-upload"
            />
            <label
              htmlFor="player-profile-upload"
              style={{
                ...styles.addButton,
                backgroundColor: '#10B981',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.7 : 1,
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
              }}
            >
              <Camera size={16} />
              {isUploading ? '⏳ Analizzando...' : '📸 Profilo Giocatore'}
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="player-stats-upload"
            />
            <label
              htmlFor="player-stats-upload"
              style={{
                ...styles.addButton,
                backgroundColor: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.7 : 1,
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
              }}
            >
              <Camera size={16} />
              📊 Statistiche
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="player-abilities-upload"
            />
            <label
              htmlFor="player-abilities-upload"
              style={{
                ...styles.addButton,
                backgroundColor: '#8B5CF6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.7 : 1,
                fontSize: '0.875rem',
                padding: '0.5rem 1rem',
              }}
            >
              <Camera size={16} />
              🎯 Abilità
            </label>
          </div>
        </div>

        <button style={styles.addButton} onClick={handleAddPlayer}>
          ➕ Aggiungi Giocatore Manuale
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            style={{
              ...styles.button,
              ...(viewMode === 'list' ? styles.tabActive : styles.tabIdle),
            }}
            onClick={() => setViewMode('list')}
          >
            📋 Lista
          </button>
          <button
            style={{
              ...styles.button,
              ...(viewMode === 'profile' ? styles.tabActive : styles.tabIdle),
            }}
            onClick={() => setViewMode('profile')}
          >
            👤 Profilo
          </button>
          <button
            style={{
              ...styles.button,
              ...(viewMode === 'formation' ? styles.tabActive : styles.tabIdle),
            }}
            onClick={() => setViewMode('formation')}
          >
            📐 Formazione
          </button>
        </div>
      </div>

      {/* Render different views */}
      {viewMode === 'list' && (
        <div style={styles.playersGrid}>
          {filteredPlayers.map(player => (
            <div
              key={player.id}
              style={styles.playerCard}
              onClick={() => handleViewPlayer(player)}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#4B5563';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#374151';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
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
                  <div style={styles.playerName}>{player.name || 'Giocatore Sconosciuto'}</div>
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
                  <div style={styles.infoValue}>{player.nationality || 'N/A'}</div>
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

              {/* Stat Bars */}
              <div style={{ marginTop: '1rem' }}>
                {Object.entries(player.stats || {})
                  .slice(0, 3)
                  .map(([stat, value]) => (
                    <div key={stat} style={{ marginBottom: '0.5rem' }}>
                      <div style={styles.statItem}>
                        <div style={styles.statName}>{stat}</div>
                        <div style={styles.statValue}>{value}</div>
                      </div>
                      <div style={styles.statBar}>
                        <div
                          style={{
                            ...styles.statBarFill,
                            width: `${value}%`,
                            backgroundColor: getStatColor(value),
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>

              {/* Edit Button */}
              <div
                style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}
              >
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleEditPlayer(player);
                  }}
                  style={{
                    ...styles.button,
                    backgroundColor: '#3B82F6',
                    color: '#fff',
                    fontSize: '0.75rem',
                    padding: '0.5rem 1rem',
                    flex: 1,
                  }}
                >
                  ✏️ Modifica
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDeletePlayer(player.id);
                  }}
                  style={{
                    ...styles.button,
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    fontSize: '0.75rem',
                    padding: '0.5rem 1rem',
                    flex: 1,
                  }}
                >
                  🗑️ Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'profile' && selectedPlayer && (
        <>
          {isUploading && (
            <div style={styles.uploadStatus}>
              {uploadStatus === 'uploading' && (
                <div style={styles.statusMessage}>
                  <div style={styles.spinner}></div>
                  Caricamento immagine...
                </div>
              )}
              {uploadStatus === 'processing' && (
                <div style={styles.statusMessage}>
                  <div style={styles.spinner}></div>
                  Google Vision sta analizzando l'immagine...
                </div>
              )}
              {uploadStatus === 'success' && (
                <div style={{ ...styles.statusMessage, color: '#10B981' }}>
                  ✅ Immagine caricata con successo!
                </div>
              )}
              {uploadStatus === 'error' && (
                <div style={{ ...styles.statusMessage, color: '#EF4444' }}>
                  ❌ Errore durante il caricamento
                </div>
              )}
            </div>
          )}
          <PlayerProfile
            player={selectedPlayer}
            onEdit={() => setIsEditing(true)}
            showEditButton={true}
            onImageUpload={handlePlayerImageUpload}
          />
        </>
      )}

      {viewMode === 'formation' && (
        <FormationBuilder
          players={filteredPlayers}
          onSave={formationData => {
            console.log('Formation saved:', formationData);
            // Implement save logic
          }}
          onReset={() => {
            console.log('Formation reset');
            // Implement reset logic
          }}
        />
      )}

      {/* Summary */}
      <div
        style={{
          backgroundColor: '#374151',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          border: '1px solid #4B5563',
        }}
      >
        <h3
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#E5E7EB',
          }}
        >
          📊 Riepilogo Squadra
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}
            >
              {players.length}
            </div>
            <div style={{ color: '#9CA3AF' }}>Giocatori</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6' }}
            >
              {Math.round(
                players.reduce((sum, p) => sum + p.rating, 0) / players.length
              )}
            </div>
            <div style={{ color: '#9CA3AF' }}>Rating Medio</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}
            >
              {players.filter(p => p.form === 'Excellent').length}
            </div>
            <div style={{ color: '#9CA3AF' }}>In Forma</div>
          </div>
        </div>
      </div>

      {/* OCR Results Modal */}
      {showOCRModal && ocrResult && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {ocrResult.error
                  ? '❌ Errore OCR'
                  : '🔍 Risultato OCR Giocatore'}
              </h2>
              <button
                onClick={() => setShowOCRModal(false)}
                style={styles.closeButton}
              >
                ✕
              </button>
            </div>

            {ocrResult.error ? (
              <div style={styles.errorSection}>
                <div style={styles.errorIcon}>⚠️</div>
                <h3 style={styles.errorTitle}>
                  Errore nell'analisi dell'immagine
                </h3>
                <p style={styles.errorMessage}>{ocrResult.error}</p>
                <div style={styles.errorTips}>
                  <h4 style={styles.tipsTitle}>💡 Suggerimenti:</h4>
                  <ul style={styles.tipsList}>
                    <li>Assicurati che l'immagine sia ben illuminata</li>
                    <li>Evita riflessi e ombre</li>
                    <li>Usa immagini ad alta risoluzione</li>
                    <li>Mantieni il testo orizzontale</li>
                    <li>Prova con screenshot invece di foto</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div style={styles.ocrResults}>
                <div style={styles.ocrSection}>
                  <h3 style={styles.ocrSectionTitle}>📊 Dati Estratti:</h3>
                  <div style={styles.ocrData}>
                    <div style={styles.ocrItem}>
                      <strong>Nome:</strong> {ocrResult.playerName || 'N/A'}
                    </div>
                    <div style={styles.ocrItem}>
                      <strong>Rating:</strong> {ocrResult.rating || 'N/A'}
                    </div>
                    <div style={styles.ocrItem}>
                      <strong>Posizione:</strong> {ocrResult.position || 'N/A'}
                    </div>
                    <div style={styles.ocrItem}>
                      <strong>Età:</strong> {ocrResult.age || 'N/A'}
                    </div>
                    <div style={styles.ocrItem}>
                      <strong>Nazionalità:</strong>{' '}
                      {ocrResult.nationality || 'N/A'}
                    </div>
                    <div style={styles.ocrItem}>
                      <strong>Squadra:</strong> {ocrResult.team || 'N/A'}
                    </div>
                  </div>
                </div>

                {ocrResult.stats && Object.keys(ocrResult.stats).length > 0 && (
                  <div style={styles.ocrSection}>
                    <h3 style={styles.ocrSectionTitle}>⚽ Statistiche:</h3>
                    <div style={styles.ocrStatsGrid}>
                      {Object.entries(ocrResult.stats).map(([key, value]) => (
                        <div key={key} style={styles.ocrStatItem}>
                          <span style={styles.ocrStatLabel}>{key}:</span>
                          <span style={styles.ocrStatValue}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {ocrResult.abilities && ocrResult.abilities.length > 0 && (
                  <div style={styles.ocrSection}>
                    <h3 style={styles.ocrSectionTitle}>🎯 Abilità:</h3>
                    <div style={styles.abilitiesList}>
                      {ocrResult.abilities.map((ability, index) => (
                        <span key={index} style={styles.abilityTag}>
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div style={styles.modalActions}>
              <button
                onClick={() => setShowOCRModal(false)}
                style={styles.cancelButton}
              >
                {ocrResult.error ? 'Chiudi' : 'Annulla'}
              </button>
              {!ocrResult.error && (
                <button
                  onClick={handleAddPlayerFromOCR}
                  style={styles.confirmButton}
                >
                  <CheckCircle size={20} />
                  Aggiungi Giocatore
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {uploadStatus === 'processing' && (
        <div style={styles.statusOverlay}>
          <div style={styles.statusContent}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.statusText}>
              🔍 Analizzando screenshot giocatore...
            </p>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div style={styles.errorOverlay}>
          <div style={styles.errorContent}>
            <AlertCircle size={48} style={{ color: '#EF4444' }} />
            <h3 style={styles.errorTitle}>Errore OCR</h3>
            <p style={styles.errorText}>
              Non è stato possibile analizzare l'immagine. Riprova con
              un'immagine più chiara.
            </p>
            <button
              onClick={() => setUploadStatus(null)}
              style={styles.retryButton}
            >
              Riprova
            </button>
          </div>
        </div>
      )}

      {/* Complete Player Editor Modal */}
      {showCompleteEditor && (
        <CompletePlayerEditor
          player={editingPlayer}
          onSave={handleSaveEditedPlayer}
          onClose={handleCloseEditor}
          isOpen={showCompleteEditor}
        />
      )}
    </div>
    );
  } catch (error) {
    console.error('❌ Error rendering PlayerManagement:', error);
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>❌ Errore</h1>
          <p style={styles.subtitle}>Si è verificato un errore nel caricamento della pagina</p>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Errore: {error.message}</p>
          <button onClick={() => window.location.reload()}>Ricarica Pagina</button>
        </div>
      </div>
    );
  }
};

export default PlayerManagement;
