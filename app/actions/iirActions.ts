import { ipcRenderer } from 'electron';
import { GetIIRState, Dispatch } from '../reducers/types';
import { toggleErrorModalState, toggleSuccessModalState } from './modalActions';

export const TOGGLE_PDF_DISPLAY = 'TOGGLE_PDF_DISPLAY';
export const TOGGLE_LOADING_SCREEN_DISPLAY = 'TOGGLE_LOADING_SCREEN_DISPLAY';
export const TOGGLE_IIR_EDIT_STATE = 'TOGGLE_IIR_EDIT_STATE';
export const SET_WORK_ORDER = 'SET_WORK_ORDER';
export const SET_WORK_ORDER_DATA = 'SET_WORK_ORDER_DATA';
export const TOGGLE_POST_IIR_NOTES = 'SET_POST_IIR_NOTES';

export function toggleDisplayPDFFormState() {
  return {
    type: TOGGLE_PDF_DISPLAY
  };
}

export function togglePostIIRNotes() {
  return {
    type: TOGGLE_POST_IIR_NOTES
  };
}

export function toggleLoadingScreenState() {
  return {
    type: TOGGLE_LOADING_SCREEN_DISPLAY
  };
}

export function toggleIIRAddEditState() {
  return {
    type: TOGGLE_IIR_EDIT_STATE
  };
}

export function setWorkOrder(resp: {}) {
  return {
    type: SET_WORK_ORDER,
    resp
  };
}

export function setWorkOrderData(resp: {}) {
  return {
    type: SET_WORK_ORDER_DATA,
    resp
  };
}

export function getWorkOrderData(workOrder: {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}) {

  console.log('Get Work Order Data');

  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    console.log('State:', state);

    if (workOrder.workOrderSearchLineItem.length === 1) {
      // Disabled here because we need to keep it at a two char of 0x where x is a number.
      // eslint-disable-next-line no-param-reassign
      workOrder.workOrderSearchLineItem = `0${workOrder.workOrderSearchLineItem}`;
    }

    const workOrderNumber = `${workOrder.workOrderSearch}   ${workOrder.workOrderSearchLineItem}`;

    const mainRequest = {
      request: 'getWorkOrderData',
      workOrderNumber
    };

    console.log('Main Request:', mainRequest);

    const handleGetWorkOrderDataResp = (
      _event: {},
      resp: { error: {}; data: [{}] }
    ) => {
      console.log('handle data: ', resp);

      dispatch(toggleLoadingScreenState());
      debugger;
      // Checking no errors
      if (Object.keys(resp.error).length === 0) {
        // Checking if data is empty and the edit form search is false
        if (!resp.data.length === 0) {
          dispatch(
            toggleErrorModalState(
              `Could not find WO: ${workOrder.workOrderSearch}-${workOrder.workOrderSearchLineItem}. Double check WO is correct.`
            )
          );
        } else {
          dispatch(setWorkOrder(workOrder));
          dispatch(setWorkOrderData(resp.data[0]));
          dispatch(toggleDisplayPDFFormState());
        }
      } else {
        dispatch(toggleErrorModalState('Error Happened'));
      }

      ipcRenderer.removeListener('asynchronous-replay', handleGetWorkOrderDataResp);
    };
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', handleGetWorkOrderDataResp);
  };
}

export function postIIRReport(iirNotes: {}) {
  console.log('IIR notes: ', iirNotes);

  return (dispatch: Dispatch, getState: GetIIRState) => {
    debugger;
    const state = getState().iir;
    let request = 'updateIIRReport';
    console.log('State:', state);
    // Changes from updating IIR notes to Adding IIR note if it was set to doesn't excised.
    if (state.postIIRNotes) {
      request = 'postIIRReport';
    }
    // TODO: SETUP updateIIRReport api.
    const mainRequest = {
      request,
      SalesOrderNumber: 'xx1234-01',
      customerReasonForRemoval: 'Test customer reason for removal.',
      genConditionReceived: 'Test general condition received.',
      evalFindings: 'Test evaluation findings.',
      workedPerformed: 'Test work done.'
    };

    const handlePostIIRResp = (_event: {}, resp: { error: {}; data: {} }) => {
      console.log('handle data: ', resp);
      ipcRenderer.removeListener('asynchronous-replay', handlePostIIRResp);
    }
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState())
    ipcRenderer.on('asynchronous-reply', handlePostIIRResp);
  };
}

export function getIIRData(workOrder: {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}) {
  console.log('Get IIR Data');
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    console.log('State:', state);

    if (state.postIIRNotes) {
      dispatch(togglePostIIRNotes());
    }

    if (workOrder.workOrderSearchLineItem.length === 1) {
      // Disabled here because we need to keep it at a two char of 0x where x is a number.
      // eslint-disable-next-line no-param-reassign
      workOrder.workOrderSearchLineItem = `0${workOrder.workOrderSearchLineItem}`;
    }

    const mainRequest = {
      request: 'getIIRData',
      workOrder
    };

    console.log('Main Request:', mainRequest);

    const handleGeIIRDataResp = (
      _event: {},
      resp: { error: {}; data: [{}] }
    ) => {
      console.log('handle iir data: ', resp);

      dispatch(toggleLoadingScreenState());
debugger;

      if (Object.keys(resp.error).length === 0) {
        // If there is no data and the postIIRNotes is false, set postIIRNotes to true
        if (resp.data.length === 0) {
          dispatch(togglePostIIRNotes());
        }
        dispatch(setWorkOrder(workOrder));
        dispatch(setWorkOrderData(resp.data[0]));
      } else {
        dispatch(toggleErrorModalState('Error Happened'));
      }

      ipcRenderer.removeListener('asynchronous-replay', handleGeIIRDataResp);
    };
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', handleGeIIRDataResp);
  };
}
