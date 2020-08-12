import React from 'react';
import styles from './LoadingDisplay.css';

export default function LoadingScreen() {
  return (
    <div className={styles['loading-container']}>
      <div>
        <img
          src="../../internals/img/loadingImg.gif"
          alt="Circle Loading Spinner."
        />
      </div>
    </div>
  );
}
