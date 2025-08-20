import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { 
  Brain, Lightbulb, TrendingUp, Target, Users, Code, 
  BookOpen, Award, AlertCircle, CheckCircle, Info,
  ChevronRight, Star, Zap, Trophy, Clock, BarChart3
} from 'lucide-react';

interface InsightsPanelProps {
  userInsights?: any;
  challengeInsights?: any;
  systemInsights?: any;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  userInsights, 
  challengeInsights, 
  systemInsights 
}) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  // Mock insights data for demonstration
  const mockInsights = {
    userInsights: userInsights || {
      strengths: ['Fast execution times', 'High accuracy in easy problems', 'Consistent daily practice'],
      weaknesses: ['Struggles with dynamic programming', 'Slow on complex algorithms'],
      recommendations: ['Practice more tree algorithms', 'Focus on time complexity optimization', 'Try harder difficulty levels'],
      nextChallenges: ['Binary Tree Maximum Path Sum', 'Longest Increasing Subsequence', 'Graph Coloring'],
      learningPath: [
        'Master basic data structures',
        'Learn advanced sorting algorithms',
        'Practice dynamic programming patterns',
        'Study graph algorithms',
        'Optimize for competitive programming'
      ]
    },
    challengeInsights: challengeInsights || {
      difficultyAnalysis: {
        perceivedDifficulty: 3.2,
        actualDifficulty: 2.8,
        difficultyGap: 0.4
      },
      improvementSuggestions: [
        'Add more examples to clarify the problem statement',
        'Include edge case explanations',
        'Provide hints for common algorithmic approaches'
      ],
      similarChallenges: [
        'Two Pointer Technique Problems',
        'Binary Search Variations',
        'Dynamic Programming Basics'
      ]
    },
    systemInsights: systemInsights || {
      performanceTrends: [
        { metric: 'User Engagement', trend: 'up', value: '+15%', description: 'More users spending time on platform' },
        { metric: 'Problem Completion Rate', trend: 'up', value: '+8%', description: 'Users solving more challenges' },
        { metric: 'Average Session Time', trend: 'stable', value: '0%', description: 'Consistent user engagement' }
      ],
      userBehaviorInsights: [
        'Peak activity hours: 6-9 PM local time',
        'Most popular difficulty: Medium (45% of attempts)',
        'Preferred languages: Python (35%), JavaScript (28%), Java (15%)',
        'Success rate higher on weekends (+12%)'
      ],
      recommendedActions: [
        'Increase medium-difficulty challenge inventory',
        'Add more Python and JavaScript examples',
        'Schedule maintenance during low-traffic hours (3-5 AM)',
        'Consider weekend coding contests'
      ]
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return CheckCircle;
      case 'weakness': return AlertCircle;
      case 'recommendation': return Lightbulb;
      case 'trend': return TrendingUp;
      case 'challenge': return Target;
      default: return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return 'text-green-400';
      case 'weakness': return 'text-yellow-400';
      case 'recommendation': return 'text-blue-400';
      case 'trend': return 'text-purple-400';
      case 'challenge': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 transform rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Insights Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm p-6 rounded-xl border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI-Powered Insights</h2>
              <p className="text-gray-400">Personalized recommendations and analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm text-purple-400">Live Analysis</span>
          </div>
        </div>
      </div>

      {/* Personal Insights */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Personal Development Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="space-y-4">
            <h4 className="font-medium text-green-400 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Your Strengths
            </h4>
            <div className="space-y-3">
              {mockInsights.userInsights.strengths.map((strength: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg border border-green-800">
                  <Star className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-4">
            <h4 className="font-medium text-yellow-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Growth Opportunities
            </h4>
            <div className="space-y-3">
              {mockInsights.userInsights.weaknesses.map((weakness: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                  <Target className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{weakness}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="mt-6">
          <h4 className="font-medium text-blue-400 mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Personalized Recommendations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockInsights.userInsights.recommendations.map((recommendation: string, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-800">
                <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div className="mt-6">
          <h4 className="font-medium text-purple-400 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Suggested Learning Path
          </h4>
          <div className="relative">
            {mockInsights.userInsights.learningPath.map((step: string, index: number) => (
              <div key={index} className="flex items-start gap-4 pb-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 
                      ? 'bg-purple-600 text-white' 
                      : index === 1
                      ? 'bg-purple-800 text-purple-200'
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < mockInsights.userInsights.learningPath.length - 1 && (
                    <div className="w-0.5 h-6 bg-gray-700 mt-2" />
                  )}
                </div>
                <div className={`flex-1 ${index === 0 ? 'text-white' : 'text-gray-400'}`}>
                  <p className="text-sm">{step}</p>
                  {index === 0 && (
                    <span className="text-xs text-purple-400 mt-1 inline-block">Current focus</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Insights */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-400" />
            Challenge Analysis
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Difficulty Analysis */}
          <div className="space-y-4">
            <h4 className="font-medium text-orange-400 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Difficulty Analysis
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Perceived Difficulty</span>
                  <span className="text-white font-bold">{mockInsights.challengeInsights.difficultyAnalysis.perceivedDifficulty}/5</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                    style={{ width: `${(mockInsights.challengeInsights.difficultyAnalysis.perceivedDifficulty / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300 text-sm">Actual Difficulty</span>
                  <span className="text-white font-bold">{mockInsights.challengeInsights.difficultyAnalysis.actualDifficulty}/5</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                    style={{ width: `${(mockInsights.challengeInsights.difficultyAnalysis.actualDifficulty / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-info-900/20 rounded-lg border border-info-800">
                <div className="flex items-center gap-2 text-info-400">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">
                    Difficulty gap: {mockInsights.challengeInsights.difficultyAnalysis.difficultyGap.toFixed(1)} points
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="space-y-4">
            <h4 className="font-medium text-blue-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Challenge Improvements
            </h4>
            <div className="space-y-3">
              {mockInsights.challengeInsights.improvementSuggestions.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-900/20 rounded-lg border border-blue-800">
                  <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{suggestion}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-gray-300 mb-2">Similar Challenges</h5>
              <div className="space-y-2">
                {mockInsights.challengeInsights.similarChallenges.map((challenge: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded border border-gray-700">
                    <Code className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300 text-sm">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Insights */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-400" />
            Platform Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Trends */}
          <div className="space-y-4">
            <h4 className="font-medium text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Performance Trends
            </h4>
            <div className="space-y-3">
              {mockInsights.systemInsights.performanceTrends.map((trend: any, index: number) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{trend.metric}</span>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(trend.trend)}
                      <span className={`font-bold ${
                        trend.trend === 'up' ? 'text-green-400' : 
                        trend.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {trend.value}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{trend.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Behavior Insights */}
          <div className="space-y-4">
            <h4 className="font-medium text-purple-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              User Behavior Insights
            </h4>
            <div className="space-y-3">
              {mockInsights.systemInsights.userBehaviorInsights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-purple-900/20 rounded-lg border border-purple-800">
                  <Info className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="mt-6">
          <h4 className="font-medium text-yellow-400 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Recommended Actions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mockInsights.systemInsights.recommendedActions.map((action: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800">
                <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg border border-blue-500 transition-all group">
            <BookOpen className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-white text-sm">Start Learning Path</p>
          </button>

          <button className="p-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg border border-green-500 transition-all group">
            <Target className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-white text-sm">Try Recommended</p>
          </button>

          <button className="p-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg border border-purple-500 transition-all group">
            <Trophy className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-white text-sm">View Achievements</p>
          </button>

          <button className="p-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 rounded-lg border border-orange-500 transition-all group">
            <Users className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
            <p className="font-medium text-white text-sm">Join Community</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;