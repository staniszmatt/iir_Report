import React from 'react';
import styles from './Home.css';
import image from '../img/AeroPartsLogo.png';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      <div className={styles.backgroundImageContainer}>
        <img src={image} alt="AeroParts Logo" />
      </div>
    </div>
  );
}
