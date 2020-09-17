/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer, shell } from 'electron';
import { reset } from 'redux-form';
import fs from 'fs';
import { GetIIRState, Dispatch } from '../reducers/types';
import { toggleErrorModalState, toggleSuccessModalState } from './modalActions';

export const RESET_STATE = 'RESET_STATE';
export const TOGGLE_PDF_DISPLAY = 'TOGGLE_PDF_DISPLAY';
// eslint-disable-next-line prettier/prettier
export const TOGGLE_LOADING_SCREEN_DISPLAY_ON = 'TOGGLE_LOADING_SCREEN_DISPLAY_ON';
// eslint-disable-next-line prettier/prettier
export const TOGGLE_LOADING_SCREEN_DISPLAY_OFF = 'TOGGLE_LOADING_SCREEN_DISPLAY_OFF';
export const TOGGLE_IIR_EDIT_STATE = 'TOGGLE_IIR_EDIT_STATE';
export const SET_WORK_ORDER = 'SET_WORK_ORDER';
export const SET_WORK_ORDER_DATA = 'SET_WORK_ORDER_DATA';
export const TOGGLE_POST_IIR_NOTES = 'SET_POST_IIR_NOTES';
export const TOGGLE_DISPLAY_OPEN_PDF_BTN = 'TOGGLE_DISPLAY_OPEN_PDF_BTN';

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

export function toggleDisplayOpenPDFBTnState() {
  return {
    type: TOGGLE_DISPLAY_OPEN_PDF_BTN
  };
}

export function togglePostIIRNotes() {
  return {
    type: TOGGLE_POST_IIR_NOTES
  };
}

export function toggleLoadingScreenState() {
  return {
    type: TOGGLE_LOADING_SCREEN_DISPLAY_ON
  };
}

