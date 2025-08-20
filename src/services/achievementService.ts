export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'coding' | 'social' | 'streak' | 'milestone' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirements: {
    type: 'submissions' | 'solved' | 'streak' | 'languages' | 'speed' | 'accuracy' | 'social' | 'custom';
    target: number;
    condition?: string;
  };
  unlockDate?: Date;
  progress?: number;
  isUnlocked: boolean;
  isHidden: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  unlockedAt: Date;
}

export interface UserLevel {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  levelProgress: number;
}

export interface GamificationStats {
  achievements: Achievement[];
  badges: Badge[];
  level: UserLevel;
  dailyStreak: number;
  longestStreak: number;
  totalPoints: number;
  rank: number;
  nextMilestone: {
    title: string;
    description: string;
    progress: number;
    target: number;
  };
}

export interface XPEvent {
  id: string;
  type: 'challenge_solved' | 'first_try' | 'fast_solve' | 'perfect_score' | 'daily_login' | 'streak_milestone' | 'social_interaction';
  xpAmount: number;
  timestamp: Date;
  description: string;
  multiplier?: number;
}

class AchievementService {
  private achievements: Map<string, Achievement> = new Map();
  private userProgress: Map<string, GamificationStats> = new Map();

  constructor() {
    this.initializeAchievements();
    this.loadUserProgress();
  }

  private initializeAchievements() {
    const baseAchievements: Achievement[] = [
      // Coding Achievements
      {
        id: 'first_blood',
        title: 'First Blood',
        description: 'Solve your first challenge',
        icon: '🎯',
        category: 'milestone',
        rarity: 'common',
        points: 10,
        requirements: { type: 'solved', target: 1 },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'problem_solver',
        title: 'Problem Solver',
        description: 'Solve 10 challenges',
        icon: '🧩',
        category: 'milestone',
        rarity: 'common',
        points: 50,
        requirements: { type: 'solved', target: 10 },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'centurion',
        title: 'Centurion',
        description: 'Solve 100 challenges',
        icon: '💯',
        category: 'milestone',
        rarity: 'rare',
        points: 500,
        requirements: { type: 'solved', target: 100 },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'grandmaster',
        title: 'Grandmaster',
        description: 'Solve 1000 challenges',
        icon: '👑',
        category: 'milestone',
        rarity: 'legendary',
        points: 5000,
        requirements: { type: 'solved', target: 1000 },
        isUnlocked: false,
        isHidden: true
      },

      // Speed Achievements
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Solve a challenge in under 10 seconds',
        icon: '⚡',
        category: 'coding',
        rarity: 'rare',
        points: 100,
        requirements: { type: 'speed', target: 10000 }, // milliseconds
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'lightning_fast',
        title: 'Lightning Fast',
        description: 'Average execution time under 50ms for 10 consecutive solutions',
        icon: '🌩️',
        category: 'coding',
        rarity: 'epic',
        points: 200,
        requirements: { type: 'custom', target: 10, condition: 'avg_speed_50ms' },
        isUnlocked: false,
        isHidden: false
      },

      // Accuracy Achievements
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Solve 5 challenges on first try',
        icon: '🎯',
        category: 'coding',
        rarity: 'rare',
        points: 150,
        requirements: { type: 'custom', target: 5, condition: 'first_try' },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'flawless_victory',
        title: 'Flawless Victory',
        description: 'Maintain 100% accuracy for 20 consecutive challenges',
        icon: '💎',
        category: 'coding',
        rarity: 'epic',
        points: 300,
        requirements: { type: 'accuracy', target: 100, condition: '20_consecutive' },
        isUnlocked: false,
        isHidden: false
      },

      // Language Achievements
      {
        id: 'polyglot',
        title: 'Polyglot',
        description: 'Solve challenges in 5 different languages',
        icon: '🗣️',
        category: 'coding',
        rarity: 'rare',
        points: 200,
        requirements: { type: 'languages', target: 5 },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'language_master',
        title: 'Language Master',
        description: 'Solve challenges in 10 different languages',
        icon: '🌍',
        category: 'coding',
        rarity: 'epic',
        points: 500,
        requirements: { type: 'languages', target: 10 },
        isUnlocked: false,
        isHidden: false
      },

      // Streak Achievements
      {
        id: 'streak_starter',
        title: 'Streak Starter',
        description: 'Maintain a 7-day coding streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'common',
        points: 75,
        requirements: { type: 'streak', target: 7 },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'dedication',
        title: 'Dedication',
        description: 'Maintain a 30-day coding streak',
        icon: '🌟',
        category: 'streak',
        rarity: 'rare',
        points: 300,
        requirements: { type: 'streak', target: 30 },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'unstoppable',
        title: 'Unstoppable',
        description: 'Maintain a 100-day coding streak',
        icon: '🚀',
        category: 'streak',
        rarity: 'legendary',
        points: 1000,
        requirements: { type: 'streak', target: 100 },
        isUnlocked: false,
        isHidden: true
      },

