import React, { useState, memo } from 'react';
import { 
  Trophy, Crown, Medal, Users, TrendingUp, Star, Award,
  Flame, Target, Clock, Activity, ChevronUp, ChevronDown,
  Globe, Filter, Search, Calendar, Zap, Shield, Sparkles,
  ArrowUp, ArrowDown, Minus, Hash, Flag
} from 'lucide-react';

const LeaderboardRow = memo(({ player, index, previousRank }: any) => {
  const getRankIcon = () => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300" />;
    if (index === 2) return <Medal className="w-6 h-6 text-orange-400" />;
    return <Hash className="w-4 h-4 text-gray-500" />;
  };

  const getRankBg = () => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/30';
    if (index === 1) return 'bg-gradient-to-r from-gray-600/20 to-gray-500/20 border-gray-500/30';
    if (index === 2) return 'bg-gradient-to-r from-orange-600/20 to-amber-600/20 border-orange-500/30';
    return 'bg-black/40 border-white/10 hover:border-purple-500/30';
  };

  const getRankChange = () => {
    const change = previousRank - (index + 1);
    if (change > 0) return { icon: <ArrowUp className="w-3 h-3" />, color: 'text-green-400', value: `+${change}` };
    if (change < 0) return { icon: <ArrowDown className="w-3 h-3" />, color: 'text-red-400', value: change };
    return { icon: <Minus className="w-3 h-3" />, color: 'text-gray-500', value: '-' };
  };

  const rankChange = getRankChange();

  return (
    <div
      className={`group relative backdrop-blur-xl border rounded-xl p-4 transition-all duration-300 hover:translate-y-[-2px] animate-fade-in-up ${getRankBg()}`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Rank */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Rank Number/Icon */}
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg
              ${index < 3 
                ? 'bg-gradient-to-br from-white/10 to-white/5' 
                : 'bg-white/5'
              }
            `}>
              {index < 3 ? getRankIcon() : <span className="text-white">#{index + 1}</span>}
            </div>
            
            {/* Rank Change */}
            <div className={`flex items-center gap-1 ${rankChange.color}`}>
              {rankChange.icon}
              <span className="text-xs font-medium">{rankChange.value}</span>
            </div>
          </div>

          {/* Player Info */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">{player.name[0]}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {player.name}
                </h3>
                {player.isVerified && <Shield className="w-4 h-4 text-blue-400" />}
                {player.isPro && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full font-bold">
                    PRO
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{player.country}</span>
                <span>•</span>
                <span>{player.team}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{player.rating}</div>
            <div className="text-xs text-gray-400">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{player.solved}</div>
            <div className="text-xs text-gray-400">Solved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{player.winRate}%</div>
            <div className="text-xs text-gray-400">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-2xl font-bold text-orange-400">{player.streak}</span>
            </div>
            <div className="text-xs text-gray-400">Streak</div>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="flex lg:hidden items-center gap-4 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-1 text-sm">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span className="text-white font-medium">{player.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Target className="w-4 h-4 text-green-400" />
          <span className="text-white font-medium">{player.solved}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-white font-medium">{player.winRate}%</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-white font-medium">{player.streak}</span>
        </div>
      </div>
    </div>
  );
});

const OptimizedLeaderboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('all');
  const [category, setCategory] = useState('global');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const players = [
    {
      name: 'AlgoMaster',
      country: 'USA',
      team: 'Code Warriors',
      rating: 2847,
      solved: 1234,
      winRate: 78,
      streak: 45,
      isVerified: true,
      isPro: true,
      previousRank: 2
    },
    {
      name: 'ByteNinja',
      country: 'Japan',
      team: 'Tech Samurai',
      rating: 2789,
      solved: 1156,
      winRate: 75,
      streak: 32,
      isVerified: true,
      isPro: true,
      previousRank: 1
    },
    {
      name: 'CodeWizard',
      country: 'India',
      team: 'Logic Lords',
      rating: 2756,
      solved: 1089,
      winRate: 72,
      streak: 28,
      isVerified: true,
      isPro: false,
      previousRank: 4
    },
    {
      name: 'DataDragon',
      country: 'Germany',
      team: 'Algo Knights',
      rating: 2698,
      solved: 987,
      winRate: 69,
      streak: 21,
      isVerified: false,
      isPro: true,
      previousRank: 3
    },
    {
      name: 'PythonPro',
      country: 'Canada',
      team: 'Syntax Squad',
      rating: 2654,
      solved: 923,
      winRate: 67,
      streak: 18,
      isVerified: true,
      isPro: false,
      previousRank: 6
    }
  ];

  const topPerformers = {
    fastest: { name: 'SpeedCoder', time: '0.23s', challenge: 'Two Sum' },
    mostSolved: { name: 'ProblemCrusher', count: 2456, category: 'All Time' },
    longestStreak: { name: 'ConsistentCoder', days: 365, active: true }
  };

  const stats = [
    { label: 'Total Players', value: '125K+', icon: Users, color: 'from-purple-500 to-pink-500' },
    { label: 'Active Today', value: '8.2K', icon: Activity, color: 'from-green-500 to-emerald-500' },
    { label: 'Challenges', value: '500+', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { label: 'Countries', value: '180', icon: Globe, color: 'from-yellow-500 to-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-black pt-8">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 backdrop-blur-xl border border-yellow-500/20 rounded-full px-6 py-3 mb-6">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-300">Global Rankings</span>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Code <span className="text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text animate-gradient-x bg-300%">Champions</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Compete with the best developers from around the world
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300">
                <div className={`bg-gradient-to-br ${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-2`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Performers Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-xl border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-green-300">Fastest Solution</span>
            </div>
            <div className="text-xl font-bold text-white">{topPerformers.fastest.name}</div>
            <div className="text-sm text-gray-400">{topPerformers.fastest.time} • {topPerformers.fastest.challenge}</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Most Problems Solved</span>
            </div>
            <div className="text-xl font-bold text-white">{topPerformers.mostSolved.name}</div>
            <div className="text-sm text-gray-400">{topPerformers.mostSolved.count} problems</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 backdrop-blur-xl border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">Longest Streak</span>
            </div>
            <div className="text-xl font-bold text-white">{topPerformers.longestStreak.name}</div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{topPerformers.longestStreak.days} days</span>
              {topPerformers.longestStreak.active && (
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs rounded-full">Active</span>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
                <option value="today">Today</option>
              </select>
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-all duration-300"
              >
                <option value="global">Global</option>
                <option value="country">My Country</option>
                <option value="friends">Friends</option>
                <option value="team">My Team</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3 mb-12">
          {players.map((player, index) => (
            <LeaderboardRow 
              key={index} 
              player={player} 
              index={index} 
              previousRank={player.previousRank}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mb-12">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
            Load More Players
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizedLeaderboard;