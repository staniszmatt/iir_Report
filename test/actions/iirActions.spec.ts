/* eslint-disable prettier/prettier */
import { spy } from 'sinon';
// For Async function dispatches
// import configureMockStore from 'redux-mock-store';
// import thunk from 'redux-thunk';
// import fetchMock from 'fetch-mock';
// import expect from 'expect';
import * as actions from '../../app/actions/iirActions';
import * as modalActons from '../../app/actions/modalActions';

const { ipcRenderer } = require('electron');

const mockData = {
  SalesOrderAndLineNumber: 'string',
  ItemNumber: 'string',
  PartNumber: 'string',
  PartDescription: 'string',
  SerialNumber: 'string',
  Quantity: 1,
  TSN: 0,
  TSR: 0,
  TSO: 0,
  SalesOrderNumber: 'string',
  CustomerNumber: 'string',
  CustomerName: 'string',
  CustomerOrderNumber: 'string',
  DateIssuedYYMMDD: 'string',
  Warrenty_Y_N: 'N',
  OrderType: 'string',
  Manual_Combined: 'string',
  Work_Order_Number: 'string',
  Trv_Num: 'string',
  Cert_type_Description: 'string',
  customerReasonForRemoval: 'NONE',
  genConditionReceived: 'NONE',
  evalFindings: 'NONE',
  workedPerformed: 'NONE'
}

// For Async function dispatches
// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);

const thunk = ({ dispatch, getState }) => next => action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }

  return next(action)
}
const create = () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn()
  }
  const next = jest.fn()

  const invoke = action => thunk(store)(next)(action)

  return { store, next, invoke }
}

jest.mock(
  'electron',
  () => {
    const mElectron = {
      ipcRenderer: {
        on: jest.fn(),
        send: jest.fn(),
        removeAllListeners: jest.fn(),
        removeListener: jest.fn()
      },
      mockImplementationOnce: () => {}
    };
    return mElectron;
  },
  { virtual: true }
);

describe('iirActions', () => {
  // For Async function dispatches
  // afterEach(() => {
  //   fetchMock.reset();
  //   fetchMock.restore();
  // });

  it('should reset iir state to all false states and clear data', () => {
    expect(actions.resetState()).toMatchSnapshot();
  });
  it('should toggle PDF form display state', () => {
    expect(actions.toggleDisplayPDFFormState()).toMatchSnapshot();
  });
  it('should toggle to post iir notes state', () => {
    expect(actions.togglePostIIRNotes()).toMatchSnapshot();
  });
  it('should toggle loading screen display state', () => {
    expect(actions.toggleLoadingScreenState()).toMatchSnapshot();
  });
  it('should toggle IIR form field display state', () => {
    expect(actions.toggleIIRAddEditState()).toMatchSnapshot();
  });
  it('should set the workOrder data state', () => {
    expect(
      actions.setWorkOrder({
        workOrderSearch: 'string',
        workOrderSearchLineItem: 'string'
      })
    ).toMatchSnapshot();
  });
  it('should set the workOrderData data state', () => {
    expect(
      actions.setWorkOrderData(mockData)
    ).toMatchSnapshot();
  });

  it('should toggle laoding screen to false, reset iir state and remove ipcRender listner action', () => {
    const fn = actions.cancelLoading();
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    fn(dispatch);
    expect(dispatch.calledWith({ type: actions.RESET_STATE })).toBe(true);
    expect(
      dispatch.calledWith({ type: actions.TOGGLE_LOADING_SCREEN_DISPLAY_OFF })
    ).toBe(false);
    expect(ipcRenderer.removeAllListeners).toBeCalledWith('asynchronous-reply');
  });
  // Actions getWorkOrderData testing.
  // First set to test of reciving correct data
  // This is for the getWorkOrderData method in iirActions
  it('should pass two values to use for searching for info, setting loading screen and saving work order search', () => {
    const dataResp = {
      error: {},
      data: {
        SalesOrderAndLineNumber: 'string',
        ItemNumber: 'string',
        PartNumber: 'string',
        PartDescription: 'string',
        SerialNumber: 'string',
        Quantity: 1,
        TSN: 0,
        TSR: 0,
        TSO: 0,
        SalesOrderNumber: 'string',
        CustomerNumber: 'string',
        CustomerName: 'string',
        CustomerOrderNumber: 'string',
        DateIssuedYYMMDD: 'string',
        Warrenty_Y_N: 'string',
        OrderType: 'string',
        Manual_Combined: 'string',
        Work_Order_Number: 'string',
        Trv_Num: 'string',
        Cert_type_Description: 'string',
        customerReasonForRemoval: 'string',
        genConditionReceived: 'string',
        evalFindings: 'string',
        workedPerformed: 'string'
      }
    };
    const dataArg = {
      workOrderSearch: 'string',
      workOrderSearchLineItem: 'string'
    };
    const dataRequest = {
      request: 'getWorkOrderData',
      workOrderSearch: 'string',
      workOrderSearchLineItem: 'string'
    };
    const fn = actions.getWorkOrderData(dataArg);
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    fn(dispatch);
    // Testing
    expect(
      dispatch.calledWith({ type: actions.TOGGLE_LOADING_SCREEN_DISPLAY_ON })
    ).toBe(true);
    expect(dispatch.calledWith({ type: actions.RESET_STATE })).toBe(true);
    expect(dispatch.calledWith({ type: actions.SET_WORK_ORDER, resp: dataArg })).toBe(true);
    // Do not know how to fix this at this time.
    // Error: Property 'mockImplementationOnce' does not exist on type '(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => IpcRenderer'.ts(2339)
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore: ts(2339)
    ipcRenderer.on.mockImplementationOnce((event, callback) => {
      callback(event, dataResp);
    });
    // This may be more for the UI react components than for actions unfortently
    expect(ipcRenderer.on).toBeCalledWith('asynchronous-reply', expect.any(Function));
    expect(ipcRenderer.send).toBeCalledWith('asynchronous-message',dataRequest);
  });
  // Start of good data from callback handleGetWorkOrderDataResp from getWorkOrderData to set dispatch items
  it('should recive data from ipcRenderer and pass to set work order data, turn on display PDF form state and set check pdf file string', () => {


    // TODO: Need to setup middleware with state,
    // Checkout out https://redux.js.org/recipes/writing-tests

    const resp = {
      error: {},
      data: [mockData]
    }
    const event = {};

    const fn = actions.handleGetWorkOrderDataResp(event, resp);
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    fn(dispatch);
  })

  expect(dispatch.calledWith({ type: actions.TOGGLE_PDF_DISPLAY })).toBe(false);

});