      // Social Achievements
      {
        id: 'team_player',
        title: 'Team Player',
        description: 'Participate in 5 collaborative coding sessions',
        icon: '🤝',
        category: 'social',
        rarity: 'common',
        points: 100,
        requirements: { type: 'social', target: 5, condition: 'collaboration' },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'mentor',
        title: 'Mentor',
        description: 'Help 10 other users by sharing solutions or tips',
        icon: '👨‍🏫',
        category: 'social',
        rarity: 'rare',
        points: 250,
        requirements: { type: 'social', target: 10, condition: 'help_others' },
        isUnlocked: false,
        isHidden: false
      },

      // Special Achievements
      {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Code before 6 AM local time',
        icon: '🐦',
        category: 'special',
        rarity: 'common',
        points: 25,
        requirements: { type: 'custom', target: 1, condition: 'early_morning' },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Code after midnight local time',
        icon: '🦉',
        category: 'special',
        rarity: 'common',
        points: 25,
        requirements: { type: 'custom', target: 1, condition: 'late_night' },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'weekend_warrior',
        title: 'Weekend Warrior',
        description: 'Solve 50 challenges on weekends',
        icon: '⚔️',
        category: 'special',
        rarity: 'rare',
        points: 150,
        requirements: { type: 'custom', target: 50, condition: 'weekend_only' },
        isUnlocked: false,
        isHidden: false
      },
      {
        id: 'beta_tester',
        title: 'Beta Tester',
        description: 'One of the first 100 users on the platform',
        icon: '🧪',
        category: 'special',
        rarity: 'legendary',
        points: 1000,
        requirements: { type: 'custom', target: 1, condition: 'early_adopter' },
        isUnlocked: false,
        isHidden: true
      }
    ];

    baseAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
  }

  // Get all achievements for a user
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const userStats = this.userProgress.get(userId);
    if (!userStats) {
      await this.initializeUserProgress(userId);
    }
    
    return Array.from(this.achievements.values()).map(achievement => ({
      ...achievement,
      isUnlocked: userStats?.achievements.some(a => a.id === achievement.id && a.isUnlocked) || false,
      progress: this.calculateProgress(userId, achievement)
    }));
  }

  // Get user's gamification stats
  async getUserGamificationStats(userId: string): Promise<GamificationStats> {
    let userStats = this.userProgress.get(userId);
    if (!userStats) {
      userStats = await this.initializeUserProgress(userId);
    }
    return userStats;
  }

  // Check and unlock achievements based on user activity
  async checkAchievements(userId: string, activity: {
    type: 'challenge_solved' | 'submission_made' | 'streak_updated' | 'collaboration' | 'social_interaction';
    data: any;
  }): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = [];
    const userStats = await this.getUserGamificationStats(userId);
    
    for (const [achievementId, achievement] of this.achievements) {
      if (achievement.isUnlocked || userStats.achievements.some(a => a.id === achievementId && a.isUnlocked)) {
        continue;
      }

      if (this.checkAchievementCondition(userId, achievement, activity)) {
        const unlockedAchievement = { ...achievement, isUnlocked: true, unlockDate: new Date() };
        unlockedAchievements.push(unlockedAchievement);
        
        // Update user stats
        userStats.achievements.push(unlockedAchievement);
        userStats.totalPoints += achievement.points;
        
        // Award XP
        await this.awardXP(userId, {
          id: `achievement_${achievementId}`,
          type: 'challenge_solved',
          xpAmount: achievement.points,
          timestamp: new Date(),
          description: `Unlocked achievement: ${achievement.title}`
        });
      }
    }

    if (unlockedAchievements.length > 0) {
      this.saveUserProgress();
    }

    return unlockedAchievements;
  }

  // Award XP to user
  async awardXP(userId: string, event: XPEvent): Promise<UserLevel> {
    const userStats = await this.getUserGamificationStats(userId);
    
    const xpToAward = Math.floor(event.xpAmount * (event.multiplier || 1));
    userStats.level.currentXP += xpToAward;
    userStats.level.totalXP += xpToAward;
    
    // Check for level up
    while (userStats.level.currentXP >= userStats.level.xpToNextLevel) {
      userStats.level.currentXP -= userStats.level.xpToNextLevel;
      userStats.level.currentLevel++;
      userStats.level.xpToNextLevel = this.calculateXPForLevel(userStats.level.currentLevel + 1);
      
      // Award level up bonus
      const levelUpBonus = userStats.level.currentLevel * 10;
      userStats.totalPoints += levelUpBonus;
    }
    
    // Update progress percentage
    userStats.level.levelProgress = (userStats.level.currentXP / userStats.level.xpToNextLevel) * 100;
    
    this.saveUserProgress();
    return userStats.level;
  }

  // Get leaderboard with gamification stats
  async getGamificationLeaderboard(limit = 50): Promise<Array<{
    userId: string;
    username: string;
    level: number;
    totalXP: number;
    totalPoints: number;
    achievementCount: number;
    badgeCount: number;
    streak: number;
  }>> {
    const leaderboard = [];
    
    for (const [userId, stats] of this.userProgress) {
      leaderboard.push({
        userId,
        username: `User_${userId.slice(0, 8)}`,
        level: stats.level.currentLevel,
        totalXP: stats.level.totalXP,
        totalPoints: stats.totalPoints,
        achievementCount: stats.achievements.filter(a => a.isUnlocked).length,
        badgeCount: stats.badges.length,
        streak: stats.dailyStreak
      });
    }
    
    return leaderboard
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  }

  // Get daily challenges and bonuses
  async getDailyRewards(userId: string): Promise<{
    dailyChallenge?: {
      id: string;
      title: string;
      difficulty: string;
      bonus: number;
      completed: boolean;
    };
    streakBonus: number;
    loginBonus: number;
  }> {
    const userStats = await this.getUserGamificationStats(userId);
    
    // Mock daily challenge
    const dailyChallenge = {
      id: `daily_${new Date().toISOString().split('T')[0]}`,
      title: 'Two Sum Variations',
      difficulty: 'Medium',
      bonus: 50,
      completed: false // Check against user's completed challenges
    };
    
    const streakBonus = Math.min(userStats.dailyStreak * 5, 100); // Max 100 bonus
    const loginBonus = 10; // Base daily login bonus
    
    return {
      dailyChallenge,
      streakBonus,
      loginBonus
    };
  }

  // Get achievement suggestions based on user's current progress
  async getAchievementSuggestions(userId: string): Promise<Achievement[]> {
    const userAchievements = await this.getUserAchievements(userId);
    
    return userAchievements
      .filter(achievement => !achievement.isUnlocked && !achievement.isHidden)
      .filter(achievement => (achievement.progress || 0) > 10) // Show achievements with some progress
      .sort((a, b) => (b.progress || 0) - (a.progress || 0))
      .slice(0, 5);
  }

  // Private helper methods
  private async initializeUserProgress(userId: string): Promise<GamificationStats> {
    const initialStats: GamificationStats = {
      achievements: [],
      badges: [],
      level: {
        currentLevel: 1,
        currentXP: 0,
        xpToNextLevel: this.calculateXPForLevel(2),
        totalXP: 0,
        levelProgress: 0
      },
      dailyStreak: 0,
      longestStreak: 0,
      totalPoints: 0,
      rank: 0,
      nextMilestone: {
        title: 'Problem Solver',
        description: 'Solve 10 challenges',
        progress: 0,
        target: 10
      }
    };
    
    this.userProgress.set(userId, initialStats);
    return initialStats;
  }

  private calculateXPForLevel(level: number): number {
    // Exponential XP curve
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  private calculateProgress(userId: string, achievement: Achievement): number {
    // Mock progress calculation
    // In a real implementation, this would check user's actual stats
    const mockProgress = Math.random() * 100;
    
    if (achievement.requirements.type === 'solved') {
      return Math.min(mockProgress, achievement.requirements.target) / achievement.requirements.target * 100;
    }
    
    return mockProgress;
  }

  private checkAchievementCondition(userId: string, achievement: Achievement, activity: any): boolean {
    // Mock achievement checking logic
    // In a real implementation, this would check actual user data against achievement requirements
    
    switch (achievement.requirements.type) {
      case 'solved':
        return activity.type === 'challenge_solved' && Math.random() < 0.1; // 10% chance for demo
      case 'streak':
        return activity.type === 'streak_updated' && activity.data.streak >= achievement.requirements.target;
      case 'social':
        return activity.type === 'social_interaction' && Math.random() < 0.15; // 15% chance for demo
      default:
        return Math.random() < 0.05; // 5% chance for other achievements
    }
  }

  private loadUserProgress(): void {
    try {
      const stored = localStorage.getItem('codebattle_gamification');
      if (stored) {
        const data = JSON.parse(stored);
        this.userProgress = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load gamification data:', error);
    }
  }

  private saveUserProgress(): void {
    try {
      const data = Object.fromEntries(this.userProgress);
      localStorage.setItem('codebattle_gamification', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save gamification data:', error);
    }
  }
}

export const achievementService = new AchievementService();