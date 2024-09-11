import React from 'react';

interface FeedbackProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Feedback: React.FC<FeedbackProps> = ({ message, type }) => {
  const baseStyles = 'fixed bottom-2.5 left-2.5 p-2.5 border border-gray-800 rounded-md text-gray-300 z-[1000]';
  
  const typeStyles = {
    success: 'bg-green-500', // Green for success
    error: 'bg-red-500', // Red for error
    info: 'bg-blue-500', // Blue for info
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]}`}>
      {message}
    </div>
  );
};

export default Feedback;
