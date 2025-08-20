import React, { useState, memo } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Activity, Calendar, Clock,
  Code, Trophy, Target, Users, ChevronUp, ChevronDown, Filter,
  Download, Share2, Zap, Award, Brain, Timer, ArrowUp, ArrowDown,
  GitBranch, Hash, Percent, Star, Flame, Shield, AlertCircle,
  CheckCircle2, XCircle, RefreshCw, Eye, GitCommit, GitPullRequest
} from 'lucide-react';

const StatCard = memo(({ stat, index }: any) => {
  const getTrendIcon = () => {
    if (stat.trend > 0) return <ArrowUp className="w-4 h-4 text-green-400" />;
    if (stat.trend < 0) return <ArrowDown className="w-4 h-4 text-red-400" />;
    return <ArrowUp className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = () => {
    if (stat.trend > 0) return 'text-green-400';
    if (stat.trend < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div
      className="group relative animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
            <stat.icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">{Math.abs(stat.trend)}%</span>
          </div>
        </div>
        
        <div className="mb-2">
          <p className="text-gray-400 text-sm">{stat.label}</p>
          <p className="text-3xl font-bold text-white">{stat.value}</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{stat.period}</span>
          {stat.comparison && (
            <>
              <span>•</span>
              <span>{stat.comparison}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

const PerformanceChart = memo(({ data, title, type }: any) => {
  const maxValue = Math.max(...data.map((d: any) => d.value));
  
  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300">
            <Download className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300">
            <Share2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item: any, index: number) => (
          <div key={index} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                {item.label}
              </span>
              <span className="text-sm font-bold text-white">{item.value}</span>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 group-hover:brightness-110`}
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const ActivityHeatmap = memo(() => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeks = 12;
  
  const generateHeatmapData = () => {
    const data = [];
    for (let week = 0; week < weeks; week++) {
      for (let day = 0; day < 7; day++) {
        data.push({
          week,
          day,
          value: Math.floor(Math.random() * 5),
          date: `Week ${week + 1}, ${days[day]}`
        });
      }
    }
    return data;
  };

  const heatmapData = generateHeatmapData();
  
  const getColorByValue = (value: number) => {
    const colors = [
      'bg-white/5',
      'bg-purple-900/40',
      'bg-purple-700/50',
      'bg-purple-500/60',
      'bg-purple-400/70'
    ];
    return colors[value] || colors[0];
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300">
      <h3 className="text-lg font-bold text-white mb-6">Activity Heatmap</h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex gap-1 mb-2">
            <div className="w-10"></div>
            {Array.from({ length: weeks }, (_, i) => (
              <div key={i} className="w-4 text-xs text-gray-500 text-center">
                {i % 2 === 0 ? i + 1 : ''}
              </div>
            ))}
          </div>
          
          {days.map((day, dayIndex) => (
            <div key={day} className="flex gap-1 mb-1">
              <div className="w-10 text-xs text-gray-500 flex items-center">
                {day[0]}
              </div>
              {Array.from({ length: weeks }, (_, weekIndex) => {
                const dataPoint = heatmapData.find(d => d.week === weekIndex && d.day === dayIndex);
                return (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-4 h-4 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer ${getColorByValue(dataPoint?.value || 0)}`}
                    title={`${dataPoint?.date}: ${dataPoint?.value} contributions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(value => (
            <div key={value} className={`w-3 h-3 rounded-sm ${getColorByValue(value)}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
});

const OptimizedAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Mock data
  const stats = [
    {
      label: 'Problems Solved',
      value: '342',
      trend: 12.5,
      period: 'This Week',
      comparison: 'vs last week',
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Success Rate',
      value: '78.5%',
      trend: 5.2,
      period: 'This Week',
      comparison: 'vs last week',
      icon: Percent,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'Current Streak',
      value: '15 days',
      trend: 0,
      period: 'Active',
      comparison: 'Best: 45 days',
      icon: Flame,
      color: 'from-orange-500 to-red-500'
    },
    {
      label: 'Global Rank',
      value: '#1,234',
      trend: 8.3,
      period: 'Current',
      comparison: 'Top 5%',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const languageStats = [
    { label: 'JavaScript', value: 145, color: 'from-yellow-500 to-yellow-600' },
    { label: 'Python', value: 98, color: 'from-blue-500 to-blue-600' },
    { label: 'TypeScript', value: 76, color: 'from-blue-600 to-indigo-600' },
    { label: 'Java', value: 54, color: 'from-red-500 to-orange-600' },
    { label: 'C++', value: 32, color: 'from-purple-500 to-pink-600' }
  ];

  const difficultyStats = [
    { label: 'Easy', value: 156, color: 'from-green-500 to-emerald-500' },
    { label: 'Medium', value: 124, color: 'from-yellow-500 to-orange-500' },
    { label: 'Hard', value: 45, color: 'from-red-500 to-pink-500' },
    { label: 'Expert', value: 17, color: 'from-purple-500 to-indigo-500' }
  ];

  const recentActivity = [
    { type: 'solved', title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', time: '2 hours ago', status: 'success' },
    { type: 'attempted', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', time: '5 hours ago', status: 'failed' },
    { type: 'solved', title: 'Valid Parentheses', difficulty: 'Easy', time: '1 day ago', status: 'success' },
    { type: 'tournament', title: 'Weekly Challenge #42', rank: 3, time: '2 days ago', status: 'completed' },
    { type: 'achievement', title: 'Speed Demon', description: 'Solved 10 problems in under 5 minutes each', time: '3 days ago' }
  ];

  const timeRanges = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="min-h-screen bg-black pt-8">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-green-600/20 to-cyan-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-xl border border-purple-500/20 rounded-full px-6 py-3 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Performance Analytics</span>
          </div>
          
          <h1 className="text-5xl font-black text-white mb-4">
            Track Your <span className="text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text animate-gradient-x bg-300%">Progress</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Detailed insights into your coding journey and performance metrics
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-1">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart 
            data={languageStats} 
            title="Languages Used" 
            type="language"
          />
          <PerformanceChart 
            data={difficultyStats} 
            title="Problems by Difficulty" 
            type="difficulty"
          />
        </div>

        {/* Activity Heatmap */}
        <div className="mb-8">
          <ActivityHeatmap />
        </div>

        {/* Recent Activity */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-12">
          <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  {/* Activity Icon */}
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'solved' ? 'bg-green-500/20' :
                    activity.type === 'attempted' ? 'bg-yellow-500/20' :
                    activity.type === 'tournament' ? 'bg-purple-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    {activity.type === 'solved' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> :
                     activity.type === 'attempted' ? <XCircle className="w-5 h-5 text-yellow-400" /> :
                     activity.type === 'tournament' ? <Trophy className="w-5 h-5 text-purple-400" /> :
                     <Award className="w-5 h-5 text-blue-400" />}
                  </div>
                  
                  {/* Activity Details */}
                  <div>
                    <p className="font-medium text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      {activity.difficulty && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          activity.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                          activity.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          activity.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {activity.difficulty}
                        </span>
                      )}
                      {activity.rank && (
                        <span>Rank #{activity.rank}</span>
                      )}
                      {activity.description && (
                        <span>{activity.description}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium rounded-xl transition-all duration-300">
            View All Activity
          </button>
        </div>

        {/* Export Section */}
        <div className="text-center mb-12">
          <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 inline-flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Analytics Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptimizedAnalytics;