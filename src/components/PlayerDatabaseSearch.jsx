import React, { useState, useEffect } from 'react';
import { searchPlayers, getPlayersByPosition } from '../data/playersDatabase';

const PlayerDatabaseSearch = ({ onPlayerSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    position: '',
    overallMin: '',
    overallMax: '',
    club: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const results = searchPlayers(searchQuery, filters);
    setSearchResults(results);
  }, [searchQuery, filters]);

  const handleSearch = () => {
    const results = searchPlayers(searchQuery, filters);
    setSearchResults(results);
  };

  const handlePlayerClick = player => {
    setSelectedPlayer(player);
  };

  const handleSelectPlayer = () => {
    if (selectedPlayer) {
      onPlayerSelect(selectedPlayer);
      onClose();
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      position: '',
      overallMin: '',
      overallMax: '',
      club: '',
    });
    setSearchQuery('');
  };

  const positions = [
    'GK',
    'CB',
    'LB',
    'RB',
    'LWB',
    'RWB',
    'DMF',
    'CMF',
    'AMF',
    'LWF',
    'RWF',
    'SS',
    'CF',
  ];

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    modal: {
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '1200px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #333',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '1px solid #333',
    },
    title: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0,
    },
    closeButton: {
      background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      padding: '8px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    searchSection: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    searchInput: {
      flex: 1,
      minWidth: '200px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #444',
      backgroundColor: '#2a2a2a',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      transition: 'border-color 0.3s ease',
    },
    filterButton: {
      background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    clearButton: {
      background: 'linear-gradient(135deg, #ffa726, #ff9800)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    filtersPanel: {
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '20px',
      border: '1px solid #444',
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    filterLabel: {
      color: '#ccc',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    filterSelect: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #555',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
    },
    filterInput: {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #555',
      backgroundColor: '#1a1a1a',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
    },
    content: {
      display: 'flex',
      gap: '20px',
      flex: 1,
      overflow: 'hidden',
    },
    resultsList: {
      flex: 1,
      overflowY: 'auto',
      border: '1px solid #333',
      borderRadius: '8px',
      backgroundColor: '#2a2a2a',
    },
    playerCard: {
      padding: '16px',
      borderBottom: '1px solid #444',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    playerInfo: {
      flex: 1,
    },
    playerName: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '4px',
    },
    playerDetails: {
      color: '#aaa',
      fontSize: '14px',
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    playerOverall: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#4ecdc4',
      minWidth: '40px',
      textAlign: 'center',
    },
    playerPosition: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
    },
    selectedPlayer: {
      flex: 1,
      padding: '20px',
      border: '1px solid #333',
      borderRadius: '8px',
      backgroundColor: '#2a2a2a',
    },
    selectedTitle: {
      color: '#fff',
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px',
    },
    selectedInfo: {
      color: '#ccc',
      fontSize: '14px',
      marginBottom: '8px',
    },
    selectButton: {
      background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      padding: '12px 24px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      marginTop: '20px',
      width: '100%',
    },
    noResults: {
      textAlign: 'center',
      color: '#aaa',
      padding: '40px',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Database Giocatori eFootball</h2>
          <button style={styles.closeButton} onClick={onClose}>
            ✕ Chiudi
          </button>
        </div>

        <div style={styles.searchSection}>
          <input
            type="text"
            placeholder="Cerca giocatore, squadra, nazionalità..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button
            style={styles.filterButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Nascondi Filtri' : 'Mostra Filtri'}
          </button>
          <button style={styles.clearButton} onClick={clearFilters}>
            Pulisci
          </button>
        </div>

        {showFilters && (
          <div style={styles.filtersPanel}>
            <div style={styles.filtersGrid}>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Posizione</label>
                <select
                  value={filters.position}
                  onChange={e => handleFilterChange('position', e.target.value)}
                  style={styles.filterSelect}
                >
                  <option value="">Tutte le posizioni</option>
                  {positions.map(pos => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Overall Min</label>
                <input
                  type="number"
                  value={filters.overallMin}
                  onChange={e =>
                    handleFilterChange('overallMin', e.target.value)
                  }
                  style={styles.filterInput}
                  placeholder="es. 80"
                />
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Overall Max</label>
                <input
                  type="number"
                  value={filters.overallMax}
                  onChange={e =>
                    handleFilterChange('overallMax', e.target.value)
                  }
                  style={styles.filterInput}
                  placeholder="es. 95"
                />
              </div>
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Squadra</label>
                <input
                  type="text"
                  value={filters.club}
                  onChange={e => handleFilterChange('club', e.target.value)}
                  style={styles.filterInput}
                  placeholder="es. Real Madrid"
                />
              </div>
            </div>
          </div>
        )}

        <div style={styles.content}>
          <div style={styles.resultsList}>
            {searchResults.length === 0 ? (
              <div style={styles.noResults}>Nessun giocatore trovato</div>
            ) : (
              searchResults.map(player => (
                <div
                  key={player.id}
                  style={{
                    ...styles.playerCard,
                    backgroundColor:
                      selectedPlayer?.id === player.id ? '#444' : 'transparent',
                  }}
                  onClick={() => handlePlayerClick(player)}
                >
                  <div style={styles.playerOverall}>{player.overall}</div>
                  <div style={styles.playerInfo}>
                    <div style={styles.playerName}>{player.name}</div>
                    <div style={styles.playerDetails}>
                      <span style={styles.playerPosition}>
                        {player.position}
                      </span>
                      <span>{player.club}</span>
                      <span>{player.nationality}</span>
                      <span>Età: {player.age}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedPlayer && (
            <div style={styles.selectedPlayer}>
              <h3 style={styles.selectedTitle}>{selectedPlayer.name}</h3>
              <div style={styles.selectedInfo}>
                <strong>Posizione:</strong> {selectedPlayer.position}
              </div>
              <div style={styles.selectedInfo}>
                <strong>Overall:</strong> {selectedPlayer.overall}
              </div>
              <div style={styles.selectedInfo}>
                <strong>Squadra:</strong> {selectedPlayer.club}
              </div>
              <div style={styles.selectedInfo}>
                <strong>Nazionalità:</strong> {selectedPlayer.nationality}
              </div>
              <div style={styles.selectedInfo}>
                <strong>Età:</strong> {selectedPlayer.age}
              </div>
              <div style={styles.selectedInfo}>
                <strong>Piede Preferito:</strong> {selectedPlayer.preferredFoot}
              </div>
              <div style={styles.selectedInfo}>
                <strong>Piede Debole:</strong> {selectedPlayer.weakFoot}/5
              </div>
              <div style={styles.selectedInfo}>
                <strong>Resistenza Infortuni:</strong>{' '}
                {selectedPlayer.injuryResistance}/5
              </div>
              <div style={styles.selectedInfo}>
                <strong>Forma:</strong> {selectedPlayer.form}
              </div>
              <div style={styles.selectedInfo}>
                <strong>Playstyle:</strong> {selectedPlayer.playstyle}
              </div>
              <div style={styles.selectedInfo}>
                <strong>AI Playstyle:</strong> {selectedPlayer.aiPlaystyle}
              </div>

              <button style={styles.selectButton} onClick={handleSelectPlayer}>
                Seleziona Giocatore
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerDatabaseSearch;
