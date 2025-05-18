import React from 'react';
import styles from './Support.module.css';

const Support: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Need Help?</h1>
        <p>We're here to help! For any questions or support, please email us at:</p>
        <a href="mailto:rhamzthev@gmail.com" className={styles.email}>
          rhamzthev@gmail.com
        </a>
      </div>
    </div>
  );
};

export default Support;
