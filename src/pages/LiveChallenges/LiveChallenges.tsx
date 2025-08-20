import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CardSkeleton, InlineLoader } from '../../components/Loaders';
import { 
  Zap, 
  Clock, 
  Trophy, 
  Users, 
  Filter,
  Flame,
  Activity,
  Radio,
  Eye,
  PlayCircle,
  ChevronRight,
  Sparkles,
  Swords,
  AlertCircle,
  Timer,
  TrendingUp,
  Award,
  Wifi
} from 'lucide-react';

const LiveChallenges: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'starting-soon'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const [liveChallenges] = useState([
    {
      id: '1',
      title: 'Speed Coding Challenge',
      description: 'Solve 3 algorithmic problems as fast as possible. First to complete all wins!',
      difficulty: 'Medium' as const,
      participants: 47,
      maxParticipants: 100,
      timeLeft: 1800,
      prize: 100,
      status: 'live' as const,
      category: 'Algorithms',
      viewers: 234
    },
    {
      id: '2',
      title: 'Binary Tree Marathon',
      description: 'Advanced tree problems for experienced developers. Test your data structure skills!',
      difficulty: 'Hard' as const,
      participants: 23,
      maxParticipants: 50,
      timeLeft: 3600,
      prize: 250,
      status: 'live' as const,
      category: 'Data Structures',
      viewers: 156
    },
    {
      id: '3',
      title: 'Beginner Friendly Sprint',
      description: 'Perfect for newcomers! Solve basic programming problems and learn.',
      difficulty: 'Easy' as const,
      participants: 89,
      maxParticipants: 150,
      timeLeft: 300,
      prize: 50,
      status: 'starting-soon' as const,
      category: 'Basics',
      viewers: 89
    },
    {
      id: '4',
      title: 'Dynamic Programming Duel',
      description: 'Master the art of dynamic programming with challenging optimization problems.',
      difficulty: 'Hard' as const,
      participants: 156,
      maxParticipants: 200,
      timeLeft: 0,
      prize: 500,
      status: 'ended' as const,
      category: 'Dynamic Programming',
      viewers: 412
    }
  ]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredChallenges = liveChallenges.filter(challenge => {
    if (filter === 'all') return challenge.status !== 'ended';
    return challenge.status === filter;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return {
          bg: 'from-green-600 to-emerald-600',
          text: 'text-green-400',
          border: 'border-green-500/30'
        };
      case 'Medium':
        return {
          bg: 'from-yellow-600 to-orange-600',
          text: 'text-yellow-400',
          border: 'border-yellow-500/30'
        };
      case 'Hard':
        return {
          bg: 'from-red-600 to-pink-600',
          text: 'text-red-400',
          border: 'border-red-500/30'
        };
      default:
        return {
          bg: 'from-gray-600 to-gray-700',
          text: 'text-gray-400',
          border: 'border-gray-500/30'
        };
    }
  };

  const formatTimeLeft = (seconds: number) => {
    if (seconds <= 0) return 'Ended';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const totalPrize = liveChallenges.reduce((sum, c) => sum + c.prize, 0);
  const liveCount = liveChallenges.filter(c => c.status === 'live').length;
  const totalParticipants = liveChallenges.reduce((sum, c) => sum + c.participants, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-900/10 via-transparent to-transparent"></div>
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 10}s`
              }}
            >
              <div className="w-2 h-2 bg-red-500/20 rounded-full blur-sm"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm border border-red-500/30 rounded-full px-4 py-2 mb-6">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-sm font-medium text-red-300">Live Battles Arena</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Live Challenges
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join real-time coding battles happening right now and compete for instant prizes
            </p>

            {/* Live Stats Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  <span className="text-2xl font-bold text-white">{liveCount}</span>
                </div>
                <p className="text-sm text-gray-400">Live Now</p>
              </div>
              
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{totalParticipants}</span>
                </div>
                <p className="text-sm text-gray-400">Active Players</p>
              </div>
              
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">${totalPrize}</span>
                </div>
                <p className="text-sm text-gray-400">Total Prizes</p>
              </div>
              
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-white">891</span>
                </div>
                <p className="text-sm text-gray-400">Watching</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Active', icon: Activity, count: liveChallenges.filter(c => c.status !== 'ended').length },
            { key: 'live', label: 'Live Now', icon: Radio, count: liveCount },
            { key: 'starting-soon', label: 'Starting Soon', icon: Clock, count: liveChallenges.filter(c => c.status === 'starting-soon').length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                filter === tab.key
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/25'
                  : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800 hover:border-red-500/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  filter === tab.key ? 'bg-white/20' : 'bg-gray-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Featured Live Challenge */}
        {liveChallenges.filter(c => c.status === 'live').length > 0 && (
          <div className="mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-red-600/10 via-orange-600/10 to-yellow-600/10 rounded-3xl border border-red-500/30 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <Flame className="w-6 h-6 text-red-400" />
                  </div>
                  <span className="text-red-400 font-bold text-lg flex items-center gap-2">
                    🔥 HOT BATTLE IN PROGRESS
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {liveChallenges.find(c => c.status === 'live')?.title}
                    </h2>
                    <p className="text-gray-300 mb-4">
                      {liveChallenges.find(c => c.status === 'live')?.description}
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        <span className="text-white">
                          <span className="font-bold">{liveChallenges.find(c => c.status === 'live')?.participants}</span> competing
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-purple-400" />
                        <span className="text-white">
                          <span className="font-bold">{liveChallenges.find(c => c.status === 'live')?.viewers}</span> watching
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-bold">
                          ${liveChallenges.find(c => c.status === 'live')?.prize} Prize
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4">
                    <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Watch Live
                    </button>
                    <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-2xl shadow-orange-500/25 flex items-center gap-2">
                      <Swords className="w-5 h-5" />
                      Join Battle
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Challenges Grid */}
        {isLoading ? (
          <CardSkeleton count={6} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge, index) => {
              const difficultyStyle = getDifficultyColor(challenge.difficulty);
              const isLive = challenge.status === 'live';
              
              return (
                <div
                  key={challenge.id}
                  className="group relative animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${isLive ? 'from-red-600 to-orange-600' : 'from-gray-600 to-gray-700'} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10">
                    {/* Status Bar */}
                    <div className={`h-1 bg-gradient-to-r ${isLive ? 'from-red-600 to-orange-600' : 'from-gray-600 to-gray-700'}`}></div>
                    
                    {/* Live Indicator */}
                    {isLive && (
                      <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-900/50 backdrop-blur-sm px-3 py-1 rounded-full border border-red-500/30">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-red-400">LIVE</span>
                      </div>
                    )}
                    
                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                          {challenge.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {challenge.description}
                        </p>
                      </div>

                      {/* Challenge Info */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-800/50 rounded-lg p-2">
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                            <Award className="w-3 h-3" />
                            Difficulty
                          </div>
                          <p className={`text-sm font-bold ${difficultyStyle.text}`}>
                            {challenge.difficulty}
                          </p>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2">
                          <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                            <Trophy className="w-3 h-3" />
                            Prize Pool
                          </div>
                          <p className="text-sm font-bold text-yellow-400">
                            ${challenge.prize}
                          </p>
                        </div>
                      </div>

                      {/* Live Stats */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">Players</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                              {challenge.participants}/{challenge.maxParticipants}
                            </span>
                            {isLive && (
                              <TrendingUp className="w-3 h-3 text-green-400" />
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">Viewers</span>
                          </div>
                          <span className="text-white font-medium">
                            {challenge.viewers}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-400">
                            <Timer className="w-4 h-4" />
                            <span className="text-sm">Time Left</span>
                          </div>
                          <span className={`font-bold ${isLive ? 'text-orange-400' : 'text-gray-400'}`}>
                            {formatTimeLeft(challenge.timeLeft)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Capacity</span>
                          <span className="text-gray-400">
                            {Math.round((challenge.participants / challenge.maxParticipants) * 100)}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${isLive ? 'from-red-500 to-orange-500' : 'from-gray-500 to-gray-600'} rounded-full transition-all`}
                            style={{ 
                              width: `${(challenge.participants / challenge.maxParticipants) * 100}%` 
                            }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {isLive ? (
                          <>
                            <button className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2">
                              <PlayCircle className="w-4 h-4" />
                              Join Now
                            </button>
                            <button className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all flex items-center justify-center">
                              <Eye className="w-4 h-4" />
                            </button>
                          </>
                        ) : challenge.status === 'starting-soon' ? (
                          <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            Register
                          </button>
                        ) : (
                          <button className="w-full px-4 py-3 bg-gray-800 text-gray-500 rounded-xl cursor-not-allowed flex items-center justify-center gap-2" disabled>
                            <AlertCircle className="w-4 h-4" />
                            Ended
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredChallenges.length === 0 && !isLoading && (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-900/60 rounded-2xl mb-6">
              <Zap className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No live challenges</h3>
            <p className="text-gray-400 mb-6">Check back soon for new live coding battles</p>
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all"
            >
              Show All Challenges
            </button>
          </div>
        )}
      </div>

      {/* Floating Live Indicator */}
      <div className="fixed bottom-8 left-8 z-50 flex items-center gap-3 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-full border border-red-500/30">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-red-400">LIVE</span>
        </div>
        <span className="text-sm text-gray-400">{liveCount} battles in progress</span>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-full shadow-2xl shadow-red-500/25 flex items-center justify-center text-white transition-all hover:scale-110 group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Flame className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default LiveChallenges;