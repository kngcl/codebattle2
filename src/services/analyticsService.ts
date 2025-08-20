export interface UserAnalytics {
  userId: string;
  totalSubmissions: number;
  successfulSubmissions: number;
  averageExecutionTime: number;
  averageMemoryUsage: number;
  languagePreferences: { [language: string]: number };
  difficultyBreakdown: { [difficulty: string]: { attempted: number; solved: number } };
  dailyActivity: { date: string; submissions: number; solutions: number }[];
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastSubmissionDate: string;
  };
  performanceMetrics: {
    averageRating: number;
    ratingTrend: number[];
    timeToSolve: number[];
    accuracyRate: number;
  };
  skillProgression: {
    [category: string]: {
      level: number;
      experience: number;
      nextLevelThreshold: number;
    };
  };
}

export interface ChallengeAnalytics {
  challengeId: string;
  totalAttempts: number;
  uniqueUsers: number;
  successRate: number;
  averageExecutionTime: number;
  averageMemoryUsage: number;
  difficultyRating: number;
  languageDistribution: { [language: string]: number };
  timeDistribution: {
    range: string;
    count: number;
  }[];
  commonErrors: {
    errorType: string;
    frequency: number;
    description: string;
  }[];
  solutionQuality: {
    averageComplexity: number;
    averageMaintainability: number;
    bestPracticesScore: number;
  };
}

export interface SystemAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalChallenges: number;
  totalSubmissions: number;
  systemLoad: {
    timestamp: Date;
    cpuUsage: number;
    memoryUsage: number;
    activeConnections: number;
    executionQueueSize: number;
  }[];
  popularLanguages: { language: string; usage: number }[];
  userGrowth: { date: string; newUsers: number; totalUsers: number }[];
  performanceMetrics: {
    averageResponseTime: number;
    uptime: number;
    errorRate: number;
    throughput: number;
  };
  geographicDistribution: {
    country: string;
    userCount: number;
    continent: string;
  }[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  rating: number;
  solvedChallenges: number;
  totalSubmissions: number;
  accuracyRate: number;
  averageExecutionTime: number;
  favoriteLanguage: string;
  rank: number;
  rankChange: number;
  badges: string[];
}

export interface TrendAnalysis {
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    name: string;
    values: number[];
    dates: string[];
    trend: 'up' | 'down' | 'stable';
    changePercentage: number;
  }[];
  predictions: {
    metric: string;
    predictedValue: number;
    confidence: number;
    timeframe: string;
  }[];
}

class AnalyticsService {
  private analytics: {
    users: Map<string, UserAnalytics>;
    challenges: Map<string, ChallengeAnalytics>;
    system: SystemAnalytics;
  };

  constructor() {
    this.analytics = {
      users: new Map(),
      challenges: new Map(),
      system: this.initializeSystemAnalytics()
    };
    this.loadAnalytics();
    this.startSystemMonitoring();
  }

  // User Analytics
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    let userAnalytics = this.analytics.users.get(userId);
    
    if (!userAnalytics) {
      userAnalytics = await this.generateUserAnalytics(userId);
      this.analytics.users.set(userId, userAnalytics);
    }
    
