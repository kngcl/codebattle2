import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { TrendAnalysis } from '../../../services/analyticsService';
import { 
  TrendingUp, TrendingDown, Minus, Activity, BarChart3,
  Calendar, Users, Code, Target, Clock, Zap, Brain,
  AlertCircle, CheckCircle, Info, ArrowUp, ArrowDown
} from 'lucide-react';

interface TrendsPanelProps {
  trendAnalysis: TrendAnalysis;
  timeRange: string;
}

const TrendsPanel: React.FC<TrendsPanelProps> = ({ trendAnalysis, timeRange }) => {
  const { actualTheme } = useTheme();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const isDark = actualTheme === 'dark';

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getMetricIcon = (metricName: string) => {
    const name = metricName.toLowerCase();
    if (name.includes('activity') || name.includes('submission')) return Activity;
    if (name.includes('user')) return Users;
    if (name.includes('success') || name.includes('accuracy')) return Target;
    if (name.includes('speed') || name.includes('time')) return Clock;
    if (name.includes('rating') || name.includes('performance')) return Zap;
    if (name.includes('skill') || name.includes('learning')) return Brain;
    return BarChart3;
  };

  const formatPeriod = (period: string) => {
    switch (period) {
      case 'day': return 'Daily';
      case 'week': return 'Weekly';
      case 'month': return 'Monthly';
      case 'year': return 'Yearly';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Period Overview */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            {formatPeriod(trendAnalysis.period)} Trends
          </h3>
          <div className="text-sm text-gray-400">
            Analyzing {trendAnalysis.metrics.length} metrics
          </div>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendAnalysis.metrics.map((metric, index) => {
            const IconComponent = getMetricIcon(metric.name);
            const latestValue = metric.values[metric.values.length - 1];
            const previousValue = metric.values[metric.values.length - 2];
            const absoluteChange = latestValue - previousValue;

            return (
              <div
                key={index}
                onClick={() => setSelectedMetric(selectedMetric === metric.name ? null : metric.name)}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-purple-500/50 ${
                  selectedMetric === metric.name
                    ? 'bg-purple-900/20 border-purple-500/50'
                    : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-purple-400" />
                    <span className="font-medium text-white text-sm">{metric.name}</span>
                  </div>
                  {getTrendIcon(metric.trend)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">{latestValue}</span>
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage}%
                    </span>
                  </div>

                  {/* Mini Chart */}
                  <div className="h-8 flex items-end gap-1">
                    {metric.values.slice(-8).map((value, idx) => {
                      const maxValue = Math.max(...metric.values.slice(-8));
                      const height = (value / maxValue) * 100;
                      
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t ${
                            idx === metric.values.slice(-8).length - 1
                              ? 'bg-purple-500'
                              : 'bg-gray-600'
                          } transition-all`}
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      {metric.trend === 'up' ? 'Increasing' : 
                       metric.trend === 'down' ? 'Decreasing' : 'Stable'}
                    </span>
                    <span>
                      {absoluteChange > 0 ? '+' : ''}{absoluteChange} from last
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Metric View */}
      {selectedMetric && (
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              {selectedMetric} - Detailed View
            </h3>
            <button
              onClick={() => setSelectedMetric(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {(() => {
            const metric = trendAnalysis.metrics.find(m => m.name === selectedMetric);
            if (!metric) return null;

            return (
              <div className="space-y-6">
                {/* Large Chart Visualization */}
                <div className="h-64 border border-gray-700 rounded-lg p-4 bg-gray-800/30">
                  <div className="h-full flex items-end gap-2">
                    {metric.values.map((value, idx) => {
                      const maxValue = Math.max(...metric.values);
                      const minValue = Math.min(...metric.values);
                      const height = ((value - minValue) / (maxValue - minValue)) * 100;
                      const date = metric.dates[idx];
                      
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all hover:from-purple-500 hover:to-purple-300"
                            style={{ height: `${height || 10}%` }}
                            title={`${date}: ${value}`}
                          />
                          <div className="text-xs text-gray-400 mt-1 transform -rotate-45 origin-left">
                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metric Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium text-gray-300">Peak Value</span>
                    </div>
                    <p className="text-xl font-bold text-white">{Math.max(...metric.values)}</p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDown className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-gray-300">Low Value</span>
                    </div>
                    <p className="text-xl font-bold text-white">{Math.min(...metric.values)}</p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">Average</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {Math.round(metric.values.reduce((a, b) => a + b, 0) / metric.values.length)}
                    </p>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      {getTrendIcon(metric.trend)}
                      <span className="text-sm font-medium text-gray-300">Trend</span>
                    </div>
                    <p className={`text-xl font-bold ${getTrendColor(metric.trend)}`}>
                      {metric.changePercentage > 0 ? '+' : ''}{metric.changePercentage}%
                    </p>
                  </div>
                </div>

                {/* Data Points Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800/50 border-b border-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Value</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Change</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">% Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {metric.values.map((value, idx) => {
                        const previousValue = metric.values[idx - 1];
                        const change = previousValue ? value - previousValue : 0;
                        const percentChange = previousValue ? ((change / previousValue) * 100) : 0;
                        
                        return (
                          <tr key={idx} className="hover:bg-gray-800/30">
                            <td className="px-4 py-2 text-sm text-gray-300">
                              {new Date(metric.dates[idx]).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-white">{value}</td>
                            <td className={`px-4 py-2 text-sm font-medium ${
                              change > 0 ? 'text-green-400' : 
                              change < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {change > 0 ? '+' : ''}{change || '-'}
                            </td>
                            <td className={`px-4 py-2 text-sm font-medium ${
                              percentChange > 0 ? 'text-green-400' : 
                              percentChange < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {percentChange ? `${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Predictions */}
      {trendAnalysis.predictions.length > 0 && (
        <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-pink-400" />
              Predictive Analysis
            </h3>
            <div className="text-sm text-gray-400">
              AI-powered insights
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendAnalysis.predictions.map((prediction, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-white">{prediction.metric}</span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    prediction.confidence >= 80 
                      ? 'bg-green-900/30 text-green-300' :
                    prediction.confidence >= 60
                      ? 'bg-yellow-900/30 text-yellow-300' :
                      'bg-red-900/30 text-red-300'
                  }`}>
                    {prediction.confidence}% confident
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{prediction.predictedValue}</span>
                    <span className="text-sm text-gray-400">{prediction.timeframe}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    {prediction.confidence >= 80 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : prediction.confidence >= 60 ? (
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Info className="w-4 h-4 text-blue-400" />
                    )}
                    <span className={
                      prediction.confidence >= 80 ? 'text-green-400' :
                      prediction.confidence >= 60 ? 'text-yellow-400' : 'text-blue-400'
                    }>
                      {prediction.confidence >= 80 ? 'High' :
                       prediction.confidence >= 60 ? 'Medium' : 'Low'} confidence
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trend Insights */}
      <div className="bg-gray-900/60 backdrop-blur-sm p-6 rounded-xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            Key Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-400 mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Positive Trends
            </h4>
            <div className="space-y-2">
              {trendAnalysis.metrics
                .filter(m => m.trend === 'up')
                .map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-green-900/20 rounded border border-green-800">
                    <span className="text-white text-sm">{metric.name}</span>
                    <span className="text-green-400 font-medium">+{metric.changePercentage}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Areas for Improvement
            </h4>
            <div className="space-y-2">
              {trendAnalysis.metrics
                .filter(m => m.trend === 'down')
                .map((metric, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-red-900/20 rounded border border-red-800">
                    <span className="text-white text-sm">{metric.name}</span>
                    <span className="text-red-400 font-medium">{metric.changePercentage}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {trendAnalysis.metrics.filter(m => m.trend === 'up').length === 0 && 
         trendAnalysis.metrics.filter(m => m.trend === 'down').length === 0 && (
          <div className="text-center py-8">
            <Minus className="w-12 h-12 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">All metrics are showing stable trends.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsPanel;