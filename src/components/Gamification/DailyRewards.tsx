import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { achievementService } from '../../services/achievementService';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  Gift, Star, Flame, Calendar, Clock, Trophy, Sparkles,
  ChevronRight, Award, Target, Zap, Crown, Check
} from 'lucide-react';

const DailyRewards: React.FC = () => {
  const { user } = useAuth();
  const { actualTheme } = useTheme();
  const { showSuccess, showInfo } = useToast();
  const isDark = actualTheme === 'dark';
  
  const [dailyRewards, setDailyRewards] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [claimingReward, setClaimingReward] = useState<string | null>(null);
  const [lastClaimedDate, setLastClaimedDate] = useState<string | null>(null);

  useEffect(() => {
    loadDailyRewards();
    loadLastClaimedDate();
  }, [user]);

  const loadDailyRewards = async () => {
    if (!user?.id) return;
    
    try {
      const rewards = await achievementService.getDailyRewards(user.id);
      setDailyRewards(rewards);
    } catch (error) {
      console.error('Failed to load daily rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLastClaimedDate = () => {
    const stored = localStorage.getItem(`daily_rewards_${user?.id}`);
    if (stored) {
      setLastClaimedDate(stored);
    }
  };

  const canClaimToday = () => {
    if (!lastClaimedDate) return true;
    const today = new Date().toDateString();
    return lastClaimedDate !== today;
  };

  const handleClaimReward = async (rewardType: string) => {
    if (!user?.id || !canClaimToday()) return;
    
    setClaimingReward(rewardType);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const today = new Date().toDateString();
      localStorage.setItem(`daily_rewards_${user.id}`, today);
      setLastClaimedDate(today);
      
      switch (rewardType) {
        case 'login':
          showSuccess('Daily Login Bonus', `+${dailyRewards.loginBonus} XP claimed!`);
          break;
        case 'streak':
          showSuccess('Streak Bonus', `+${dailyRewards.streakBonus} XP for your ${Math.floor(dailyRewards.streakBonus / 5)} day streak!`);
          break;
        case 'challenge':
          showSuccess('Daily Challenge', 'Challenge completed! +50 XP bonus!');
          break;
      }
      
      // Award XP (mock implementation)
      await achievementService.awardXP(user.id, {
        id: `daily_${rewardType}_${Date.now()}`,
        type: 'daily_login',
        xpAmount: rewardType === 'challenge' ? 50 : rewardType === 'streak' ? dailyRewards.streakBonus : dailyRewards.loginBonus,
        timestamp: new Date(),
        description: `Daily ${rewardType} bonus`
      });
      
    } catch (error) {
      console.error('Failed to claim reward:', error);
    } finally {
      setClaimingReward(null);
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 100) return '🔥';
    if (streak >= 50) return '🌟';
    if (streak >= 30) return '⭐';
    if (streak >= 14) return '✨';
    if (streak >= 7) return '🎯';
    return '🎉';
  };

  if (loading || !dailyRewards) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const canClaim = canClaimToday();
  const currentStreak = Math.floor(dailyRewards.streakBonus / 5); // Assuming 5 XP per day

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Gift className="w-6 h-6 text-yellow-400" />
              Daily Rewards
            </h2>
            <p className="text-gray-400 mt-1">
              {canClaim ? 'Claim your daily rewards!' : 'Come back tomorrow for more rewards!'}
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400">Today</div>
            <div className="text-lg font-bold text-white">
              {today.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reward Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Daily Login Bonus */}
        <div className={`
          relative p-6 rounded-xl border-2 transition-all duration-300 group
          ${canClaim 
            ? 'border-blue-500 bg-gradient-to-br from-blue-900/30 to-purple-900/30 hover:scale-105 cursor-pointer' 
            : 'border-gray-700 bg-gray-900/60'
          }
        `}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${canClaim ? 'bg-blue-600' : 'bg-gray-700'}`}>
              <Calendar className="w-6 h-6 text-white" />
            </div>
            
            {!canClaim && (
              <div className="flex items-center gap-1 text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm">Claimed</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-2">Daily Login</h3>
          <p className="text-gray-400 text-sm mb-4">
            Just for logging in today
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-white">+{dailyRewards.loginBonus} XP</span>
            </div>
            
            {canClaim && (
              <button
                onClick={() => handleClaimReward('login')}
                disabled={claimingReward === 'login'}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {claimingReward === 'login' ? 'Claiming...' : 'Claim'}
              </button>
            )}
          </div>

          {canClaim && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse" />
          )}
        </div>

        {/* Streak Bonus */}
        <div className={`
          relative p-6 rounded-xl border-2 transition-all duration-300 group
          ${canClaim && currentStreak > 0
            ? 'border-orange-500 bg-gradient-to-br from-orange-900/30 to-red-900/30 hover:scale-105 cursor-pointer' 
            : 'border-gray-700 bg-gray-900/60'
          }
        `}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${canClaim && currentStreak > 0 ? 'bg-orange-600' : 'bg-gray-700'}`}>
              <Flame className="w-6 h-6 text-white" />
            </div>
            
            {!canClaim && currentStreak > 0 && (
              <div className="flex items-center gap-1 text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm">Claimed</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            Streak Bonus
            <span className="text-2xl">{getStreakEmoji(currentStreak)}</span>
          </h3>
          
          <p className="text-gray-400 text-sm mb-4">
            {currentStreak > 0 ? `${currentStreak} day streak!` : 'Start a coding streak'}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-white">
                +{currentStreak > 0 ? dailyRewards.streakBonus : 0} XP
              </span>
            </div>
            
            {canClaim && currentStreak > 0 && (
              <button
                onClick={() => handleClaimReward('streak')}
                disabled={claimingReward === 'streak'}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {claimingReward === 'streak' ? 'Claiming...' : 'Claim'}
              </button>
            )}
          </div>

          {canClaim && currentStreak > 0 && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-600/10 to-red-600/10 animate-pulse" />
          )}
        </div>

        {/* Daily Challenge */}
        <div className={`
          relative p-6 rounded-xl border-2 transition-all duration-300 group
          ${canClaim 
            ? 'border-green-500 bg-gradient-to-br from-green-900/30 to-blue-900/30 hover:scale-105 cursor-pointer' 
            : 'border-gray-700 bg-gray-900/60'
          }
        `}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-full ${canClaim ? 'bg-green-600' : 'bg-gray-700'}`}>
              <Target className="w-6 h-6 text-white" />
            </div>
            
            {!canClaim && dailyRewards.dailyChallenge?.completed && (
              <div className="flex items-center gap-1 text-green-400">
                <Check className="w-4 h-4" />
                <span className="text-sm">Completed</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-2">Daily Challenge</h3>
          <p className="text-gray-400 text-sm mb-1">
            {dailyRewards.dailyChallenge?.title || 'No challenge available'}
          </p>
          <p className="text-xs text-gray-500 mb-4">
            {dailyRewards.dailyChallenge?.difficulty || 'Medium'} difficulty
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-bold text-white">
                +{dailyRewards.dailyChallenge?.bonus || 50} XP
              </span>
            </div>
            
            {canClaim && (
              <button
                onClick={() => handleClaimReward('challenge')}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
              >
                Start
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {canClaim && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-600/10 to-blue-600/10 animate-pulse" />
          )}
        </div>
      </div>

      {/* Streak Progress */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Streak Progress
          </h3>
          <span className="text-sm text-gray-400">
            {currentStreak} days
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({ length: 7 }, (_, i) => {
            const dayIndex = (today.getDay() - i + 7) % 7;
            const isToday = i === 0;
            const isActive = i < currentStreak;
            
            return (
              <div
                key={i}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                  ${isToday && canClaim
                    ? 'bg-orange-600 text-white animate-pulse'
                    : isActive
                    ? 'bg-orange-900/50 text-orange-400 border border-orange-600'
                    : 'bg-gray-800 text-gray-500'
                  }
                `}
              >
                {isToday ? 'Today' : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex]}
              </div>
            );
          })}
        </div>

        {/* Streak Milestones */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Next milestone</span>
            <span>{Math.ceil(currentStreak / 7) * 7} days</span>
          </div>
          
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-600 to-yellow-600 transition-all duration-500"
              style={{ width: `${(currentStreak % 7) / 7 * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Upcoming Rewards */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-blue-400" />
          Upcoming Rewards
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="font-medium text-white">Weekly Challenge</p>
                <p className="text-sm text-gray-400">Complete 5 challenges this week</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-yellow-400">+200 XP</div>
              <div className="text-xs text-gray-500">3/5 completed</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-purple-400" />
              <div>
                <p className="font-medium text-white">Monthly Achievement</p>
                <p className="text-sm text-gray-400">Maintain a 30-day streak</p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-purple-400">+500 XP</div>
              <div className="text-xs text-gray-500">{currentStreak}/30 days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRewards;