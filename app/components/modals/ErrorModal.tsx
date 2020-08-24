/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styles from './modal.css';

interface Props {
  props: string;
}

export default function AlarmModal(props: Props) {

  const errorKey = Object.keys(props.props)[0];

  console.log('Error modal props: ', props);
  debugger;

  return (
    <div className={styles['error-modal-container']}>
      <div>
        <p>ERROR!</p>
      </div>
      <div>
        <p>{props.props[errorKey]}</p>
      </div>
    </div>
  );
}
