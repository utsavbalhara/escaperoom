import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = 'Loading...', fullScreen = false }: LoadingProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-dark z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        </div>
        <p className="text-primary font-mono text-lg animate-pulse">{message}</p>
      </div>
    </div>
  );
}
