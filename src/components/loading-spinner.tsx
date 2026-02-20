/**
 * Simple Loading Spinner Component
 * Basic loading indicator with customizable styles
 */

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'primary',
  className = '',
  text
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-8 h-8';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-blue-600';
      case 'secondary':
        return 'text-gray-600';
      case 'white':
        return 'text-white';
      default:
        return 'text-blue-600';
    }
  };

  const spinnerClasses = `
    animate-spin rounded-full border-2 border-current border-t-transparent
    ${getSizeClasses()}
    ${getColorClasses()}
    ${className}
  `;

  return (
    <div className="flex items-center justify-center">
      <div className={spinnerClasses} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <span className={`ml-2 ${getColorClasses()}`}>{text}</span>
      )}
    </div>
  );
};

export default LoadingSpinner;
