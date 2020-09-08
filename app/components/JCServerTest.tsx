/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import LoadingDisplay from './LoadingDisplay';
import styles from './Home.css';

interface Props {
  testJobCostDB: (queryString: string) => {};
  iir: {
    loadingScreen: boolean;
  }
};

interface HomeState {
  textInput: string;
}

export default function Home(props: Props) {
  console.log('Home Page, props:', props);
  const [homeState, setHomeState] = useState<HomeState>({
    textInput: ''
  })
  const { testJobCostDB } = props;
  const { loadingScreen } = props.iir;

  const sendData = (event: any) => {
    console.log('test JobCost query string send, event:', event);
    console.log('test JobCost query sting send, queryString', homeState.textInput);

    testJobCostDB(homeState.textInput);
  }

  const setText = (event: any) => {
    console.log('text JobCost change, event: ', event);
    setHomeState({
      ...homeState,
      textInput: event.currentTarget.value
    });
  };

  return (
    <div className={styles.container}>
      <div>{loadingScreen && <LoadingDisplay props={null} />}</div>
      <div>Job Cost DB Testing</div>
      <div>
        <div>
          <button type="button" onClick={sendData}>
            Test DB String
          </button>
        </div>
        <div>
          <textarea onChange={setText}>{homeState.textInput}</textarea>
        </div>
      </div>
    </div>
  );
}
