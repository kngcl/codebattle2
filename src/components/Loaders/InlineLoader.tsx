import React from 'react';

interface InlineLoaderProps {
  text?: string;
  className?: string;
}

const InlineLoader: React.FC<InlineLoaderProps> = ({ 
  text = 'Loading', 
  className = '' 
}) => {
  return (
    <div className={`inline-flex items-center gap-2 text-gray-400 ${className}`}>
      <span>{text}</span>
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default InlineLoader;