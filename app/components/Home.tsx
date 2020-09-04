import React from 'react';
import styles from './Home.css';
import logo from '../img/logo.png';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <div className={styles['faded-backgroundImageContainer']}>
        <img src={logo} alt="AeroParts Logo" />
      </div>
      <div className={styles.backgroundImageContainer}>
        <img src={logo} alt="AeroParts Logo" />
      </div>
    </div>
  );
}
