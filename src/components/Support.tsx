import React from 'react';
import './Support.css';

const Support: React.FC = () => {
  return (
    <div className="support-container">
      <div className="support-content">
        <h1>Need Help?</h1>
        <p>We're here to help! For any questions or support, please email us at:</p>
        <a href="mailto:rhamzthev@gmail.com" className="support-email">
          rhamzthev@gmail.com
        </a>
      </div>
    </div>
  );
};

export default Support;
