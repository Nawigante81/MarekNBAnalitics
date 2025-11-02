import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertTriangle, Clock, Activity } from 'lucide-react';

interface OddsData {
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  bookmakers: {
    name: string;
    moneyline: { home: number; away: number };
    spread: { line: number; home: number; away: number };
    total: { line: number; over: number; under: number };
  }[];
  movements: {
    type: 'spread' | 'total' | 'ml';
    direction: 'up' | 'down';
    from: number;
    to: number;
    time: string;
  }[];
}

interface LiveAlert {
  id: string;
  type: 'movement' | 'value' | 'reverse';
  game: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  time: string;
}

const LiveOdds: React.FC = () => {
  const [oddsData, setOddsData] = useState<OddsData[]>([]);
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOdds = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOddsData([
        {
          gameId: '1',
          homeTeam: 'Chicago Bulls',
          awayTeam: 'Los Angeles Lakers',
          startTime: '8:00 PM EST',
          bookmakers: [
            {
              name: 'DraftKings',
              moneyline: { home: -120, away: +100 },
              spread: { line: -2.5, home: -110, away: -110 },
              total: { line: 225.5, over: -110, under: -110 }
            },
            {
              name: 'BetMGM',
              moneyline: { home: -115, away: -105 },
              spread: { line: -2.5, home: -105, away: -115 },
              total: { line: 225.0, over: -115, under: -105 }
            },
            {
              name: 'FanDuel',
              moneyline: { home: -118, away: -102 },
              spread: { line: -3.0, home: -110, away: -110 },
              total: { line: 226.0, over: -108, under: -112 }
            }
          ],
          movements: [
            { type: 'spread', direction: 'down', from: -1.5, to: -2.5, time: '2:30 PM' },
            { type: 'total', direction: 'up', from: 224.5, to: 225.5, time: '3:15 PM' }
          ]
        },
        {
          gameId: '2',
          homeTeam: 'Boston Celtics',
          awayTeam: 'Miami Heat',
          startTime: '7:30 PM EST',
          bookmakers: [
            {
              name: 'DraftKings',
              moneyline: { home: -240, away: +200 },
              spread: { line: -5.5, home: -110, away: -110 },
              total: { line: 218.5, over: -110, under: -110 }
            },
            {
              name: 'BetMGM',
              moneyline: { home: -245, away: +195 },
              spread: { line: -5.5, home: -115, away: -105 },
              total: { line: 218.0, over: -105, under: -115 }
            },
            {
              name: 'FanDuel',
              moneyline: { home: -235, away: +205 },
              spread: { line: -6.0, home: -110, away: -110 },
              total: { line: 219.0, over: -112, under: -108 }
            }
          ],
          movements: [
            { type: 'spread', direction: 'up', from: -5.0, to: -5.5, time: '1:45 PM' }
          ]
        }
      ]);

      setAlerts([
        {
          id: '1',
          type: 'movement',
          game: 'Bulls vs Lakers',
          message: 'Spread moved from -1.5 to -2.5 (heavy Bulls action)',
          severity: 'high',
          time: '2:30 PM'
        },
        {
          id: '2',
          type: 'value',
          game: 'Celtics vs Heat',
          message: 'BetMGM offering best value on Heat +5.5 at -105',
          severity: 'medium',
          time: '3:00 PM'
        },
        {
          id: '3',
          type: 'reverse',
          game: 'Bulls vs Lakers',
          message: 'Reverse line movement detected - line up but money on Lakers',
          severity: 'high',
          time: '3:45 PM'
        }
      ]);

      setLoading(false);
    };

    fetchOdds();

    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchOdds();
        setLastUpdate(new Date());
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const getBestOdds = (bookmakers: any[], market: string, side: string) => {
    let best = null;
    let bestValue = market === 'moneyline' ? (side === 'favorite' ? -1000 : -1000) : -1000;
    
    bookmakers.forEach(book => {
      let value;
      if (market === 'moneyline') {
        value = side === 'home' ? book.moneyline.home : book.moneyline.away;
      } else if (market === 'spread') {
        value = side === 'home' ? book.spread.home : book.spread.away;
      } else if (market === 'total') {
        value = side === 'over' ? book.total.over : book.total.under;
      }
      
      if (value && value > bestValue) {
        bestValue = value;
        best = book.name;
      }
    });

    return { value: bestValue, book: best };
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-400/30 bg-red-600/10 text-red-400';
      case 'medium': return 'border-yellow-400/30 bg-yellow-600/10 text-yellow-400';
      case 'low': return 'border-blue-400/30 bg-blue-600/10 text-blue-400';
      default: return 'border-gray-400/30 bg-gray-600/10 text-gray-400';
    }
  };

  const getMovementIcon = (direction: string) => {
    return direction === 'up' ? 
      <TrendingUp className="w-4 h-4 text-green-400" /> : 
      <TrendingDown className="w-4 h-4 text-red-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading live odds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Activity className="w-6 h-6 text-blue-400" />
          <span>Live Odds Monitor</span>
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-300">Auto-refresh</span>
          </div>
          <button
            onClick={() => {
              setLastUpdate(new Date());
              // Trigger refresh
            }}
            className="glass-card p-2 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
          <div className="glass-card px-3 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Live Alerts */}
        <div className="xl:col-span-1">
          <div className="glass-card">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span>Live Alerts</span>
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium">{alert.game}</div>
                    <div className="text-xs opacity-70">{alert.time}</div>
                  </div>
                  <div className="text-sm opacity-90">{alert.message}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.type === 'movement' ? 'bg-blue-600/20 text-blue-400' :
                      alert.type === 'value' ? 'bg-green-600/20 text-green-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {alert.type}
                    </span>
                    <span className="text-xs opacity-60 capitalize">{alert.severity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Odds Comparison */}
        <div className="xl:col-span-3">
          <div className="glass-card">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span>Odds Comparison</span>
                </div>
                <span className="text-sm text-gray-400">{oddsData.length} games</span>
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {oddsData.map((game) => (
                <div 
                  key={game.gameId} 
                  className={`glass-card p-4 cursor-pointer transition-all duration-300 ${
                    selectedGame === game.gameId ? 'neon-border' : 'hover:bg-white/5'
                  }`}
                  onClick={() => setSelectedGame(selectedGame === game.gameId ? null : game.gameId)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {game.homeTeam} vs {game.awayTeam}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{game.startTime}</span>
                        </div>
                        {game.movements.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Activity className="w-4 h-4 text-yellow-400" />
                            <span>{game.movements.length} movements</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {game.homeTeam.includes('Bulls') && (
                        <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded">
                          BULLS FOCUS
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Best Odds */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Spread</div>
                      <div className="text-white font-semibold">
                        {game.bookmakers[0]?.spread.line > 0 ? '+' : ''}{game.bookmakers[0]?.spread.line}
                      </div>
                      <div className="text-xs text-green-400">
                        Best: {formatOdds(getBestOdds(game.bookmakers, 'spread', 'home').value)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Total</div>
                      <div className="text-white font-semibold">{game.bookmakers[0]?.total.line}</div>
                      <div className="text-xs text-green-400">
                        O: {formatOdds(getBestOdds(game.bookmakers, 'total', 'over').value)}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-800/30 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Moneyline</div>
                      <div className="text-white font-semibold">
                        {formatOdds(game.bookmakers[0]?.moneyline.home)}
                      </div>
                      <div className="text-xs text-green-400">
                        Best: {formatOdds(getBestOdds(game.bookmakers, 'moneyline', 'home').value)}
                      </div>
                    </div>
                  </div>

                  {/* Recent Movements */}
                  {game.movements.length > 0 && (
                    <div className="border-t border-gray-700/50 pt-3">
                      <div className="text-sm font-medium text-gray-300 mb-2">Recent Movements</div>
                      <div className="flex space-x-4">
                        {game.movements.slice(0, 3).map((movement, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            {getMovementIcon(movement.direction)}
                            <span className="text-gray-400">
                              {movement.type}: {movement.from} → {movement.to}
                            </span>
                            <span className="text-xs text-gray-500">({movement.time})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Bookmaker Comparison (when selected) */}
                  {selectedGame === game.gameId && (
                    <div className="border-t border-gray-700/50 pt-4 mt-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-700/50">
                              <th className="text-left py-2 text-gray-400">Sportsbook</th>
                              <th className="text-center py-2 text-gray-400">Spread</th>
                              <th className="text-center py-2 text-gray-400">Total</th>
                              <th className="text-center py-2 text-gray-400">Moneyline</th>
                            </tr>
                          </thead>
                          <tbody>
                            {game.bookmakers.map((book, index) => (
                              <tr key={index} className="border-b border-gray-800/50">
                                <td className="py-2 font-medium text-white">{book.name}</td>
                                <td className="text-center py-2">
                                  <div className="text-white">
                                    {book.spread.line > 0 ? '+' : ''}{book.spread.line}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {formatOdds(book.spread.home)} / {formatOdds(book.spread.away)}
                                  </div>
                                </td>
                                <td className="text-center py-2">
                                  <div className="text-white">{book.total.line}</div>
                                  <div className="text-xs text-gray-400">
                                    {formatOdds(book.total.over)} / {formatOdds(book.total.under)}
                                  </div>
                                </td>
                                <td className="text-center py-2">
                                  <div className="text-xs text-gray-400">
                                    {formatOdds(book.moneyline.home)} / {formatOdds(book.moneyline.away)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveOdds;