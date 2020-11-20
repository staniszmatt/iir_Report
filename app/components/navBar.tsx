import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './NavBar.css';

export default function Nav() {
  return (
    <div className={styles.container}>
      <Link to={routes.EDITFORM}>
        <button type="button">Add/Edit Notes</button>
      </Link>
      <Link to={routes.IIRFORM}>
        <button type="button">PDF Review</button>
      </Link>
    </div>
  );
}
