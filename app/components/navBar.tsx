import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';
import styles from './navBar.css';

export default function Nav() {
  return (
    <div className={styles.container}>
      <Link to={routes.EDITFORM}>
        <button type="button">Add/Edit Tear Down Form</button>
      </Link>
      <Link to={routes.IIRFORM}>
        <button type="button">Tear Down Form</button>
      </Link>
      <Link to={routes.HOME}>
        <button type="button">HOME TEST</button>
      </Link>
    </div>
  );
}
