import { useState } from 'react';
import { X, Save, User, BarChart3, Zap, Shield, Target, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const ManualPlayerModal = ({ isOpen, onClose, onPlayerSaved }) => {
  const [currentTab, setCurrentTab] = useState('general');
  const [playerData, setPlayerData] = useState({
    // Dati Generali
    nome: '',
    ruoloPrimario: 'PT',
    stileGiocatore: '',
    stiliIA: [],
    carta: {
      rarita: 'Standard',
      complessivamente: 0,
      potenziale: 0,
      livelloMassimo: 1,
      condizione: 'A',
      valoreGiocatore: '1★'
    },
    anagrafica: {
      eta: 0,
      altezza: 0,
      peso: 0,
      club: '',
      nazionalita: ''
    },
    // Statistiche
    statistiche: {
      comportamentoOffensivo: 0,
      controlloPalla: 0,
      velocitaDribbling: 0,
      possessoStretto: 0,
      passaggioRasoterra: 0,
      passaggioAlto: 0,
      finalizzazione: 0,
      colpoTesta: 0,
      calciPiazzati: 0,
      tiroAGiro: 0,
      velocita: 0,
      accelerazione: 0,
      potenzaTiro: 0,
      elevazione: 0,
      contattoFisico: 0,
      equilibrio: 0,
      resistenza: 0,
      comportamentoDifensivo: 0,
      coinvolgimentoDifensivo: 0,
      contrasto: 0,
      aggressivita: 0,
      portiere: 0,
      presaPT: 0,
      parataPT: 0,
      riflessiPT: 0,
      estensionePT: 0
    },
    // Competenze Posizione
    competenzePosizione: [],
    // Booster e Abilità
    booster: [],
    abilita: [],
    // Media
    media: {
      imgCarta: null,
      imgAbilitaBooster: null,
      imgAbilitaIA: null
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const tabs = [
    { id: 'general', label: 'Dati Generali', icon: User },
    { id: 'stats', label: 'Statistiche', icon: BarChart3 },
    { id: 'style', label: 'Stile/Abilità', icon: Zap },
    { id: 'position', label: 'Competenze Posizione', icon: Target },
    { id: 'media', label: 'Media', icon: Upload }
  ];

  const ruoli = [
    { value: 'PT', label: 'Portiere' },
    { value: 'DC', label: 'Difensore Centrale' },
    { value: 'TD', label: 'Terzino Destro' },
    { value: 'TS', label: 'Terzino Sinistro' },
    { value: 'CC', label: 'Centrocampista Centrale' },
    { value: 'CDC', label: 'Centrocampista Difensivo' },
    { value: 'COC', label: 'Centrocampista Offensivo' },
    { value: 'TRQ', label: 'Trequartista' },
    { value: 'AS', label: 'Ala Sinistra' },
    { value: 'AD', label: 'Ala Destra' },
    { value: 'ATT', label: 'Attaccante' }
  ];

  const rarita = [
    { value: 'Standard', label: 'Standard' },
    { value: 'In evidenza', label: 'In evidenza' },
    { value: 'Leggenda', label: 'Leggenda' },
    { value: 'Epica', label: 'Epica' }
  ];

  const stiliIA = [
    'Funambolo', 'Inserimento', 'Marcatore', 'Regista', 'Ala', 'Centrocampista',
    'Difensore', 'Portiere', 'Attaccante', 'Trequartista', 'Terzino'
  ];

  const abilitaList = [
    'Passaggio filtrante', 'Intercettatore', 'Tiro a giro', 'Colpo di testa',
    'Crossing', 'Dribbling', 'Finalizzazione', 'Passaggio lungo',
    'Controllo palla', 'Accelerazione', 'Resistenza', 'Equilibrio'
  ];

  const boosterList = [
    'Tiro +2', 'Passaggio +1', 'Velocità +3', 'Difesa +2',
    'Resistenza +1', 'Finalizzazione +2', 'Crossing +1', 'Dribbling +2'
  ];

  const handleInputChange = (section, field, value) => {
    setPlayerData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field, value, action) => {
    setPlayerData(prev => ({
      ...prev,
      [field]: action === 'add' 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleImageUpload = (type, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPlayerData(prev => ({
          ...prev,
          media: {
            ...prev.media,
            [type]: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!playerData.nome.trim()) newErrors.nome = 'Nome obbligatorio';
    if (playerData.carta.complessivamente < 1 || playerData.carta.complessivamente > 100) {
      newErrors.complessivamente = 'Rating deve essere tra 1 e 100';
    }
    if (playerData.anagrafica.eta < 16 || playerData.anagrafica.eta > 50) {
      newErrors.eta = 'Età deve essere tra 16 e 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      // Qui salveremo su Firestore
      console.log('💾 Salvando giocatore manuale:', playerData);
      onPlayerSaved(playerData);
      onClose();
    } catch (error) {
      console.error('❌ Errore salvataggio:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderGeneralTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <h4>📋 Informazioni Base</h4>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nome Giocatore *</label>
            <input
              type="text"
              className={`form-input ${errors.nome ? 'error' : ''}`}
              value={playerData.nome}
              onChange={(e) => setPlayerData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Es. Jude Bellingham"
            />
            {errors.nome && <span className="error-text">{errors.nome}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Ruolo Primario</label>
            <select
              className="form-select"
              value={playerData.ruoloPrimario}
              onChange={(e) => setPlayerData(prev => ({ ...prev, ruoloPrimario: e.target.value }))}
            >
              {ruoli.map(ruolo => (
                <option key={ruolo.value} value={ruolo.value}>{ruolo.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Stile di Gioco</label>
            <input
              type="text"
              className="form-input"
              value={playerData.stileGiocatore}
              onChange={(e) => setPlayerData(prev => ({ ...prev, stileGiocatore: e.target.value }))}
              placeholder="Es. Regista creativo"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>🎴 Carta Giocatore</h4>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Rarità</label>
            <select
              className="form-select"
              value={playerData.carta.rarita}
              onChange={(e) => handleInputChange('carta', 'rarita', e.target.value)}
            >
              {rarita.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Complessivamente *</label>
            <input
              type="number"
              min="1"
              max="100"
              className={`form-input ${errors.complessivamente ? 'error' : ''}`}
              value={playerData.carta.complessivamente}
              onChange={(e) => handleInputChange('carta', 'complessivamente', parseInt(e.target.value))}
            />
            {errors.complessivamente && <span className="error-text">{errors.complessivamente}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Potenziale</label>
            <input
              type="number"
              min="1"
              max="110"
              className="form-input"
              value={playerData.carta.potenziale}
              onChange={(e) => handleInputChange('carta', 'potenziale', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Livello Massimo</label>
            <input
              type="number"
              min="1"
              max="5"
              className="form-input"
              value={playerData.carta.livelloMassimo}
              onChange={(e) => handleInputChange('carta', 'livelloMassimo', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Condizione</label>
            <select
              className="form-select"
              value={playerData.carta.condizione}
              onChange={(e) => handleInputChange('carta', 'condizione', e.target.value)}
            >
              <option value="A">A (Ottima)</option>
              <option value="B">B (Buona)</option>
              <option value="C">C (Normale)</option>
              <option value="D">D (Scarsa)</option>
              <option value="E">E (Pessima)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Valore Giocatore</label>
            <select
              className="form-select"
              value={playerData.carta.valoreGiocatore}
              onChange={(e) => handleInputChange('carta', 'valoreGiocatore', e.target.value)}
            >
              <option value="1★">1★</option>
              <option value="2★">2★</option>
              <option value="3★">3★</option>
              <option value="4★">4★</option>
              <option value="5★">5★</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4>👤 Anagrafica</h4>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Età *</label>
            <input
              type="number"
              min="16"
              max="50"
              className={`form-input ${errors.eta ? 'error' : ''}`}
              value={playerData.anagrafica.eta}
              onChange={(e) => handleInputChange('anagrafica', 'eta', parseInt(e.target.value))}
            />
            {errors.eta && <span className="error-text">{errors.eta}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Altezza (cm)</label>
            <input
              type="number"
              min="150"
              max="220"
              className="form-input"
              value={playerData.anagrafica.altezza}
              onChange={(e) => handleInputChange('anagrafica', 'altezza', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Peso (kg)</label>
            <input
              type="number"
              min="50"
              max="120"
              className="form-input"
              value={playerData.anagrafica.peso}
              onChange={(e) => handleInputChange('anagrafica', 'peso', parseInt(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Club</label>
            <input
              type="text"
              className="form-input"
              value={playerData.anagrafica.club}
              onChange={(e) => handleInputChange('anagrafica', 'club', e.target.value)}
              placeholder="Es. Real Madrid"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nazionalità</label>
            <input
              type="text"
              className="form-input"
              value={playerData.anagrafica.nazionalita}
              onChange={(e) => handleInputChange('anagrafica', 'nazionalita', e.target.value)}
              placeholder="Es. Inghilterra"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="tab-content">
      <div className="stats-container">
        <div className="stats-section">
          <h4>⚽ Attacco</h4>
          <div className="stats-grid">
            {[
              { key: 'comportamentoOffensivo', label: 'Comportamento Offensivo' },
              { key: 'controlloPalla', label: 'Controllo Palla' },
              { key: 'velocitaDribbling', label: 'Velocità Dribbling' },
              { key: 'possessoStretto', label: 'Possesso Stretto' },
              { key: 'passaggioRasoterra', label: 'Passaggio Rasoterra' },
              { key: 'passaggioAlto', label: 'Passaggio Alto' },
              { key: 'finalizzazione', label: 'Finalizzazione' },
              { key: 'colpoTesta', label: 'Colpo di Testa' },
              { key: 'calciPiazzati', label: 'Calci Piazzati' },
              { key: 'tiroAGiro', label: 'Tiro a Giro' }
            ].map(stat => (
              <div key={stat.key} className="stat-field">
                <label className="stat-label">{stat.label}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="stat-input"
                  value={playerData.statistiche[stat.key]}
                  onChange={(e) => handleInputChange('statistiche', stat.key, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h4>🛡️ Difesa</h4>
          <div className="stats-grid">
            {[
              { key: 'comportamentoDifensivo', label: 'Comportamento Difensivo' },
              { key: 'coinvolgimentoDifensivo', label: 'Coinvolgimento Difensivo' },
              { key: 'contrasto', label: 'Contrasto' },
              { key: 'aggressivita', label: 'Aggressività' }
            ].map(stat => (
              <div key={stat.key} className="stat-field">
                <label className="stat-label">{stat.label}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="stat-input"
                  value={playerData.statistiche[stat.key]}
                  onChange={(e) => handleInputChange('statistiche', stat.key, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h4>🏃‍♂️ Fisico</h4>
          <div className="stats-grid">
            {[
              { key: 'velocita', label: 'Velocità' },
              { key: 'accelerazione', label: 'Accelerazione' },
              { key: 'potenzaTiro', label: 'Potenza Tiro' },
              { key: 'elevazione', label: 'Elevazione' },
              { key: 'contattoFisico', label: 'Contatto Fisico' },
              { key: 'equilibrio', label: 'Equilibrio' },
              { key: 'resistenza', label: 'Resistenza' }
            ].map(stat => (
              <div key={stat.key} className="stat-field">
                <label className="stat-label">{stat.label}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="stat-input"
                  value={playerData.statistiche[stat.key]}
                  onChange={(e) => handleInputChange('statistiche', stat.key, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="stats-section">
          <h4>🥅 Portiere</h4>
          <div className="stats-grid">
            {[
              { key: 'portiere', label: 'Portiere' },
              { key: 'presaPT', label: 'Presa PT' },
              { key: 'parataPT', label: 'Parata PT' },
              { key: 'riflessiPT', label: 'Riflessi PT' },
              { key: 'estensionePT', label: 'Estensione PT' }
            ].map(stat => (
              <div key={stat.key} className="stat-field">
                <label className="stat-label">{stat.label}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="stat-input"
                  value={playerData.statistiche[stat.key]}
                  onChange={(e) => handleInputChange('statistiche', stat.key, parseInt(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStyleTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <h4>🤖 Stili IA</h4>
        <div className="chips-container">
          {stiliIA.map(stile => (
            <button
              key={stile}
              className={`chip ${playerData.stiliIA.includes(stile) ? 'active' : ''}`}
              onClick={() => handleArrayChange('stiliIA', stile, 
                playerData.stiliIA.includes(stile) ? 'remove' : 'add')}
            >
              {stile}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h4>⚡ Booster</h4>
        <div className="chips-container">
          {boosterList.map(booster => (
            <button
              key={booster}
              className={`chip ${playerData.booster.includes(booster) ? 'active' : ''}`}
              onClick={() => handleArrayChange('booster', booster,
                playerData.booster.includes(booster) ? 'remove' : 'add')}
            >
              {booster}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h4>🎯 Abilità</h4>
        <div className="chips-container">
          {abilitaList.map(abilita => (
            <button
              key={abilita}
              className={`chip ${playerData.abilita.includes(abilita) ? 'active' : ''}`}
              onClick={() => handleArrayChange('abilita', abilita,
                playerData.abilita.includes(abilita) ? 'remove' : 'add')}
            >
              {abilita}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPositionTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <h4>📍 Competenze Posizione</h4>
        <p className="section-description">
          Aggiungi le posizioni in cui il giocatore può giocare e il relativo livello di competenza.
        </p>
        
        <div className="position-list">
          {playerData.competenzePosizione.map((pos, index) => (
            <div key={index} className="position-item">
              <select
                className="form-select"
                value={pos.posizione}
                onChange={(e) => {
                  const newPos = [...playerData.competenzePosizione];
                  newPos[index].posizione = e.target.value;
                  setPlayerData(prev => ({ ...prev, competenzePosizione: newPos }));
                }}
              >
                {ruoli.map(ruolo => (
                  <option key={ruolo.value} value={ruolo.value}>{ruolo.label}</option>
                ))}
              </select>
              
              <select
                className="form-select"
                value={pos.livello}
                onChange={(e) => {
                  const newPos = [...playerData.competenzePosizione];
                  newPos[index].livello = e.target.value;
                  setPlayerData(prev => ({ ...prev, competenzePosizione: newPos }));
                }}
              >
                <option value="Basso">Basso</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Alto">Alto</option>
              </select>
              
              <button
                className="btn-icon"
                onClick={() => {
                  const newPos = playerData.competenzePosizione.filter((_, i) => i !== index);
                  setPlayerData(prev => ({ ...prev, competenzePosizione: newPos }));
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          
          <button
            className="btn btn-secondary"
            onClick={() => {
              setPlayerData(prev => ({
                ...prev,
                competenzePosizione: [...prev.competenzePosizione, { posizione: 'PT', livello: 'Intermedio' }]
              }));
            }}
          >
            + Aggiungi Posizione
          </button>
        </div>
      </div>
    </div>
  );

  const renderMediaTab = () => (
    <div className="tab-content">
      <div className="form-section">
        <h4>📸 Immagini Giocatore</h4>
        <p className="section-description">
          Carica le immagini del giocatore per una migliore visualizzazione.
        </p>
        
        <div className="media-grid">
          <div className="media-upload">
            <h5>🃏 Carta Giocatore</h5>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('imgCarta', e.target.files[0])}
                className="file-input"
                id="carta-upload"
              />
              <label htmlFor="carta-upload" className="upload-label">
                {playerData.media.imgCarta ? (
                  <img src={playerData.media.imgCarta} alt="Carta" className="upload-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={32} />
                    <span>Carica Carta</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="media-upload">
            <h5>⚡ Abilità e Booster</h5>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('imgAbilitaBooster', e.target.files[0])}
                className="file-input"
                id="abilita-upload"
              />
              <label htmlFor="abilita-upload" className="upload-label">
                {playerData.media.imgAbilitaBooster ? (
                  <img src={playerData.media.imgAbilitaBooster} alt="Abilità" className="upload-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={32} />
                    <span>Carica Abilità</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="media-upload">
            <h5>🤖 Stili IA</h5>
            <div className="upload-area">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('imgAbilitaIA', e.target.files[0])}
                className="file-input"
                id="ia-upload"
              />
              <label htmlFor="ia-upload" className="upload-label">
                {playerData.media.imgAbilitaIA ? (
                  <img src={playerData.media.imgAbilitaIA} alt="Stili IA" className="upload-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={32} />
                    <span>Carica Stili IA</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="manual-modal">
        <div className="modal-header">
          <h2>✏️ Inserimento Manuale Giocatore</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab ${currentTab === tab.id ? 'active' : ''}`}
                onClick={() => setCurrentTab(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="modal-content">
          {currentTab === 'general' && renderGeneralTab()}
          {currentTab === 'stats' && renderStatsTab()}
          {currentTab === 'style' && renderStyleTab()}
          {currentTab === 'position' && renderPositionTab()}
          {currentTab === 'media' && renderMediaTab()}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Annulla
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="loading-spinner-small"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                Salva Giocatore
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualPlayerModal;
