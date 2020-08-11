import { ipcRenderer } from 'electron';
import { GetIIRState, Dispatch } from '../reducers/types';
import { toggleErrorModalState, toggleSuccessModalState } from './modalActions';


export const TOGGLE_PDF_DISPLAY = 'TOGGLE_PDF_DISPLAY';

export function toggleIIRState() {
  return {
    type: TOGGLE_PDF_DISPLAY
  };
}

export function getData() {
  console.log('Get Data')
  return (dispatch: Dispatch, getstate: GetIIRState) => {
    const state = getstate().iir;
    console.log('State:', state);

    const mainRequest = {
      request: 'getData'
    };

    const handleGetDataResp = (_event: {}, resp: { error: {}; data: {} }) => {
      console.log('handle data: ', resp);
      ipcRenderer.removeListener('asynchronous-replay', handleGetDataResp);
    }
    ipcRenderer.send('asynchronous-message', mainRequest);
    console.log('request sent');
    ipcRenderer.on('asynchronous-reply', handleGetDataResp);
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
