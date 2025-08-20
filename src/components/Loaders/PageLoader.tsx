import React from 'react';
import { Code, Zap } from 'lucide-react';

const PageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <div className="relative">
        {/* Animated background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute w-24 h-24 bg-pink-600/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        {/* Main loader content */}
        <div className="relative flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center animate-spin-slow">
              <Code className="w-10 h-10 text-white" />
            </div>
            <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Loading CodeBattle</h2>
          
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;