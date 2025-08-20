import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface RadialProgressChartProps {
  value: number;
  maxValue?: number;
  title?: string;
  color?: string;
  size?: number;
  showPercentage?: boolean;
  label?: string;
  thickness?: number;
}

const RadialProgressChart: React.FC<RadialProgressChartProps> = ({
  value,
  maxValue = 100,
  title,
  color = '#8b5cf6',
  size = 120,
  showPercentage = true,
  label,
  thickness = 8
}) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const percentage = Math.min((value / maxValue) * 100, 100);
  const data = [{ value: percentage, fill: color }];

  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border text-center`}>
      {title && (
        <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      )}
      
      <div className="relative inline-block">
        <ResponsiveContainer width={size} height={size}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - thickness * 2}
            outerRadius={size / 2 - thickness}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              dataKey="value"
              cornerRadius={thickness / 2}
              fill={color}
              background={{ fill: isDark ? '#374151' : '#e5e7eb' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showPercentage && (
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ color }}>
              {Math.round(percentage)}%
            </div>
          )}
          {label && (
            <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {label}
            </div>
          )}
          {!showPercentage && (
            <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ color }}>
              {value.toLocaleString()}
              {maxValue !== 100 && <span className="text-sm">/{maxValue.toLocaleString()}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RadialProgressChart;