    return userAnalytics;
  }

  async updateUserAnalytics(userId: string, submission: any): Promise<void> {
    const analytics = await this.getUserAnalytics(userId);
    
    // Update submission counts
    analytics.totalSubmissions++;
    if (submission.status === 'Accepted') {
      analytics.successfulSubmissions++;
    }
    
    // Update language preferences
    analytics.languagePreferences[submission.language] = 
      (analytics.languagePreferences[submission.language] || 0) + 1;
    
    // Update difficulty breakdown
    const difficulty = submission.difficulty || 'Medium';
    if (!analytics.difficultyBreakdown[difficulty]) {
      analytics.difficultyBreakdown[difficulty] = { attempted: 0, solved: 0 };
    }
    analytics.difficultyBreakdown[difficulty].attempted++;
    if (submission.status === 'Accepted') {
      analytics.difficultyBreakdown[difficulty].solved++;
    }
    
    // Update daily activity
    const today = new Date().toISOString().split('T')[0];
    let todayActivity = analytics.dailyActivity.find(a => a.date === today);
    if (!todayActivity) {
      todayActivity = { date: today, submissions: 0, solutions: 0 };
      analytics.dailyActivity.push(todayActivity);
    }
    todayActivity.submissions++;
    if (submission.status === 'Accepted') {
      todayActivity.solutions++;
    }
    
    // Keep only last 30 days
    analytics.dailyActivity = analytics.dailyActivity
      .filter(a => new Date(a.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Update streak data
    this.updateStreakData(analytics, submission.status === 'Accepted');
    
    // Update performance metrics
    this.updatePerformanceMetrics(analytics, submission);
    
    // Update skill progression
    this.updateSkillProgression(analytics, submission);
    
    // Save analytics
    this.saveAnalytics();
  }

  // Challenge Analytics
  async getChallengeAnalytics(challengeId: string): Promise<ChallengeAnalytics> {
    let challengeAnalytics = this.analytics.challenges.get(challengeId);
    
    if (!challengeAnalytics) {
      challengeAnalytics = await this.generateChallengeAnalytics(challengeId);
      this.analytics.challenges.set(challengeId, challengeAnalytics);
    }
    
    return challengeAnalytics;
  }

  async updateChallengeAnalytics(challengeId: string, submission: any): Promise<void> {
    const analytics = await this.getChallengeAnalytics(challengeId);
    
    // Update attempt counts
    analytics.totalAttempts++;
    
    // Update language distribution
    analytics.languageDistribution[submission.language] = 
      (analytics.languageDistribution[submission.language] || 0) + 1;
    
    // Update success rate
    const submissions = this.getSubmissionsForChallenge(challengeId);
    const successfulSubmissions = submissions.filter(s => s.status === 'Accepted').length;
    analytics.successRate = (successfulSubmissions / analytics.totalAttempts) * 100;
    
    // Update average execution time and memory usage
    if (submission.executionTime) {
      const totalTime = analytics.averageExecutionTime * (analytics.totalAttempts - 1) + submission.executionTime;
      analytics.averageExecutionTime = totalTime / analytics.totalAttempts;
    }
    
    // Update time distribution
    this.updateTimeDistribution(analytics, submission.executionTime);
    
    // Update common errors
    if (submission.error) {
      this.updateCommonErrors(analytics, submission.error);
    }
    
    // Save analytics
    this.saveAnalytics();
  }

  // System Analytics
  getSystemAnalytics(): SystemAnalytics {
    return this.analytics.system;
  }

  // Leaderboard
  async getLeaderboard(limit = 50, period: 'all' | 'month' | 'week' = 'all'): Promise<LeaderboardEntry[]> {
    const users = Array.from(this.analytics.users.values());
    
    const leaderboard: LeaderboardEntry[] = users
      .filter(user => this.shouldIncludeInLeaderboard(user, period))
      .map(user => this.createLeaderboardEntry(user))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
        rankChange: this.calculateRankChange(entry.userId, index + 1)
      }));
    
    return leaderboard;
  }

  // Trend Analysis
  async getTrendAnalysis(period: 'day' | 'week' | 'month' | 'year'): Promise<TrendAnalysis> {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case 'day':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'week':
        startDate.setDate(endDate.getDate() - 28);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 2);
        break;
    }
    
    const metrics = this.calculateTrendMetrics(startDate, endDate, period);
    const predictions = this.generatePredictions(metrics);
    
    return {
      period,
      metrics,
      predictions
    };
  }

  // Advanced Analytics
  async getUserInsights(userId: string): Promise<{
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    nextChallenges: string[];
    learningPath: string[];
  }> {
    const analytics = await this.getUserAnalytics(userId);
    
    const strengths = this.identifyStrengths(analytics);
    const weaknesses = this.identifyWeaknesses(analytics);
    const recommendations = this.generateRecommendations(analytics, strengths, weaknesses);
    const nextChallenges = this.suggestChallenges(analytics);
    const learningPath = this.generateLearningPath(analytics);
    
    return {
      strengths,
      weaknesses,
      recommendations,
      nextChallenges,
      learningPath
    };
  }

  async getChallengeInsights(challengeId: string): Promise<{
    difficultyAnalysis: {
      perceivedDifficulty: number;
      actualDifficulty: number;
      difficultyGap: number;
    };
    improvementSuggestions: string[];
    similarChallenges: string[];
  }> {
    const analytics = await this.getChallengeAnalytics(challengeId);
    
    const difficultyAnalysis = this.analyzeDifficulty(analytics);
    const improvementSuggestions = this.generateChallengeImprovements(analytics);
    const similarChallenges = this.findSimilarChallenges(challengeId);
    
    return {
      difficultyAnalysis,
      improvementSuggestions,
      similarChallenges
    };
  }

  // Private methods
  private async generateUserAnalytics(userId: string): Promise<UserAnalytics> {
    const submissions = this.getSubmissionsForUser(userId);
    
    return {
      userId,
      totalSubmissions: submissions.length,
      successfulSubmissions: submissions.filter(s => s.status === 'Accepted').length,
      averageExecutionTime: submissions.reduce((sum, s) => sum + (s.executionTime || 0), 0) / submissions.length || 0,
      averageMemoryUsage: submissions.reduce((sum, s) => sum + (s.memoryUsage || 0), 0) / submissions.length || 0,
      languagePreferences: this.calculateLanguagePreferences(submissions),
      difficultyBreakdown: this.calculateDifficultyBreakdown(submissions),
      dailyActivity: this.calculateDailyActivity(submissions),
      streakData: this.calculateStreakData(submissions),
      performanceMetrics: this.calculatePerformanceMetrics(submissions),
      skillProgression: this.calculateSkillProgression(submissions)
    };
  }

  private async generateChallengeAnalytics(challengeId: string): Promise<ChallengeAnalytics> {
    const submissions = this.getSubmissionsForChallenge(challengeId);
    const uniqueUsers = new Set(submissions.map(s => s.userId)).size;
    
    return {
      challengeId,
      totalAttempts: submissions.length,
      uniqueUsers,
      successRate: submissions.filter(s => s.status === 'Accepted').length / submissions.length * 100 || 0,
      averageExecutionTime: submissions.reduce((sum, s) => sum + (s.executionTime || 0), 0) / submissions.length || 0,
      averageMemoryUsage: submissions.reduce((sum, s) => sum + (s.memoryUsage || 0), 0) / submissions.length || 0,
      difficultyRating: this.calculatePerceivedDifficulty(submissions),
      languageDistribution: this.calculateLanguageDistribution(submissions),
      timeDistribution: this.calculateTimeDistribution(submissions),
      commonErrors: this.calculateCommonErrors(submissions),
      solutionQuality: this.calculateSolutionQuality(submissions)
    };
  }

  private initializeSystemAnalytics(): SystemAnalytics {
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalChallenges: 0,
      totalSubmissions: 0,
      systemLoad: [],
      popularLanguages: [],
      userGrowth: [],
      performanceMetrics: {
        averageResponseTime: 0,
        uptime: 99.9,
        errorRate: 0.1,
        throughput: 0
      },
      geographicDistribution: []
    };
  }

  private startSystemMonitoring(): void {
    // Mock system monitoring
    setInterval(() => {
      const systemLoad = {
        timestamp: new Date(),
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 1000),
        executionQueueSize: Math.floor(Math.random() * 50)
      };
      
      this.analytics.system.systemLoad.push(systemLoad);
      
      // Keep only last 24 hours of data
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      this.analytics.system.systemLoad = this.analytics.system.systemLoad
        .filter(load => load.timestamp > oneDayAgo);
    }, 60000); // Update every minute
  }

  // Mock data retrieval methods
  private getSubmissionsForUser(userId: string): any[] {
    // In a real implementation, this would query the database
    const stored = localStorage.getItem('codebattle_submissions');
    const submissions = stored ? JSON.parse(stored) : [];
    return submissions.filter((s: any) => s.userId === userId);
  }

  private getSubmissionsForChallenge(challengeId: string): any[] {
    // In a real implementation, this would query the database
    const stored = localStorage.getItem('codebattle_submissions');
    const submissions = stored ? JSON.parse(stored) : [];
    return submissions.filter((s: any) => s.challengeId === challengeId);
  }

  // Helper calculation methods
  private calculateLanguagePreferences(submissions: any[]): { [language: string]: number } {
    const preferences: { [language: string]: number } = {};
    submissions.forEach(s => {
      preferences[s.language] = (preferences[s.language] || 0) + 1;
    });
    return preferences;
  }

  private calculateDifficultyBreakdown(submissions: any[]): { [difficulty: string]: { attempted: number; solved: number } } {
    const breakdown: { [difficulty: string]: { attempted: number; solved: number } } = {};
    
    submissions.forEach(s => {
      const difficulty = s.difficulty || 'Medium';
      if (!breakdown[difficulty]) {
        breakdown[difficulty] = { attempted: 0, solved: 0 };
      }
      breakdown[difficulty].attempted++;
      if (s.status === 'Accepted') {
        breakdown[difficulty].solved++;
      }
    });
    
    return breakdown;
  }

  private calculateDailyActivity(submissions: any[]): { date: string; submissions: number; solutions: number }[] {
    const activity: { [date: string]: { submissions: number; solutions: number } } = {};
    
    submissions.forEach(s => {
      const date = new Date(s.submittedAt).toISOString().split('T')[0];
      if (!activity[date]) {
        activity[date] = { submissions: 0, solutions: 0 };
      }
      activity[date].submissions++;
      if (s.status === 'Accepted') {
        activity[date].solutions++;
      }
    });
    
    return Object.entries(activity).map(([date, data]) => ({
      date,
      ...data
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private calculateStreakData(submissions: any[]): {
    currentStreak: number;
    longestStreak: number;
    lastSubmissionDate: string;
  } {
    // Mock implementation
    return {
      currentStreak: Math.floor(Math.random() * 30),
      longestStreak: Math.floor(Math.random() * 100),
      lastSubmissionDate: new Date().toISOString()
    };
  }

  private calculatePerformanceMetrics(submissions: any[]): {
    averageRating: number;
    ratingTrend: number[];
    timeToSolve: number[];
    accuracyRate: number;
  } {
    const successfulSubmissions = submissions.filter(s => s.status === 'Accepted');
    
    return {
      averageRating: submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.length || 0,
      ratingTrend: submissions.slice(-10).map(s => s.score || 0),
      timeToSolve: successfulSubmissions.map(s => s.executionTime || 0),
      accuracyRate: (successfulSubmissions.length / submissions.length) * 100 || 0
    };
  }

  private calculateSkillProgression(submissions: any[]): {
    [category: string]: {
      level: number;
      experience: number;
      nextLevelThreshold: number;
    };
  } {
    // Mock skill progression
    const categories = ['Algorithms', 'Data Structures', 'Dynamic Programming', 'Graph Theory', 'Math'];
    const progression: any = {};
    
    categories.forEach(category => {
      const experience = Math.floor(Math.random() * 1000);
      const level = Math.floor(experience / 100) + 1;
      progression[category] = {
        level,
        experience,
        nextLevelThreshold: level * 100
      };
    });
    
    return progression;
  }

  // Additional helper methods would be implemented here...
  private updateStreakData(analytics: UserAnalytics, wasSuccessful: boolean): void {
    // Mock streak update logic
    if (wasSuccessful) {
      analytics.streakData.currentStreak++;
      analytics.streakData.longestStreak = Math.max(
        analytics.streakData.longestStreak, 
        analytics.streakData.currentStreak
      );
    }
    analytics.streakData.lastSubmissionDate = new Date().toISOString();
  }

  private updatePerformanceMetrics(analytics: UserAnalytics, submission: any): void {
    // Update rating trend
    analytics.performanceMetrics.ratingTrend.push(submission.score || 0);
    if (analytics.performanceMetrics.ratingTrend.length > 20) {
      analytics.performanceMetrics.ratingTrend = analytics.performanceMetrics.ratingTrend.slice(-20);
    }
    
    // Update time to solve
    if (submission.status === 'Accepted') {
      analytics.performanceMetrics.timeToSolve.push(submission.executionTime || 0);
      if (analytics.performanceMetrics.timeToSolve.length > 20) {
        analytics.performanceMetrics.timeToSolve = analytics.performanceMetrics.timeToSolve.slice(-20);
      }
    }
    
    // Update accuracy rate
    analytics.performanceMetrics.accuracyRate = 
      (analytics.successfulSubmissions / analytics.totalSubmissions) * 100;
  }

  private updateSkillProgression(analytics: UserAnalytics, submission: any): void {
    // Mock skill progression update
    const categories = Object.keys(analytics.skillProgression);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    if (randomCategory && submission.status === 'Accepted') {
      const skill = analytics.skillProgression[randomCategory];
      skill.experience += Math.floor(Math.random() * 50) + 10;
      
      // Level up if threshold reached
      while (skill.experience >= skill.nextLevelThreshold) {
        skill.level++;
        skill.nextLevelThreshold = skill.level * 100;
      }
    }
  }

  // Additional calculation methods...
  private calculatePerceivedDifficulty(submissions: any[]): number {
    // Mock calculation based on success rate and attempt patterns
    const successRate = submissions.filter(s => s.status === 'Accepted').length / submissions.length;
    return Math.max(1, Math.min(5, (1 - successRate) * 5));
  }

  private calculateLanguageDistribution(submissions: any[]): { [language: string]: number } {
    const distribution: { [language: string]: number } = {};
    submissions.forEach(s => {
      distribution[s.language] = (distribution[s.language] || 0) + 1;
    });
    return distribution;
  }

  private calculateTimeDistribution(submissions: any[]): { range: string; count: number }[] {
    const ranges = [
      { range: '0-100ms', min: 0, max: 100 },
      { range: '100-500ms', min: 100, max: 500 },
      { range: '500ms-1s', min: 500, max: 1000 },
      { range: '1s-5s', min: 1000, max: 5000 },
      { range: '5s+', min: 5000, max: Infinity }
    ];
    
    return ranges.map(range => ({
      range: range.range,
      count: submissions.filter(s => 
        (s.executionTime || 0) >= range.min && (s.executionTime || 0) < range.max
      ).length
    }));
  }

  private calculateCommonErrors(submissions: any[]): {
    errorType: string;
    frequency: number;
    description: string;
  }[] {
    // Mock error analysis
    return [
      { errorType: 'Runtime Error', frequency: 30, description: 'Array index out of bounds' },
      { errorType: 'Time Limit Exceeded', frequency: 25, description: 'Solution too slow' },
      { errorType: 'Wrong Answer', frequency: 20, description: 'Logic error in solution' },
      { errorType: 'Memory Limit Exceeded', frequency: 15, description: 'Using too much memory' },
      { errorType: 'Compilation Error', frequency: 10, description: 'Syntax or type errors' }
    ];
  }

  private calculateSolutionQuality(submissions: any[]): {
    averageComplexity: number;
    averageMaintainability: number;
    bestPracticesScore: number;
  } {
    // Mock solution quality analysis
    return {
      averageComplexity: Math.floor(Math.random() * 20) + 5,
      averageMaintainability: Math.floor(Math.random() * 40) + 60,
      bestPracticesScore: Math.floor(Math.random() * 30) + 70
    };
  }

  // More helper methods...
  private shouldIncludeInLeaderboard(user: UserAnalytics, period: 'all' | 'month' | 'week'): boolean {
    if (period === 'all') return user.totalSubmissions > 0;
    
    const now = new Date();
    const cutoff = new Date();
    
    if (period === 'month') {
      cutoff.setMonth(now.getMonth() - 1);
    } else if (period === 'week') {
      cutoff.setDate(now.getDate() - 7);
    }
    
    return user.dailyActivity.some(activity => new Date(activity.date) >= cutoff);
  }

  private createLeaderboardEntry(user: UserAnalytics): LeaderboardEntry {
    const favoriteLanguage = Object.entries(user.languagePreferences)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
    
    return {
      userId: user.userId,
      username: `User_${user.userId.slice(0, 8)}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.userId}`,
      rating: user.performanceMetrics.averageRating,
      solvedChallenges: user.successfulSubmissions,
      totalSubmissions: user.totalSubmissions,
      accuracyRate: user.performanceMetrics.accuracyRate,
      averageExecutionTime: user.averageExecutionTime,
      favoriteLanguage,
      rank: 0, // Will be set later
      rankChange: 0, // Will be calculated
      badges: this.calculateUserBadges(user)
    };
  }

  private calculateUserBadges(user: UserAnalytics): string[] {
    const badges = [];
    
    if (user.successfulSubmissions >= 100) badges.push('Centurion');
    if (user.streakData.longestStreak >= 30) badges.push('Streak Master');
    if (user.performanceMetrics.accuracyRate >= 90) badges.push('Precision Expert');
    if (Object.keys(user.languagePreferences).length >= 5) badges.push('Polyglot');
    
    return badges;
  }

  private calculateRankChange(userId: string, currentRank: number): number {
    // Mock rank change calculation
    return Math.floor(Math.random() * 10) - 5;
  }

  private calculateTrendMetrics(startDate: Date, endDate: Date, period: string): any[] {
    // Mock trend metrics
    return [
      {
        name: 'User Activity',
        values: Array.from({ length: 10 }, () => Math.floor(Math.random() * 1000)),
        dates: Array.from({ length: 10 }, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        trend: 'up' as const,
        changePercentage: Math.floor(Math.random() * 20) + 5
      },
      {
        name: 'Success Rate',
        values: Array.from({ length: 10 }, () => Math.floor(Math.random() * 40) + 60),
        dates: Array.from({ length: 10 }, (_, i) => new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
        trend: 'stable' as const,
        changePercentage: Math.floor(Math.random() * 10) - 5
      }
    ];
  }

  private generatePredictions(metrics: any[]): any[] {
    return [
      {
        metric: 'User Growth',
        predictedValue: Math.floor(Math.random() * 1000) + 500,
        confidence: Math.floor(Math.random() * 20) + 80,
        timeframe: 'next 30 days'
      }
    ];
  }

  private identifyStrengths(analytics: UserAnalytics): string[] {
    const strengths = [];
    
    if (analytics.performanceMetrics.accuracyRate > 80) {
      strengths.push('High accuracy rate');
    }
    
    if (analytics.averageExecutionTime < 200) {
      strengths.push('Fast execution times');
    }
    
    if (Object.keys(analytics.languagePreferences).length >= 3) {
      strengths.push('Multi-language proficiency');
    }
    
    return strengths;
  }

  private identifyWeaknesses(analytics: UserAnalytics): string[] {
    const weaknesses = [];
    
    if (analytics.performanceMetrics.accuracyRate < 60) {
      weaknesses.push('Low accuracy rate - consider more testing');
    }
    
    if (analytics.averageExecutionTime > 1000) {
      weaknesses.push('Slow execution times - optimize algorithms');
    }
    
    return weaknesses;
  }

  private generateRecommendations(analytics: UserAnalytics, strengths: string[], weaknesses: string[]): string[] {
    const recommendations = [];
    
    if (weaknesses.length > strengths.length) {
      recommendations.push('Focus on understanding problem requirements better');
      recommendations.push('Practice with easier challenges to build confidence');
    }
    
    if (analytics.streakData.currentStreak === 0) {
      recommendations.push('Start a daily coding streak');
    }
    
    return recommendations;
  }

  private suggestChallenges(analytics: UserAnalytics): string[] {
    // Mock challenge suggestions based on user analytics
    return [
      'Two Sum (Easy)',
      'Binary Tree Traversal (Medium)',
      'Dynamic Programming Intro (Medium)',
      'Graph Algorithms (Hard)'
    ];
  }

  private generateLearningPath(analytics: UserAnalytics): string[] {
    // Mock learning path generation
    return [
      '1. Master basic data structures',
      '2. Learn sorting algorithms',
      '3. Practice tree traversals',
      '4. Study dynamic programming',
      '5. Explore graph algorithms'
    ];
  }

  private analyzeDifficulty(analytics: ChallengeAnalytics): {
    perceivedDifficulty: number;
    actualDifficulty: number;
    difficultyGap: number;
  } {
    const perceivedDifficulty = analytics.difficultyRating;
    const actualDifficulty = 5 - (analytics.successRate / 20); // Mock calculation
    
    return {
      perceivedDifficulty,
      actualDifficulty,
      difficultyGap: Math.abs(perceivedDifficulty - actualDifficulty)
    };
  }

  private generateChallengeImprovements(analytics: ChallengeAnalytics): string[] {
    const improvements = [];
    
    if (analytics.successRate < 30) {
      improvements.push('Consider adding more examples');
      improvements.push('Clarify problem statement');
    }
    
    if (analytics.averageExecutionTime > 5000) {
      improvements.push('Optimize test cases for better performance');
    }
    
    return improvements;
  }

  private findSimilarChallenges(challengeId: string): string[] {
    // Mock similar challenges
    return [
      'Challenge A (Similar difficulty)',
      'Challenge B (Same topic)',
      'Challenge C (Same algorithm)'
    ];
  }

  private loadAnalytics(): void {
    try {
      const stored = localStorage.getItem('codebattle_analytics');
      if (stored) {
        const data = JSON.parse(stored);
        // Load user analytics
        if (data.users) {
          this.analytics.users = new Map(Object.entries(data.users));
        }
        // Load challenge analytics
        if (data.challenges) {
          this.analytics.challenges = new Map(Object.entries(data.challenges));
        }
        // Load system analytics
        if (data.system) {
          this.analytics.system = { ...this.analytics.system, ...data.system };
        }
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }

  private saveAnalytics(): void {
    try {
      const data = {
        users: Object.fromEntries(this.analytics.users),
        challenges: Object.fromEntries(this.analytics.challenges),
        system: this.analytics.system
      };
      localStorage.setItem('codebattle_analytics', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }
}

export const analyticsService = new AnalyticsService();