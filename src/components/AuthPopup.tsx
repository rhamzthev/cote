import React from 'react';
import styles from './AuthPopup.module.css';

interface AuthPopupProps {
  onAuth: () => void;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ onAuth }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <h2>Sign in with Google</h2>
        <p>Please sign in with your Google account to access this application.</p>
        <button className={styles.button} onClick={onAuth}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default AuthPopup; 