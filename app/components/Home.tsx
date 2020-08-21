/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from 'react';
// import styles from './Home.css';
// import logo from '../img/Logo.png';

// export default function Home() {
//   return (
//     <div className={styles.container} data-tid="container">
//       <div className={styles.backgroundImageContainer}>
//         <img src={logo} alt="AeroParts Logo" />
//       </div>
//     </div>
//   );
// }
import React, { useState } from 'react';
import LoadingDisplay from './LoadingDisplay';
import styles from './Home.css';

interface Props {
  testDB: (queryString: string) => {};
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
  const { testDB } = props;
  const { loadingScreen } = props.iir;

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
