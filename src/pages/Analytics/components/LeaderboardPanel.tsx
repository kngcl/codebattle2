import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { LeaderboardEntry } from '../../../services/analyticsService';
import { 
  Trophy, Medal, Award, TrendingUp, TrendingDown, 
  Minus, Crown, Star, Code, Target, Clock, Zap,
  Filter, Search, ChevronUp, ChevronDown
} from 'lucide-react';

interface LeaderboardPanelProps {
  leaderboard: LeaderboardEntry[];
  currentUserId?: string;
  timeRange: string;
}

const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({ 
  leaderboard, 
  currentUserId, 
  timeRange 
}) => {
  const { actualTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'solved' | 'accuracy' | 'speed'>('rating');
  const [filterBy, setFilterBy] = useState<'all' | 'friends' | 'similar'>('all');
  const isDark = actualTheme === 'dark';

  const filteredLeaderboard = leaderboard
    .filter(entry => {
      if (searchTerm) {
        return entry.username.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'solved':
          return b.solvedChallenges - a.solvedChallenges;
        case 'accuracy':
          return b.accuracyRate - a.accuracyRate;
        case 'speed':
          return a.averageExecutionTime - b.averageExecutionTime;
        default:
          return b.rating - a.rating;
      }
    });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      'Centurion': 'bg-purple-500',
      'Streak Master': 'bg-orange-500',
      'Precision Expert': 'bg-green-500',
      'Polyglot': 'bg-blue-500',
      'Speed Demon': 'bg-red-500',
      'Problem Solver': 'bg-yellow-500'
    };
    return colors[badge as keyof typeof colors] || 'bg-gray-500';
  };

  const currentUserEntry = leaderboard.find(entry => entry.userId === currentUserId);
  const topPerformers = filteredLeaderboard.slice(0, 3);
  const regularEntries = filteredLeaderboard.slice(3);

  return (
    <div className="space-y-6">
      {/* Current User Highlight */}
      {currentUserEntry && (
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-400" />
              Your Ranking
            </h3>
            <div className="text-sm text-gray-400">
              {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'All Time'}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {getRankIcon(currentUserEntry.rank)}
              <img
                src={currentUserEntry.avatar}
                alt={currentUserEntry.username}
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
              <div>
                <p className="font-medium text-white">{currentUserEntry.username}</p>
                <p className="text-sm text-gray-400">
                  {currentUserEntry.solvedChallenges} challenges solved
                </p>
              </div>
            </div>
            
            <div className="flex-1" />
            
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{currentUserEntry.rating}</p>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{Math.round(currentUserEntry.accuracyRate)}%</p>
                <p className="text-xs text-gray-400">Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{Math.round(currentUserEntry.averageExecutionTime)}ms</p>
                <p className="text-xs text-gray-400">Avg Speed</p>
              </div>
              <div className="flex items-center gap-1">
                {getRankChangeIcon(currentUserEntry.rankChange)}
                <div>
                  <p className={`text-sm font-medium ${
                    currentUserEntry.rankChange > 0 ? 'text-green-400' : 
                    currentUserEntry.rankChange < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {currentUserEntry.rankChange > 0 ? '+' : ''}{currentUserEntry.rankChange}
                  </p>
                  <p className="text-xs text-gray-400">Change</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="rating">Sort by Rating</option>
              <option value="solved">Sort by Solved</option>
              <option value="accuracy">Sort by Accuracy</option>
              <option value="speed">Sort by Speed</option>
            </select>
            
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="all">All Users</option>
              <option value="friends">Friends Only</option>
              <option value="similar">Similar Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {topPerformers.length >= 3 && (
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Top Performers
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {[topPerformers[1], topPerformers[0], topPerformers[2]].map((entry, index) => {
              if (!entry) return null;
              const actualRank = entry.rank;
              const podiumOrder = [2, 1, 3][index];
              
              return (
                <div 
                  key={entry.userId}
                  className={`text-center ${index === 1 ? 'transform scale-110 z-10' : ''}`}
                >
                  <div className={`relative p-4 rounded-xl border ${
                    actualRank === 1 
                      ? 'bg-gradient-to-b from-yellow-900/30 to-yellow-800/20 border-yellow-500/30' :
                    actualRank === 2
                      ? 'bg-gradient-to-b from-gray-700/30 to-gray-600/20 border-gray-400/30' :
                      'bg-gradient-to-b from-orange-900/30 to-orange-800/20 border-orange-500/30'
                  }`}>
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      {getRankIcon(actualRank)}
                    </div>
                    
                    <div className="mt-4">
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className={`w-16 h-16 mx-auto rounded-full border-2 mb-3 ${
                          actualRank === 1 ? 'border-yellow-400' :
                          actualRank === 2 ? 'border-gray-300' : 'border-orange-400'
                        }`}
                      />
                      <p className="font-medium text-white mb-1">{entry.username}</p>
                      <p className="text-sm text-gray-400 mb-2">{entry.rating} rating</p>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Solved:</span>
                          <span className="text-white">{entry.solvedChallenges}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Accuracy:</span>
                          <span className="text-white">{Math.round(entry.accuracyRate)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Language:</span>
                          <span className="text-white capitalize">{entry.favoriteLanguage}</span>
                        </div>
                      </div>
                      
                      {entry.badges.length > 0 && (
                        <div className="flex justify-center gap-1 mt-2">
                          {entry.badges.slice(0, 2).map((badge) => (
                            <div
                              key={badge}
                              className={`w-2 h-2 rounded-full ${getBadgeColor(badge)}`}
                              title={badge}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Full Leaderboard
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} border-b border-gray-700`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Solved
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Avg Speed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Badges
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredLeaderboard.map((entry) => (
                <tr 
                  key={entry.userId}
                  className={`hover:bg-gray-800/30 transition-colors ${
                    entry.userId === currentUserId 
                      ? 'bg-purple-900/20 border border-purple-500/30' 
                      : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {entry.rank <= 3 ? (
                        getRankIcon(entry.rank)
                      ) : (
                        <span className="text-gray-400 font-medium">#{entry.rank}</span>
                      )}
                      {getRankChangeIcon(entry.rankChange)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-white">{entry.username}</p>
                        {entry.userId === currentUserId && (
                          <p className="text-xs text-purple-400">You</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-white font-medium">{entry.rating}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-gray-400" />
                      <span className="text-white">{entry.solvedChallenges}</span>
                      <span className="text-gray-400 text-sm">/{entry.totalSubmissions}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-400" />
                      <span className={`font-medium ${
                        entry.accuracyRate >= 80 ? 'text-green-400' :
                        entry.accuracyRate >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {Math.round(entry.accuracyRate)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className={`font-medium ${
                        entry.averageExecutionTime < 100 ? 'text-green-400' :
                        entry.averageExecutionTime < 500 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {Math.round(entry.averageExecutionTime)}ms
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-300 rounded-full capitalize">
                      {entry.favoriteLanguage}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      {entry.badges.slice(0, 3).map((badge) => (
                        <div
                          key={badge}
                          className={`w-3 h-3 rounded-full ${getBadgeColor(badge)}`}
                          title={badge}
                        />
                      ))}
                      {entry.badges.length > 3 && (
                        <span className="text-xs text-gray-400 ml-1">
                          +{entry.badges.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLeaderboard.length === 0 && (
          <div className="text-center py-8">
            <Search className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPanel;