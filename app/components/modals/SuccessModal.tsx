/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styles from './modal.css';

interface Props {
  props: string;
}

export default function SuccessModal(props: Props) {
  return (
    <div className={styles['success-modal-container']}>
      <div>
        <p>SUCCESS!</p>
      </div>
      <div>
        <p>{props.props}</p>
      </div>
    </div>
  );
}
