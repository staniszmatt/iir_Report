import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './navBar.css';

export default function Nav() {
  return (
    <div className={styles.container}>
      <Link to={routes.EDITFORM}>
        <button type="button">Add/Edit Form</button>
      </Link>
      <Link to={routes.IIRFORM}>
        <button type="button">IIR Form</button>
      </Link>
    </div>
  );
}
