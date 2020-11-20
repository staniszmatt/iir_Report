import React from 'react';
import styles from './modal.css';
import ModalBtn from '../buttonFunctions/buttonClickHandler';

interface WarnModalProps {
  props: {
    warningMsg: string;
    btnLbl: string;
    actionFunction: () => {};
    closeModal: () => {};
  };
}

export default function WarningModal(warnModalProps: WarnModalProps) {
  const {
    warningMsg,
    btnLbl,
    actionFunction,
    closeModal
  } = warnModalProps.props;

  const handleBtn = () => {
    actionFunction();
    closeModal();
  };

  return (
    <div className={styles['warning-modal-container']}>
      <div className={styles.blink_me}>
        <p>WARNING!</p>
      </div>
      <div>
        <p>{warningMsg}</p>
      </div>
      <div>
        <ModalBtn buttonName={btnLbl} ClickHandler={handleBtn} />
      </div>
    </div>
  );
}
