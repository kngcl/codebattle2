import React from 'react';
import Spinner from './Spinner';

interface ButtonLoaderProps {
  loading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const ButtonLoader: React.FC<ButtonLoaderProps> = ({
  loading,
  children,
  loadingText = 'Loading...',
  className = '',
  onClick,
  disabled,
  variant = 'primary'
}) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variantClasses[variant]}
        font-bold py-3 px-6 rounded-full
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {loading ? (
        <>
          <Spinner size="sm" color="text-white" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default ButtonLoader;