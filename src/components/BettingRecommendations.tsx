import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, AlertTriangle, Star, Calculator, Percent } from 'lucide-react';

interface BetRecommendation {
  id: string;
  type: 'parlay' | 'single' | 'prop';
  category: 'bulls' | 'general' | 'value';
  title: string;
  legs: {
    game: string;
    bet: string;
    odds: number;
    confidence: number;
  }[];
  totalOdds: number;
  stake: number;
  potentialPayout: number;
  risk: 'low' | 'medium' | 'high';
  reasoning: string;
  kelly: number;
}

interface ValueBet {
  game: string;
  bet: string;
  bookmakerOdds: number;
  fairOdds: number;
  edge: number;
  confidence: number;
  maxStake: number;
}

const BettingRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<BetRecommendation[]>([]);
  const [valueBets, setValueBets] = useState<ValueBet[]>([]);
  const [bankroll, setBankroll] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'bulls' | 'general' | 'value'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setRecommendations([
        {
          id: '1',
          type: 'parlay',
          category: 'bulls',
          title: 'Bulls Focus Parlay',
          legs: [
            { game: 'Bulls vs Lakers', bet: 'DeRozan Over 26.5 PTS', odds: -110, confidence: 78 },
            { game: 'Bulls vs Lakers', bet: 'Vucevic Over 9.5 REB', odds: -105, confidence: 72 },
            { game: 'Bulls vs Lakers', bet: 'Bulls +2.5', odds: -110, confidence: 65 }
          ],
          totalOdds: 596,
          stake: 25,
          potentialPayout: 149,
          risk: 'medium',
          reasoning: 'Bulls at home with strong recent form. DeRozan averaging 28.4 PPG, Vucevic dominant on boards vs Lakers weak interior defense.',
          kelly: 0.025
        },
        {
          id: '2',
          type: 'parlay',
          category: 'general',
          title: 'Safe Evening Parlay',
          legs: [
            { game: 'Celtics vs Heat', bet: 'Celtics -5.5', odds: -110, confidence: 82 },
            { game: 'Warriors vs Kings', bet: 'Over 232.5', odds: -110, confidence: 75 },
            { game: 'Bulls vs Lakers', bet: 'Over 225.5', odds: -105, confidence: 69 }
          ],
          totalOdds: 596,
          stake: 30,
          potentialPayout: 179,
          risk: 'low',
          reasoning: 'Conservative picks with high-confidence spread and total bets. Celtics dominant at home, Warriors/Kings pace matchup favors over.',
          kelly: 0.032
        },
        {
          id: '3',
          type: 'single',
          category: 'value',
          title: 'Value Pick of the Day',
          legs: [
            { game: 'Bulls vs Lakers', bet: 'Coby White Over 5.5 AST', odds: 150, confidence: 71 }
          ],
          totalOdds: 150,
          stake: 20,
          potentialPayout: 30,
          risk: 'medium',
          reasoning: 'White averaging 6.8 APG with increased usage. Lakers allow 4th most assists to opposing PGs.',
          kelly: 0.045
        }
      ]);

      setValueBets([
        {
          game: 'Bulls vs Lakers',
          bet: 'Bulls +2.5',
          bookmakerOdds: -110,
          fairOdds: -105,
          edge: 2.3,
          confidence: 65,
          maxStake: 32
        },
        {
          game: 'Celtics vs Heat',
          bet: 'Under 218.5',
          bookmakerOdds: 105,
          fairOdds: -110,
          edge: 5.1,
          confidence: 71,
          maxStake: 51
        },
        {
          game: 'Warriors vs Kings',
          bet: 'Kings +3.5',
          bookmakerOdds: -105,
          fairOdds: 100,
          edge: 2.4,
          confidence: 58,
          maxStake: 24
        }
      ]);

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-600/20';
      case 'medium': return 'text-yellow-400 bg-yellow-600/20';
      case 'high': return 'text-red-400 bg-red-600/20';
      default: return 'text-gray-400 bg-gray-600/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bulls': return 'border-red-400/30 bg-red-600/5';
      case 'general': return 'border-blue-400/30 bg-blue-600/5';
      case 'value': return 'border-green-400/30 bg-green-600/5';
      default: return 'border-gray-400/30 bg-gray-600/5';
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Analyzing betting opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Bankroll */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <DollarSign className="w-6 h-6 text-green-400" />
          <span>Betting Intelligence Hub</span>
        </h2>
        <div className="glass-card px-4 py-2">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">Bankroll:</div>
            <div className="text-lg font-bold text-green-400">${bankroll}</div>
            <input
              type="number"
              value={bankroll}
              onChange={(e) => setBankroll(Number(e.target.value))}
              className="w-20 bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2">
        {['all', 'bulls', 'general', 'value'].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as any)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors capitalize ${
              selectedCategory === category
                ? 'bg-blue-600/20 text-blue-400 border border-blue-400/30'
                : 'glass-card text-gray-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Betting Recommendations */}
        <div className="xl:col-span-2">
          <div className="glass-card">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span>Recommended Bets</span>
                </div>
                <span className="text-sm text-gray-400">{filteredRecommendations.length} bets</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {filteredRecommendations.map((rec) => (
                <div key={rec.id} className={`glass-card p-4 border ${getCategoryColor(rec.category)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{rec.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded text-xs capitalize ${getRiskColor(rec.risk)}`}>
                          {rec.risk} risk
                        </span>
                        <span className="text-sm text-gray-400">{rec.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{formatOdds(rec.totalOdds)}</div>
                      <div className="text-sm text-gray-400">Kelly: {(rec.kelly * 100).toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {rec.legs.map((leg, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                        <div>
                          <div className="text-sm font-medium text-white">{leg.bet}</div>
                          <div className="text-xs text-gray-400">{leg.game}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-300">{formatOdds(leg.odds)}</div>
                          <div className="text-xs text-blue-400">{leg.confidence}%</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700/50 pt-4">
                    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                      <div>
                        <div className="text-sm text-gray-400">Stake</div>
                        <div className="text-white font-semibold">${rec.stake}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">To Win</div>
                        <div className="text-green-400 font-semibold">${rec.potentialPayout}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">ROI</div>
                        <div className="text-blue-400 font-semibold">
                          {((rec.potentialPayout / rec.stake) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 bg-gray-800/30 p-3 rounded">
                      <strong>Reasoning:</strong> {rec.reasoning}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value Bets & Tools */}
        <div className="space-y-6">
          {/* Value Bets */}
          <div className="glass-card">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Percent className="w-5 h-5 text-green-400" />
                <span>Value Bets</span>
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {valueBets.map((bet, index) => (
                <div key={index} className="glass-card p-3 border border-green-400/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-white">{bet.bet}</div>
                    <div className="text-green-400 font-bold">+{bet.edge.toFixed(1)}%</div>
                  </div>
                  <div className="text-xs text-gray-400 mb-2">{bet.game}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">Book:</span> {formatOdds(bet.bookmakerOdds)}
                    </div>
                    <div>
                      <span className="text-gray-400">Fair:</span> {formatOdds(bet.fairOdds)}
                    </div>
                    <div>
                      <span className="text-gray-400">Confidence:</span> {bet.confidence}%
                    </div>
                    <div>
                      <span className="text-gray-400">Max:</span> ${bet.maxStake}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kelly Calculator */}
          <div className="glass-card">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-purple-400" />
                <span>Kelly Calculator</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Odds</label>
                  <input
                    type="number"
                    placeholder="-110"
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Win Probability (%)</label>
                  <input
                    type="number"
                    placeholder="55"
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition-colors">
                  Calculate Optimal Stake
                </button>
                <div className="text-center p-3 bg-purple-600/10 border border-purple-600/30 rounded">
                  <div className="text-sm text-gray-400">Recommended Stake</div>
                  <div className="text-lg font-bold text-purple-400">2.3% of bankroll</div>
                </div>
              </div>
            </div>
          </div>

          {/* Betting Stats */}
          <div className="glass-card">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Session Stats</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">+$127</div>
                  <div className="text-sm text-gray-400">Today P&L</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">73%</div>
                  <div className="text-sm text-gray-400">Win Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">5</div>
                  <div className="text-sm text-gray-400">Active Bets</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">12.3%</div>
                  <div className="text-sm text-gray-400">ROI</div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Management */}
          <div className="glass-card border-yellow-400/20">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span>Risk Alerts</span>
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="text-white font-medium">Exposure Warning</div>
                    <div className="text-gray-400">15% of bankroll on Bulls games</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-600/10 border border-blue-600/20 rounded">
                  <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <div className="text-sm">
                    <div className="text-white font-medium">Hot Streak</div>
                    <div className="text-gray-400">4 wins in last 5 bets</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BettingRecommendations;