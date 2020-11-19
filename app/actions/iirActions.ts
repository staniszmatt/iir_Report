/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer, shell } from 'electron';
import { reset } from 'redux-form';
import fs from 'fs';
import { GetIIRState, Dispatch } from '../reducers/types';
import {
  toggleModalState,
  toggleWarningModalState,
  toggleErrorModalState,
  toggleSuccessModalState
} from './modalActions';

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
export const RESET_DISPLAY_STATE = 'RESET_DISPLAY_STATE';
export const TOGGLE_SEND_EMAIL_ON = 'TOGGLE_SEND_EMAIL_ON';
export const TOGGLE_SEND_EMAIL_OFF = 'TOGGLE_SEND_EMAIL_OFF';
export const TOGGLE_SUCCESS_UPDATE_MODAL_ON = 'TOGGLE_SUCCESS_UPDATE_MODAL_ON';
export const TOGGLE_SUCCESS_UPDATE_MODAL_OFF =
  'TOGGLE_SUCCESS_UPDATE_MODAL_OFF';
export const GET_VERSION = 'GET_VERSION';

export interface WorkOrder {
  callAutoEmailer?: () => {} | any;
  callSuccessModal?: () => {} | any;
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}

// Sets state booleans to false so to turn on only what is needed.
export function resetState() {
  return {
    type: RESET_STATE
  };
}

export function softResetState() {
  return {
    type: RESET_DISPLAY_STATE
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

export function toggleSendEmailStateOn() {
  return {
    type: TOGGLE_SEND_EMAIL_ON
  };
}

export function toggleSendEmailStateOff() {
  return {
    type: TOGGLE_SEND_EMAIL_OFF
  };
}

export function toggleSuccessUpdateModalOn() {
  return {
    type: TOGGLE_SUCCESS_UPDATE_MODAL_ON
  };
}

export function toggleSuccessUpdateModalOff() {
  return {
    type: TOGGLE_SUCCESS_UPDATE_MODAL_OFF
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

export function setGetVersion(resp: string) {
  return {
    type: GET_VERSION,
    resp
  };
}





// TODO: Setup Testing
export function updateAPELinkWorkOrder(workOrderToLink: {
  linkWorkOrder: string;
}) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    console.log('Update APE Link Clicked', workOrderToLink);
  };
}








// TODO: Setup Testing
export function removeAPELinkWorkOrder(event: {}) {
  return (dispatch: Dispatch, getState: GetIIRState) => {

    console.log('Remove APE Link Clicked', event);

  };
}










// TODO: Setup Testing
export function warnRemoveAPELinkWorkOrder(event) {
  return (dispatch: Dispatch, getState: GetIIRState) => {

    console.log('Warn Clicked', event);

    const state = getState();
    const warningModalResp = {
      warningMsg: `Are you sure you wish to remove link to WO?`,
      btnLbl: 'Remove Link',
      actionFunction: () => {
        dispatch(removeAPELinkWorkOrder(event));
      },
      closeModal: () => {
        toggleModalState();
      }
    };

    dispatch(toggleWarningModalState(warningModalResp));
  };
}

// TODO: Setup Testing
export function handleLinkWorkOrder(
  _event: {},
  resp: {
    error: { code: string; name: string } | any;
    data: {};
  }
) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    // Turn off the loading screen once we receive a response.
    dispatch(toggleLoadingScreenStateOff());

    if (Object.keys(resp.error).length === 0) {
      dispatch(getIIRData(state.workOrder));
      dispatch(toggleSuccessModalState('Successfully Linked Orders!'));
    } else {
      dispatch(toggleErrorModalState(resp.error));
    }
  };
}

// TODO: Setup Testing
export function linkWorkOrder(workOrderToLink: { linkWorkOrderToAPE: string }) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    // Soft Reset to keep current work order info.
    dispatch(softResetState());
    const state = getState().iir;
    const { linkWorkOrderToAPE } = workOrderToLink;

    const mainRequest = {
      request: 'updateLinkWorkOrderToAPE',
      workOrderToLink: linkWorkOrderToAPE,
      originalWorkOrder: {
        workOrder: state.workOrder.workOrderSearch,
        lineItem: state.workOrder.workOrderSearchLineItem
      }
    };
    const callBackFunction = (
      event: {},
      resp: {
        error: { code: string; name: string };
        data: {};
      }
    ) => {
      dispatch(handleLinkWorkOrder(event, resp));
      ipcRenderer.removeListener('asynchronous-reply', callBackFunction);
    };

    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', callBackFunction);
  };
}

