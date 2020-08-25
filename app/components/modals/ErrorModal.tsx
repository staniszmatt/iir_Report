/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styles from './modal.css';

interface Props {
  props: {} | any;
}

export default function AlarmModal(props: Props) {
  const errorKey = Object.keys(props.props)[0];
  return (
    <div className={styles['error-modal-container']}>
      <div>
        <p>ERROR!</p>
      </div>
      <div>
        <p>{`Error Key: ${errorKey}`}</p>
        <p>{`Description: ${props.props[errorKey]}`}</p>
      </div>
    </div>
  );
}
