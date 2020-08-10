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
    }

    const handleGetDataResp = (_event: {}, resp: { error: {}; data: {} }) => {
      console.log('handle data: ', resp);
      ipcRenderer.removeListener('asynchronous-replay', handleGetDataResp);
    }
    ipcRenderer.send('asynchronous-message', mainRequest);
    console.log('request sent');
    ipcRenderer.on('asynchronous-replay', handleGetDataResp);
  }
}
