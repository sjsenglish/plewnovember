import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'filter';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: 'var(--font-primary)',
    border: 'var(--border-medium)',
    borderRadius: '0',
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-black)',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-black)',
      boxShadow: 'var(--shadow-sm)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-black)',
      border: 'none',
    },
    filter: {
      backgroundColor: 'var(--color-primary-light)',
      color: 'var(--color-black)',
      fontSize: 'var(--text-sm)',
      padding: 'var(--space-xs) var(--space-sm)',
      border: '1px solid var(--color-black)',
      fontWeight: '500'
    }
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      fontSize: 'var(--text-sm)',
      padding: 'var(--space-sm) var(--space-md)',
    },
    md: {
      fontSize: 'var(--text-base)',
      padding: 'var(--space-md) var(--space-lg)',
    },
    lg: {
      fontSize: 'var(--text-lg)',
      padding: 'var(--space-lg) var(--space-xl)',
    }
  };

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size]
  };

  return (
    <button
      className={`button ${variant} ${size} ${className}`}
      style={combinedStyles}
      {...props}
    >
      {children}
    </button>
  );
};
