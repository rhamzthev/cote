import React from 'react';
import './AuthPopup.css';
import { useGoogleDrive } from '../hooks/useGoogleDrive';

interface AuthPopupProps {
  isOpen: boolean;
}

const AuthPopup: React.FC<AuthPopupProps> = ({ isOpen }) => {
  const { initiateAuth } = useGoogleDrive();

  if (!isOpen) return null;

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup">
        <h2>Sign in with Google</h2>
        <p>Please sign in with your Google account to access this application.</p>
        <button className="auth-button" onClick={initiateAuth}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default AuthPopup; 