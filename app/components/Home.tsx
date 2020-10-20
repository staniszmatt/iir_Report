import React from 'react';
import styles from './Home.css';
import logo from '../img/logo.png';

interface Props {
  getVersion: () => {};
  iir: {
    appVersion: string;
  };
}

export default function Home(props: Props) {
  const { getVersion } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const { appVersion } = props.iir;

  if (appVersion === '') {
    getVersion();
  }

  return (
    <div className={styles.container} data-tid="container">
      <div className={styles['faded-backgroundImageContainer']}>
        <img src={logo} alt="AeroParts Logo" />
      </div>
      <div>
        <div className={styles.backgroundImageContainer}>
          <img src={logo} alt="AeroParts Logo" />
        </div>
        <div id={styles.version}>
          <p>{`VERSION: ${appVersion}`}</p>
        </div>
      </div>
    </div>
  );
}
