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
  TOGGLE_APE_ORDER_STATE,
  TOGGLE_DISPLAY_OPEN_PDF_BTN,
  RESET_DISPLAY_STATE,
  TOGGLE_SEND_EMAIL_ON,
  TOGGLE_SEND_EMAIL_OFF,
  TOGGLE_SUCCESS_UPDATE_MODAL_ON,
  TOGGLE_SUCCESS_UPDATE_MODAL_OFF,
  GET_VERSION
} from '../actions/iirActions';

const IState = {
  loadPDF: false,
  iirFormDisplay: false,
  loadingScreen: false,
  postIIRNotes: false,
  displayOpenPDFBtn: false,
  sendEmail: false,
  successUpdateModalCall: false,
  apeWorkOrder: false,
  workOrder: {},
  workOrderInfo: {},
  appVersion: ''
};

export interface CustomAction extends Action {
  type: string;
  resp?: {};
}

export default function iir(state = IState, action: CustomAction) {
  switch (action.type) {
    case GET_VERSION:
      return {
        ...state,
        appVersion: action.resp
      };
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
    case TOGGLE_APE_ORDER_STATE:
      return {
        ...state,
        apeWorkOrder: true
      };
    case TOGGLE_SEND_EMAIL_ON:
      return {
        ...state,
        sendEmail: true
      };
    case TOGGLE_SEND_EMAIL_OFF:
      return {
        ...state,
        sendEmail: false
      };
    case TOGGLE_SUCCESS_UPDATE_MODAL_ON:
      return {
        ...state,
        successUpdateModalCall: true
      };
    case TOGGLE_SUCCESS_UPDATE_MODAL_OFF:
      return {
        ...state,
        successUpdateModalCall: false
      };
    case TOGGLE_PDF_DISPLAY:
      return {
        ...state,
        loadPDF: true
      };
    case TOGGLE_DISPLAY_OPEN_PDF_BTN:
      return {
        ...state,
        displayOpenPDFBtn: true
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
        displayOpenPDFBtn: false,
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
        displayOpenPDFBtn: false,
        apeWorkOrder: false
      };
    default:
      return state;
  }
}
