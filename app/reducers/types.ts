import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

export type iirStateType = {
  iir: {
    loadPDF: boolean;
    iirFormDisplay: boolean;
    loadingScreen: boolean;
    postIIRNotes: boolean;
    workOrder: {
      workOrderSearch: string;
      workOrderSearchLineItem: string;
    };
    workOrderInfo: {};
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
