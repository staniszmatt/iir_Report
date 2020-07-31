import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';

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

export type Store =
  | ReduxStore<modalStateType, Action<string>>

export type Dispatch = ReduxDispatch<Action<string>>;