export function toggleLoadingScreenStateOff() {
  return {
    type: TOGGLE_LOADING_SCREEN_DISPLAY_OFF
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

export function checkForPDFFile(workOrderString: string) {
  return (dispatch: Dispatch) => {
    const filePath = `\\\\AMR-FS1\\Scanned\\CPLT_TRAVELERS\\TearDowns\\${workOrderString}_TEAR_DOWN.pdf`;
    // If the file is already created and saved in the correct location, then display the open pdf button.
    if (fs.existsSync(filePath)) {
      dispatch(toggleDisplayOpenPDFBTnState());
    }
  };
}

export function getIIRData(workOrder: {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
  // AutoEmailer sent to be called when Adding or Updating notes and why is optional.
  callAutoEmailer?: any;
  callSuccessModal?: any;
}) {
  return (dispatch: Dispatch) => {
    dispatch(resetState());
    dispatch(reset('iirForm'));

    if (workOrder.workOrderSearchLineItem.length === 1) {
      // Disabled here because we need to keep it at a two char of 0x where x is a number.
      // eslint-disable-next-line no-param-reassign
      workOrder.workOrderSearchLineItem = `0${workOrder.workOrderSearchLineItem}`;
    }

    const mainRequest = {
      request: 'getIIRData',
      workOrder
    };

    const handleGeIIRDataResp = (
      _event: {},
      resp: {
        error: { code: string; name: string };
        data: { length: number; customerReasonForRemoval: string | null };
      }
    ) => {
      // Turn off the loading screen once we receive a response.
      dispatch(toggleLoadingScreenStateOff());

      if (Object.keys(resp.error).length === 0) {
        // If there is no note data and set to null, set postIIRNotes to true
        if (resp.data.customerReasonForRemoval === null) {
          dispatch(togglePostIIRNotes());
        }
        const workOrderString = `${workOrder.workOrderSearch}-${workOrder.workOrderSearchLineItem}`;
        dispatch(setWorkOrder(workOrder));
        dispatch(setWorkOrderData(resp.data));
        dispatch(toggleIIRAddEditState());
        dispatch(checkForPDFFile(workOrderString));

        if (typeof workOrder.callAutoEmailer === 'function') {
          workOrder.callSuccessModal('Success');
          workOrder.callAutoEmailer();
        }
      } else if (
        Object.prototype.hasOwnProperty.call(resp.error, 'noWorkOrder')
      ) {
        dispatch(toggleErrorModalState(resp.error));
      } else {
        const returnError = { error: '' };
        if (Object.keys(resp.error).length > 1) {
          returnError.error = `${resp.error.code}: ${resp.error.name}`;
        } else {
          returnError.error =
            'Something went wrong updating or adding IIR notes!';
        }
        dispatch(toggleErrorModalState(returnError));
      }
      ipcRenderer.removeListener('asynchronous-reply', handleGeIIRDataResp);
    };
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(reset('iirForm'));
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', handleGeIIRDataResp);
  };
}

export function autoEmailer() {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState();
    const {
      SalesOrderNumber,
      ItemNumber,
      PartNumber,
      CustomerName,
      customerReasonForRemoval,
      genConditionReceived,
      evalFindings,
      workedPerformed
    } = state.iir.workOrderInfo;

    const mainRequest = {
      request: 'emailer',
      testInfo: {
        workOrder: `${SalesOrderNumber}-${ItemNumber}`,
        CustomerName,
        PartNumber,
        customerReasonForRemoval,
        genConditionReceived,
        evalFindings,
        workedPerformed
      }
    };

    const handleEmailerResp = (
      _event: {},
      resp: {
        error: { name: string; code: string };
        data: {};
        success: boolean;
      }
    ) => {
      if (!resp.success) {
        const error = {
          errorNotFound: `Couldn't send RepairCS Update Email, Please send an email if successfully Added or Updated Notes!`
        };

        const checkModalStatus = () => {
          const modalState: any = getState();
          if (!modalState.modals.successModalState) {
            dispatch(toggleErrorModalState(error));
            clearInterval(timerCheck);
          }
        };
        const timerCheck = setInterval(checkModalStatus, 1000);
      }
      ipcRenderer.removeListener('asynchronous-reply', handleEmailerResp);
    };

    ipcRenderer.send('asynchronous-message', mainRequest);
    ipcRenderer.on('asynchronous-reply', handleEmailerResp);
  };
}

// This will only be exacutable if checkForPDFFile finds the file and sets the display open pdf btn to true.
export function openPDF() {
  return (_dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    const workOrderString = `${state.workOrder.workOrderSearch}-${state.workOrder.workOrderSearchLineItem}`;
    const filePath = `\\\\AMR-FS1\\Scanned\\CPLT_TRAVELERS\\TearDowns\\${workOrderString}_TEAR_DOWN.pdf`;
    shell.openItem(filePath);
  };
}

export function getWorkOrderData(workOrder: {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}) {
  return (dispatch: Dispatch) => {
    // Reset states and clear the current iir form if displayed
    dispatch(reset('iirFormDisabled'));
    dispatch(resetState());

    if (workOrder.workOrderSearchLineItem.length === 1) {
      // Disabled here because we need to keep it at a two char of 0x where x is a number.
      // eslint-disable-next-line no-param-reassign
      workOrder.workOrderSearchLineItem = `0${workOrder.workOrderSearchLineItem}`;
    }

    const mainRequest = {
      request: 'getWorkOrderData',
      workOrderSearch: workOrder.workOrderSearch,
      workOrderSearchLineItem: workOrder.workOrderSearchLineItem
    };
    const handleGetWorkOrderDataResp = (
      _event: {},
      resp: { error: { code: string; name: string }; data: object[] }
    ) => {
      dispatch(toggleLoadingScreenStateOff());
      // Checking no errors
      if (Object.keys(resp.error).length === 0) {
        // Checking if data is empty and the edit form search is false
        if (resp.data.length === 0) {
          const error = {
            errorNotFound: `Could not find WO: ${workOrder.workOrderSearch}-${workOrder.workOrderSearchLineItem}. Double check WO is correct.`
          };
          dispatch(toggleErrorModalState(error));
        } else {
          const workOrderString = `${workOrder.workOrderSearch}-${workOrder.workOrderSearchLineItem}`;
          dispatch(setWorkOrder(workOrder));
          dispatch(setWorkOrderData(resp.data[0]));
          dispatch(toggleDisplayPDFFormState());
          dispatch(checkForPDFFile(workOrderString));
        }
      } else {
        dispatch(reset('iirFormDisabled'));
        dispatch(resetState());
        const returnError = { error: '' };
        if (Object.keys(resp.error).length > 1) {
          returnError.error = `${resp.error.code}: ${resp.error.name}`;
        } else {
          returnError.error =
            'Something went wrong updating or adding IIR notes!';
        }
        dispatch(toggleErrorModalState(returnError));
      }

      ipcRenderer.removeListener(
        'asynchronous-reply',
        handleGetWorkOrderDataResp
      );
    };
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', handleGetWorkOrderDataResp);
  };
}

export function postOrUpdateIIRReport(iirNotes: {
  customerReasonForRemoval: string | null;
  evalFindings: string | null;
  genConditionReceived: string | null;
  workedPerformed: string | null;
}) {
  // Cancel out if nothing was changed.
  debugger;
  if (
    iirNotes.customerReasonForRemoval === null &&
    iirNotes.evalFindings === null &&
    iirNotes.genConditionReceived === null &&
    iirNotes.workedPerformed === null
  ) {
    return;
  }

  console.log('update notes request notes change: ', iirNotes);

  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    let request = 'updateIIRReport';
    // Changes from updating IIR notes to Adding IIR notes if there was no record.
    if (state.postIIRNotes) {
      request = 'postIIRReport';
    }

    const mainRequest = {
      request,
      SalesOrderNumber: state.workOrder.workOrderSearch,
      salesOrderNumberLine: state.workOrder.workOrderSearchLineItem,
      customerReasonForRemoval: iirNotes.customerReasonForRemoval,
      genConditionReceived: iirNotes.genConditionReceived,
      evalFindings: iirNotes.evalFindings,
      workedPerformed: iirNotes.workedPerformed
    };
    const handlePostIIRResp = (
      _event: {},
      resp: { error: { name: string; code: string }; data: {} }
    ) => {
      dispatch(toggleLoadingScreenStateOff());
      if (Object.keys(resp.error).length === 0) {
        const workOrder = {
          workOrderSearch: state.workOrder.workOrderSearch,
          workOrderSearchLineItem: state.workOrder.workOrderSearchLineItem,
          callAutoEmailer: () => {
            dispatch(autoEmailer());
          },
          callSuccessModal: () => {
            dispatch(toggleSuccessModalState('Successfully updated notes!'));
          }
        };
        // Callback for autoEmailer and success modal only if the updated workOrder Info succuessfully updates state
        dispatch(getIIRData(workOrder));

        // TODO: Setup move PDF if it exists.
        // When changes are made, need to move the current PDF out to prevent people pulling a none updated PDF.
      } else {
        const returnError = { error: '' };
        if (Object.keys(resp.error).length > 1) {
          returnError.error = `${resp.error.code}: ${resp.error.name}`;
        } else {
          returnError.error =
            'Something went wrong updating or adding IIR notes!';
        }
        dispatch(toggleErrorModalState(returnError));
      }

      ipcRenderer.removeListener('asynchronous-reply', handlePostIIRResp);
    };
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', handlePostIIRResp);
  };
}

export function handleEditIIRPDF() {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    const workOrder = {
      workOrderSearch: state.workOrder.workOrderSearch,
      workOrderSearchLineItem: state.workOrder.workOrderSearchLineItem
    };

    dispatch(getIIRData(workOrder));
  };
}

export function handleReviewIIRPDF() {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    const workOrder = {
      workOrderSearch: state.workOrder.workOrderSearch,
      workOrderSearchLineItem: state.workOrder.workOrderSearchLineItem
    };

    dispatch(getWorkOrderData(workOrder));
  };
}

export function cancelLoading() {
  // Resets the state, removes loading screen and clears the listner that
  // could be setup to prevent aditional server request issues when cancling
  // a loading state.
  return (dispatch: Dispatch) => {
    dispatch(resetState());
    ipcRenderer.removeAllListeners('asynchronous-reply');
  };
}
