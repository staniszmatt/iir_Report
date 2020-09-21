import { spy } from 'sinon';
import * as actions from '../../app/actions/iirActions';
import * as modalActons from '../../app/actions/modalActions';
// import { GetState } from '../../app/reducers/types';

const { ipcRenderer } = require('electron');

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

describe('actions', () => {
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
    expect(actions.setWorkOrder({})).toMatchSnapshot();
  });

  it('should set the workOrderData data state', () => {
    expect(actions.setWorkOrderData({})).toMatchSnapshot();
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
  it('should pass two values to use for searching for info, setting loading screen and displays based on recived data', () => {
    const dataResp = {
      error: {},
      data: [{ someData: '' }]
    };
    // Do not know how to fix this at this time.
    // Error: Property 'mockImplementationOnce' does not exist on type '(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => IpcRenderer'.ts(2339)
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore: ts(2339)
    ipcRenderer.on.mockImplementationOnce((event, callback) => {
      callback(event, dataResp);
    });
    const dataArg = {
      workOrderSearch: '',
      workOrderSearchLineItem: ''
    };
    const dataRequest = {
      request: 'getWorkOrderData',
      workOrderSearch: '',
      workOrderSearchLineItem: ''
    };
    const fn = actions.getWorkOrderData(dataArg);
    expect(fn).toBeInstanceOf(Function);
    const dispatch = spy();
    fn(dispatch);
    // Testing
    expect(
      dispatch.calledWith({ type: actions.TOGGLE_LOADING_SCREEN_DISPLAY_ON })
    ).toBe(true);
    // TODO: Setup test to verify redux-form reset runs/complete
    expect(dispatch.calledWith({ type: actions.RESET_STATE })).toBe(true);

    const expectedSetWorkOrder = {
      type: actions.SET_WORK_ORDER,
      resp: dataArg
    };
    expect(actions.setWorkOrder(dataArg)).toEqual(expectedSetWorkOrder);

    const expectedSetWorkOrderData = {
      type: actions.SET_WORK_ORDER_DATA,
      resp: dataResp.data[0]
    };
    expect(actions.setWorkOrderData(dataResp.data[0])).toEqual(
      expectedSetWorkOrderData
    );
    expect(dispatch.calledWith({ type: actions.TOGGLE_PDF_DISPLAY })).toBe(
      true
    );
    expect(
      dispatch.calledWith({ type: modalActons.TOGGLE_ERROR_MODAL_STATE })
    ).toBe(false);
    expect(ipcRenderer.on).toBeCalledWith(
      'asynchronous-reply',
      expect.any(Function)
    );
    expect(ipcRenderer.send).toBeCalledWith(
      'asynchronous-message',
      dataRequest
    );
  });
});
// Setup to recive error data and display the error catch process in getWorkOrderData in iirActions
it('should pass two values to use for searching for info, setting loading screen and displays based on error data', () => {
  const mainRequest = {
    request: 'getWorkOrderData',
    workOrderSearch: '',
    workOrderSearchLineItem: ''
  };
  const mockArgument = {
    workOrderSearch: '',
    workOrderSearchLineItem: ''
  };
  const dataResp = {
    error: { error: '' },
    data: []
  };

  const fn = actions.getWorkOrderData(mockArgument);
  expect(fn).toBeInstanceOf(Function);
  const dispatch = spy();
  fn(dispatch);

  // Do not know how to fix this at this time.
  // Error: Property 'mockImplementationOnce' does not exist on type '(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void) => IpcRenderer'.ts(2339)
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore: ts(2339)
  ipcRenderer.on.mockImplementationOnce((event, callback) => {
    callback(event, dataResp);
  });

  expect(
    dispatch.calledWith({ type: actions.TOGGLE_LOADING_SCREEN_DISPLAY_ON })
  ).toBe(true);

  expect(dispatch.calledWith({ type: actions.RESET_STATE })).toBe(true);

  // const expectedSetWorkOrder = {
  //   type: actions.SET_WORK_ORDER,
  //   resp: dataArg
  // };

  // expect(actions.setWorkOrder(dataArg)).toEqual(expectedSetWorkOrder);

  // const expectedSetWorkOrderData = {
  //   type: actions.SET_WORK_ORDER_DATA,
  //   resp: dataResp.data[0]
  // };

  // expect(actions.setWorkOrderData(dataResp.data[0])).toEqual(
  //   expectedSetWorkOrderData
  // );

  expect(ipcRenderer.on).toBeCalledWith(
    'asynchronous-reply',
    expect.any(Function)
  );
  expect(ipcRenderer.send).toBeCalledWith('asynchronous-message', mainRequest);
});
