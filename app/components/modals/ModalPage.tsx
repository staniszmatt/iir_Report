/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import { toggleModalState } from '../../actions/modalActions';
import { modalStateType } from '../../reducers/types';
import ErrorModal from './ErrorModal';
import SuccessModal from './SuccessModal';
import WarningModal from './warningModal';
import ModalBtn from '../buttonFunctions/buttonClickHandler';
import styles from './modal.css';

interface Props {
  toggleModalState: () => {};
  modals: {
    modalState: boolean;
    errorModalState: boolean;
    successModalState: boolean;
    warningModalState: boolean;
    modalMessage: any;
  };
}

function mapStateToProps(state: modalStateType) {
  return {
    modals: state.modals
  };
}

function mapDispatchToProps(dispatch: Dispatch<null>) {
  return bindActionCreators(
    {
      toggleModalState
    },
    dispatch
  );
}

function AlarmModal(props: Props) {
  // toggleModalState is needed to be called here to gain proper access to the toggle state.
  // eslint-disable-next-line no-shadow
  const { toggleModalState } = props;
  // TODO: Fix the way string props is passed or how to fix typescript rules.
  return (
    <div>
      {props.modals.modalState && (
        <ReactModal
          isOpen={props.modals.modalState}
          onRequestClose={toggleModalState}
          contentLabel="MODAL"
          ariaHideApp={false}
          className={styles['modal-container']}
        >
          {props.modals.errorModalState && (
            <ErrorModal props={props.modals.modalMessage} />
          )}
          {props.modals.successModalState && (
            <SuccessModal props={props.modals.modalMessage} />
          )}
          {props.modals.warningModalState && (
            <WarningModal props={props.modals.modalMessage} />
          )}

          {!props.modals.warningModalState && (
            <div>
              <ModalBtn buttonName="CLOSE" ClickHandler={toggleModalState} />
            </div>
          )}
          {props.modals.warningModalState && (
            <div>
              <ModalBtn buttonName="CANCEL" ClickHandler={toggleModalState} />
            </div>
          )}
        </ReactModal>
      )}
    </div>
  );
}
// TODO: Need to figure out how to fix typescript rules or the interface setup.
export default connect(mapStateToProps, mapDispatchToProps)(AlarmModal);
