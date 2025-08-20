import React, { useState, useEffect } from 'react';
import { User, getStorageData } from '../data/mockData';
import { CardSkeleton, Spinner } from '../components/Loaders';
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Code, 
  Calendar,
  Crown,
  Award,
  Target,
  Users,
  Sparkles,
  Flame,
  ChevronUp,
  ChevronDown,
  Activity,
  Zap,
  Shield,
  Swords
} from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');
  const [category, setCategory] = useState<'overall' | 'challenges' | 'tournaments'>('overall');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const storedUsers = getStorageData('codebattle_users', []);
      const sortedUsers = storedUsers.sort((a: User, b: User) => b.rating - a.rating);
      setUsers(sortedUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'from-yellow-600 to-orange-600',
          border: 'border-yellow-500/30',
          shadow: 'shadow-yellow-500/20',
          text: 'text-yellow-400'
        };
      case 2:
        return {
          bg: 'from-gray-400 to-gray-600',
          border: 'border-gray-500/30',
          shadow: 'shadow-gray-500/20',
          text: 'text-gray-300'
        };
      case 3:
        return {
          bg: 'from-orange-600 to-red-600',
          border: 'border-orange-500/30',
          shadow: 'shadow-orange-500/20',
          text: 'text-orange-400'
        };
      default:
        return {
          bg: 'from-purple-600 to-pink-600',
          border: 'border-purple-500/30',
          shadow: 'shadow-purple-500/20',
          text: 'text-purple-400'
        };
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 2400) return 'text-red-400';
    if (rating >= 2100) return 'text-orange-400';
    if (rating >= 1800) return 'text-yellow-400';
    if (rating >= 1500) return 'text-green-400';
    if (rating >= 1200) return 'text-blue-400';
    return 'text-gray-400';
  };

  const getRatingTitle = (rating: number) => {
    if (rating >= 2400) return { title: 'Grandmaster', icon: Crown, color: 'text-red-400' };
    if (rating >= 2100) return { title: 'Master', icon: Shield, color: 'text-orange-400' };
    if (rating >= 1800) return { title: 'Expert', icon: Star, color: 'text-yellow-400' };
    if (rating >= 1500) return { title: 'Specialist', icon: Zap, color: 'text-green-400' };
    if (rating >= 1200) return { title: 'Pupil', icon: Activity, color: 'text-blue-400' };
    return { title: 'Newbie', icon: Users, color: 'text-gray-400' };
  };

  const topThree = users.slice(0, 3);
  const totalSolved = users.reduce((sum, user) => sum + user.solvedChallenges, 0);
  const avgRating = Math.round(users.reduce((sum, user) => sum + user.rating, 0) / users.length) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/30 rounded-full px-4 py-2 mb-6">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">Hall of Fame</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Compete with the best developers and climb your way to the top
            </p>

            {/* Stats Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-2xl font-bold text-white">{users.length}</span>
                </div>
                <p className="text-sm text-gray-400">Active Players</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">{avgRating}</span>
                </div>
                <p className="text-sm text-gray-400">Avg Rating</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Code className="w-5 h-5 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{totalSolved}</span>
                </div>
                <p className="text-sm text-gray-400">Problems Solved</p>
              </div>
              <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  <span className="text-2xl font-bold text-white">24/7</span>
                </div>
                <p className="text-sm text-gray-400">Competition</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Time', icon: Calendar },
              { key: 'month', label: 'This Month', icon: Activity },
              { key: 'week', label: 'This Week', icon: Zap }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setTimeframe(item.key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  timeframe === item.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800 hover:border-purple-500/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            {[
              { key: 'overall', label: 'Overall', icon: Trophy },
              { key: 'challenges', label: 'Challenges', icon: Code },
              { key: 'tournaments', label: 'Tournaments', icon: Swords }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setCategory(item.key as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  category === item.key
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/25'
                    : 'bg-gray-900/60 text-gray-400 hover:text-white border border-gray-800 hover:border-yellow-500/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Champions
                </span>
              </h2>
              <p className="text-gray-400">The elite developers leading the competition</p>
            </div>
            
            <div className="flex justify-center items-end gap-4 mb-8">
              {/* 2nd Place */}
              {topThree[1] && (
                <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '200ms' }}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-4 w-48 border border-gray-700 hover:border-gray-500/50 transition-all">
                      <div className="text-center">
                        <div className="relative mb-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-white text-2xl font-bold">
                              {topThree[1].username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1">
                            <Medal className="w-6 h-6 text-gray-300" />
                          </div>
                        </div>
                        <h3 className="font-bold text-white mb-1">{topThree[1].username}</h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {(() => {
                            const { icon: Icon, color } = getRatingTitle(topThree[1].rating);
                            return (
                              <>
                                <Icon className={`w-4 h-4 ${color}`} />
                                <span className={`text-sm font-medium ${color}`}>
                                  {getRatingTitle(topThree[1].rating).title}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{topThree[1].rating}</p>
                        <p className="text-sm text-gray-400">{topThree[1].solvedChallenges} solved</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-32 h-24 bg-gradient-to-t from-gray-400 to-gray-600 rounded-t-xl flex items-center justify-center shadow-2xl">
                    <span className="text-white text-4xl font-bold">2</span>
                  </div>
                </div>
              )}

              {/* 1st Place */}
              {topThree[0] && (
                <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
                    <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-4 w-56 border-2 border-yellow-500/50 hover:border-yellow-400 transition-all transform hover:scale-105">
                      <div className="text-center">
                        <div className="relative mb-4">
                          <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                            <span className="text-white text-3xl font-bold">
                              {topThree[0].username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full p-2 animate-bounce">
                            <Crown className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <h3 className="font-bold text-xl text-white mb-1">{topThree[0].username}</h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {(() => {
                            const { icon: Icon, color } = getRatingTitle(topThree[0].rating);
                            return (
                              <>
                                <Icon className={`w-5 h-5 ${color}`} />
                                <span className={`text-sm font-bold ${color}`}>
                                  {getRatingTitle(topThree[0].rating).title}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                        <p className="text-4xl font-bold text-white mb-2">{topThree[0].rating}</p>
                        <p className="text-sm text-gray-400">{topThree[0].solvedChallenges} solved</p>
                        <div className="mt-3 flex justify-center gap-1">
                          {topThree[0].achievements.slice(0, 3).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-36 h-32 bg-gradient-to-t from-yellow-400 to-orange-600 rounded-t-xl flex items-center justify-center shadow-2xl">
                    <span className="text-white text-5xl font-bold">1</span>
                  </div>
                </div>
              )}

              {/* 3rd Place */}
              {topThree[2] && (
                <div className="flex flex-col items-center animate-fade-in" style={{ animationDelay: '300ms' }}>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 mb-4 w-48 border border-orange-700 hover:border-orange-500/50 transition-all">
                      <div className="text-center">
                        <div className="relative mb-4">
                          <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-white text-2xl font-bold">
                              {topThree[2].username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="absolute -top-2 -right-2 bg-gray-800 rounded-full p-1">
                            <Medal className="w-6 h-6 text-orange-400" />
                          </div>
                        </div>
                        <h3 className="font-bold text-white mb-1">{topThree[2].username}</h3>
                        <div className="flex items-center justify-center gap-1 mb-2">
                          {(() => {
                            const { icon: Icon, color } = getRatingTitle(topThree[2].rating);
                            return (
                              <>
                                <Icon className={`w-4 h-4 ${color}`} />
                                <span className={`text-sm font-medium ${color}`}>
                                  {getRatingTitle(topThree[2].rating).title}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{topThree[2].rating}</p>
                        <p className="text-sm text-gray-400">{topThree[2].solvedChallenges} solved</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-32 h-20 bg-gradient-to-t from-orange-600 to-red-600 rounded-t-xl flex items-center justify-center shadow-2xl">
                    <span className="text-white text-4xl font-bold">3</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Complete Rankings
            </h2>
          </div>
          
          {isLoading ? (
            <div className="p-6">
              <CardSkeleton count={5} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Solved</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Achievements</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map((user, index) => {
                    const rankStyle = getRankStyle(index + 1);
                    const ratingInfo = getRatingTitle(user.rating);
                    const RatingIcon = ratingInfo.icon;
                    
                    return (
                      <tr 
                        key={user.id} 
                        className={`hover:bg-gray-800/50 transition-colors ${
                          index < 3 ? 'bg-gradient-to-r from-gray-800/30 to-transparent' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index < 3 ? (
                              <div className={`w-10 h-10 bg-gradient-to-r ${rankStyle.bg} rounded-full flex items-center justify-center shadow-lg ${rankStyle.shadow}`}>
                                {getRankIcon(index + 1)}
                              </div>
                            ) : (
                              <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-r ${rankStyle.bg} rounded-full flex items-center justify-center`}>
                              <span className="text-white font-bold text-lg">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">{user.username}</div>
                              <div className={`text-xs flex items-center gap-1 ${ratingInfo.color}`}>
                                <RatingIcon className="w-3 h-3" />
                                {ratingInfo.title}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${getRatingColor(user.rating)}`}>
                              {user.rating}
                            </span>
                            <ChevronUp className="w-4 h-4 text-green-400" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-blue-400" />
                            <span className="text-white">{user.solvedChallenges}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {user.achievements.slice(0, 3).map((achievement, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center border border-purple-500/30"
                                title={achievement}
                              >
                                <Award className="w-4 h-4 text-purple-400" />
                              </div>
                            ))}
                            {user.achievements.length > 3 && (
                              <span className="text-xs text-gray-400 ml-2">+{user.achievements.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <div className="w-16 h-6 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <TrendingUp className="w-4 h-4 text-green-400" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-full shadow-2xl shadow-yellow-500/25 flex items-center justify-center text-black transition-all hover:scale-110 group"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <Trophy className="w-6 h-6 group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default Leaderboard;