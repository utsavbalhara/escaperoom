import React from 'react';

interface RoboticTextProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  glow?: boolean;
  className?: string;
}

export default function RoboticText({
  children,
  size = 'md',
  glow = false,
  className = '',
}: RoboticTextProps) {
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const glowStyle = glow ? 'animate-glow' : '';

  return (
    <div
      className={`font-mono text-primary ${sizeStyles[size]} ${glowStyle} ${className}`}
      style={{
        textShadow: glow ? '0 0 10px rgba(0,255,65,0.8)' : 'none',
      }}
    >
      {children}
    </div>
  );
}
