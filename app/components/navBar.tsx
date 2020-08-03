import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './navBar.css';

export default function Nav() {
  return (
    <div className={styles.container}>
      <Link to={routes.HOME}>
        <button type="button">HOME</button>
      </Link>
    </div>
  );
}