// TODO: Setup Testing
export function handleGetVersion(_event: {}, resp: { version: string }) {
  return (dispatch: Dispatch) => {
    dispatch(setGetVersion(resp.version));
  };
}
// TODO: Setup Testing
export function getVersion() {
  return (dispatch: Dispatch) => {
    const callHandleGetVersion = (event: {}, resp: { version: string }) => {
      dispatch(handleGetVersion(event, resp));
      ipcRenderer.removeListener('app_version', callHandleGetVersion);
    };
    ipcRenderer.send('app_version');
    ipcRenderer.on('app_version', callHandleGetVersion);
  };
}
// TODO: Setup Testing
export function checkForPDFFile(workOrderString: string) {
  return (dispatch: Dispatch) => {
    const filePath = `\\\\AMR-FS1\\Scanned\\CPLT_TRAVELERS\\TearDowns\\${workOrderString}_TEAR_DOWN.pdf`;
    // If the file is already created and saved in the correct location, then display the open pdf button.
    if (fs.existsSync(filePath)) {
      dispatch(toggleDisplayOpenPDFBTnState());
    }
  };
}
// TODO: Setup Testing
export function savePDF(pdfData: {} | any) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    const workOrder = {
      workOrderSearch: state.workOrder.workOrderSearch,
      workOrderSearchLineItem: state.workOrder.workOrderSearchLineItem
    };

    const u8 = new Uint8Array(pdfData);
    const workOrderString = `${state.workOrder.workOrderSearch}-${state.workOrder.workOrderSearchLineItem}`;
    const filePath = `\\\\AMR-FS1\\Scanned\\CPLT_TRAVELERS\\TearDowns\\${workOrderString}_TEAR_DOWN.pdf`;

    if (fs.existsSync(filePath)) {
      const error = {
        errorNotFound: `WO: ${workOrderString} has already been saved!`
      };
      dispatch(toggleErrorModalState(error));
      return;
    }

    fs.writeFileSync(
      `\\\\AMR-FS1\\Scanned\\CPLT_TRAVELERS\\TearDowns\\${workOrderString}_TEAR_DOWN.pdf`,
      u8
    );
    dispatch(getWorkOrderData(workOrder));
  };
}
// TODO: Setup Testing
export function handleGeIIRDataResp(
  _event: {},
  resp: {
    error: { code: string; name: string } | any;
    data: {
      length: number;
      customerReasonForRemoval: string | null;
      recordPresent: boolean;
      CustomerNumber: string;
    };
  }
) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    // Turn off the loading screen once we receive a response.
    dispatch(toggleLoadingScreenStateOff());

    if (Object.keys(resp.error).length === 0) {
      // If there is no note data and set to null, set postIIRNotes to true
      if (!resp.data.recordPresent) {
        dispatch(togglePostIIRNotes());
      }

      const workOrderString = `${state.workOrder.workOrderSearch}-${state.workOrder.workOrderSearchLineItem}`;

      // TODO: Setup async for dispatch(setWorkOrderData(resp.data)); to call workOrder.callAutoEmailer(); when loaded.
      // Once in a great while autoEmailer runs before data is saved to state.
      // Reference https://redux.js.org/tutorials/essentials/part-5-async-logic on Detailed Explanation
      dispatch(setWorkOrderData(resp.data));
      dispatch(toggleIIRAddEditState());
      dispatch(checkForPDFFile(workOrderString));
      // Checking if email needs sent.
      if (state.sendEmail) {
        dispatch(autoEmailer());
        dispatch(toggleSendEmailStateOff());
      }
      // Checking if Success update modal needs called.
      if (state.successUpdateModalCall) {
        dispatch(toggleSuccessModalState('Successfully updated notes!'));
        dispatch(toggleSuccessUpdateModalOff());
      }
    } else if (
      Object.prototype.hasOwnProperty.call(resp.error, 'noWorkOrder')
    ) {
      dispatch(toggleErrorModalState(resp.error));
    } else {
      dispatch(toggleErrorModalState(resp.error));
    }
  };
}
// TODO: Setup Testing
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
      request: 'getWorkOrderData',
      workOrderSearch: workOrder.workOrderSearch,
      workOrderSearchLineItem: workOrder.workOrderSearchLineItem
    };

    dispatch(setWorkOrder(workOrder));
    const callBackFunction = (
      event: {},
      resp: {
        error: { code: string; name: string } | any;
        data: {
          length: number;
          customerReasonForRemoval: string | null;
          recordPresent: boolean;
          CustomerNumber: string;
        };
      }
    ) => {
      dispatch(handleGeIIRDataResp(event, resp));
      ipcRenderer.removeListener('asynchronous-reply', callBackFunction);
    };

    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(reset('iirForm'));
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', callBackFunction);
  };
}
// TODO: Setup Testing
export function handleEmailerResp(
  _event: {},
  resp: {
    error: {};
    data: {};
    success: boolean;
  }
) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
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
  };
}
// TODO: Setup Testing
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
      evalFindings
    } = state.iir.workOrderInfo;

    const mainRequest = {
      request: 'emailer',
      testInfo: {
        workOrder: `${SalesOrderNumber}-${ItemNumber}`,
        CustomerName,
        PartNumber,
        customerReasonForRemoval,
        genConditionReceived,
        evalFindings
      }
    };
    // TODO: Setup Testing
    // Setup to dispatch with callback function and can then cancel that specific listener when received.
    const callBackFunction = (
      event: {},
      resp: {
        error: {};
        data: {};
        success: boolean;
      }
    ) => {
      dispatch(handleEmailerResp(event, resp));
      ipcRenderer.removeListener('asynchronous-reply', callBackFunction);
    };

    ipcRenderer.send('asynchronous-message', mainRequest);
    ipcRenderer.on('asynchronous-reply', callBackFunction);
  };
}
// TODO: Setup Testing
// This will only be exactable if checkForPDFFile finds the file and sets the display open pdf btn to true.
export function openPDF() {
  return (_dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    const workOrderString = `${state.workOrder.workOrderSearch}-${state.workOrder.workOrderSearchLineItem}`;
    const filePath = `\\\\AMR-FS1\\Scanned\\CPLT_TRAVELERS\\TearDowns\\${workOrderString}_TEAR_DOWN.pdf`;
    shell.openItem(filePath);
  };
}
// TODO: Setup Testing
export function handleGetWorkOrderDataResp(
  _event: {},
  resp: {
    error: { code: string; name: string };
    data: {
      Work_Order_Number: string;
      ItemNumber: string;
      CustomerNumber: string;
    };
  }
) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    dispatch(toggleLoadingScreenStateOff());
    const { workOrderSearch, workOrderSearchLineItem } = state.workOrder;

    // Checking no errors
    if (Object.keys(resp.error).length === 0) {
      // Checking if data is empty and the edit form search is false
      const workOrderString = `${workOrderSearch}-${workOrderSearchLineItem}`;

      dispatch(setWorkOrderData(resp.data));
      dispatch(toggleDisplayPDFFormState());
      dispatch(checkForPDFFile(workOrderString));
    } else if (
      Object.prototype.hasOwnProperty.call(resp.error, 'noWorkOrder')
    ) {
      dispatch(toggleErrorModalState(resp.error));
    } else {
      dispatch(toggleErrorModalState(resp.error));
    }
  };
}
// TODO: Setup Testing
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
    // Setup to dispatch with callback function and can then cancel that specific listener when received.
    const callBackFunction = (
      event: {},
      resp: {
        error: { code: string; name: string };
        data: {
          Work_Order_Number: string;
          ItemNumber: string;
          CustomerNumber: string;
        };
      }
    ) => {
      dispatch(handleGetWorkOrderDataResp(event, resp));
      ipcRenderer.removeListener('asynchronous-reply', callBackFunction);
    };

    dispatch(setWorkOrder(workOrder));
    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', callBackFunction);
  };
}
// TODO: Setup Testing
export function postUpdatePDFCheck(iirNotes: {
  customerReasonForRemoval: string | any;
  evalFindings: string | any;
  genConditionReceived: string | any;
  workedPerformed: string | any;
}) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    // When Work Order is searched, it will set state true if a PDF exists. Then setup to move it to the old folder since a change to notes were made.
    if (state.displayOpenPDFBtn) {
      const dateTime = Date.now();
      const workOrderString = `${state.workOrder.workOrderSearch}-${state.workOrder.workOrderSearchLineItem}`;
      const oldPath = `\\\\AMR-FS1\\Scanned\\CPLT_TRAVELERS\\TearDowns\\${workOrderString}_TEAR_DOWN.pdf`;
      const newPath = `\\\\AMR-FS1\\Scanned\\CPLT_TRAVELERS\\TearDowns\\old\\${workOrderString}_TEAR_DOWN_${dateTime}.pdf`;

      fs.rename(oldPath, newPath, err => {
        if (err) {
          const returnError = {
            error: `FILE ${workOrderString}_TEAR_DOWN is currently open, please close first before you can submit changes!`
          };
          dispatch(toggleErrorModalState(returnError));
        } else {
          dispatch(postOrUpdateIIRReport(iirNotes));
        }
      });
    } else {
      dispatch(postOrUpdateIIRReport(iirNotes));
    }
  };
}
// TODO: Setup Testing
export function handlePostIIRResp(
  _event: {},
  resp: { error: { name: string; code: string }; data: {} }
) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    dispatch(toggleLoadingScreenStateOff());
    if (Object.keys(resp.error).length === 0) {
      const workOrder: WorkOrder = {
        workOrderSearch: state.workOrder.workOrderSearch,
        workOrderSearchLineItem: state.workOrder.workOrderSearchLineItem
      };
      // Callback for autoEmailer and success modal only if the updated workOrder Info successfully updates state
      dispatch(getIIRData(workOrder));
    } else {
      let returnError = {};

      if (Object.keys(resp.error).length > 1) {
        returnError = resp.error;
      } else {
        returnError = {
          error: 'Something went wrong updating or adding IIR notes!'
        };
      }
      dispatch(toggleErrorModalState(returnError));
    }
  };
}
// TODO: Setup Testing
export function postOrUpdateIIRReport(iirNotes: {
  customerReasonForRemoval: string | any;
  evalFindings: string | any;
  genConditionReceived: string | any;
  workedPerformed: string | any;
}) {
  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    // When changes are made, need to move the current PDF out to prevent people pulling a none updated PDF.
    // If values are not changed, then set them to null
    const valueChangeCheck = (stateValue: string, receivedValue: string) => {
      if (stateValue === receivedValue || receivedValue === null) {
        return null;
      }
      return receivedValue;
    };
    // Setup value checks to use for comparing and returning null values.
    const valueChangeCheckCustomerReasonForRemoval = valueChangeCheck(
      state.workOrderInfo.customerReasonForRemoval,
      iirNotes.customerReasonForRemoval
    );
    const valueChangeCheckEvalFindings = valueChangeCheck(
      state.workOrderInfo.evalFindings,
      iirNotes.evalFindings
    );
    const valueChangeCheckGenConditionReceived = valueChangeCheck(
      state.workOrderInfo.genConditionReceived,
      iirNotes.genConditionReceived
    );
    const valueChangeCheckWorkedPerformed = valueChangeCheck(
      state.workOrderInfo.workedPerformed,
      iirNotes.workedPerformed
    );

    // Cancel out if nothing was changed.
    if (
      valueChangeCheckCustomerReasonForRemoval === null &&
      valueChangeCheckEvalFindings === null &&
      valueChangeCheckGenConditionReceived === null &&
      valueChangeCheckWorkedPerformed === null
    ) {
      const returnError = {
        error: 'Nothing was changed! Please make changes to submit.'
      };

      dispatch(toggleErrorModalState(returnError));
      return;
    }

    let request = 'updateIIRReport';
    // Changes from updating IIR notes to Adding IIR notes if there was no record.
    if (state.postIIRNotes) {
      request = 'postIIRReport';
    }

    if (
      valueChangeCheckCustomerReasonForRemoval !== null ||
      valueChangeCheckEvalFindings !== null ||
      valueChangeCheckGenConditionReceived !== null
    ) {
      dispatch(toggleSendEmailStateOn());
    }
    dispatch(toggleSuccessUpdateModalOn());

    let linkedWorkOrderIfAPE = null;
    if (
      state.workOrderInfo.linkedWorkOrderIfAPE &&
      state.workOrderInfo.linkedWorkOrderIfAPE.length > 0
    ) {
      linkedWorkOrderIfAPE = state.workOrderInfo.linkedWorkOrderIfAPE;
    }

    const mainRequest = {
      request,
      linkedWorkOrderIfAPE,
      SalesOrderNumber: state.workOrder.workOrderSearch,
      salesOrderNumberLine: state.workOrder.workOrderSearchLineItem,
      customerReasonForRemoval: iirNotes.customerReasonForRemoval,
      genConditionReceived: iirNotes.genConditionReceived,
      evalFindings: iirNotes.evalFindings,
      workedPerformed: iirNotes.workedPerformed
    };
    // Setup to dispatch with callback function and can then cancel that specific listener when received.
    const callBackFunction = (
      event: {},
      resp: { error: { code: string; name: string }; data: object[] }
    ) => {
      dispatch(handlePostIIRResp(event, resp));
      ipcRenderer.removeListener('asynchronous-reply', callBackFunction);
    };

    ipcRenderer.send('asynchronous-message', mainRequest);
    dispatch(toggleLoadingScreenState());
    ipcRenderer.on('asynchronous-reply', callBackFunction);
  };
}
// TODO: Setup Testing
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
// TODO: Setup Testing
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
// TODO: Setup Testing
export function cancelLoading() {
  // Resets the state, removes loading screen and clears the listener that
  // could be setup to prevent additional server request issues when canceling
  // a loading state.
  return (dispatch: Dispatch) => {
    dispatch(resetState());
    ipcRenderer.removeAllListeners('asynchronous-reply');
  };
}
