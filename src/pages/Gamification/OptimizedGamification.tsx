import React, { useState, memo } from 'react';
import { 
  Trophy, Star, Award, Shield, Zap, Target, Crown, Medal,
  Gem, Heart, Flame, Gift, Lock, Unlock, TrendingUp, Users,
  Brain, Code, GitBranch, Timer, CheckCircle2, Circle,
  Sparkles, Swords, Flag, Rocket, Diamond, Coins, Package,
  ChevronRight, Info, ExternalLink, Share2, Download, Grid3x3
} from 'lucide-react';

const AchievementCard = memo(({ achievement, index, isUnlocked }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'legendary': return 'from-yellow-500 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityBorder = () => {
    switch (achievement.rarity) {
      case 'common': return 'border-gray-500/30';
      case 'rare': return 'border-blue-500/30';
      case 'epic': return 'border-purple-500/30';
      case 'legendary': return 'border-yellow-500/30 animate-pulse';
      default: return 'border-white/10';
    }
  };

  return (
    <div
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect for Legendary */}
      {achievement.rarity === 'legendary' && isUnlocked && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-2xl blur-xl animate-pulse" />
      )}
      
      <div className={`
        relative bg-black/40 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300
        ${isUnlocked ? getRarityBorder() : 'border-white/5'}
        ${isUnlocked ? 'hover:translate-y-[-4px] hover:shadow-2xl' : 'opacity-60'}
      `}>
        {/* Achievement Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className={`
            relative p-4 rounded-xl transition-all duration-300
            ${isUnlocked 
              ? `bg-gradient-to-br ${getRarityColor()} group-hover:scale-110` 
              : 'bg-gray-800'
            }
          `}>
            {isUnlocked ? (
              <achievement.icon className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-gray-600" />
            )}
            
            {/* Sparkle Effect */}
            {isUnlocked && isHovered && (
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400 animate-spin" />
            )}
          </div>
          
          {/* Progress or Status */}
          {isUnlocked ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-xs text-green-400">Unlocked</span>
            </div>
          ) : achievement.progress ? (
            <div className="text-right">
              <p className="text-xs text-gray-400">Progress</p>
              <p className="text-sm font-bold text-white">{achievement.progress}%</p>
            </div>
          ) : null}
        </div>

        {/* Achievement Details */}
        <h3 className={`text-lg font-bold mb-2 transition-all duration-300 ${
          isUnlocked 
            ? 'text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text' 
            : 'text-gray-500'
        }`}>
          {achievement.title}
        </h3>
        
        <p className={`text-sm mb-4 ${isUnlocked ? 'text-gray-400' : 'text-gray-600'}`}>
          {achievement.description}
        </p>

        {/* Rewards */}
        {achievement.rewards && (
          <div className="flex items-center gap-3 mb-4">
            {achievement.rewards.xp && (
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-lg">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-300">+{achievement.rewards.xp} XP</span>
              </div>
            )}
            {achievement.rewards.coins && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-300">+{achievement.rewards.coins}</span>
              </div>
            )}
            {achievement.rewards.badge && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-lg">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-blue-300">Badge</span>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        {!isUnlocked && achievement.maxProgress && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{achievement.currentProgress || 0}</span>
              <span>{achievement.maxProgress}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getRarityColor()} transition-all duration-500`}
                style={{ width: `${(achievement.currentProgress / achievement.maxProgress) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Rarity Badge */}
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold uppercase ${
          achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-black' :
          achievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
          achievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' :
          'bg-gray-700 text-gray-300'
        }`}>
          {achievement.rarity}
        </div>
      </div>
    </div>
  );
});

const LevelProgressCard = memo(() => {
  const currentLevel = 12;
  const currentXP = 2450;
  const requiredXP = 3000;
  const progress = (currentXP / requiredXP) * 100;

  return (
    <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Level <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{currentLevel}</span>
            </h2>
            <p className="text-gray-400">Code Warrior</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-400">Next Level</p>
            <p className="text-2xl font-bold text-white">Level {currentLevel + 1}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>{currentXP} XP</span>
            <span>{requiredXP} XP</span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-1000 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">42</p>
            <p className="text-xs text-gray-400">Achievements</p>
          </div>
          <div className="text-center">
            <Star className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">156</p>
            <p className="text-xs text-gray-400">Challenges</p>
          </div>
          <div className="text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">15</p>
            <p className="text-xs text-gray-400">Day Streak</p>
          </div>
          <div className="text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">#234</p>
            <p className="text-xs text-gray-400">Global Rank</p>
          </div>
        </div>
      </div>
    </div>
  );
});

const OptimizedGamification: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  // Mock data
  const achievements = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first coding challenge',
      icon: Flag,
      rarity: 'common',
      isUnlocked: true,
      rewards: { xp: 50, coins: 10 }
    },
    {
      id: 2,
      title: 'Speed Demon',
      description: 'Solve 10 problems in under 5 minutes each',
      icon: Zap,
      rarity: 'rare',
      isUnlocked: true,
      rewards: { xp: 200, coins: 50, badge: true }
    },
    {
      id: 3,
      title: 'Algorithm Master',
      description: 'Solve 100 algorithm problems',
      icon: Brain,
      rarity: 'epic',
      isUnlocked: false,
      currentProgress: 67,
      maxProgress: 100,
      progress: 67,
      rewards: { xp: 500, coins: 150, badge: true }
    },
    {
      id: 4,
      title: 'Legendary Coder',
      description: 'Reach the top 1% of global rankings',
      icon: Crown,
      rarity: 'legendary',
      isUnlocked: false,
      progress: 45,
      rewards: { xp: 1000, coins: 500, badge: true }
    },
    {
      id: 5,
      title: 'Team Player',
      description: 'Win 10 team tournaments',
      icon: Users,
      rarity: 'rare',
      isUnlocked: true,
      rewards: { xp: 150, coins: 40 }
    },
    {
      id: 6,
      title: 'Consistency King',
      description: 'Maintain a 30-day coding streak',
      icon: Flame,
      rarity: 'epic',
      isUnlocked: false,
      currentProgress: 15,
      maxProgress: 30,
      progress: 50,
      rewards: { xp: 400, coins: 100, badge: true }
    }
  ];

  const categories = [
    { id: 'all', label: 'All', icon: Grid3x3, count: achievements.length },
    { id: 'challenges', label: 'Challenges', icon: Code, count: 24 },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy, count: 12 },
    { id: 'social', label: 'Social', icon: Users, count: 8 },
    { id: 'special', label: 'Special', icon: Star, count: 6 }
  ];

  const leaderboard = [
    { rank: 1, name: 'AlgoMaster', level: 42, achievements: 156, xp: 12450 },
    { rank: 2, name: 'CodeNinja', level: 39, achievements: 142, xp: 11200 },
    { rank: 3, name: 'ByteWizard', level: 37, achievements: 138, xp: 10800 },
    { rank: 4, name: 'You', level: 12, achievements: 42, xp: 2450, isYou: true },
    { rank: 5, name: 'DataDragon', level: 11, achievements: 38, xp: 2100 }
  ];

  return (
    <div className="min-h-screen bg-black pt-8">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-xl border border-purple-500/20 rounded-full px-6 py-3 mb-6">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Achievements & Rewards</span>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Unlock <span className="text-transparent bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text animate-gradient-x bg-300%">Achievements</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Complete challenges, win tournaments, and earn rewards on your coding journey
          </p>
        </div>

        {/* Level Progress */}
        <LevelProgressCard />

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span>{category.label}</span>
              <span className="px-2 py-0.5 bg-black/30 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Options */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowOnlyUnlocked(!showOnlyUnlocked)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              showOnlyUnlocked
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {showOnlyUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>Show {showOnlyUnlocked ? 'Unlocked' : 'All'}</span>
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {achievements
            .filter(a => !showOnlyUnlocked || a.isUnlocked)
            .map((achievement, index) => (
              <AchievementCard 
                key={achievement.id} 
                achievement={achievement} 
                index={index}
                isUnlocked={achievement.isUnlocked}
              />
            ))}
        </div>

        {/* Mini Leaderboard */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Achievement Leaderboard</h3>
            <button className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                  player.isYou 
                    ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30' 
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    player.rank === 1 ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-black' :
                    player.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-black' :
                    player.rank === 3 ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-black' :
                    'bg-white/10 text-white'
                  }`}>
                    {player.rank}
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {player.name} {player.isYou && <span className="text-purple-400">(You)</span>}
                    </p>
                    <p className="text-sm text-gray-400">Level {player.level}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-bold text-white">{player.achievements}</p>
                    <p className="text-xs text-gray-400">Achievements</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-purple-400">{player.xp.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">XP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-white mb-4">Ready for Your Next Achievement?</h3>
          <p className="text-gray-400 mb-6">Start a new challenge and unlock more rewards</p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 inline-flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Start New Challenge
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizedGamification;