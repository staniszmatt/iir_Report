/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import { Store, modalStateType, iirStateType } from '../reducers/types';
// import { Store, customerStateType, counterStateType } from '../reducers/types';

const history = createHashHistory();
const rootReducer = createRootReducer(history);
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

function configureStore(initialState?: {
  iir?:
    | {
        loadPDF: boolean;
        iirFormDisplay: boolean;
        loadingScreen: boolean;
        postIIRNotes: boolean;
        workOrder: {
          workOrderSearch: string;
          workOrderSearchLineItem: string;
        };
        workOrderInfo: {};
        // eslint-disable-next-line prettier/prettier
      }
    | any
    | iirStateType;
  modals?:
    | {
        modalState: boolean;
        errorModalState: boolean;
        successModalState: boolean;
        warningModalState: boolean;
        modalMessage: string;
        // eslint-disable-next-line prettier/prettier
      } | any
    | modalStateType;
  // counter?: number | counterStateType;
}): Store {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
