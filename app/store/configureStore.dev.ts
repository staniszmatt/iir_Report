/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'connected-react-router';
import { createLogger } from 'redux-logger';
import createRootReducer from '../reducers';
import * as iirActions from '../actions/iirActions';
import * as modalActions from '../actions/modalActions';
import { modalStateType, IIRStateType } from '../reducers/types';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj: Record<string, any>
    ) => Function;
  }
  interface NodeModule {
    hot?: {
      accept: (path: string, cb: () => void) => void;
    };
  }
}

const history = createHashHistory();

const rootReducer = createRootReducer(history);

const configureStore = (initialState?: {
  iir?:
    | {
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
          CustomerName: string;
          CustomerNumber: string;
          CustomerOrderNumber: string;
          DateIssuedYYMMDD: string;
          ItemNumber: string;
          Manual_Combined: string;
          Manual: string;
          Manual_Document: string;
          Manual_Section: string;
          Manual_Revision: string;
          Manual_Rev_Date_MMDDYY: string;
          OrderType: string;
          PartDescription: string;
          PartNumber: string;
          Quantity: number;
          SalesOrderAndLineNumber: string;
          SalesOrderNumber: string;
          SerialNumber: string;
          TSN: number;
          TSO: number;
          TSR: number;
          tearDownTSO: string;
          tearDownTSN: string;
          tearDownTSR: string;
          Trv_Num: string;
          Warrenty_Y_N: string;
          Work_Order_Number: string;
          customerReasonForRemoval: string;
          evalFindings: string;
          genConditionReceived: string;
          workedPerformed: string;
        };
        // eslint-disable-next-line prettier/prettier
      }
    | any
    | IIRStateType;
  modals?:
    | {
        modalState: boolean;
        errorModalState: boolean;
        successModalState: boolean;
        warningModalState: boolean;
        modalMessage: string;
        // eslint-disable-next-line prettier/prettier
      }
    | any
    | modalStateType;
}) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });

  // Skip redux logs in console during the tests
  if (process.env.NODE_ENV !== 'test') {
    middleware.push(logger);
  }

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...modalActions,
    ...iirActions,
    ...routerActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://extension.remotedev.io/docs/API/Arguments.html
        actionCreators
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept(
      '../reducers',
      // eslint-disable-next-line global-require
      () => store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
};

export default { configureStore, history };
