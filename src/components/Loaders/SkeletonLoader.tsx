import React from 'react';

interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
  variant = 'rect',
  count = 1
}) => {
  const variantClasses = {
    text: 'rounded',
    rect: 'rounded-lg',
    circle: 'rounded-full'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`bg-gray-800 animate-pulse ${width} ${height} ${variantClasses[variant]}`}
          style={{
            background: 'linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s ease-in-out infinite'
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;