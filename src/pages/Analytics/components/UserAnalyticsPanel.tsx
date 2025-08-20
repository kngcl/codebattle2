import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { UserAnalytics, analyticsService } from '../../../services/analyticsService';
import { 
  TrendingUp, Target, Code, Zap, Brain, Calendar, 
  Trophy, Star, BarChart3, Clock, CheckCircle,
  ChevronRight, AlertCircle, BookOpen, Award
} from 'lucide-react';

interface UserAnalyticsPanelProps {
  analytics: UserAnalytics;
  timeRange: string;
}

const UserAnalyticsPanel: React.FC<UserAnalyticsPanelProps> = ({ analytics, timeRange }) => {
  const { actualTheme } = useTheme();
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const isDark = actualTheme === 'dark';

  const loadInsights = async () => {
    setLoadingInsights(true);
    try {
      const userInsights = await analyticsService.getUserInsights(analytics.userId);
      setInsights(userInsights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  React.useEffect(() => {
    if (!insights) {
      loadInsights();
    }
  }, [analytics.userId]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-400';
    if (level >= 7) return 'text-blue-400';
    if (level >= 4) return 'text-green-400';
    if (level >= 2) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Performance Metrics
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-gray-300">Accuracy Rate</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">{Math.round(analytics.performanceMetrics.accuracyRate)}%</span>
                  <span className="text-sm text-green-400">+3%</span>
                </div>
                <div className="mt-2 w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    style={{ width: `${analytics.performanceMetrics.accuracyRate}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Avg. Execution Time</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">{Math.round(analytics.averageExecutionTime)}ms</span>
                  <span className="text-sm text-green-400">-15ms</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {analytics.averageExecutionTime < 100 ? 'Excellent' : 
                   analytics.averageExecutionTime < 300 ? 'Good' : 
                   analytics.averageExecutionTime < 1000 ? 'Average' : 'Needs Improvement'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium text-gray-300">Average Rating</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">{Math.round(analytics.performanceMetrics.averageRating)}</span>
                  <span className="text-sm text-green-400">+12</span>
                </div>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-4 h-4 ${
                        star <= Math.round(analytics.performanceMetrics.averageRating / 20) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-600'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Current Streak</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">{analytics.streakData.currentStreak}</span>
                  <span className="text-sm text-gray-400">days</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Best: {analytics.streakData.longestStreak} days
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Rating Trend */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Rating Trend
            </h3>
          </div>
          <div className="space-y-3">
            {analytics.performanceMetrics.ratingTrend.slice(-10).map((rating, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">#{analytics.performanceMetrics.ratingTrend.length - 10 + index + 1}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: `${(rating / 100) * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-sm w-8 text-right">{rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Progression */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-400" />
            Skill Progression
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analytics.skillProgression).map(([category, skill]) => (
            <div key={category} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-white">{category}</h4>
                <span className={`text-lg font-bold ${getSkillLevelColor(skill.level)}`}>
                  Lv.{skill.level}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Experience</span>
                  <span className="text-gray-300">{skill.experience}/{skill.nextLevelThreshold}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                    style={{ width: `${(skill.experience / skill.nextLevelThreshold) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {skill.nextLevelThreshold - skill.experience} XP to next level
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Difficulty Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Difficulty Breakdown
            </h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(analytics.difficultyBreakdown).map(([difficulty, data]) => {
              const successRate = data.attempted > 0 ? (data.solved / data.attempted) * 100 : 0;
              
              return (
                <div key={difficulty} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium capitalize ${getDifficultyColor(difficulty)}`}>
                        {difficulty}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({data.solved}/{data.attempted})
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {Math.round(successRate)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        difficulty.toLowerCase() === 'easy' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        difficulty.toLowerCase() === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-400" />
              Recent Activity
            </h3>
          </div>
          
          <div className="space-y-3">
            {analytics.dailyActivity.slice(-14).map((activity, index) => (
              <div key={activity.date} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.submissions > 0 ? 'bg-green-400' : 'bg-gray-600'
                  }`} />
                  <span className="text-gray-300 text-sm">
                    {new Date(activity.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm">{activity.submissions}</span>
                  <span className="text-gray-400 text-xs">submissions</span>
                  {activity.solutions > 0 && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-green-400 text-sm">{activity.solutions}</span>
                      <span className="text-gray-400 text-xs">solved</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths and Weaknesses */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Insights
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </h4>
                <ul className="space-y-1">
                  {insights.strengths.map((strength: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-green-400" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              {insights.weaknesses.length > 0 && (
                <div>
                  <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Areas for Improvement
                  </h4>
                  <ul className="space-y-1">
                    {insights.weaknesses.map((weakness: string, index: number) => (
                      <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-yellow-400" />
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Recommendations
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Suggested Actions
                </h4>
                <ul className="space-y-2">
                  {insights.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Next Challenges
                </h4>
                <ul className="space-y-1">
                  {insights.nextChallenges.map((challenge: string, index: number) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-purple-400" />
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAnalyticsPanel;