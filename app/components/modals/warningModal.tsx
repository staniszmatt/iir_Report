/* eslint-disable react/destructuring-assignment */
import React from 'react';
import styles from './modal.css';
import ModalBtn from '../buttonFunctions/buttonClickHandler';

interface Props {
  props: {
    warningMsg: string;
    actionFunction: () => {};
    closeModal: () => {};
  };
}

export default function WarningModal(props: Props) {
  const { actionFunction } = props.props;
  const { closeModal } = props.props;

  const handDeleteBtn = () => {
    actionFunction();
    closeModal();
  };

  return (
    <div className={styles['warning-modal-container']}>
      <div className={styles.blink_me}>
        <p>WARNING!</p>
      </div>
      <div>
        <p>{props.props.warningMsg}</p>
      </div>
      <div>
        <ModalBtn buttonName="Delete" ClickHandler={handDeleteBtn} />
      </div>
    </div>
  );
}
