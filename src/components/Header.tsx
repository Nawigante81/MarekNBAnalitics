import React from 'react';
import { Bell, RefreshCw, Settings, Users } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  lastUpdate: Date;
  onRefresh: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, lastUpdate, onRefresh }) => {
  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'dashboard': return 'NBA Analytics Dashboard';
      case 'reports': return 'Daily Reports Center';
      case 'bulls': return 'Chicago Bulls Analysis';
      case 'betting': return 'Betting Intelligence Hub';
      case 'odds': return 'Live Odds Monitor';
      case 'analytics': return 'Advanced Analytics';
      default: return 'NBA Analytics';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{getSectionTitle(activeSection)}</h1>
          <p className="text-gray-400 text-sm mt-1">
            Last updated: {formatTime(lastUpdate)} CST
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Live Status */}
          <div className="flex items-center space-x-2 glass-card px-3 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Live Data</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="glass-card p-2 hover:bg-white/10 transition-colors duration-200"
            title="Refresh Data"
          >
            <RefreshCw className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>

          {/* Notifications */}
          <button className="glass-card p-2 hover:bg-white/10 transition-colors duration-200 relative">
            <Bell className="w-5 h-5 text-gray-400 hover:text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          {/* Settings */}
          <button className="glass-card p-2 hover:bg-white/10 transition-colors duration-200">
            <Settings className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>

          {/* User Profile */}
          <button className="flex items-center space-x-2 glass-card px-3 py-2 hover:bg-white/10 transition-colors duration-200">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-300">Analyst</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;