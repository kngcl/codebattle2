import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { SystemAnalytics } from '../../../services/analyticsService';
import { 
  Activity, Cpu, MemoryStick, Wifi, Users, Globe, 
  Server, Database, Clock, Zap, AlertCircle, CheckCircle,
  TrendingUp, BarChart3, Gauge, HardDrive, Network
} from 'lucide-react';

interface SystemMetricsPanelProps {
  analytics: SystemAnalytics;
  timeRange: string;
}

const SystemMetricsPanel: React.FC<SystemMetricsPanelProps> = ({ analytics, timeRange }) => {
  const { actualTheme } = useTheme();
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    cpuUsage: 0,
    memoryUsage: 0,
    activeConnections: 0,
    responseTime: 0
  });
  const isDark = actualTheme === 'dark';

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeMetrics({
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        activeConnections: Math.floor(Math.random() * 1000) + 100,
        responseTime: Math.random() * 200 + 50
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getHealthStatus = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'text-green-400', bg: 'bg-green-500' };
    if (value <= thresholds.warning) return { status: 'warning', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { status: 'critical', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime);
    const hours = Math.floor((uptime - days) * 24);
    return `${days}d ${hours}h`;
  };

  const getLanguageColor = (index: number) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500', 
      'from-yellow-500 to-orange-500',
      'from-purple-500 to-pink-500',
      'from-red-500 to-rose-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Total Users</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">+12% this month</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{analytics.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Active Now</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Online users</span>
          </div>
        </div>

        {/* Total Challenges */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{analytics.totalChallenges}</p>
              <p className="text-sm text-gray-400">Challenges</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Problems available
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{analytics.performanceMetrics.uptime}%</p>
              <p className="text-sm text-gray-400">Uptime</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Excellent</span>
          </div>
        </div>
      </div>

      {/* Real-time System Metrics */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Real-time System Health
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CPU Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-gray-300">CPU Usage</span>
              </div>
              <span className={`text-lg font-bold ${getHealthStatus(realTimeMetrics.cpuUsage, { good: 50, warning: 80 }).color}`}>
                {Math.round(realTimeMetrics.cpuUsage)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getHealthStatus(realTimeMetrics.cpuUsage, { good: 50, warning: 80 }).bg}`}
                style={{ width: `${realTimeMetrics.cpuUsage}%` }}
              />
            </div>
          </div>

          {/* Memory Usage */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MemoryStick className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-gray-300">Memory</span>
              </div>
              <span className={`text-lg font-bold ${getHealthStatus(realTimeMetrics.memoryUsage, { good: 60, warning: 85 }).color}`}>
                {Math.round(realTimeMetrics.memoryUsage)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getHealthStatus(realTimeMetrics.memoryUsage, { good: 60, warning: 85 }).bg}`}
                style={{ width: `${realTimeMetrics.memoryUsage}%` }}
              />
            </div>
          </div>

          {/* Active Connections */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-gray-300">Connections</span>
              </div>
              <span className="text-lg font-bold text-white">
                {realTimeMetrics.activeConnections}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((realTimeMetrics.activeConnections / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Response Time */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-gray-300">Response Time</span>
              </div>
              <span className={`text-lg font-bold ${getHealthStatus(realTimeMetrics.responseTime, { good: 100, warning: 200 }).color}`}>
                {Math.round(realTimeMetrics.responseTime)}ms
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getHealthStatus(realTimeMetrics.responseTime, { good: 100, warning: 200 }).bg}`}
                style={{ width: `${Math.min((realTimeMetrics.responseTime / 300) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Load Chart */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            System Load (Last 24 Hours)
          </h3>
        </div>

        <div className="h-64 border border-gray-700 rounded-lg p-4 bg-gray-800/30">
          <div className="h-full flex items-end gap-1">
            {analytics.systemLoad.slice(-24).map((load, idx) => {
              const maxCpu = Math.max(...analytics.systemLoad.slice(-24).map(l => l.cpuUsage));
              const height = (load.cpuUsage / maxCpu) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-500 hover:to-blue-300"
                    style={{ height: `${height || 10}%` }}
                    title={`${new Date(load.timestamp).toLocaleTimeString()}: ${Math.round(load.cpuUsage)}%`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Popular Languages and Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Languages */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Popular Languages
            </h3>
          </div>

          <div className="space-y-4">
            {analytics.popularLanguages.map((lang, index) => (
              <div key={lang.language} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white capitalize">{lang.language}</span>
                  <span className="text-gray-400">{lang.usage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getLanguageColor(index)} rounded-full transition-all`}
                    style={{ width: `${lang.usage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              Geographic Distribution
            </h3>
          </div>

          <div className="space-y-3">
            {analytics.geographicDistribution.slice(0, 8).map((geo, index) => (
              <div key={geo.country} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getLanguageColor(index).replace('from-', 'bg-').replace(' to-cyan-500', '').replace(' to-emerald-500', '').replace(' to-orange-500', '').replace(' to-pink-500', '').replace(' to-rose-500', '').replace(' to-purple-500', '')}`} />
                  <span className="text-white font-medium">{geo.country}</span>
                  <span className="text-xs text-gray-400 px-2 py-1 bg-gray-700 rounded">
                    {geo.continent}
                  </span>
                </div>
                <span className="text-gray-300">{geo.userCount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics Summary */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Gauge className="w-5 h-5 text-yellow-400" />
            Performance Summary
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {Math.round(analytics.performanceMetrics.averageResponseTime)}ms
            </p>
            <p className="text-sm text-gray-400">Avg Response Time</p>
            <div className={`text-xs mt-1 ${
              analytics.performanceMetrics.averageResponseTime < 100 ? 'text-green-400' : 
              analytics.performanceMetrics.averageResponseTime < 300 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {analytics.performanceMetrics.averageResponseTime < 100 ? 'Excellent' : 
               analytics.performanceMetrics.averageResponseTime < 300 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{analytics.performanceMetrics.uptime}%</p>
            <p className="text-sm text-gray-400">Uptime</p>
            <div className="text-xs text-green-400 mt-1">
              {formatUptime(analytics.performanceMetrics.uptime / 100 * 365)} this year
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{analytics.performanceMetrics.errorRate}%</p>
            <p className="text-sm text-gray-400">Error Rate</p>
            <div className={`text-xs mt-1 ${
              analytics.performanceMetrics.errorRate < 1 ? 'text-green-400' : 
              analytics.performanceMetrics.errorRate < 5 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {analytics.performanceMetrics.errorRate < 1 ? 'Excellent' : 
               analytics.performanceMetrics.errorRate < 5 ? 'Acceptable' : 'High'}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {analytics.performanceMetrics.throughput.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400">Requests/min</p>
            <div className="text-xs text-purple-400 mt-1">
              Current throughput
            </div>
          </div>
        </div>
      </div>

      {/* User Growth Trend */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            User Growth Trend
          </h3>
        </div>

        <div className="h-48 border border-gray-700 rounded-lg p-4 bg-gray-800/30">
          <div className="h-full flex items-end gap-2">
            {analytics.userGrowth.slice(-12).map((growth, idx) => {
              const maxUsers = Math.max(...analytics.userGrowth.slice(-12).map(g => g.totalUsers));
              const height = (growth.totalUsers / maxUsers) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-500 hover:to-green-300"
                    style={{ height: `${height || 10}%` }}
                    title={`${growth.date}: ${growth.totalUsers} total users (+${growth.newUsers} new)`}
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(growth.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-white">
              {analytics.userGrowth[analytics.userGrowth.length - 1]?.newUsers || 0}
            </p>
            <p className="text-sm text-gray-400">New Users (Last Month)</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">
              {Math.round(analytics.userGrowth.reduce((sum, g) => sum + g.newUsers, 0) / analytics.userGrowth.length)}
            </p>
            <p className="text-sm text-gray-400">Avg Monthly Growth</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-400">
              +{Math.round(((analytics.userGrowth[analytics.userGrowth.length - 1]?.newUsers || 0) / (analytics.userGrowth[analytics.userGrowth.length - 2]?.newUsers || 1) - 1) * 100)}%
            </p>
            <p className="text-sm text-gray-400">Growth Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMetricsPanel;