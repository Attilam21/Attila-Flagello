import React, { useState } from 'react';
import {
  Star,
  Target,
  Zap,
  Shield,
  Brain,
  Heart,
  Award,
  TrendingUp,
} from 'lucide-react';

const PlayerProfile = ({ player, onEdit, showEditButton = true, onImageUpload }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!player) {
    return <div className="text-gray-400">Nessun giocatore selezionato</div>;
  }

  const tabs = [
    { id: 'overview', label: 'Panoramica', icon: '👤' },
    { id: 'stats', label: 'Statistiche', icon: '⚽' },
    { id: 'abilities', label: 'Abilità', icon: '⭐' },
    { id: 'build', label: 'Build', icon: '🔧' },
    { id: 'formation', label: 'Formazione', icon: '📐' },
  ];

  const getRatingColor = rating => {
    if (rating >= 95) return 'text-red-500';
    if (rating >= 90) return 'text-orange-500';
    if (rating >= 85) return 'text-yellow-500';
    if (rating >= 80) return 'text-green-500';
    return 'text-blue-500';
  };

  const getFormColor = form => {
    switch (form) {
      case 'Excellent':
        return 'bg-green-600';
      case 'Good':
        return 'bg-blue-600';
      case 'Average':
        return 'bg-yellow-600';
      case 'Poor':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Player Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">
              {player.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{player.name}</h2>
              <p className="text-gray-400">
                {player.position} • {player.age} anni
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-4xl font-bold ${getRatingColor(player.rating)}`}
            >
              {player.rating}
            </div>
            <div className="text-sm text-gray-400">Overall Rating</div>
          </div>
        </div>

        {/* Physical Attributes */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {player.physical?.height || 180} cm
            </div>
            <div className="text-xs text-gray-400">Altezza</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {player.physical?.weight || 75} kg
            </div>
            <div className="text-xs text-gray-400">Peso</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white">
              {player.physical?.preferredFoot || 'Right'}
            </div>
            <div className="text-xs text-gray-400">Piede</div>
          </div>
        </div>

        {/* Form and Level */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Forma:</span>
            <span
              className={`px-2 py-1 rounded text-xs font-bold text-white ${getFormColor(player.form)}`}
            >
              {player.form}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Livello:</span>
            <span className="text-sm font-bold text-white">
              {player.level || 1}/{player.maxLevel || 50}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-500">
            {player.matchesPlayed || 0}
          </div>
          <div className="text-xs text-gray-400">Partite</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-500">
            {player.goals || 0}
          </div>
          <div className="text-xs text-gray-400">Gol</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-500">
            {player.assists || 0}
          </div>
          <div className="text-xs text-gray-400">Assist</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-500">
            {player.rating || 0}
          </div>
          <div className="text-xs text-gray-400">Rating</div>
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          ⚽ Statistiche Principali
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(player.stats || {}).map(([stat, value]) => (
            <div
              key={stat}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {stat.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white font-medium capitalize">
                  {stat.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-white font-bold w-8 text-right">
                  {value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          📊 Profilo Statistico
        </h3>
        <div className="flex justify-center">
          <div className="w-64 h-64 relative">
            {/* Simplified radar chart representation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">📊</div>
                <div className="text-gray-400">Radar Chart</div>
                <div className="text-sm text-gray-500">
                  Visualizzazione delle statistiche
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbilities = () => (
    <div className="space-y-6">
      {/* Player Abilities */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          ⭐ Abilità Giocatore
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(player.abilities || []).map((ability, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
            >
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-medium">{ability}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Play Styles */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          🤖 Stili di Gioco IA
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(player.aiPlayStyles || []).map((style, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
            >
              <Brain className="w-5 h-5 text-blue-500" />
              <span className="text-white font-medium">{style}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Abilities */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          🎯 Abilità Aggiuntive
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(player.additionalAbilities || []).map((ability, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
            >
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-white font-medium">{ability}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBuild = () => (
    <div className="space-y-6">
      {/* Build Information */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          🔧 Build Giocatore
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Build Attuale
            </h4>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-500 mb-2">
                {player.build || 'Standard'}
              </div>
              <div className="text-gray-400 text-sm">
                {player.buildDescription ||
                  'Build standard per questa posizione'}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Efficienza Build
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Efficienza</span>
                <span className="text-white font-bold">
                  {player.buildEfficiency || 85}%
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                  style={{ width: `${player.buildEfficiency || 85}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booster Information */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">⚡ Booster Attivi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(player.boosters || []).map((booster, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">{booster.name}</span>
                <span className="text-green-500 font-bold">
                  +{booster.effect}
                </span>
              </div>
              <div className="text-gray-400 text-sm">{booster.description}</div>
              <div className="text-xs text-blue-400 mt-1">
                {booster.condition}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFormation = () => (
    <div className="space-y-6">
      {/* Position Analysis */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          📐 Analisi Posizione
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Posizione Naturale
            </h4>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-500 mb-2">
                {player.position}
              </div>
              <div className="text-gray-400 text-sm">
                {player.positionDescription ||
                  'Posizione principale del giocatore'}
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">
              Posizioni Alternative
            </h4>
            <div className="space-y-2">
              {(player.alternativePositions || []).map((pos, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                >
                  <span className="text-white">{pos.position}</span>
                  <span className="text-yellow-500 font-bold">
                    {pos.rating}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Formation Suitability */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          ⚽ Adattabilità Formazioni
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(player.formationSuitability || []).map((formation, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="text-lg font-bold text-white mb-2">
                {formation.name}
              </div>
              <div className="text-sm text-gray-400 mb-2">
                {formation.description}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Efficacia</span>
                <span className="text-green-500 font-bold">
                  {formation.effectiveness}%
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${formation.effectiveness}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'stats':
        return renderStats();
      case 'abilities':
        return renderAbilities();
      case 'build':
        return renderBuild();
      case 'formation':
        return renderFormation();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{player.name}</h1>
          <p className="text-gray-400">
            {player.position} • {player.team || 'Nessuna squadra'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {onImageUpload && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageUpload(e, 'profile')}
                style={{ display: 'none' }}
                id="player-profile-upload"
              />
              <label
                htmlFor="player-profile-upload"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-2"
              >
                📸 Profilo
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageUpload(e, 'stats')}
                style={{ display: 'none' }}
                id="player-stats-upload"
              />
              <label
                htmlFor="player-stats-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-2"
              >
                📊 Statistiche
              </label>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onImageUpload(e, 'skills')}
                style={{ display: 'none' }}
                id="player-skills-upload"
              />
              <label
                htmlFor="player-skills-upload"
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-2"
              >
                ⭐ Abilità
              </label>
            </>
          )}
          {showEditButton && (
            <button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              ✏️ Modifica
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default PlayerProfile;
