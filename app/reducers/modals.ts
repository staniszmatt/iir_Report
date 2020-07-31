/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from 'redux';
import {
  TOGGLE_MODAL_STATE,
  TOGGLE_ERROR_MODAL_STATE,
  TOGGLE_SUCCESS_MODAL_STATE,
  TOGGLE_WARNING_MODAL_STATE
} from '../actions/modalActions';

const IState = {
  modalState: false,
  errorModalState: false,
  successModalState: false,
  warningModalState: false,
  modalMessage: 'Initial'
};

export interface ModalAction extends Action {
  type: string;
  resp?: any;
}

export default function modals(state = IState, action: ModalAction) {
  switch (action.type) {
    case TOGGLE_MODAL_STATE:
      return {
        ...state,
        modalState: false,
        errorModalState: false,
        successModalState: false,
        warningModalState: false,
        modalMessage: {}
      };
    case TOGGLE_ERROR_MODAL_STATE:
      return {
        ...state,
        modalState: true,
        errorModalState: true,
        modalMessage: action.resp
      };
    case TOGGLE_SUCCESS_MODAL_STATE:
      return {
        ...state,
        modalState: true,
        successModalState: true,
        modalMessage: action.resp
      };
    case TOGGLE_WARNING_MODAL_STATE:
      return {
        ...state,
        modalState: true,
        warningModalState: true,
        modalMessage: action.resp
      };
    default:
      return state;
  }
}
