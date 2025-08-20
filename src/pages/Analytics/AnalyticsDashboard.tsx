import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  analyticsService, 
  UserAnalytics, 
  SystemAnalytics, 
  LeaderboardEntry,
  TrendAnalysis 
} from '../../services/analyticsService';
import { PageLoader } from '../../components/Loaders';
import { 
  BarChart3, TrendingUp, Users, Award, Clock, Target, 
  Brain, Code, Zap, Trophy, Star, Activity, Eye,
  Calendar, Filter, Download, RefreshCw, Settings,
  ChevronDown, ChevronRight, AlertCircle, CheckCircle
} from 'lucide-react';
import UserAnalyticsPanel from './components/UserAnalyticsPanel';
import SystemMetricsPanel from './components/SystemMetricsPanel';
import LeaderboardPanel from './components/LeaderboardPanel';
import TrendsPanel from './components/TrendsPanel';
import InsightsPanel from './components/InsightsPanel';

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { actualTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'personal' | 'leaderboard' | 'trends' | 'system'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const isDark = actualTheme === 'dark';

  useEffect(() => {
    loadAnalyticsData();
  }, [user?.id, timeRange]);

  const loadAnalyticsData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const [userAnalyticsData, systemData, leaderboardData, trendsData] = await Promise.all([
        analyticsService.getUserAnalytics(user.id),
        Promise.resolve(analyticsService.getSystemAnalytics()),
        analyticsService.getLeaderboard(50, timeRange === 'week' ? 'week' : timeRange === 'month' ? 'month' : 'all'),
        analyticsService.getTrendAnalysis(timeRange === 'week' ? 'week' : 'month')
      ]);

      setUserAnalytics(userAnalyticsData);
      setSystemAnalytics(systemData);
      setLeaderboard(leaderboardData);
      setTrendAnalysis(trendsData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalyticsData();
    setRefreshing(false);
  };

  const exportData = () => {
    if (!userAnalytics) return;
    
    const data = {
      userAnalytics,
      systemAnalytics,
      leaderboard,
      trendAnalysis,
      exportedAt: new Date().toISOString(),
      timeRange
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codebattle-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading && !userAnalytics) {
    return <PageLoader />;
  }

  const overviewStats = userAnalytics ? [
    {
      title: 'Total Submissions',
      value: userAnalytics.totalSubmissions,
      change: '+12%',
      trend: 'up' as const,
      icon: Code,
      color: 'blue'
    },
    {
      title: 'Success Rate',
      value: `${Math.round((userAnalytics.successfulSubmissions / userAnalytics.totalSubmissions) * 100)}%`,
      change: '+5%',
      trend: 'up' as const,
      icon: Target,
      color: 'green'
    },
    {
      title: 'Current Streak',
      value: userAnalytics.streakData.currentStreak,
      change: '+3',
      trend: 'up' as const,
      icon: Zap,
      color: 'yellow'
    },
    {
      title: 'Avg. Execution Time',
      value: `${Math.round(userAnalytics.averageExecutionTime)}ms`,
      change: '-15%',
      trend: 'up' as const,
      icon: Clock,
      color: 'purple'
    }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-gray-900/80 via-black/80 to-gray-900/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
                  <p className="text-gray-400">Comprehensive insights into your coding journey</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>

              {/* Action Buttons */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={exportData}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* View Navigation */}
          <div className="mt-6">
            <nav className="flex gap-1 p-1 bg-gray-800/50 rounded-xl">
              {[
                { key: 'overview', label: 'Overview', icon: Eye },
                { key: 'personal', label: 'Personal', icon: Users },
                { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
                { key: 'trends', label: 'Trends', icon: TrendingUp },
                { key: 'system', label: 'System', icon: Activity }
              ].map((view) => {
                const IconComponent = view.icon;
                return (
                  <button
                    key={view.key}
                    onClick={() => setActiveView(view.key as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeView === view.key
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {view.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => {
                const IconComponent = stat.icon;
                const colorClasses = {
                  blue: 'from-blue-600 to-cyan-600',
                  green: 'from-green-600 to-emerald-600',
                  yellow: 'from-yellow-600 to-orange-600',
                  purple: 'from-purple-600 to-pink-600'
                };

                return (
                  <div key={index} className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-xl opacity-0 group-hover:opacity-10 blur transition-opacity`}></div>
                    <div className="relative bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800 hover:border-gray-700 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-r ${colorClasses[stat.color as keyof typeof colorClasses]} rounded-lg`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm ${
                          stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          <TrendingUp className="w-3 h-3" />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Insights */}
            {userAnalytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Chart Placeholder */}
                <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Daily Activity</h3>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {userAnalytics.dailyActivity.slice(-7).map((activity, index) => (
                      <div key={activity.date} className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                          {new Date(activity.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: `${Math.min((activity.submissions / 10) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-white text-sm w-12 text-right">{activity.submissions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language Distribution */}
                <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Language Usage</h3>
                    <Code className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-3">
                    {Object.entries(userAnalytics.languagePreferences)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([language, count], index) => {
                        const percentage = (count / userAnalytics.totalSubmissions) * 100;
                        const colors = ['from-blue-500 to-cyan-500', 'from-green-500 to-emerald-500', 'from-yellow-500 to-orange-500', 'from-purple-500 to-pink-500', 'from-red-500 to-rose-500'];
                        
                        return (
                          <div key={language} className="flex items-center justify-between">
                            <span className="text-gray-300 capitalize">{language}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${colors[index]} rounded-full`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-white text-sm w-12 text-right">{Math.round(percentage)}%</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Achievements Placeholder */}
            <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Achievements</h3>
                <Award className="w-5 h-5 text-gray-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Problem Solver', description: 'Solved 50 challenges', icon: CheckCircle, color: 'text-green-400' },
                  { title: 'Speed Demon', description: 'Average execution < 100ms', icon: Zap, color: 'text-yellow-400' },
                  { title: 'Streak Master', description: '7-day coding streak', icon: Target, color: 'text-purple-400' }
                ].map((achievement, index) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <IconComponent className={`w-8 h-8 ${achievement.color}`} />
                      <div>
                        <p className="font-medium text-white">{achievement.title}</p>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeView === 'personal' && userAnalytics && (
          <UserAnalyticsPanel 
            analytics={userAnalytics} 
            timeRange={timeRange}
          />
        )}

        {activeView === 'leaderboard' && (
          <LeaderboardPanel 
            leaderboard={leaderboard}
            currentUserId={user?.id}
            timeRange={timeRange}
          />
        )}

        {activeView === 'trends' && trendAnalysis && (
          <TrendsPanel 
            trendAnalysis={trendAnalysis}
            timeRange={timeRange}
          />
        )}

        {activeView === 'system' && systemAnalytics && (
          <SystemMetricsPanel 
            analytics={systemAnalytics}
            timeRange={timeRange}
          />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;