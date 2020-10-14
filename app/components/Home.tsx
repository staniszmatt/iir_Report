import React, { useState } from 'react';
import { ipcRenderer } from 'electron';
import styles from './Home.css';
import logo from '../img/logo.png';

interface VersionState {
  version: string;
}

export default function Home() {
  const [versionState, setVersionState] = useState<VersionState>({
    version: ''
  });

  ipcRenderer.send('app_version');
  ipcRenderer.on('app_version', (_event, arg) => {
    ipcRenderer.removeAllListeners('app_version');
    // version.innerText = 'Version ' + arg.version;
    setVersionState({
      ...versionState,
      version: arg.version
    });
  });

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
          <p>{`VERSION: ${versionState.version}`}</p>
        </div>
      </div>
    </div>
  );
}
