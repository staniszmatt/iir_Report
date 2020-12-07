/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import LoadingDisplay from './LoadingDisplay';
import styles from './Home.css';

interface Props {
  testDB: (queryString: string) => {};
  getVersion: () => {};
  iir: {
    loadingScreen: boolean;
    appVersion: string;
  };
}

interface HomeState {
  textInput: string;
}

export default function Home(props: Props) {
  console.log('Home Page, props:', props);
  const [homeState, setHomeState] = useState<HomeState>({
    textInput: ''
  })
  const { testDB, getVersion, iir } = props;
  const { loadingScreen, appVersion } = iir;

  if (appVersion === '') {
    getVersion();
  }

  const sendData = (event: any) => {
    console.log('test query string send, event:', event);
    console.log('test query sting send, queryString', homeState.textInput);
    testDB(homeState.textInput);
  }

  const setText = (event: any) => {
    console.log('text change, event: ', event);
    setHomeState({
      ...homeState,
      textInput: event.currentTarget.value
    });
  };

  return (
    <div className={styles.container}>
      <div>{loadingScreen && <LoadingDisplay props={null} />}</div>
      <div>Aero Parts DB Testing</div>
      <div>
        <div>
          <button type="button" onClick={sendData}>
            Test DB String
          </button>
        </div>
        <div>
          <textarea onChange={setText}>{homeState.textInput}</textarea>
        </div>
        <div id={styles.version}>
          <p>{`VERSION: ${appVersion}`}</p>
        </div>
      </div>
    </div>
  );
}
