import { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Camera, FileText, Zap } from 'lucide-react';
import { uploadMatchImage } from '../../services/firebaseClient';

const OCRWizard = ({ isOpen, onClose, onPlayerAdded }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState({
    carta: null,
    abilita: null,
    booster: null
  });
  const [uploadStatus, setUploadStatus] = useState({
    carta: 'pending',
    abilita: 'pending', 
    booster: 'pending'
  });
  const [extractedData, setExtractedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dati mock per test (sarà sostituito con Google Vision)
  const mockExtractedData = {
    nome: "Jude Bellingham",
    ruoloPrimario: "TRQ",
    stileGiocatore: "Regista creativo",
    stiliIA: ["Funambolo", "Inserimento"],
    carta: {
      rarita: "Epica",
      complessivamente: 98,
      potenziale: 104,
      livelloMassimo: 2,
      condizione: "B",
      valoreGiocatore: "5★"
    },
    anagrafica: {
      eta: 21,
      altezza: 186,
      peso: 75,
      club: "Real Madrid",
      nazionalita: "Inghilterra"
    },
    statistiche: {
      comportamentoOffensivo: 87,
      controlloPalla: 88,
      velocitaDribbling: 84,
      possessoStretto: 85,
      passaggioRasoterra: 85,
      passaggioAlto: 84,
      finalizzazione: 87,
      colpoTesta: 73,
      calciPiazzati: 63,
      tiroAGiro: 68,
      velocita: 82,
      accelerazione: 75,
      potenzaTiro: 78,
      elevazione: 76,
      contattoFisico: 78,
      equilibrio: 80,
      resistenza: 94,
      comportamentoDifensivo: 70,
      coinvolgimentoDifensivo: 78,
      contrasto: 75,
      aggressivita: 79
    },
    competenzePosizione: [
      { posizione: "TRQ", livello: "Alto" },
      { posizione: "CC", livello: "Intermedio" }
    ],
    booster: ["Tiro +2", "Passaggio +1"],
    abilita: ["Passaggio filtrante", "Intercettatore", "Tiro a giro"]
  };

  const handleImageUpload = async (type, file) => {
    if (!file) return;

    setUploadStatus(prev => ({ ...prev, [type]: 'uploading' }));
    
    try {
      // Simula upload e OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setImages(prev => ({ ...prev, [type]: file }));
      setUploadStatus(prev => ({ ...prev, [type]: 'completed' }));
      
      // Se tutte le 3 immagini sono caricate, procedi al step 2
      const newStatus = { ...uploadStatus, [type]: 'completed' };
      if (Object.values(newStatus).every(status => status === 'completed')) {
        setTimeout(() => {
          setIsProcessing(true);
          // Simula elaborazione OCR
          setTimeout(() => {
            setExtractedData(mockExtractedData);
            setIsProcessing(false);
            setCurrentStep(2);
          }, 3000);
        }, 1000);
      }
    } catch (error) {
      console.error('Errore upload:', error);
      setUploadStatus(prev => ({ ...prev, [type]: 'error' }));
    }
  };

  const handleSavePlayer = async () => {
    try {
      // Qui salveremo il giocatore su Firestore
      console.log('💾 Salvando giocatore:', extractedData);
      onPlayerAdded(extractedData);
      onClose();
    } catch (error) {
      console.error('❌ Errore salvataggio giocatore:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'uploading':
        return <div className="loading-spinner-small"></div>;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      default:
        return <Upload size={20} className="text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completato';
      case 'uploading':
        return 'Caricamento...';
      case 'error':
        return 'Errore';
      default:
        return 'In attesa';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="ocr-wizard-modal">
        <div className="wizard-header">
          <h2>🔍 Wizard OCR - Estrazione Giocatore</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="wizard-progress">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Caricamento</div>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Revisione</div>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Conferma</div>
            </div>
          </div>
        </div>

        <div className="wizard-content">
          {/* STEP 1: Caricamento Immagini */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3>📸 Carica le 3 immagini del giocatore</h3>
              <p className="step-description">
                Carica le immagini in questo ordine per una migliore estrazione dei dati
              </p>

              <div className="image-upload-grid">
                {/* Carta Giocatore */}
                <div className="upload-card">
                  <div className="upload-header">
                    <Camera size={24} />
                    <h4>Carta Giocatore</h4>
                  </div>
                  <div className="upload-content">
                    <p>Complessivamente, Potenziale, Livello massimo, Condizione, Rarità</p>
                    <div className="upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('carta', e.target.files[0])}
                        className="file-input"
                        id="carta-upload"
                      />
                      <label htmlFor="carta-upload" className="upload-label">
                        {images.carta ? (
                          <div className="image-preview">
                            <img src={URL.createObjectURL(images.carta)} alt="Carta" />
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <Upload size={32} />
                            <span>Carica immagine</span>
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="upload-status">
                      {getStatusIcon(uploadStatus.carta)}
                      <span>{getStatusText(uploadStatus.carta)}</span>
                    </div>
                  </div>
                </div>

                {/* Abilità */}
                <div className="upload-card">
                  <div className="upload-header">
                    <FileText size={24} />
                    <h4>Abilità</h4>
                  </div>
                  <div className="upload-content">
                    <p>Elenco abilità del giocatore</p>
                    <div className="upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('abilita', e.target.files[0])}
                        className="file-input"
                        id="abilita-upload"
                      />
                      <label htmlFor="abilita-upload" className="upload-label">
                        {images.abilita ? (
                          <div className="image-preview">
                            <img src={URL.createObjectURL(images.abilita)} alt="Abilità" />
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <Upload size={32} />
                            <span>Carica immagine</span>
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="upload-status">
                      {getStatusIcon(uploadStatus.abilita)}
                      <span>{getStatusText(uploadStatus.abilita)}</span>
                    </div>
                  </div>
                </div>

                {/* Booster/Stile */}
                <div className="upload-card">
                  <div className="upload-header">
                    <Zap size={24} />
                    <h4>Booster / Stile</h4>
                  </div>
                  <div className="upload-content">
                    <p>Booster, Stile di gioco, Forma</p>
                    <div className="upload-area">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload('booster', e.target.files[0])}
                        className="file-input"
                        id="booster-upload"
                      />
                      <label htmlFor="booster-upload" className="upload-label">
                        {images.booster ? (
                          <div className="image-preview">
                            <img src={URL.createObjectURL(images.booster)} alt="Booster" />
                          </div>
                        ) : (
                          <div className="upload-placeholder">
                            <Upload size={32} />
                            <span>Carica immagine</span>
                          </div>
                        )}
                      </label>
                    </div>
                    <div className="upload-status">
                      {getStatusIcon(uploadStatus.booster)}
                      <span>{getStatusText(uploadStatus.booster)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isProcessing && (
                <div className="processing-overlay">
                  <div className="processing-content">
                    <div className="loading-spinner"></div>
                    <h4>🔍 Elaborazione OCR in corso...</h4>
                    <p>Google Vision sta analizzando le immagini per estrarre i dati del giocatore</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Revisione Estrazione */}
          {currentStep === 2 && extractedData && (
            <div className="step-content">
              <h3>✏️ Revisione Dati Estratti</h3>
              <p className="step-description">
                Controlla e modifica i dati estratti. I campi evidenziati in giallo hanno bassa affidabilità.
              </p>

              <div className="extracted-data">
                <div className="data-section">
                  <h4>📋 Dati Generali</h4>
                  <div className="data-grid">
                    <div className="data-field">
                      <label>Nome</label>
                      <input type="text" value={extractedData.nome} className="data-input" />
                    </div>
                    <div className="data-field">
                      <label>Ruolo Primario</label>
                      <select value={extractedData.ruoloPrimario} className="data-select">
                        <option value="PT">PT</option>
                        <option value="DC">DC</option>
                        <option value="TD">TD</option>
                        <option value="TS">TS</option>
                        <option value="CC">CC</option>
                        <option value="CDC">CDC</option>
                        <option value="COC">COC</option>
                        <option value="TRQ">TRQ</option>
                        <option value="AS">AS</option>
                        <option value="AD">AD</option>
                        <option value="ATT">ATT</option>
                      </select>
                    </div>
                    <div className="data-field">
                      <label>Rarità</label>
                      <select value={extractedData.carta.rarita} className="data-select">
                        <option value="Standard">Standard</option>
                        <option value="In evidenza">In evidenza</option>
                        <option value="Leggenda">Leggenda</option>
                        <option value="Epica">Epica</option>
                      </select>
                    </div>
                    <div className="data-field low-confidence">
                      <label>Complessivamente</label>
                      <input type="number" value={extractedData.carta.complessivamente} className="data-input" />
                    </div>
                    <div className="data-field">
                      <label>Potenziale</label>
                      <input type="number" value={extractedData.carta.potenziale} className="data-input" />
                    </div>
                    <div className="data-field">
                      <label>Livello Massimo</label>
                      <input type="number" value={extractedData.carta.livelloMassimo} className="data-input" />
                    </div>
                  </div>
                </div>

                <div className="data-section">
                  <h4>⚽ Statistiche</h4>
                  <div className="stats-grid">
                    <div className="stat-group">
                      <h5>Attacco</h5>
                      <div className="stat-fields">
                        <div className="stat-field">
                          <label>Comportamento Offensivo</label>
                          <input type="number" value={extractedData.statistiche.comportamentoOffensivo} />
                        </div>
                        <div className="stat-field">
                          <label>Controllo Palla</label>
                          <input type="number" value={extractedData.statistiche.controlloPalla} />
                        </div>
                        <div className="stat-field">
                          <label>Finalizzazione</label>
                          <input type="number" value={extractedData.statistiche.finalizzazione} />
                        </div>
                      </div>
                    </div>
                    <div className="stat-group">
                      <h5>Difesa</h5>
                      <div className="stat-fields">
                        <div className="stat-field">
                          <label>Comportamento Difensivo</label>
                          <input type="number" value={extractedData.statistiche.comportamentoDifensivo} />
                        </div>
                        <div className="stat-field">
                          <label>Contrasto</label>
                          <input type="number" value={extractedData.statistiche.contrasto} />
                        </div>
                        <div className="stat-field">
                          <label>Aggressività</label>
                          <input type="number" value={extractedData.statistiche.aggressivita} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="data-section">
                  <h4>🎯 Stile e Abilità</h4>
                  <div className="data-grid">
                    <div className="data-field">
                      <label>Stile di Gioco</label>
                      <input type="text" value={extractedData.stileGiocatore} className="data-input" />
                    </div>
                    <div className="data-field">
                      <label>Booster</label>
                      <input type="text" value={extractedData.booster.join(', ')} className="data-input" />
                    </div>
                    <div className="data-field">
                      <label>Abilità</label>
                      <input type="text" value={extractedData.abilita.join(', ')} className="data-input" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={16} />
                  Indietro
                </button>
                <button className="btn btn-primary" onClick={() => setCurrentStep(3)}>
                  Avanti
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Conferma */}
          {currentStep === 3 && extractedData && (
            <div className="step-content">
              <h3>✅ Conferma e Posizionamento</h3>
              <p className="step-description">
                Conferma i dati del giocatore e scegli se posizionarlo subito in campo
              </p>

              <div className="confirmation-summary">
                <div className="player-summary">
                  <h4>{extractedData.nome}</h4>
                  <div className="summary-details">
                    <span className="role">{extractedData.ruoloPrimario}</span>
                    <span className="rating">{extractedData.carta.complessivamente}</span>
                    <span className="rarity">{extractedData.carta.rarita}</span>
                  </div>
                </div>
              </div>

              <div className="positioning-options">
                <div className="option-card">
                  <h4>📋 Status Squadra</h4>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="status" value="titolare" defaultChecked />
                      <span>Titolare</span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="status" value="riserva" />
                      <span>Riserva</span>
                    </label>
                  </div>
                </div>

                <div className="option-card">
                  <h4>⚽ Posizionamento</h4>
                  <label className="checkbox-option">
                    <input type="checkbox" />
                    <span>Posiziona subito in campo</span>
                    <p>Il gettone apparirà "in mano" per il drop sul campo</p>
                  </label>
                </div>
              </div>

              <div className="step-actions">
                <button className="btn btn-secondary" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={16} />
                  Indietro
                </button>
                <button className="btn btn-primary" onClick={handleSavePlayer}>
                  <CheckCircle size={16} />
                  Salva e Posiziona
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRWizard;
