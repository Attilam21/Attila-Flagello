import React, { useState, useEffect } from 'react';
import PlayerProfile from '../components/PlayerProfile';
import FormationBuilder from '../components/FormationBuilder';
import PlayerEditForm from '../components/PlayerEditForm';

const PlayerManagement = ({ user }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'profile', 'formation'

  // Carica giocatori esistenti
  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    // Simula caricamento giocatori
    const mockPlayers = [
      {
        id: 1,
        name: 'Gianluigi Donnarumma',
        position: 'GK',
        rating: 95,
        age: 25,
        nationality: 'Italia',
        team: 'PSG',
        stats: {
          pace: 45,
          shooting: 25,
          passing: 88,
          dribbling: 35,
          defending: 95,
          physical: 92
        },
        abilities: [
          'Parata', 'Riflessi', 'Uscite', 'Distribuzione', 'Leader', 'Spirito combattivo'
        ],
        aiPlayStyles: ['Portiere difensivo', 'Portiere offensivo'],
        build: 'Portiere Difensivo',
        buildDescription: 'Specializzato in parate e uscite sicure',
        buildEfficiency: 95,
        boosters: [
          {
            name: 'Difesa',
            effect: '+2',
            description: '+2 alle Statistiche giocatore Comportamento difensivo, Contrasto, Accelerazione e Salto.',
            condition: 'Questo Booster è sempre attivo.'
          }
        ],
        level: 29,
        maxLevel: 29,
        alternativePositions: [
          { position: 'CB', rating: 75 },
          { position: 'CDM', rating: 60 }
        ],
        formationSuitability: [
          { name: '4-3-3', description: 'Formazione offensiva', effectiveness: 95 },
          { name: '4-4-2', description: 'Formazione classica', effectiveness: 90 },
          { name: '3-5-2', description: 'Formazione con 3 difensori', effectiveness: 85 }
        ],
        physical: {
          height: 196,
          weight: 92,
          preferredFoot: 'Right'
        },
        contract: {
          salary: 12000000,
          expiry: '2026-06-30',
          releaseClause: 50000000
        },
        form: 'Excellent',
        condition: 95,
        lastUpdate: new Date()
      },
      {
        id: 2,
        name: 'Rafael Leão',
        position: 'LW',
        rating: 91,
        age: 24,
        nationality: 'Portogallo',
        team: 'AC Milan',
        stats: {
          pace: 95,
          shooting: 85,
          passing: 82,
          dribbling: 92,
          defending: 35,
          physical: 78
        },
        abilities: [
          'Dribbling Avanzato', 'Tiro a Giro', 'Passaggio Filtrante', 'Elastico', 'Sombrero', 'Spirito combattivo'
        ],
        aiPlayStyles: ['Incursore', 'Ala Prolifica'],
        build: 'Ala Prolifica',
        buildDescription: 'Specializzato in dribbling e cross precisi',
        buildEfficiency: 90,
        boosters: [
          {
            name: 'Velocità',
            effect: '+3',
            description: '+3 alle Statistiche di Velocità e Accelerazione.',
            condition: 'Attivo quando il giocatore è in forma.'
          }
        ],
        level: 34,
        maxLevel: 34,
        alternativePositions: [
          { position: 'RW', rating: 95 },
          { position: 'ST', rating: 80 },
          { position: 'CAM', rating: 75 }
        ],
        formationSuitability: [
          { name: '4-3-3', description: 'Formazione offensiva', effectiveness: 95 },
          { name: '4-4-2', description: 'Formazione classica', effectiveness: 85 },
          { name: '3-5-2', description: 'Formazione con 3 difensori', effectiveness: 80 }
        ],
        physical: {
          height: 188,
          weight: 81,
          preferredFoot: 'Right'
        },
        contract: {
          salary: 8000000,
          expiry: '2028-06-30',
          releaseClause: 175000000
        },
        form: 'Good',
        condition: 88,
        lastUpdate: new Date()
      }
    ];
    
    setPlayers(mockPlayers);
  };

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
    { value: 'ST', label: 'Attaccante' }
  ];

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = filterPosition === 'all' || player.position === filterPosition;
    return matchesSearch && matchesPosition;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'age': return a.age - b.age;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  const styles = {
    container: {
      backgroundColor: '#1F2937',
      minHeight: '100vh',
      padding: '2rem',
      color: 'white'
    },
    header: {
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '0.5rem'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#9CA3AF'
    },
    controls: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    searchInput: {
      flex: 1,
      minWidth: '200px',
      padding: '0.75rem',
      backgroundColor: '#374151',
      border: '1px solid #4B5563',
      borderRadius: '0.5rem',
      color: '#E5E7EB',
      fontSize: '0.875rem'
    },
    select: {
      padding: '0.75rem',
      backgroundColor: '#374151',
      border: '1px solid #4B5563',
      borderRadius: '0.5rem',
      color: '#E5E7EB',
      fontSize: '0.875rem'
    },
    addButton: {
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 1.5rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    playersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    playerCard: {
      backgroundColor: '#374151',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      border: '1px solid #4B5563',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative'
    },
    playerCardHover: {
      backgroundColor: '#4B5563',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    },
    playerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem'
    },
    playerName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB'
    },
    playerRating: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#10B981'
    },
    playerInfo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.5rem',
      marginBottom: '1rem'
    },
    infoItem: {
      fontSize: '0.875rem',
      color: '#9CA3AF'
    },
    infoValue: {
      color: '#E5E7EB',
      fontWeight: '500'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '0.5rem',
      marginTop: '1rem'
    },
    statItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.25rem 0'
    },
    statName: {
      fontSize: '0.75rem',
      color: '#9CA3AF',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    statValue: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: '#E5E7EB'
    },
    statBar: {
      width: '100%',
      height: '4px',
      backgroundColor: '#1F2937',
      borderRadius: '2px',
      marginTop: '0.25rem',
      overflow: 'hidden'
    },
    statBarFill: {
      height: '100%',
      borderRadius: '2px',
      transition: 'width 0.3s ease'
    },
    formBadge: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    excellent: { backgroundColor: '#10B981', color: 'white' },
    good: { backgroundColor: '#3B82F6', color: 'white' },
    average: { backgroundColor: '#F59E0B', color: 'white' },
    poor: { backgroundColor: '#EF4444', color: 'white' }
  };

  const getFormColor = (form) => {
    switch (form) {
      case 'Excellent': return styles.excellent;
      case 'Good': return styles.good;
      case 'Average': return styles.average;
      case 'Poor': return styles.poor;
      default: return styles.average;
    }
  };

  const getStatColor = (value) => {
    if (value >= 90) return '#10B981';
    if (value >= 80) return '#3B82F6';
    if (value >= 70) return '#F59E0B';
    if (value >= 60) return '#EF4444';
    return '#6B7280';
  };

  const handleAddPlayer = () => {
    console.log('Adding new player...');
    setSelectedPlayer(null); // Reset selected player
    setIsEditing(true);
  };

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    setIsEditing(true);
  };

  const handleViewPlayer = (player) => {
    setSelectedPlayer(player);
    setViewMode('profile');
  };

  const handleSavePlayer = (playerData) => {
    console.log('Saving player:', playerData);
    
    if (selectedPlayer) {
      // Modifica giocatore esistente
      setPlayers(prev => prev.map(p => 
        p.id === selectedPlayer.id ? { ...p, ...playerData, id: selectedPlayer.id } : p
      ));
    } else {
      // Aggiungi nuovo giocatore
      const newPlayer = {
        ...playerData,
        id: Date.now(), // ID temporaneo
        matchesPlayed: 0,
        goals: 0,
        assists: 0
      };
      setPlayers(prev => [...prev, newPlayer]);
    }
    
    setIsEditing(false);
    setSelectedPlayer(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedPlayer(null);
  };

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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select
          style={styles.select}
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
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
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="rating">Rating</option>
          <option value="age">Età</option>
          <option value="name">Nome</option>
        </select>
        
        <button
          style={styles.addButton}
          onClick={handleAddPlayer}
        >
          ➕ Aggiungi Giocatore
        </button>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            style={{
              ...styles.button,
              backgroundColor: viewMode === 'list' ? '#3B82F6' : '#6B7280'
            }}
            onClick={() => setViewMode('list')}
          >
            📋 Lista
          </button>
          <button
            style={{
              ...styles.button,
              backgroundColor: viewMode === 'profile' ? '#3B82F6' : '#6B7280'
            }}
            onClick={() => setViewMode('profile')}
          >
            👤 Profilo
          </button>
          <button
            style={{
              ...styles.button,
              backgroundColor: viewMode === 'formation' ? '#3B82F6' : '#6B7280'
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
          {filteredPlayers.map((player) => (
          <div
            key={player.id}
            style={styles.playerCard}
            onClick={() => handleViewPlayer(player)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4B5563';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#374151';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Form Badge */}
            <div style={{
              ...styles.formBadge,
              ...getFormColor(player.form)
            }}>
              {player.form}
            </div>

            {/* Player Header */}
            <div style={styles.playerHeader}>
              <div>
                <div style={styles.playerName}>{player.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#9CA3AF' }}>
                  {player.position} • {player.age} anni
                </div>
              </div>
              <div style={styles.playerRating}>{player.rating}</div>
            </div>

            {/* Player Info */}
            <div style={styles.playerInfo}>
              <div style={styles.infoItem}>
                <div>Nazionalità:</div>
                <div style={styles.infoValue}>{player.nationality}</div>
              </div>
              <div style={styles.infoItem}>
                <div>Squadra:</div>
                <div style={styles.infoValue}>{player.team}</div>
              </div>
              <div style={styles.infoItem}>
                <div>Altezza:</div>
                <div style={styles.infoValue}>{player.physical.height} cm</div>
              </div>
              <div style={styles.infoItem}>
                <div>Peso:</div>
                <div style={styles.infoValue}>{player.physical.weight} kg</div>
              </div>
            </div>

            {/* Stats */}
            <div style={styles.statsGrid}>
              {Object.entries(player.stats).slice(0, 4).map(([stat, value]) => (
                <div key={stat} style={styles.statItem}>
                  <div style={styles.statName}>{stat}</div>
                  <div style={styles.statValue}>{value}</div>
                </div>
              ))}
            </div>

            {/* Stat Bars */}
            <div style={{ marginTop: '1rem' }}>
              {Object.entries(player.stats).slice(0, 3).map(([stat, value]) => (
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
                        backgroundColor: getStatColor(value)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        </div>
      )}

      {viewMode === 'profile' && selectedPlayer && (
        <PlayerProfile 
          player={selectedPlayer} 
          onEdit={() => setIsEditing(true)}
          showEditButton={true}
        />
      )}

      {viewMode === 'formation' && (
        <FormationBuilder 
          players={filteredPlayers}
          onSave={(formationData) => {
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
      <div style={{
        backgroundColor: '#374151',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: '1px solid #4B5563'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#E5E7EB' }}>
          📊 Riepilogo Squadra
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10B981' }}>
              {players.length}
            </div>
            <div style={{ color: '#9CA3AF' }}>Giocatori</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3B82F6' }}>
              {Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length)}
            </div>
            <div style={{ color: '#9CA3AF' }}>Rating Medio</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F59E0B' }}>
              {players.filter(p => p.form === 'Excellent').length}
            </div>
            <div style={{ color: '#9CA3AF' }}>In Forma</div>
          </div>
        </div>
      </div>

      {/* Player Edit Form Modal */}
      {isEditing && (
        <PlayerEditForm
          player={selectedPlayer}
          onSave={handleSavePlayer}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default PlayerManagement;
