
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3">
        <div
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-cyan-400"
        role="status"
        aria-label="loading"
        ></div>
        <p className="text-cyan-300">AI is thinking...</p>
    </div>
  );
};

export default LoadingSpinner;
