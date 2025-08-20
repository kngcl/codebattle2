import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
  showTooltip?: boolean;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  colors?: string[];
  showLabels?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = 300,
  showTooltip = true,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80,
  colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'],
  showLabels = false
}) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const dataWithColors = data.map((entry, index) => ({
    ...entry,
    color: entry.color || colors[index % colors.length]
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className={`px-3 py-2 rounded-lg shadow-lg border ${
          isDark
            ? 'bg-gray-800 border-gray-700 text-white'
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-medium">{data.name}</p>
          <p className="text-sm" style={{ color: data.payload.color }}>
            {`Value: ${data.value.toLocaleString()}`}
          </p>
          <p className="text-xs text-gray-500">
            {`${((data.value / data.payload.total) * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={isDark ? '#e5e7eb' : '#374151'}
        textAnchor={x > entry.cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="medium"
      >
        {`${entry.value}`}
      </text>
    );
  };

  // Calculate total for percentage calculation
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithTotal = dataWithColors.map(entry => ({ ...entry, total }));

  return (
    <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} border`}>
      {title && (
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      )}
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={dataWithTotal}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showLabels ? renderLabel : false}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="value"
            >
              {dataWithTotal.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && (
              <Legend 
                wrapperStyle={{ 
                  color: isDark ? '#e5e7eb' : '#374151',
                  fontSize: '12px'
                }}
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChart;