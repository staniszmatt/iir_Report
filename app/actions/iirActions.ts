import { ipcRenderer } from 'electron';
import { GetIIRState, Dispatch } from '../reducers/types';
import { toggleErrorModalState, toggleSuccessModalState } from './modalActions';


export const TOGGLE_PDF_DISPLAY = 'TOGGLE_PDF_DISPLAY';

export function toggleIIRState() {
  return {
    type: TOGGLE_PDF_DISPLAY
  };
}

export function getWorkOrderData(workOrder: {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}) {
  console.log('Get Work Order Data');
  return (dispatch: Dispatch, getstate: GetIIRState) => {
    const state = getstate().iir;
    console.log('State:', state);

    const workOrderNumber = `${workOrder.workOrderSearch}   ${workOrder.workOrderSearchLineItem}`;

    const mainRequest = {
      request: 'getWorkOrderData',
      workOrderNumber
    };

    console.log('Main Request:', mainRequest);

    const handleGetWorkOrderDataResp = (
      _event: {},
      resp: { error: {}; data: {} }
    ) => {
      console.log('handle data: ', resp);
      ipcRenderer.removeListener('asynchronous-replay', handleGetWorkOrderDataResp);
    }
    ipcRenderer.send('asynchronous-message', mainRequest);
    console.log('request sent');
    ipcRenderer.on('asynchronous-reply', handleGetWorkOrderDataResp);
  };
}

export function postIIRReport(_iirData: {}) {
  console.log('Post IIR data');

  return (dispatch: Dispatch, getstate: GetIIRState) => {
    const state = getstate().iir;
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
    console.log('Post IIR request sent');
    ipcRenderer.on('asynchronous-reply', handlePostIIRResp);
  };
}
