import React from 'react';

interface PulseLoaderProps {
  count?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PulseLoader: React.FC<PulseLoaderProps> = ({ 
  count = 3, 
  color = 'bg-purple-500',
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`${sizeClasses[size]} ${color} rounded-full animate-pulse`}
          style={{
            animationDelay: `${index * 150}ms`
          }}
        />
      ))}
    </div>
  );
};

export default PulseLoader;