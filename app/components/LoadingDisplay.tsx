import React from 'react';
import loadImg from '../../resources/loadingImg.gif';
import styles from './LoadingDisplay.css';

export default function LoadingScreen() {
  return (
    <div className={styles['loading-container']}>
      <div>
        <img src={loadImg} alt="Circle Loading Spinner." />
      </div>
    </div>
  );
}
