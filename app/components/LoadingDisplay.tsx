/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Btn from './buttonFunctions/buttonClickHandler';
import styles from './LoadingDisplay.css';

interface Props {
  props: {
    cancelLoading: () => {};
  } | null;
}

export default function LoadingScreen(props: Props) {
  let loadCancelBtn = false;
  let loadCancelFunction = null;

  const cancelNull = () => {
    // This is to satisfy the requirement to pass a function to the click handler.
    // Canceled return error since we don't' want this to do anything.
    // Not sure if this is an ok fix or not.
    // eslint-disable-next-line no-useless-return
    return;
  };

  if (props.props !== null) {
    loadCancelFunction = props.props.cancelLoading;
    loadCancelBtn = true;
  } else {
    loadCancelFunction = cancelNull;
  }

  return (
    <div className={styles['loading-container']}>
      <div>
        <div className={styles.loader} />
      </div>
      <div>
        {loadCancelBtn && (
          <div>
            <Btn buttonName="Cancel" ClickHandler={loadCancelFunction} />
          </div>
        )}
      </div>
    </div>
  );
}

// May need to change to this on packaged app : src="../../internals/img/loadingImg.gif"
