import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  size = 'md'
}) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-3 text-base';
      default:
        return 'px-3 py-2 text-sm';
    }
  };

  const getButtonClass = (disabled = false) => {
    const sizeClass = getSizeClasses();
    const baseClass = `${sizeClass} font-medium rounded-lg transition-all duration-200 flex items-center gap-2`;
    
    if (disabled) {
      return `${baseClass} cursor-not-allowed ${
        isDark ? 'text-gray-600 bg-gray-800' : 'text-gray-300 bg-gray-100'
      }`;
    }
    
    return `${baseClass} ${
      isDark
        ? 'text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white border border-gray-700'
        : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200'
    }`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      {/* Previous button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={getButtonClass(currentPage === 1)}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {/* Current page info */}
      <div className={`${getSizeClasses()} ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      } font-medium`}>
        Page {currentPage} of {totalPages}
      </div>

      {/* Next button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={getButtonClass(currentPage === totalPages)}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SimplePagination;