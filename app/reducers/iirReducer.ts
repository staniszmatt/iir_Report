import { Action } from 'redux';
// eslint-disable-next-line import/no-cycle
import {
  RESET_STATE,
  TOGGLE_PDF_DISPLAY,
  TOGGLE_LOADING_SCREEN_DISPLAY_ON,
  TOGGLE_LOADING_SCREEN_DISPLAY_OFF,
  SET_WORK_ORDER,
  SET_WORK_ORDER_DATA,
  TOGGLE_IIR_EDIT_STATE,
  TOGGLE_POST_IIR_NOTES,
  TOGGLE_DISPLAY_OPEN_PDF_BTN,
  RESET_DISPLAY_STATE
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
    case TOGGLE_LOADING_SCREEN_DISPLAY_ON:
      return {
        ...state,
        loadingScreen: true
      };
    case TOGGLE_LOADING_SCREEN_DISPLAY_OFF:
      return {
        ...state,
        loadingScreen: false
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
        loadingScreen: false,
        loadPDF: false,
        iirFormDisplay: false,
        postIIRNotes: false,
        diplayOpenPDFBtn: false,
        workOrder: {},
        workOrderInfo: {}
      };
    case RESET_DISPLAY_STATE:
      return {
        ...state,
        loadingScreen: true,
        loadPDF: false,
        iirFormDisplay: false,
        postIIRNotes: false,
        diplayOpenPDFBtn: false
      };
    default:
      return state;
  }
}
