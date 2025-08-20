import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { achievementService, UserLevel, GamificationStats } from '../../services/achievementService';
import { useTheme } from '../../context/ThemeContext';
import {
  Star, Crown, TrendingUp, Award, Flame, Target, 
  ChevronRight, Sparkles, Zap, Trophy, Gift
} from 'lucide-react';

interface UserLevelDisplayProps {
  compact?: boolean;
  showDetails?: boolean;
}

const UserLevelDisplay: React.FC<UserLevelDisplayProps> = ({ 
  compact = false, 
  showDetails = true 
}) => {
  const { user } = useAuth();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  const [gamificationStats, setGamificationStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    loadGamificationStats();
  }, [user]);

  const loadGamificationStats = async () => {
    if (!user?.id) return;
    
    try {
      const stats = await achievementService.getUserGamificationStats(user.id);
      setGamificationStats(stats);
    } catch (error) {
      console.error('Failed to load gamification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelTitle = (level: number): string => {
    if (level < 5) return 'Novice Coder';
    if (level < 10) return 'Code Apprentice';
    if (level < 20) return 'Developer';
    if (level < 35) return 'Senior Developer';
    if (level < 50) return 'Code Architect';
    if (level < 75) return 'Programming Master';
    if (level < 100) return 'Code Wizard';
    return 'Legendary Programmer';
  };

  const getLevelColor = (level: number): string => {
    if (level < 5) return 'text-gray-400';
    if (level < 10) return 'text-green-400';
    if (level < 20) return 'text-blue-400';
    if (level < 35) return 'text-purple-400';
    if (level < 50) return 'text-pink-400';
    if (level < 75) return 'text-orange-400';
    if (level < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLevelIcon = (level: number) => {
    if (level < 5) return Star;
    if (level < 10) return Sparkles;
    if (level < 20) return Award;
    if (level < 35) return Trophy;
    if (level < 50) return Crown;
    if (level < 75) return Zap;
    if (level < 100) return Flame;
    return Crown;
  };

  if (loading || !gamificationStats) {
    return (
      <div className={`${compact ? 'p-2' : 'p-4'} bg-gray-900/60 rounded-lg border border-gray-800`}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-700 rounded"></div>
          <div className="h-2 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const { level } = gamificationStats;
  const LevelIcon = getLevelIcon(level.currentLevel);

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
        <div className={`p-2 rounded-full ${getLevelColor(level.currentLevel)} bg-gray-900/50`}>
          <LevelIcon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white">Level {level.currentLevel}</span>
            <span className="text-xs text-gray-400">{level.currentXP}/{level.xpToNextLevel} XP</span>
          </div>
          
          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              style={{ width: `${level.levelProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Level Display */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 border border-purple-500 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 border border-pink-500 rounded-full"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${getLevelColor(level.currentLevel)} bg-gray-900/50`}>
                <LevelIcon className="w-8 h-8" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Level {level.currentLevel}
                </h2>
                <p className={`font-medium ${getLevelColor(level.currentLevel)}`}>
                  {getLevelTitle(level.currentLevel)}
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-400">Total XP</div>
              <div className="text-xl font-bold text-white">
                {level.totalXP.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Progress to Next Level */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress to Level {level.currentLevel + 1}</span>
              <span className="text-gray-400">
                {level.currentXP}/{level.xpToNextLevel} XP ({Math.round(level.levelProgress)}%)
              </span>
            </div>
            
            <div className="relative w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-1000 ease-out"
                style={{ width: `${level.levelProgress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Achievements */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium text-gray-300">Achievements</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {gamificationStats.achievements.filter(a => a.isUnlocked).length}
              </div>
              <div className="text-sm text-gray-400">
                of {gamificationStats.achievements.length} unlocked
              </div>
            </div>

            {/* Current Streak */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="font-medium text-gray-300">Current Streak</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {gamificationStats.dailyStreak}
              </div>
              <div className="text-sm text-gray-400">
                days (best: {gamificationStats.longestStreak})
              </div>
            </div>

            {/* Total Points */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="font-medium text-gray-300">Total Points</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {gamificationStats.totalPoints.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Rank #{gamificationStats.rank}
              </div>
            </div>
          </div>

          {/* Next Milestone */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Next Milestone
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-white">
                    {gamificationStats.nextMilestone.title}
                  </span>
                  <span className="text-sm text-gray-400">
                    {gamificationStats.nextMilestone.progress}/{gamificationStats.nextMilestone.target}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">
                  {gamificationStats.nextMilestone.description}
                </p>

                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-600 to-blue-600 transition-all duration-500"
                    style={{ 
                      width: `${(gamificationStats.nextMilestone.progress / gamificationStats.nextMilestone.target) * 100}%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements Preview */}
          {gamificationStats.achievements.some(a => a.isUnlocked) && (
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Recent Achievements
                </h3>
                <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {gamificationStats.achievements
                  .filter(a => a.isUnlocked)
                  .slice(0, 3)
                  .map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-lg">
                        {achievement.icon}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-white text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-400">{achievement.description}</p>
                      </div>

                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-medium">{achievement.points}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserLevelDisplay;