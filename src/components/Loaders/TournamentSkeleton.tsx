import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface TournamentSkeletonProps {
  count?: number;
}

const TournamentSkeleton: React.FC<TournamentSkeletonProps> = ({ count = 1 }) => {
  return (
    <div className="space-y-6">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="h-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
          
          <div className="p-6">
            {/* Tournament Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <SkeletonLoader width="w-48" height="h-6" className="mb-2" />
                <SkeletonLoader width="w-64" height="h-4" />
              </div>
              <SkeletonLoader width="w-20" height="h-8" variant="rect" />
            </div>
            
            {/* Prize Pool and Entry Fee */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <SkeletonLoader width="w-24" height="h-3" className="mb-2" />
                <SkeletonLoader width="w-32" height="h-5" />
              </div>
              <div>
                <SkeletonLoader width="w-24" height="h-3" className="mb-2" />
                <SkeletonLoader width="w-28" height="h-5" />
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 mb-4">
              <SkeletonLoader width="w-20" height="h-4" />
              <SkeletonLoader width="w-20" height="h-4" />
              <SkeletonLoader width="w-24" height="h-4" />
            </div>
            
            {/* Action Button */}
            <SkeletonLoader width="w-full" height="h-10" variant="rect" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentSkeleton;