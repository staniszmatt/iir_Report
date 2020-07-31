// import { GetErrorModalState, Dispatch } from '../reducers/types';

export const TOGGLE_ERROR_MODAL_STATE = 'TOGGLE_ERROR_MODAL_STATE';
export const TOGGLE_SUCCESS_MODAL_STATE = 'TOGGLE_SUCCESS_MODAL_STATE';
export const TOGGLE_MODAL_STATE = 'TOGGLE_MODAL_STATE';
export const TOGGLE_WARNING_MODAL_STATE = 'TOGGLE_WARNING_MODAL_STATE';
// Reducer function calls
export function toggleModalState() {
  return {
    type: TOGGLE_MODAL_STATE
  };
}

export function toggleErrorModalState(resp: {}) {
  return {
    type: TOGGLE_ERROR_MODAL_STATE,
    resp
  };
}

export function toggleSuccessModalState(resp: string) {
  return {
    type: TOGGLE_SUCCESS_MODAL_STATE,
    resp
  };
}

export function toggleWarningModalState(resp: {}) {
  return {
    type: TOGGLE_WARNING_MODAL_STATE,
    resp
  };
}
