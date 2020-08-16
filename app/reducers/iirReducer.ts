import { Action } from 'redux';
import {
  TOGGLE_PDF_DISPLAY,
  TOGGLE_LOADING_SCREEN_DISPLAY,
  SET_WORK_ORDER,
  SET_WORK_ORDER_DATA,
  TOGGLE_IIR_EDIT_STATE,
  TOGGLE_POST_IIR_NOTES
} from '../actions/iirActions';

const IState = {
  loadPDF: false,
  iirFormDisplay: false,
  loadingScreen: false,
  postIIRNotes: false,
  workOrder: {},
  workOrderInfo: {}
};

export interface CustomAction extends Action {
  type: string;
  resp?: {};
}

export default function iir(state = IState, action: CustomAction) {
  switch (action.type) {
    case TOGGLE_PDF_DISPLAY:
      return {
        ...state,
        loadPDF: !state.loadPDF
      };
    case TOGGLE_LOADING_SCREEN_DISPLAY:
      return {
        ...state,
        loadingScreen: !state.loadingScreen
      };
    case TOGGLE_IIR_EDIT_STATE:
      return {
        ...state,
        iirFormDisplay: !state.iirFormDisplay
      };
    case SET_WORK_ORDER:
      return {
        ...state,
        workOrder: action.resp
      };
    case TOGGLE_POST_IIR_NOTES:
      return {
        ...state,
        postIIRNotes: !state.iirFormDisplay
      };
    case SET_WORK_ORDER_DATA:
      return {
        ...state,
        workOrderInfo: action.resp
      };
    default:
      return state;
  }
}
