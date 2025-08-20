import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showQuickJumper?: boolean;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  total?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showQuickJumper = false,
  showSizeChanger = false,
  pageSizeOptions = [10, 20, 50, 100],
  pageSize = 10,
  onPageSizeChange,
  total,
  className = ''
}) => {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

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

  const handleQuickJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const page = parseInt(target.value);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
        target.value = '';
      }
    }
  };

  const getButtonClass = (isActive = false, disabled = false) => {
    const baseClass = 'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center min-w-[40px]';
    
    if (disabled) {
      return `${baseClass} cursor-not-allowed ${
        isDark ? 'text-gray-600 bg-gray-800' : 'text-gray-300 bg-gray-100'
      }`;
    }
    
    if (isActive) {
      return `${baseClass} bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg`;
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

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Info */}
      {total && (
        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, total)} of {total} results
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Size changer */}
        {showSizeChanger && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Show
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className={`px-2 py-1 rounded-md text-sm border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              per page
            </span>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={getButtonClass(false, currentPage === 1)}
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="px-3 py-2 text-sm text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              ) : (
                <button
                  onClick={() => handlePageClick(page)}
                  className={getButtonClass(page === currentPage)}
                  title={`Go to page ${page}`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={getButtonClass(false, currentPage === totalPages)}
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick jumper */}
        {showQuickJumper && (
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Go to
            </span>
            <input
              type="number"
              min={1}
              max={totalPages}
              placeholder={currentPage.toString()}
              onKeyDown={handleQuickJump}
              className={`w-16 px-2 py-1 rounded-md text-sm text-center border focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;