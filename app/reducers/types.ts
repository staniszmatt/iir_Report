import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type iirStateType = {
  iir: {
    loadPDF: boolean;
    iirFormDisplay: boolean;
    loadingScreen: boolean;
    postIIRNotes: boolean;
    displayOpenPDFBtn: boolean;
    sendEmail: boolean;
    successUpdateModalCall: boolean;
    apeWorkOrder: boolean;
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
export type GetIIRState = () => iirStateType;

export type Store =
  | ReduxStore<modalStateType, Action<string>>
  | ReduxStore<iirStateType, Action<string>>;

export type Dispatch = ReduxDispatch<Action<string>>;
