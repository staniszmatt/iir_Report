import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type IIRStateType = {
  getWorkOrderData: () => {};
  postOrUpdateIIRReport: () => {};
  handleEditIIRPDF: () => {};
  cancelLoading: () => {};
  openPDF: () => {};
  savePDF: (data: {}) => {};
  softResetState: () => {};
  iir: {
    loadPDF: boolean;
    iirFormDisplay: boolean;
    loadingScreen: boolean;
    postIIRNotes: boolean;
    displayOpenPDFBtn: boolean;
    sendEmail: boolean;
    successUpdateModalCall: boolean;
    workOrder: {
      workOrderSearch: string;
      workOrderSearchLineItem: string;
    };
    workOrderInfo: {
      SalesOrderNumber: string;
      ItemNumber: string;
      PartNumber: string;
      CustomerName: string;
      customerReasonForRemoval: string;
      genConditionReceived: string;
      evalFindings: string;
      workedPerformed: string;
      TSN: number;
      TSO: number;
      TSR: number;
      tearDownTSO: string;
      tearDownTSN: string;
      tearDownTSR: string;
      Warrenty_Y_N: string;
      CustomerOrderNumber: string;
      Cert_type_Description: string;
      Quantity: number;
      SerialNumber: string;
      PartDescription: string;
      DateIssuedYYMMDD: string;
      Manual_Combined: string;
      Manual: string;
      Manual_Document: string;
      Manual_Section: string;
      Manual_Revision: string;
      Manual_Rev_Date_MMDDYY: string;
    };
  };
};

export type modalStateType = {
  modals: {
    modalState: boolean;
    errorModalState: boolean;
    successModalState: boolean;
    warningModalState: boolean;
    modalMessage: string;
  };
};

// export type GetState = () => counterStateType;
export type GetErrorModalState = () => modalStateType;
export type GetIIRState = () => IIRStateType;

export type Store =
  | ReduxStore<modalStateType, Action<string>>
  | ReduxStore<IIRStateType, Action<string>>;

export type Dispatch = ReduxDispatch<Action<string>>;
