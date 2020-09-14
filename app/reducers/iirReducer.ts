import { Action } from 'redux';
import {
  RESET_STATE,
  TOGGLE_PDF_DISPLAY,
  TOGGLE_LOADING_SCREEN_DISPLAY,
  SET_WORK_ORDER,
  SET_WORK_ORDER_DATA,
  TOGGLE_IIR_EDIT_STATE,
  TOGGLE_POST_IIR_NOTES,
  TOGGLE_DISPLAY_OPEN_PDF_BTN
} from '../actions/iirActions';

const IState = {
  loadPDF: false,
  iirFormDisplay: false,
  loadingScreen: false,
  postIIRNotes: false,
  diplayOpenPDFBtn: false,
  workOrder: {},
  workOrderInfo: {}
};

export interface CustomAction extends Action {
  type: string;
  resp?: {};
}

export default function iir(state = IState, action: CustomAction) {
  switch (action.type) {
    case TOGGLE_LOADING_SCREEN_DISPLAY:
      return {
        ...state,
        loadingScreen: !state.loadingScreen
      };
    case TOGGLE_PDF_DISPLAY:
      return {
        ...state,
        loadPDF: true
      };
    case TOGGLE_DISPLAY_OPEN_PDF_BTN:
      return {
        ...state,
        diplayOpenPDFBtn: true
      };
    case TOGGLE_IIR_EDIT_STATE:
      return {
        ...state,
        iirFormDisplay: true
      };
    case TOGGLE_POST_IIR_NOTES:
      return {
        ...state,
        postIIRNotes: true
      };
    case SET_WORK_ORDER:
      return {
        ...state,
        workOrder: action.resp
      };
    case SET_WORK_ORDER_DATA:
      return {
        ...state,
        workOrderInfo: action.resp
      };
    case RESET_STATE:
      return {
        ...state,
        loadPDF: false,
        iirFormDisplay: false,
        postIIRNotes: false,
        diplayOpenPDFBtn: false,
        workOrder: {},
        workOrderInfo: {}
      };
    default:
      return state;
  }
}
