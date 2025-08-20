import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ElementType;
  color?: string;
  prefix?: string;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = '#8b5cf6',
  prefix = '',
  suffix = '',
  size = 'md'
}) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="w-4 h-4" />;
    return change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return isDark ? 'text-gray-500' : 'text-gray-400';
    return change > 0 ? 'text-green-500' : 'text-red-500';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-3',
          title: 'text-xs',
          value: 'text-lg',
          icon: 'w-4 h-4',
          change: 'text-xs'
        };
      case 'lg':
        return {
          container: 'p-6',
          title: 'text-base',
          value: 'text-4xl',
          icon: 'w-8 h-8',
          change: 'text-sm'
        };
      default:
        return {
          container: 'p-4',
          title: 'text-sm',
          value: 'text-2xl',
          icon: 'w-6 h-6',
          change: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`${sizeClasses.container} rounded-xl ${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    } border`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`${sizeClasses.title} font-medium ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {title}
        </h3>
        {Icon && (
          <Icon 
            className={`${sizeClasses.icon}`} 
            style={{ color }} 
          />
        )}
      </div>
      
      <div className={`${sizeClasses.value} font-bold ${
        isDark ? 'text-white' : 'text-gray-900'
      } mb-2`}>
        {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
      </div>
      
      {change !== undefined && (
        <div className={`flex items-center gap-1 ${sizeClasses.change}`}>
          <span className={getTrendColor()}>
            {getTrendIcon()}
          </span>
          <span className={getTrendColor()}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
              {changeLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;