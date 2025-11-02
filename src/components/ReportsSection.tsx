import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, FileText, Download } from 'lucide-react';

interface Report {
  id: string;
  type: '750am' | '800am' | '1100am';
  title: string;
  generated: string;
  status: 'ready' | 'generating' | 'error';
  content?: any;
}

const ReportsSection: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setReports([
        {
          id: '1',
          type: '750am',
          title: '7:50 AM - Previous Day Analysis',
          generated: '2025-11-02T07:50:00',
          status: 'ready',
          content: {
            gamesAnalyzed: 8,
            resultsVsLine: [
              { team: 'Bulls', result: 'W', ats: 'PUSH', ou: 'OVER' },
              { team: 'Celtics', result: 'W', ats: 'COVER', ou: 'UNDER' },
              { team: 'Lakers', result: 'L', ats: 'MISS', ou: 'OVER' }
            ],
            topTrends: [
              'Bulls 4-1 ATS last 5 home games',
              'Lakers struggling vs strong defenses (1-4)',
              'Totals hitting OVER in 67% of games'
            ],
            bullsAnalysis: {
              lastGame: 'W vs Pistons 112-108',
              keyPlayers: [
                { name: 'DeMar DeRozan', stats: '28 PTS, 6 REB, 5 AST', minutes: 36 },
                { name: 'Nikola Vucevic', stats: '16 PTS, 12 REB, 3 AST', minutes: 32 },
                { name: 'Coby White', stats: '18 PTS, 3 REB, 7 AST', minutes: 28 }
              ]
            }
          }
        },
        {
          id: '2',
          type: '800am',
          title: '8:00 AM - Morning Summary',
          generated: '2025-11-02T08:00:00',
          status: 'ready',
          content: {
            yesterdayResults: [
              'Bulls W 112-108 (PUSH -2.5, OVER 218.5)',
              'Celtics W 124-109 (COVER -8.5, UNDER 232.5)',
              'Lakers L 103-118 (MISS +3.5, OVER 221.5)'
            ],
            trends7Day: {
              tempo: 'Bulls averaging 102.3 possessions (up 2.1)',
              offRtg: 'Bulls 114.7 OffRtg (league avg: 112.1)',
              defRtg: 'Bulls 118.2 DefRtg (needs improvement)',
              threePoint: 'Bulls shooting 36.8% from 3 (up 4.2%)',
              freeThrow: 'Bulls 78.9% FT (consistent)'
            },
            bullsPlayers: {
              note: 'Last 5 games form analysis',
              players: [
                { name: 'DeRozan', form: '26.2 PPG, 5.8 RPG, 4.6 APG', trend: 'excellent' },
                { name: 'Vucevic', form: '18.4 PPG, 10.2 RPG, 3.1 APG', trend: 'solid' },
                { name: 'White', form: '16.8 PPG, 3.2 RPG, 6.4 APG', trend: 'improving' }
              ]
            }
          }
        },
        {
          id: '3',
          type: '1100am',
          title: '11:00 AM - Game-Day Scouting',
          generated: '2025-11-02T11:00:00',
          status: 'generating'
        }
      ]);
      
      setLoading(false);
    };

    fetchReports();
  }, []);

  const getReportIcon = (type: string) => {
    switch (type) {
      case '750am': return TrendingUp;
      case '800am': return FileText;
      case '1100am': return Calendar;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400';
      case 'generating': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ReportCard = ({ report }: { report: Report }) => {
    const Icon = getReportIcon(report.type);
    
    return (
      <div 
        className={`glass-card p-4 cursor-pointer transition-all duration-300 hover:bg-white/10 ${
          selectedReport?.id === report.id ? 'neon-border' : ''
        }`}
        onClick={() => setSelectedReport(report)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{report.title}</h3>
              <p className="text-sm text-gray-400">
                Generated: {formatTime(report.generated)}
              </p>
            </div>
          </div>
          <div className={`text-sm font-medium ${getStatusColor(report.status)}`}>
            {report.status === 'generating' && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                <span>Generating...</span>
              </div>
            )}
            {report.status === 'ready' && 'Ready'}
            {report.status === 'error' && 'Error'}
          </div>
        </div>

        {report.status === 'ready' && report.content && (
          <div className="space-y-2 text-sm text-gray-300">
            {report.type === '750am' && (
              <div>
                <div>Games analyzed: {report.content.gamesAnalyzed}</div>
                <div>Bulls last game: {report.content.bullsAnalysis?.lastGame}</div>
              </div>
            )}
            {report.type === '800am' && (
              <div>
                <div>Yesterday results: {report.content.yesterdayResults?.length} games</div>
                <div>Bulls OffRtg: {report.content.trends7Day?.offRtg?.split(':')[1]}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const ReportDetails = ({ report }: { report: Report }) => {
    if (report.status !== 'ready' || !report.content) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            {report.status === 'generating' ? 'Report is being generated...' : 'Report content not available'}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Report Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{report.title}</h2>
          <button className="flex items-center space-x-2 glass-card px-4 py-2 hover:bg-white/10 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* 7:50 AM Report Content */}
        {report.type === '750am' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span>Results vs Closing Line</span>
              </h3>
              <div className="space-y-3">
                {report.content.resultsVsLine?.map((result: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="font-semibold text-white">{result.team}</div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.result === 'W' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                      }`}>
                        {result.result}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.ats === 'COVER' ? 'bg-green-600/20 text-green-400' : 
                        result.ats === 'PUSH' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {result.ats}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.ou === 'OVER' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'
                      }`}>
                        {result.ou}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Top Trends</h3>
              <div className="space-y-2">
                {report.content.topTrends?.map((trend: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">{trend}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <span className="text-red-400">🐂</span>
                <span>Bulls Player Analysis</span>
              </h3>
              <div className="space-y-4">
                <div className="text-gray-300 mb-4">
                  Last Game: {report.content.bullsAnalysis?.lastGame}
                </div>
                {report.content.bullsAnalysis?.keyPlayers?.map((player: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.stats}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-gray-300">{player.minutes} min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8:00 AM Report Content */}
        {report.type === '800am' && (
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Yesterday Results</h3>
              <div className="space-y-2">
                {report.content.yesterdayResults?.map((result: string, index: number) => (
                  <div key={index} className="p-3 bg-gray-800/30 rounded-lg text-gray-300">
                    {result}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">7-Day Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(report.content.trends7Day || {}).map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-800/30 rounded-lg">
                    <div className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                    <div className="text-white font-medium">{value as string}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Bulls Players Form</h3>
              <div className="space-y-3">
                {report.content.bullsPlayers?.players?.map((player: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{player.name}</div>
                      <div className="text-sm text-gray-400">{player.form}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      player.trend === 'excellent' ? 'bg-green-600/20 text-green-400' :
                      player.trend === 'solid' ? 'bg-blue-600/20 text-blue-400' :
                      'bg-yellow-600/20 text-yellow-400'
                    }`}>
                      {player.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Reports List */}
      <div className="xl:col-span-1">
        <div className="glass-card">
          <div className="p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span>Daily Reports</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">Chicago timezone (CST)</p>
          </div>
          <div className="p-6 space-y-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>
      </div>

      {/* Report Details */}
      <div className="xl:col-span-2">
        <div className="glass-card">
          {selectedReport ? (
            <div className="p-6">
              <ReportDetails report={selectedReport} />
            </div>
          ) : (
            <div className="p-12 text-center">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Select a Report</h3>
              <p className="text-gray-500">Choose a report from the left to view detailed analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;