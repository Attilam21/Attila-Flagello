import React, { useState, useEffect } from 'react';

const PlayerEditForm = ({ player, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: 'GK',
    rating: 50,
    age: 18,
    nationality: '',
    team: '',
    stats: {
      pace: 50,
      shooting: 50,
      passing: 50,
      dribbling: 50,
      defending: 50,
      physical: 50
    },
    physical: {
      height: 180,
      weight: 70,
      preferredFoot: 'Right'
    },
    contract: {
      salary: 1000000,
      expiry: '2025-06-30',
      releaseClause: 10000000
    },
    form: 'Average',
    condition: 50
  });

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || '',
        position: player.position || 'GK',
        rating: player.rating || 50,
        age: player.age || 18,
        nationality: player.nationality || '',
        team: player.team || '',
        stats: { ...formData.stats, ...player.stats },
        physical: { ...formData.physical, ...player.physical },
        contract: { ...formData.contract, ...player.contract },
        form: player.form || 'Average',
        condition: player.condition || 50
      });
    }
  }, [player]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };

  const positions = [
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

  const forms = [
    { value: 'Excellent', label: 'Eccellente' },
    { value: 'Good', label: 'Buona' },
    { value: 'Average', label: 'Media' },
    { value: 'Poor', label: 'Scarsa' }
  ];

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: '#1F2937',
      borderRadius: '0.75rem',
      padding: '2rem',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      border: '1px solid #374151'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '1px solid #374151'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#E5E7EB'
    },
    closeButton: {
      backgroundColor: '#EF4444',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      padding: '0.5rem 1rem',
      cursor: 'pointer',
      fontSize: '0.875rem'
    },
    form: {
      display: 'grid',
      gap: '1.5rem'
    },
    section: {
      backgroundColor: '#374151',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      border: '1px solid #4B5563'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#E5E7EB',
      marginBottom: '1rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#E5E7EB'
    },
    input: {
      padding: '0.75rem',
      backgroundColor: '#1F2937',
      border: '1px solid #4B5563',
      borderRadius: '0.375rem',
      color: '#E5E7EB',
      fontSize: '0.875rem'
    },
    select: {
      padding: '0.75rem',
      backgroundColor: '#1F2937',
      border: '1px solid #4B5563',
      borderRadius: '0.375rem',
      color: '#E5E7EB',
      fontSize: '0.875rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem'
    },
    statField: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    statSlider: {
      width: '100%',
      height: '6px',
      borderRadius: '3px',
      backgroundColor: '#1F2937',
      outline: 'none',
      cursor: 'pointer'
    },
    statValue: {
      fontSize: '0.875rem',
      fontWeight: 'bold',
      color: '#10B981',
      textAlign: 'center'
    },
    buttons: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
      paddingTop: '1rem',
      borderTop: '1px solid #374151'
    },
    saveButton: {
      backgroundColor: '#10B981',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 2rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600'
    },
    cancelButton: {
      backgroundColor: '#6B7280',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.75rem 2rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {player ? '✏️ Modifica Giocatore' : '➕ Aggiungi Giocatore'}
          </h2>
          <button style={styles.closeButton} onClick={onCancel}>
            ✕ Chiudi
          </button>
        </div>

        <form style={styles.form}>
          {/* Informazioni Base */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📋 Informazioni Base</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Nome Completo</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Es. Lionel Messi"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Posizione</label>
                <select
                  style={styles.select}
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                >
                  {positions.map(pos => (
                    <option key={pos.value} value={pos.value}>
                      {pos.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Rating</label>
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  max="99"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Età</label>
                <input
                  style={styles.input}
                  type="number"
                  min="16"
                  max="45"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Nazionalità</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="Es. Argentina"
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Squadra</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.team}
                  onChange={(e) => handleInputChange('team', e.target.value)}
                  placeholder="Es. Inter Miami"
                />
              </div>
            </div>
          </div>

          {/* Statistiche */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>⚽ Statistiche</h3>
            <div style={styles.statsGrid}>
              {Object.entries(formData.stats).map(([stat, value]) => (
                <div key={stat} style={styles.statField}>
                  <label style={styles.label}>
                    {stat.charAt(0).toUpperCase() + stat.slice(1)}
                  </label>
                  <div style={styles.statValue}>{value}</div>
                  <input
                    style={styles.statSlider}
                    type="range"
                    min="1"
                    max="99"
                    value={value}
                    onChange={(e) => handleInputChange(`stats.${stat}`, parseInt(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Caratteristiche Fisiche */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💪 Caratteristiche Fisiche</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Altezza (cm)</label>
                <input
                  style={styles.input}
                  type="number"
                  min="150"
                  max="220"
                  value={formData.physical.height}
                  onChange={(e) => handleInputChange('physical.height', parseInt(e.target.value))}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Peso (kg)</label>
                <input
                  style={styles.input}
                  type="number"
                  min="50"
                  max="120"
                  value={formData.physical.weight}
                  onChange={(e) => handleInputChange('physical.weight', parseInt(e.target.value))}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Piede Preferito</label>
                <select
                  style={styles.select}
                  value={formData.physical.preferredFoot}
                  onChange={(e) => handleInputChange('physical.preferredFoot', e.target.value)}
                >
                  <option value="Right">Destro</option>
                  <option value="Left">Sinistro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contratto */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💰 Contratto</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Stipendio (€)</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  value={formData.contract.salary}
                  onChange={(e) => handleInputChange('contract.salary', parseInt(e.target.value))}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Scadenza</label>
                <input
                  style={styles.input}
                  type="date"
                  value={formData.contract.expiry}
                  onChange={(e) => handleInputChange('contract.expiry', e.target.value)}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Clausola Rescisoria (€)</label>
                <input
                  style={styles.input}
                  type="number"
                  min="0"
                  value={formData.contract.releaseClause}
                  onChange={(e) => handleInputChange('contract.releaseClause', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Forma e Condizione */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>📈 Forma e Condizione</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Forma Attuale</label>
                <select
                  style={styles.select}
                  value={formData.form}
                  onChange={(e) => handleInputChange('form', e.target.value)}
                >
                  {forms.map(form => (
                    <option key={form.value} value={form.value}>
                      {form.label}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Condizione Fisica</label>
                <div style={styles.statValue}>{formData.condition}</div>
                <input
                  style={styles.statSlider}
                  type="range"
                  min="1"
                  max="100"
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div style={styles.buttons}>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={onCancel}
            >
              ❌ Annulla
            </button>
            <button
              type="button"
              style={styles.saveButton}
              onClick={handleSave}
            >
              ✅ Salva Giocatore
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerEditForm;
