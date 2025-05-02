import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="flex space-x-4">
        <div
          className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="w-4 h-4 bg-green-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
        <div
          className="w-4 h-4 bg-orange-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.4s' }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;