import { Action } from 'redux';
import { TOGGLE_PDF_DISPLAY }  from '../actions/iirActions';

const IState = {
  loadPDF: false,
  workOrder: '',
  workOrderLine: '',
  workOrderInfo: {}
};

export interface CustomAction extends Action {
  type: string;
  resp?: {
    list?: [] | undefined;
    error?: {} | undefined;
  };
}

export default function iir(state = IState, action: Action) {
  switch (action.type) {
    case TOGGLE_PDF_DISPLAY:
      return {
        ...state,
        loadPDF: !state.loadPDF
      }
    default:
      return state;
  }
}
