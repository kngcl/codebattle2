import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

const CardSkeleton: React.FC<CardSkeletonProps> = ({ count = 1, className = '' }) => {
  return (
    <div className={`grid gap-6 ${className}`}>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <SkeletonLoader variant="circle" width="w-10" height="h-10" />
              <div>
                <SkeletonLoader width="w-32" height="h-5" className="mb-2" />
                <SkeletonLoader width="w-24" height="h-3" />
              </div>
            </div>
            <SkeletonLoader width="w-16" height="h-6" />
          </div>
          
          {/* Content */}
          <div className="space-y-3 mb-4">
            <SkeletonLoader width="w-full" height="h-4" />
            <SkeletonLoader width="w-3/4" height="h-4" />
            <SkeletonLoader width="w-1/2" height="h-4" />
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex space-x-4">
              <SkeletonLoader width="w-20" height="h-4" />
              <SkeletonLoader width="w-20" height="h-4" />
            </div>
            <SkeletonLoader width="w-24" height="h-8" variant="rect" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;