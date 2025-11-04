import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-mono font-bold rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-primary text-dark hover:bg-primary/90 shadow-[0_0_10px_rgba(0,255,65,0.5)] hover:shadow-[0_0_20px_rgba(0,255,65,0.8)]',
    secondary: 'bg-secondary text-dark hover:bg-secondary/90 shadow-[0_0_10px_rgba(0,217,255,0.5)] hover:shadow-[0_0_20px_rgba(0,217,255,0.8)]',
    danger: 'bg-danger text-white hover:bg-danger/90 shadow-[0_0_10px_rgba(255,0,64,0.5)] hover:shadow-[0_0_20px_rgba(255,0,64,0.8)]',
    success: 'bg-green-500 text-white hover:bg-green-600 shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.8)]',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
