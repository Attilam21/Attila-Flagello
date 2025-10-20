import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, Star, MapPin, Users, Trophy } from 'lucide-react';
import { searchPlayers, getFilterOptions, convertDatabasePlayer } from '../data/playersDatabaseComplete';

const AdvancedPlayerSearch = ({ isOpen, onClose, onPlayerSelect }) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    position: 'all',
    minRating: '',
    maxRating: '',
    club: 'all',
    nationality: 'all',
    sortBy: 'overall',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    positions: [],
    clubs: [],
    nationalities: [],
    minRating: 0,
    maxRating: 100
  });

  // Carica opzioni filtri al mount
  useEffect(() => {
    const options = getFilterOptions();
    setFilterOptions(options);
  }, []);

  // Ricerca giocatori
  const searchResults = useMemo(() => {
    if (!query.trim() && Object.values(filters).every(v => v === 'all' || v === '' || v === 'desc')) {
      return [];
    }
    return searchPlayers(query, filters);
  }, [query, filters]);

  // Aggiorna risultati
  useEffect(() => {
    setResults(searchResults.slice(0, 50)); // Limita a 50 risultati per performance
  }, [searchResults]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handlePlayerSelect = (player) => {
    const convertedPlayer = convertDatabasePlayer(player);
    onPlayerSelect(convertedPlayer);
    onClose();
  };

  const clearFilters = () => {
    setFilters({
      position: 'all',
      minRating: '',
      maxRating: '',
      club: 'all',
      nationality: 'all',
      sortBy: 'overall',
      sortOrder: 'desc'
    });
    setQuery('');
  };

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
      padding: '1rem'
    },
    modal: {
      backgroundColor: '#1a1a1a',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '1200px',
      maxHeight: '90vh',
      overflow: 'hidden',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
    },
    header: {
      padding: '1.5rem',
      borderBottom: '1px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    content: {
      padding: '1.5rem',
      maxHeight: '70vh',
      overflow: 'auto'
    },
    searchSection: {
      marginBottom: '1.5rem'
    },
    searchBar: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem'
    },
    searchInput: {
      flex: 1,
      padding: '0.75rem 1rem',
      backgroundColor: '#2a2a2a',
      border: '1px solid #444',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '1rem'
    },
    filterButton: {
      padding: '0.75rem 1rem',
      backgroundColor: showFilters ? '#3b82f6' : '#444',
      border: 'none',
      borderRadius: '8px',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s'
    },
    filtersPanel: {
      backgroundColor: '#2a2a2a',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      display: showFilters ? 'block' : 'none'
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    filterLabel: {
      color: '#ccc',
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    filterSelect: {
      padding: '0.5rem',
      backgroundColor: '#1a1a1a',
      border: '1px solid #444',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '0.875rem'
    },
    filterInput: {
      padding: '0.5rem',
      backgroundColor: '#1a1a1a',
      border: '1px solid #444',
      borderRadius: '6px',
      color: '#fff',
      fontSize: '0.875rem'
    },
    clearButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      border: 'none',
      borderRadius: '6px',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    resultsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem'
    },
    playerCard: {
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '1rem',
      border: '1px solid #444',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: '#3b82f6',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
      }
    },
    playerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem'
    },
    playerName: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#fff'
    },
    playerRating: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#3b82f6'
    },
    playerInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      marginBottom: '0.75rem'
    },
    playerDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#ccc',
      fontSize: '0.875rem'
    },
    playerStats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '0.5rem',
      fontSize: '0.75rem',
      color: '#999'
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    noResults: {
      textAlign: 'center',
      color: '#999',
      padding: '2rem',
      fontSize: '1.125rem'
    },
    resultsCount: {
      color: '#ccc',
      marginBottom: '1rem',
      fontSize: '0.875rem'
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.title}>
            <Search size={24} />
            Database Giocatori eFootball
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div style={styles.content}>
          <div style={styles.searchSection}>
            <div style={styles.searchBar}>
              <input
                type="text"
                placeholder="Cerca giocatori per nome, club, nazionalità..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={styles.searchInput}
              />
              <button
                style={styles.filterButton}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={16} />
                Filtri
              </button>
            </div>
            
            <div style={styles.filtersPanel}>
              <div style={styles.filtersGrid}>
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Posizione</label>
                  <select
                    value={filters.position}
                    onChange={e => handleFilterChange('position', e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">Tutte le posizioni</option>
                    {filterOptions.positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Club</label>
                  <select
                    value={filters.club}
                    onChange={e => handleFilterChange('club', e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">Tutti i club</option>
                    {filterOptions.clubs.map(club => (
                      <option key={club} value={club}>{club}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Nazionalità</label>
                  <select
                    value={filters.nationality}
                    onChange={e => handleFilterChange('nationality', e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">Tutte le nazionalità</option>
                    {filterOptions.nationalities.map(nat => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </select>
                </div>
                
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Rating Min</label>
                  <input
                    type="number"
                    placeholder="40"
                    value={filters.minRating}
                    onChange={e => handleFilterChange('minRating', e.target.value)}
                    style={styles.filterInput}
                    min="40"
                    max="100"
                  />
                </div>
                
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Rating Max</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={filters.maxRating}
                    onChange={e => handleFilterChange('maxRating', e.target.value)}
                    style={styles.filterInput}
                    min="40"
                    max="100"
                  />
                </div>
                
                <div style={styles.filterGroup}>
                  <label style={styles.filterLabel}>Ordina per</label>
                  <select
                    value={filters.sortBy}
                    onChange={e => handleFilterChange('sortBy', e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="overall">Rating</option>
                    <option value="name">Nome</option>
                    <option value="age">Età</option>
                  </select>
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button style={styles.clearButton} onClick={clearFilters}>
                  Pulisci Filtri
                </button>
              </div>
            </div>
          </div>
          
          {results.length > 0 && (
            <div style={styles.resultsCount}>
              Trovati {results.length} giocatori
            </div>
          )}
          
          {results.length === 0 && query.trim() && (
            <div style={styles.noResults}>
              Nessun giocatore trovato per "{query}"
            </div>
          )}
          
          {results.length === 0 && !query.trim() && (
            <div style={styles.noResults}>
              Inizia a digitare per cercare giocatori...
            </div>
          )}
          
          <div style={styles.resultsGrid}>
            {results.map((player, index) => (
              <div
                key={player.id || index}
                style={styles.playerCard}
                onClick={() => handlePlayerSelect(player)}
              >
                <div style={styles.playerHeader}>
                  <div style={styles.playerName}>{player.name}</div>
                  <div style={styles.playerRating}>{player.overall}</div>
                </div>
                
                <div style={styles.playerInfo}>
                  <div style={styles.playerDetail}>
                    <MapPin size={14} />
                    {player.position} • {player.club}
                  </div>
                  <div style={styles.playerDetail}>
                    <Users size={14} />
                    {player.nationality} • {player.age} anni
                  </div>
                  <div style={styles.playerDetail}>
                    <Star size={14} />
                    {player.playstyle || 'N/A'}
                  </div>
                </div>
                
                <div style={styles.playerStats}>
                  <div style={styles.statItem}>
                    <span>Velocità</span>
                    <span>{player.stats?.speed || 80}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span>Tiro</span>
                    <span>{player.stats?.finishing || 80}</span>
                  </div>
                  <div style={styles.statItem}>
                    <span>Passaggio</span>
                    <span>{player.stats?.lowPass || 80}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPlayerSearch;
