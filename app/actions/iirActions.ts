import { ipcRenderer } from 'electron';
import { GetIIRState, Dispatch } from '../reducers/types';
import { toggleErrorModalState, toggleSuccessModalState } from './modalActions';

export const TOGGLE_PDF_DISPLAY = 'TOGGLE_PDF_DISPLAY';
export const TOGGLE_LOADING_SCREEN_DISPLAY = 'TOGGLE_LOADING_SCREEN_DISPLAY';
export const SET_WORK_ORDER = 'SET_WORK_ORDER';
export const SET_WORK_ORDER_DATA = 'SET_WORK_ORDER_DATA';

export function toggleDisplayPDFFormState() {
  return {
    type: TOGGLE_PDF_DISPLAY
  };
}

export function toggleLoadingScreenState() {
  return {
    type: TOGGLE_LOADING_SCREEN_DISPLAY
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

      if (Object.keys(resp.error).length === 0) {
        if (!resp.data.length === 0) {
          dispatch(
            toggleErrorModalState(
              `Could not find WO: ${workOrder.workOrderSearch}-${workOrder.workOrderSearchLineItem}`
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

export function postIIRReport(_iirData: {}) {
  console.log('Post IIR data');

  return (dispatch: Dispatch, getState: GetIIRState) => {
    const state = getState().iir;
    console.log('State:', state);

    const mainRequest = {
      request: 'postIIRReport',
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
