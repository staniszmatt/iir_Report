/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './LoadingDisplay.css';

interface Props {
  props: {
    cancleLoading: () => {};
  } | null;
}

export default function LoadingScreen(props: Props | null) {
  console.log('loading screen props', props);
  debugger;
  let loadCancleBtn = false;
  let loadCancleFunction = null;

  if (Object.keys(props).length !== 0) {
    loadCancleFunction = props.props.cancleLoading;
    loadCancleBtn = true;
  }

  return (
    <div className={styles['loading-container']}>
      <div>
        <div className={styles.loader} />
      </div>
      <div>

        {loadCancleBtn && (
        <div>
          <Btn buttonName="Cancle" ClickHandler={loadCancleFunction} />
        </div>
        )}

      </div>
    </div>
  );
}

// May need to change to this on packaged app : src="../../internals/img/loadingImg.gif"
