/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { spy } from 'sinon';
import * as actions from '../../app/actions/iirActions';
import * as modalActons from '../../app/actions/modalActions';

const { ipcRenderer } = require('electron');

const mockState = {
  // loadPDF: false,
  // iirFormDisplay: false,
  // loadingScreen: false,
  // postIIRNotes: false,
  // diplayOpenPDFBtn: false,
  iir: {
    workOrder: {
      workOrderSearch: '',
      workOrderSearchLineItem: ''
    },
    // workOrderInfo: {
    //   CustomerName: '',
    //   CustomerNumber: '',
    //   CustomerOrderNumber: '',
    //   DateIssuedYYMMDD: '',
    //   ItemNumber: '',
    //   Manual_Combined: '',
    //   OrderType: '',
    //   PartDescription: '',
    //   PartNumber: '',
    //   Quantity: '',
    //   SalesOrderAndLineNumber: '',
    //   SalesOrderNumber: '',
    //   SerialNumber: '',
    //   TSN: 0,
    //   TSO: 0,
    //   TSR: 0,
    //   Trv_Num: '',
    //   Warrenty_Y_N: '',
    //   Work_Order_Number: '',
    //   customerReasonForRemoval: '',
    //   evalFindings: '',
    //   genConditionReceived: '',
    //   workedPerformed: '',
    // }
  }
}

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
      data: { mockData }
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
  // Start with good data from callback handleGetWorkOrderDataResp from getWorkOrderData to set dispatch items
  it('should recive data from ipcRenderer and pass to set work order data, turn on display PDF form state and set check pdf file string', () => {
    const resp: any = {
      error: {},
      data: [mockData]
    }
    const event = {};
    const data = resp.data[0];
    const getState: any = () => {
      return mockState;
    };
    const dispatch = spy();
    const fn = actions.handleGetWorkOrderDataResp(event, resp);

    expect(fn).toBeInstanceOf(Function);
    fn(dispatch, getState);
    expect(dispatch.calledWith({ type: actions.TOGGLE_LOADING_SCREEN_DISPLAY_OFF })).toBe(true);
    expect(dispatch.calledWith({ type: actions.SET_WORK_ORDER_DATA, resp: data })).toBe(true);
    expect(dispatch.calledWith({ type: actions.TOGGLE_PDF_DISPLAY })).toBe(true);
    expect(dispatch.calledWith({ type: actions.RESET_STATE })).toBe(false);
    const returnError = { error: '' }
    expect(dispatch.calledWith({ type: modalActons.TOGGLE_ERROR_MODAL_STATE, resp: returnError })).toBe(false);
  });

  // Send Error data from callback handleGetWorkOrderDataResp from getWorkOrderData to set dispatch items
  it('should recive error data from ipcRenderer and pass enable error modal', () => {
    const resp: any = {
      error: { code: 'string', name: 'string' },
      data: []
    };
    const event = {};
    const data = resp.data[0];
    const returnError = { error: '' };

    const getState: any = () => { return mockState }
    const dispatch = spy();
    const fn = actions.handleGetWorkOrderDataResp(event, resp);

    expect(fn).toBeInstanceOf(Function);
    fn(dispatch, getState);
    expect(dispatch.calledWith({ type: actions.SET_WORK_ORDER_DATA, resp: data })).toBe(false);
    expect(dispatch.calledWith({ type: actions.TOGGLE_PDF_DISPLAY })).toBe(false);
    expect(dispatch.calledWith({ type: actions.TOGGLE_PDF_DISPLAY })).toBe(false);
    expect(dispatch.calledWith({ type: actions.RESET_STATE })).toBe(true);
    expect(dispatch.calledWith({ type: modalActons.TOGGLE_ERROR_MODAL_STATE, resp: returnError })).toBe(true);
  });
});
