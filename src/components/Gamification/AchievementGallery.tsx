import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { achievementService } from '../../services/achievementService';
import { Achievement } from '../../services/achievementService';
import { useTheme } from '../../context/ThemeContext';
import {
  Trophy, Star, Award, Crown, Zap, Target, Users, Clock,
  Calendar, Code, Flame, Lock, Filter, Search, ChevronDown
} from 'lucide-react';

const AchievementGallery: React.FC = () => {
  const { user } = useAuth();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rarityFilter, setRarityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAchievements();
  }, [user]);

  const loadAchievements = async () => {
    if (!user?.id) return;
    
    try {
      const userAchievements = await achievementService.getUserAchievements(user.id);
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementIcon = (achievement: Achievement) => {
    switch (achievement.category) {
      case 'coding': return Code;
      case 'social': return Users;
      case 'streak': return Flame;
      case 'milestone': return Trophy;
      case 'special': return Star;
      default: return Award;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-600';
      case 'rare': return 'text-blue-400 border-blue-600';
      case 'epic': return 'text-purple-400 border-purple-600';
      case 'legendary': return 'text-yellow-400 border-yellow-600';
      default: return 'text-gray-400 border-gray-600';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-600/20 to-gray-800/20';
      case 'rare': return 'from-blue-600/20 to-blue-800/20';
      case 'epic': return 'from-purple-600/20 to-purple-800/20';
      case 'legendary': return 'from-yellow-600/20 to-yellow-800/20';
      default: return 'from-gray-600/20 to-gray-800/20';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unlocked' && achievement.isUnlocked) ||
      (filter === 'locked' && !achievement.isUnlocked);
    
    const matchesCategory = categoryFilter === 'all' || achievement.category === categoryFilter;
    const matchesRarity = rarityFilter === 'all' || achievement.rarity === rarityFilter;
    const matchesSearch = searchQuery === '' || 
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesCategory && matchesRarity && matchesSearch;
  });

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Achievement Gallery
            </h1>
            <p className="text-gray-400 mt-1">
              Your coding journey and accomplishments
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">
              {unlockedCount}/{totalCount}
            </div>
            <div className="text-sm text-gray-400">Unlocked</div>
            <div className="w-32 h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Achievements</option>
                <option value="unlocked">Unlocked Only</option>
                <option value="locked">Locked Only</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="coding">Coding</option>
                <option value="social">Social</option>
                <option value="streak">Streak</option>
                <option value="milestone">Milestone</option>
                <option value="special">Special</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Rarity Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
            <div className="relative">
              <select
                value={rarityFilter}
                onChange={(e) => setRarityFilter(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Rarities</option>
                <option value="common">Common</option>
                <option value="rare">Rare</option>
                <option value="epic">Epic</option>
                <option value="legendary">Legendary</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search achievements..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
          const IconComponent = getAchievementIcon(achievement);
          const isLocked = !achievement.isUnlocked && achievement.isHidden;
          
          return (
            <div
              key={achievement.id}
              className={`relative group transition-all duration-300 ${
                achievement.isUnlocked
                  ? 'hover:scale-105 hover:-translate-y-1'
                  : achievement.isHidden
                  ? 'opacity-50'
                  : 'hover:scale-102'
              }`}
            >
              <div className={`
                relative p-6 rounded-xl border-2 transition-all duration-300
                bg-gradient-to-br ${getRarityGradient(achievement.rarity)}
                ${getRarityColor(achievement.rarity)}
                ${achievement.isUnlocked ? 'shadow-lg' : 'bg-gray-900/60'}
              `}>
                {/* Rarity Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                    ${getRarityColor(achievement.rarity)} bg-gray-900/80
                  `}>
                    {achievement.rarity}
                  </span>
                </div>

                {/* Lock Indicator */}
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {/* Achievement Icon */}
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl
                  ${achievement.isUnlocked 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-gray-800 text-gray-500'
                  }
                `}>
                  {achievement.icon ? (
                    <span className="text-2xl">{achievement.icon}</span>
                  ) : (
                    <IconComponent className="w-8 h-8" />
                  )}
                </div>

                {/* Achievement Info */}
                <div className="space-y-2">
                  <h3 className={`font-bold text-lg ${
                    achievement.isUnlocked ? 'text-white' : 'text-gray-400'
                  }`}>
                    {isLocked ? '???' : achievement.title}
                  </h3>
                  
                  <p className={`text-sm ${
                    achievement.isUnlocked ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {isLocked ? 'Hidden achievement' : achievement.description}
                  </p>

                  {/* Points */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-300">
                        {achievement.points} points
                      </span>
                    </div>
                    
                    {achievement.unlockDate && (
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.unlockDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar (for locked achievements) */}
                  {!achievement.isUnlocked && !achievement.isHidden && achievement.progress !== undefined && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(achievement.progress)}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Glow effect for unlocked achievements */}
                {achievement.isUnlocked && (
                  <div className={`
                    absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300
                    bg-gradient-to-r ${getRarityGradient(achievement.rarity)}
                    blur-xl -z-10
                  `} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No achievements found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or keep coding to unlock more achievements!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementGallery;