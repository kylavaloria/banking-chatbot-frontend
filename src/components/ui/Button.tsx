import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?:   'primary' | 'secondary' | 'danger' | 'ghost';
  size?:      'sm' | 'md' | 'lg';
}

const VARIANT_CLASSES = {
  primary:   'bg-brand-600 hover:bg-brand-700 text-white focus:ring-brand-500 border-transparent',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-brand-500',
  danger:    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border-transparent',
  ghost:     'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent focus:ring-brand-500',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  isLoading = false,
  variant   = 'primary',
  size      = 'md',
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg border
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
        ${className}
      `}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
