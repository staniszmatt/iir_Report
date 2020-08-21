import React from 'react';
import styles from './LoadingDisplay.css';

export default function LoadingScreen() {
  return (
    <div className={styles['loading-container']}>
      <div>
        <div className={styles.loader} />
      </div>
    </div>
  );
}

// May need to change to this on packaged app : src="../../internals/img/loadingImg.gif"
