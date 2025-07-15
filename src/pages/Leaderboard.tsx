import React, { useState, useEffect } from 'react';
import { User, getStorageData } from '../data/mockData';
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
  Users
} from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [timeframe, setTimeframe] = useState<'all' | 'month' | 'week'>('all');
  const [category, setCategory] = useState<'overall' | 'challenges' | 'tournaments'>('overall');

  useEffect(() => {
    const storedUsers = getStorageData('codebattle_users', []);
    // Sort users by rating (descending)
    const sortedUsers = storedUsers.sort((a: User, b: User) => b.rating - a.rating);
    setUsers(sortedUsers);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
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
    if (rating >= 2400) return 'Grandmaster';
    if (rating >= 2100) return 'Master';
    if (rating >= 1800) return 'Expert';
    if (rating >= 1500) return 'Specialist';
    if (rating >= 1200) return 'Pupil';
    return 'Newbie';
  };

  const topThree = users.slice(0, 3);
  const remainingUsers = users.slice(3);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 shadow-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
              <p className="mt-2 text-gray-400">
                See how you rank against other developers in the community
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-400">
                <Users className="w-4 h-4 mr-1" />
                {users.length} developers
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Controls */}
        <div className="bg-gray-900 rounded-lg shadow-sm p-6 mb-8 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="overall">Overall Rating</option>
                <option value="challenges">Challenges Solved</option>
                <option value="tournaments">Tournament Wins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Top Performers</h2>
          <div className="flex justify-center items-end space-x-4">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className="flex flex-col items-center">
                <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-4 w-48 border border-gray-800">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-xl font-bold">
                        {topThree[1].username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{topThree[1].username}</h3>
                    <p className={`text-sm font-medium ${getRatingColor(topThree[1].rating)}`}>
                      {getRatingTitle(topThree[1].rating)}
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">{topThree[1].rating}</p>
                    <p className="text-sm text-gray-400">{topThree[1].solvedChallenges} solved</p>
                  </div>
                </div>
                <div className="w-32 h-24 bg-gradient-to-t from-gray-300 to-gray-500 rounded-t-lg flex items-center justify-center">
                  <Medal className="w-8 h-8 text-white" />
                </div>
              </div>
            )}

            {/* 1st Place */}
            {topThree[0] && (
              <div className="flex flex-col items-center">
                <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-4 w-52 border-2 border-yellow-400">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-2xl font-bold">
                        {topThree[0].username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{topThree[0].username}</h3>
                    <p className={`text-sm font-medium ${getRatingColor(topThree[0].rating)}`}>
                      {getRatingTitle(topThree[0].rating)}
                    </p>
                    <p className="text-3xl font-bold text-white mt-2">{topThree[0].rating}</p>
                    <p className="text-sm text-gray-400">{topThree[0].solvedChallenges} solved</p>
                  </div>
                </div>
                <div className="w-32 h-32 bg-gradient-to-t from-yellow-400 to-yellow-600 rounded-t-lg flex items-center justify-center">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className="flex flex-col items-center">
                <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-4 w-48 border border-gray-800">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white text-xl font-bold">
                        {topThree[2].username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{topThree[2].username}</h3>
                    <p className={`text-sm font-medium ${getRatingColor(topThree[2].rating)}`}>
                      {getRatingTitle(topThree[2].rating)}
                    </p>
                    <p className="text-2xl font-bold text-white mt-2">{topThree[2].rating}</p>
                    <p className="text-sm text-gray-400">{topThree[2].solvedChallenges} solved</p>
                  </div>
                </div>
                <div className="w-32 h-20 bg-gradient-to-t from-amber-400 to-amber-600 rounded-t-lg flex items-center justify-center">
                  <Medal className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-gray-900 rounded-lg shadow-sm overflow-hidden border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">All Rankings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-800">
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
                    Achievements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {users.map((user, index) => (
                  <tr key={user.id} className={index < 3 ? 'bg-gradient-to-r from-yellow-900/20 to-transparent' : 'hover:bg-gray-800'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getRankIcon(index + 1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${getRankBackground(index + 1)}`}>
                          <span className="text-white font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{user.username}</div>
                          <div className={`text-xs ${getRatingColor(user.rating)}`}>
                            {getRatingTitle(user.rating)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                        <span className={`text-sm font-medium ${getRatingColor(user.rating)}`}>
                          {user.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Code className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-sm text-white">{user.solvedChallenges}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {user.achievements.slice(0, 2).map((achievement, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-400"
                          >
                            <Award className="w-3 h-3 mr-1" />
                            {achievement}
                          </span>
                        ))}
                        {user.achievements.length > 2 && (
                          <span className="text-xs text-gray-400">+{user.achievements.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-400">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="bg-blue-900 rounded-lg p-3 mr-4">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Average Rating</p>
                <p className="text-2xl font-bold text-white">
                  {Math.round(users.reduce((sum, user) => sum + user.rating, 0) / users.length)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="bg-green-900 rounded-lg p-3 mr-4">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Challenges Solved</p>
                <p className="text-2xl font-bold text-white">
                  {users.reduce((sum, user) => sum + user.solvedChallenges, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-800">
            <div className="flex items-center">
              <div className="bg-purple-900 rounded-lg p-3 mr-4">
                <Star className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Active Developers</p>
                <p className="text-2xl font-bold text-white">{users.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;