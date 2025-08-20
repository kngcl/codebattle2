import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AchievementGallery, UserLevelDisplay, DailyRewards } from '../../components/Gamification';
import { useTheme } from '../../context/ThemeContext';
import {
  Trophy, Star, Gift, BarChart3, Crown, Target,
  TrendingUp, Award, Users, Flame
} from 'lucide-react';

const GamificationPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'rewards' | 'leaderboard'>('overview');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 mb-2">
            Login Required
          </h2>
          <p className="text-gray-500">
            Please log in to view your gamification progress and achievements.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'rewards', label: 'Daily Rewards', icon: Gift },
    { id: 'leaderboard', label: 'Leaderboard', icon: Crown }
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                Gamification Hub
              </h1>
              <p className="text-gray-400 mt-2">
                Track your progress, unlock achievements, and compete with other coders
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-1 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <UserLevelDisplay showDetails={true} />
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 font-medium">Daily Streak</p>
                      <p className="text-2xl font-bold text-white">7 days</p>
                    </div>
                    <Flame className="w-8 h-8 text-orange-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 p-6 rounded-xl border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-400 font-medium">Achievements</p>
                      <p className="text-2xl font-bold text-white">12/24</p>
                    </div>
                    <Trophy className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-400 font-medium">Global Rank</p>
                      <p className="text-2xl font-bold text-white">#1,337</p>
                    </div>
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-6 rounded-xl border border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-400 font-medium">Total Points</p>
                      <p className="text-2xl font-bold text-white">2,450</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Recent Activity
                </h2>
                
                <div className="space-y-3">
                  {[
                    { type: 'achievement', text: 'Unlocked "Speed Demon" achievement', time: '2 hours ago', icon: Trophy, color: 'text-yellow-400' },
                    { type: 'level', text: 'Reached Level 12', time: '1 day ago', icon: Star, color: 'text-purple-400' },
                    { type: 'streak', text: 'Extended coding streak to 7 days', time: '1 day ago', icon: Flame, color: 'text-orange-400' },
                    { type: 'challenge', text: 'Completed daily challenge', time: '2 days ago', icon: Target, color: 'text-green-400' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.text}</p>
                        <p className="text-sm text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && <AchievementGallery />}
          
          {activeTab === 'rewards' && <DailyRewards />}
          
          {activeTab === 'leaderboard' && (
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Global Leaderboard
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  { rank: 1, username: 'CodeMaster2024', level: 50, points: 15420, streak: 45 },
                  { rank: 2, username: 'AlgorithmWiz', level: 48, points: 14850, streak: 32 },
                  { rank: 3, username: 'PythonPro', level: 46, points: 14200, streak: 28 },
                  { rank: 4, username: 'JSNinja', level: 44, points: 13750, streak: 22 },
                  { rank: 5, username: 'DataStructGuru', level: 42, points: 13100, streak: 19 },
                  { rank: 1337, username: user?.username || 'You', level: 12, points: 2450, streak: 7 }
                ].map((player, index) => (
                  <div key={index} className={`
                    flex items-center justify-between p-4 rounded-lg border
                    ${player.username === user?.username 
                      ? 'bg-purple-900/30 border-purple-500/50' 
                      : 'bg-gray-800/50 border-gray-700'
                    }
                  `}>
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${player.rank === 1 ? 'bg-yellow-600 text-white' :
                          player.rank === 2 ? 'bg-gray-400 text-white' :
                          player.rank === 3 ? 'bg-orange-600 text-white' :
                          'bg-gray-700 text-gray-300'
                        }
                      `}>
                        #{player.rank}
                      </div>
                      
                      <div>
                        <p className={`font-medium ${
                          player.username === user?.username ? 'text-purple-300' : 'text-white'
                        }`}>
                          {player.username}
                        </p>
                        <p className="text-sm text-gray-400">Level {player.level}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-white">{player.points.toLocaleString()} pts</p>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span>{player.streak} days</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;