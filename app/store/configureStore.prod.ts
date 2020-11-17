/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from '../reducers';
import { Store, modalStateType, IIRStateType } from '../reducers/types';
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
      } | any
    | modalStateType;
  // counter?: number | counterStateType;
}): Store {
  return createStore(rootReducer, initialState, enhancer);
}

export default { configureStore, history };
