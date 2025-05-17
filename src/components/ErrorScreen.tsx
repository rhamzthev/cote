import React from 'react';
import './ErrorScreen.css';

interface ErrorScreenProps {
  title: string;
  message: string;
  details?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ title, message, details }) => {
  return (
    <div className="error-screen">
      <div className="error-content">
        <h1>{title}</h1>
        <p>{message}</p>
        {details && <pre className="error-details">{details}</pre>}
        <button 
          className="error-button"
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen; 