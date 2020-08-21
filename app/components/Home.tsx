import React from 'react';
import styles from './Home.css';
import logo from '../img/Logo.png';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <div className={styles.backgroundImageContainer}>
        <img src={logo} alt="AeroParts Logo" />
      </div>
    </div>
  );
}
