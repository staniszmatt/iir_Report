/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './LoadingDisplay.css';

interface Props {
  props: {
    cancleLoading: () => {};
  } | null;
}

export default function LoadingScreen(props: Props) {
  let loadCancleBtn = false;
  let loadCancleFunction = null;

  const cancleNull = () => {
    // This is to satisify the requirement to pass a function to the click handler.
    // Cancled return error since we dont' want this to do anything.
    // Not sure if this is an ok fix or not.
    // eslint-disable-next-line no-useless-return
    return;
  };

  if (props.props !== null) {
    loadCancleFunction = props.props.cancleLoading;
    loadCancleBtn = true;
  } else {
    loadCancleFunction = cancleNull;
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
