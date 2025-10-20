import React from 'react';
import {
  Target,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const MatchStats = ({ match, showPlayerRatings = false }) => {
  if (!match) return null;

  const getStatIcon = statName => {
    const icons = {
      possession: <Target size={16} className="text-blue-400" />,
      totalShots: <Target size={16} className="text-orange-400" />,
      shotsOnTarget: <Target size={16} className="text-green-400" />,
      passes: <TrendingUp size={16} className="text-purple-400" />,
      successfulPasses: <TrendingUp size={16} className="text-green-400" />,
      tackles: <Shield size={16} className="text-red-400" />,
      saves: <Shield size={16} className="text-yellow-400" />,
    };
    return icons[statName] || <Clock size={16} className="text-gray-400" />;
  };

  const getStatColor = (homeValue, awayValue) => {
    if (homeValue > awayValue) return 'text-green-400';
    if (homeValue < awayValue) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatStatName = statName => {
    const names = {
      possession: 'Possesso',
      totalShots: 'Tiri totali',
      shotsOnTarget: 'Tiri in porta',
      fouls: 'Falli',
      offsides: 'Fuorigioco',
      corners: "Calci d'angolo",
      freeKicks: 'Punizioni',
      passes: 'Passaggi',
      successfulPasses: 'Passaggi riusciti',
      crosses: 'Cross',
      interceptedPasses: 'Passaggi intercettati',
      tackles: 'Contrasti',
      saves: 'Parate',
    };
    return names[statName] || statName;
  };

  const formatStatValue = (value, statName) => {
    if (statName === 'possession') return `${value}%`;
    return value.toString();
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* Header Partita */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white mb-2">
          Statistiche Partita
        </h2>
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-400">{match.homeTeam}</div>
            <div className="text-3xl font-bold text-white">
              {match.homeScore}
            </div>
          </div>
          <div className="text-gray-400">-</div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {match.awayScore}
            </div>
            <div className="text-sm text-gray-400">{match.awayTeam}</div>
          </div>
        </div>
      </div>

      {/* Statistiche Squadra */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-4">
          Statistiche Squadra
        </h3>

        {Object.entries(match.teamStats).map(([statName, values]) => (
          <div
            key={statName}
            className="flex items-center justify-between py-2 border-b border-gray-700"
          >
            <div className="flex items-center gap-2">
              {getStatIcon(statName)}
              <span className="text-gray-300">{formatStatName(statName)}</span>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`text-right ${getStatColor(values.home, values.away)}`}
              >
                <div className="font-bold">
                  {formatStatValue(values.home, statName)}
                </div>
              </div>

              <div className="w-16 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width:
                      statName === 'possession'
                        ? `${values.home}%`
                        : `${(values.home / (values.home + values.away)) * 100}%`,
                  }}
                />
              </div>

              <div
                className={`text-left ${getStatColor(values.away, values.home)}`}
              >
                <div className="font-bold">
                  {formatStatValue(values.away, statName)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Aree di Attacco */}
      {match.attackAreas && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Aree di Attacco
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">{match.homeTeam}</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Sinistra:</span>
                  <span className="text-white">
                    {match.attackAreas.home.left}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Centro:</span>
                  <span className="text-white">
                    {match.attackAreas.home.center}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Destra:</span>
                  <span className="text-white">
                    {match.attackAreas.home.right}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-2">{match.awayTeam}</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Sinistra:</span>
                  <span className="text-white">
                    {match.attackAreas.away.left}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Centro:</span>
                  <span className="text-white">
                    {match.attackAreas.away.center}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Destra:</span>
                  <span className="text-white">
                    {match.attackAreas.away.right}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Valutazioni Giocatori */}
      {showPlayerRatings && match.playerRatings && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Valutazioni Giocatori
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Squadra Casa */}
            <div>
              <div className="text-sm text-gray-400 mb-2">{match.homeTeam}</div>
              <div className="space-y-1">
                {match.playerRatings.home.slice(0, 5).map((player, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-gray-300 text-sm">{player.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">
                        {player.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        {player.position}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Squadra Trasferta */}
            <div>
              <div className="text-sm text-gray-400 mb-2">{match.awayTeam}</div>
              <div className="space-y-1">
                {match.playerRatings.away.slice(0, 5).map((player, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-gray-300 text-sm">{player.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">
                        {player.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        {player.position}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchStats;
