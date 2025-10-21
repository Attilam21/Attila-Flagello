import { useState, useEffect } from 'react';
import {
  Plus,
  Camera,
  UserPlus,
  Save,
  Users,
  Target,
  BarChart3,
} from 'lucide-react';
import { auth } from '../services/firebaseClient';
import {
  listenToPlayers,
  addPlayer,
  updatePlayer,
  deletePlayerById,
} from '../services/firebaseClient';
import OCRWizard from '../components/rosa/OCRWizard';
import ManualPlayerModal from '../components/rosa/ManualPlayerModal';

const Rosa = ({ onPageChange }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('titolari');
  const [showOCRWizard, setShowOCRWizard] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState('4-3-3');
  const [pitchPlayers, setPitchPlayers] = useState([]);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubscribe = listenToPlayers(user.uid, playersList => {
      setPlayers(playersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const titolari = players.filter(p => p.isTitolare);
  const riserve = players.filter(p => !p.isTitolare);

  const handleAddPlayerOCR = () => {
    setShowOCRWizard(true);
  };

  const handleAddPlayerManual = () => {
    console.log(
      'handleAddPlayerManual called, setting showManualModal to true'
    );
    setShowManualModal(true);
  };

  const handlePlayerAdded = playerData => {
    console.log('🎯 Giocatore aggiunto tramite OCR:', playerData);
    // Qui salveremo il giocatore su Firestore
    // addPlayer(user.uid, playerData);
    setShowOCRWizard(false);
  };

  const handlePlayerSaved = playerData => {
    console.log('💾 Giocatore salvato manualmente:', playerData);
    // Qui salveremo il giocatore su Firestore
    // addPlayer(user.uid, playerData);
    setShowManualModal(false);
  };

  const handleSave = async () => {
    try {
      // Salva posizioni campo e altre modifiche
      console.log('💾 Salvando rosa...');
      // Implementare salvataggio posizioni e formazione
    } catch (error) {
      console.error('❌ Errore salvataggio:', error);
    }
  };

  const formations = [
    {
      id: '4-3-3',
      name: '4-3-3',
      positions: [
        'PT',
        'TD',
        'DC',
        'DC',
        'TS',
        'CC',
        'CC',
        'CC',
        'AS',
        'ATT',
        'AD',
      ],
    },
    {
      id: '4-2-3-1',
      name: '4-2-3-1',
      positions: [
        'PT',
        'TD',
        'DC',
        'DC',
        'TS',
        'CDC',
        'CDC',
        'COC',
        'AS',
        'AD',
        'ATT',
      ],
    },
    {
      id: '4-4-2',
      name: '4-4-2',
      positions: [
        'PT',
        'TD',
        'DC',
        'DC',
        'TS',
        'AS',
        'CC',
        'CC',
        'AD',
        'ATT',
        'ATT',
      ],
    },
    {
      id: '3-5-2',
      name: '3-5-2',
      positions: [
        'PT',
        'DC',
        'DC',
        'DC',
        'TD',
        'TS',
        'CC',
        'CC',
        'CC',
        'ATT',
        'ATT',
      ],
    },
    {
      id: '5-3-2',
      name: '5-3-2',
      positions: [
        'PT',
        'TD',
        'DC',
        'DC',
        'TS',
        'TD',
        'TS',
        'CC',
        'CC',
        'CC',
        'ATT',
        'ATT',
      ],
    },
  ];

  const currentFormation = formations.find(f => f.id === selectedFormation);

  if (loading) {
    return (
      <div className="page-container">
        <div
          className="loading-spinner"
          style={{ width: '48px', height: '48px', margin: '0 auto' }}
        ></div>
        <p style={{ color: '#9CA3AF', textAlign: 'center', marginTop: '16px' }}>
          Caricamento rosa...
        </p>
      </div>
    );
  }

  return (
    <div className="rosa-container">
      {/* Header */}
      <div className="rosa-header">
        <div className="rosa-title">
          <h1>👥 Rosa</h1>
          <span className="player-count">{players.length} giocatori</span>
        </div>
        <div className="rosa-actions">
          <button className="btn btn-secondary" onClick={handleAddPlayerOCR}>
            <Camera size={16} />
            Carica foto o screen giocatore
          </button>
          <button className="btn btn-secondary" onClick={handleAddPlayerManual}>
            <UserPlus size={16} />
            Inserisci manualmente
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Salva
          </button>
        </div>
      </div>

      {/* Layout a 3 colonne */}
      <div className="rosa-layout">
        {/* Lista Giocatori (Sinistra) */}
        <div className="player-list-section">
          <div className="section-header">
            <h3>📋 Lista Giocatori</h3>
            <div className="player-tabs">
              <button
                className={`tab ${activeTab === 'titolari' ? 'active' : ''}`}
                onClick={() => setActiveTab('titolari')}
              >
                Titolari ({titolari.length})
              </button>
              <button
                className={`tab ${activeTab === 'riserve' ? 'active' : ''}`}
                onClick={() => setActiveTab('riserve')}
              >
                Riserve ({riserve.length})
              </button>
              <button
                className={`tab ${activeTab === 'tutti' ? 'active' : ''}`}
                onClick={() => setActiveTab('tutti')}
              >
                Tutti ({players.length})
              </button>
            </div>
          </div>

          <div className="player-list">
            {activeTab === 'titolari' && (
              <div className="player-list-content">
                {titolari.length === 0 ? (
                  <div className="empty-state">
                    <Users size={48} />
                    <p>Nessun titolare presente</p>
                  </div>
                ) : (
                  titolari.map(player => (
                    <div key={player.id} className="player-card">
                      <div className="player-info">
                        <div className="player-name">{player.nome}</div>
                        <div className="player-role">
                          {player.ruoloPrimario}
                        </div>
                        <div className="player-rating">
                          {player.carta.complessivamente}
                        </div>
                      </div>
                      <div className="player-actions">
                        <button className="btn-icon">✏️</button>
                        <button className="btn-icon">📋</button>
                        <button className="btn-icon">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'riserve' && (
              <div className="player-list-content">
                {riserve.length === 0 ? (
                  <div className="empty-state">
                    <Users size={48} />
                    <p>Nessuna riserva presente</p>
                  </div>
                ) : (
                  riserve.map(player => (
                    <div key={player.id} className="player-card">
                      <div className="player-info">
                        <div className="player-name">{player.nome}</div>
                        <div className="player-role">
                          {player.ruoloPrimario}
                        </div>
                        <div className="player-rating">
                          {player.carta.complessivamente}
                        </div>
                      </div>
                      <div className="player-actions">
                        <button className="btn-icon">✏️</button>
                        <button className="btn-icon">📋</button>
                        <button className="btn-icon">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'tutti' && (
              <div className="player-list-content">
                {players.length === 0 ? (
                  <div className="empty-state">
                    <Users size={48} />
                    <p>
                      Nessun giocatore presente. Aggiungi la tua rosa tramite
                      OCR o inserimento manuale.
                    </p>
                  </div>
                ) : (
                  players.map(player => (
                    <div key={player.id} className="player-card">
                      <div className="player-info">
                        <div className="player-name">{player.nome}</div>
                        <div className="player-role">
                          {player.ruoloPrimario}
                        </div>
                        <div className="player-rating">
                          {player.carta.complessivamente}
                        </div>
                        <div className="player-status">
                          {player.isTitolare ? '🟢 Titolare' : '🔵 Riserva'}
                        </div>
                      </div>
                      <div className="player-actions">
                        <button className="btn-icon">✏️</button>
                        <button className="btn-icon">📋</button>
                        <button className="btn-icon">🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Campo Tattico 2D (Centro) */}
        <div className="pitch-section">
          <div className="section-header">
            <h3>⚽ Campo Tattico</h3>
            <div className="formation-selector">
              <select
                value={selectedFormation}
                onChange={e => setSelectedFormation(e.target.value)}
                className="formation-select"
              >
                {formations.map(formation => (
                  <option key={formation.id} value={formation.id}>
                    {formation.name}
                  </option>
                ))}
              </select>
              <button className="btn btn-secondary">Applica</button>
            </div>
          </div>

          <div className="pitch-container">
            <div className="pitch-field">
              <div className="pitch-area">
                <div className="goal-area top"></div>
                <div className="field-center">
                  <div className="center-circle"></div>
                </div>
                <div className="goal-area bottom"></div>
              </div>

              {/* Gettoni giocatori */}
              <div className="player-tokens">
                {pitchPlayers.map((player, index) => (
                  <div
                    key={player.id}
                    className="player-token"
                    style={{
                      left: `${player.x}%`,
                      top: `${player.y}%`,
                    }}
                  >
                    <div className="token-content">
                      <div className="token-name">{player.nome}</div>
                      <div className="token-role">{player.ruoloPrimario}</div>
                      <div className="token-rating">
                        {player.carta.complessivamente}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analisi Tattica (Destra) */}
        <div className="analysis-section">
          <div className="section-header">
            <h3>📊 Analisi Tattica</h3>
          </div>

          <div className="tactical-indices">
            <div className="index-card">
              <div className="index-label">Attacco</div>
              <div className="index-value">85</div>
              <div className="index-bar">
                <div
                  className="index-fill attack"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>

            <div className="index-card">
              <div className="index-label">Difesa</div>
              <div className="index-value">78</div>
              <div className="index-bar">
                <div
                  className="index-fill defense"
                  style={{ width: '78%' }}
                ></div>
              </div>
            </div>

            <div className="index-card">
              <div className="index-label">Transizione</div>
              <div className="index-value">82</div>
              <div className="index-bar">
                <div
                  className="index-fill transition"
                  style={{ width: '82%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="tactical-charts">
            <div className="chart-container">
              <h4>Radar Tattico</h4>
              <div className="radar-chart">
                {/* Placeholder per radar chart */}
                <div className="radar-placeholder">📈</div>
              </div>
            </div>

            <div className="chart-container">
              <h4>Intesa di Reparto</h4>
              <div className="bar-chart">
                <div className="bar-item">
                  <span>Difesa</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: '85%' }}></div>
                  </div>
                  <span>85%</span>
                </div>
                <div className="bar-item">
                  <span>Centrocampo</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: '78%' }}></div>
                  </div>
                  <span>78%</span>
                </div>
                <div className="bar-item">
                  <span>Attacco</span>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: '92%' }}></div>
                  </div>
                  <span>92%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="tactical-warnings">
            <h4>⚠️ Avvisi Tattici</h4>
            <div className="warnings-list">
              <div className="warning-item">
                <span className="warning-icon">⚠️</span>
                <span>TRQ con build Marcatore: bassa resa in rifinitura</span>
              </div>
              <div className="warning-item">
                <span className="warning-icon">⚠️</span>
                <span>TD senza booster difensivi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Player Modal */}
      <ManualPlayerModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onPlayerSaved={handlePlayerSaved}
      />

      {/* OCR Wizard Modal */}
      <OCRWizard
        isOpen={showOCRWizard}
        onClose={() => setShowOCRWizard(false)}
        onPlayerAdded={handlePlayerAdded}
      />
    </div>
  );
};

export default Rosa;
