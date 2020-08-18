import { ipcRenderer } from 'electron';
import { reset } from 'redux-form';
import { GetIIRState, Dispatch } from '../reducers/types';
import { toggleErrorModalState, toggleSuccessModalState } from './modalActions';

export const RESET_STATE = 'RESET_STATE';
export const TOGGLE_PDF_DISPLAY = 'TOGGLE_PDF_DISPLAY';
export const TOGGLE_LOADING_SCREEN_DISPLAY = 'TOGGLE_LOADING_SCREEN_DISPLAY';
export const TOGGLE_IIR_EDIT_STATE = 'TOGGLE_IIR_EDIT_STATE';
export const SET_WORK_ORDER = 'SET_WORK_ORDER';
export const SET_WORK_ORDER_DATA = 'SET_WORK_ORDER_DATA';
export const TOGGLE_POST_IIR_NOTES = 'SET_POST_IIR_NOTES';

// Sets state booleans to false so to turn on only what is needed.
export function resetState() {
  return {
    type: RESET_STATE
  };
}

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
        dispatch(reset('iirFormDisabled'));
        dispatch(resetState());
        dispatch(toggleErrorModalState('Error Happened'));
      }

      ipcRenderer.removeListener('asynchronous-reply', handleGetWorkOrderDataResp);
    };
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', handleGetWorkOrderDataResp);
  };
}

export function getIIRData(workOrder: {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}) {
  console.log('Get IIR Data');
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    dispatch(resetState());
    dispatch(reset('iirForm'));
    console.log('State:', state);
    // Reset to default false state posting Notes
    if (state.postIIRNotes) {
      dispatch(togglePostIIRNotes());
    }
    // Reset display off if IIR form if sate its on
    if (state.iirFormDisplay) {
      dispatch(toggleIIRAddEditState());
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
    const handleGeIIRDataResp = (_event: {}, resp: { error: {}; data: {} }) => {
      console.log('handle iir data: ', resp);
        // Turn off the loading screen once we receive a response.
        dispatch(toggleLoadingScreenState());
      if (Object.keys(resp.error).length === 0) {
        // If there is no data and the postIIRNotes is false, set postIIRNotes to true
        if (resp.data.length === 0) {
          dispatch(togglePostIIRNotes());
        }
        dispatch(setWorkOrder(workOrder));
        dispatch(setWorkOrderData(resp.data));
        dispatch(toggleIIRAddEditState());
      } else {
        dispatch(toggleErrorModalState('Error Happened'));
      }

      ipcRenderer.removeListener('asynchronous-reply', handleGeIIRDataResp);
    };
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(reset('iirForm'));
    dispatch(resetState());
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', handleGeIIRDataResp);
  };
}

export function postOrUpdateIIRReport(iirNotes: {
  customerReasonForRemoval: string | null;
  evalFindings: string | null;
  genConditionReceived: string | null;
  workedPerformed: string | null;
}) {
  console.log('IIR notes: ', iirNotes);

  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    let request = 'updateIIRReport';
    console.log('State:', state);
    // Changes from updating IIR notes to Adding IIR notes if there was no record.
    if (state.postIIRNotes) {
      request = 'postIIRReport';
    }
    // TODO: SETUP updateIIRReport api.
    const mainRequest = {
      request,
      SalesOrderNumber: state.workOrder.workOrderSearch,
      salesOrderNumberLine: state.workOrder.workOrderSearchLineItem,
      customerReasonForRemoval: iirNotes.customerReasonForRemoval,
      genConditionReceived: iirNotes.genConditionReceived,
      evalFindings: iirNotes.evalFindings,
      workedPerformed: iirNotes.workedPerformed
    };

    console.log('main Request: ', mainRequest);
    const handlePostIIRResp = (_event: {}, resp: { error: {}; data: {} }) => {

      console.log('handle data: ', resp);

      dispatch(toggleLoadingScreenState());

      if (Object.keys(resp.error).length === 0) {
        const iirRequest = {
          workOrderSearch: state.workOrder.workOrderSearch,
          workOrderSearchLineItem: state.workOrder.workOrderSearchLineItem
        }
        dispatch(getIIRData(iirRequest));
        dispatch(toggleSuccessModalState('Succesfully updated IIR notes!'));
      } else {
        dispatch(
          toggleErrorModalState(
            'Somthing went wrong updating or adding IIR notes!'
          )
        );
      }

      ipcRenderer.removeListener('asynchronous-reply', handlePostIIRResp);
    };
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', handlePostIIRResp);
  };
}
