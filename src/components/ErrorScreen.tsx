import React from 'react';
import styles from './ErrorScreen.module.css';

interface ErrorScreenProps {
  title: string;
  message: string;
  details?: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ title, message, details }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>{title}</h1>
        <p>{message}</p>
        {details && <pre className={styles.details}>{details}</pre>}
        <button 
          className={styles.button}
          onClick={() => window.location.href = '/'}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen; 