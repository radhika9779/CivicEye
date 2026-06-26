import React from 'react';

const VARIANTS = {
  primary: 'bg-civic-blue text-white hover:bg-blue-700 active:bg-blue-800',
  secondary: 'bg-white text-civic-dark border border-civic-border hover:bg-slate-50',
  danger: 'bg-severity-critical text-white hover:bg-red-700',
  ghost: 'bg-transparent text-civic-blue hover:bg-blue-50',
  safety: 'bg-safety-purple text-white hover:bg-purple-700',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...rest
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}
      `}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
}
