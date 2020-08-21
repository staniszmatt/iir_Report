import React from 'react';
import styles from './Home.css';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <div className={styles.backgroundImageContainer}>
        <img src="../internals/img/AeroPartsLogo.png" alt="AeroParts Logo" />
      </div>
    </div>
  );
}
