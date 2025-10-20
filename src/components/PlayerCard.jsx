import React from 'react';
import { Trophy, Star, Target, Zap, Shield, Clock } from 'lucide-react';

const PlayerCard = ({ player, showDetails = false }) => {
  if (!player) return null;

  const getPositionColor = position => {
    const colors = {
      PT: 'bg-yellow-500',
      DC: 'bg-red-500',
      TS: 'bg-blue-500',
      TD: 'bg-blue-500',
      CC: 'bg-green-500',
      MED: 'bg-green-500',
      TRQ: 'bg-purple-500',
      SP: 'bg-orange-500',
      P: 'bg-orange-500',
      RWF: 'bg-pink-500',
      LWF: 'bg-pink-500',
    };
    return colors[position] || 'bg-gray-500';
  };

  const getCardTypeColor = cardType => {
    const colors = {
      Epico: 'border-yellow-400',
      Trending: 'border-blue-400',
      POTW: 'border-green-400',
      Leggendaria: 'border-purple-400',
    };
    return colors[cardType] || 'border-gray-400';
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 border-2 ${getCardTypeColor(player.cardType)}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full ${getPositionColor(player.position)} flex items-center justify-center text-white text-xs font-bold`}
          >
            {player.position}
          </div>
          <div>
            <h3 className="text-white font-semibold">{player.name}</h3>
            <p className="text-gray-400 text-sm">
              {player.team} {player.season}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-400">
            {player.rating}
          </div>
          <div className="text-xs text-gray-400">{player.cardType}</div>
        </div>
      </div>

      {/* Statistiche principali */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-gray-700 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <Target size={12} className="text-blue-400" />
            <span className="text-xs text-gray-300">Attacco</span>
          </div>
          <div className="text-lg font-bold text-white">
            {player.stats?.offensiveAwareness || 0}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <Shield size={12} className="text-red-400" />
            <span className="text-xs text-gray-300">Difesa</span>
          </div>
          <div className="text-lg font-bold text-white">
            {player.stats?.defensiveAwareness || 0}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <Zap size={12} className="text-green-400" />
            <span className="text-xs text-gray-300">Velocità</span>
          </div>
          <div className="text-lg font-bold text-white">
            {player.stats?.speed || 0}
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-2">
          <div className="flex items-center gap-1 mb-1">
            <Clock size={12} className="text-purple-400" />
            <span className="text-xs text-gray-300">Resistenza</span>
          </div>
          <div className="text-lg font-bold text-white">
            {player.stats?.stamina || 0}
          </div>
        </div>
      </div>

      {/* Dettagli aggiuntivi */}
      {showDetails && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Altezza:</span>
            <span className="text-white">{player.physical?.height || player.height} cm</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Peso:</span>
            <span className="text-white">{player.physical?.weight || player.weight} kg</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Età:</span>
            <span className="text-white">{player.age}</span>
          </div>

          {/* Abilità */}
          {player.abilities && player.abilities.length > 0 && (
            <div>
              <div className="text-xs text-gray-400 mb-1">Abilità:</div>
              <div className="flex flex-wrap gap-1">
                {player.abilities.slice(0, 3).map((ability, index) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                  >
                    {ability}
                  </span>
                ))}
                {player.abilities.length > 3 && (
                  <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                    +{player.abilities.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Statistiche partita */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-600">
            <div className="text-center">
              <div className="text-xs text-gray-400">Partite</div>
              <div className="text-sm font-bold text-white">
                {player.matchesPlayed}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Gol</div>
              <div className="text-sm font-bold text-white">{player.goals}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400">Assist</div>
              <div className="text-sm font-bold text-white">
                {player.assists}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
