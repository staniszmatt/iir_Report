import React from 'react';
// import { Link } from 'react-router-dom';
// import routes from '../constants/routes.json';
import styles from './Home.css';

export default function Home() {
  return (
    <div className={styles.container} data-tid="container">
      {/**   <Link to={routes.COUNTER}>to Counter</Link>
      <Link to={routes.CUSTOMER}>to Customer</Link> */}
      <div className={styles.backgroundImageContainer}>
        <img src="../internals/img/AeroPartsLogo.png" alt="AeroParts Logo" />
      </div>
    </div>
  );
}
