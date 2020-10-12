/* eslint-disable prettier/prettier */
import * as actions from '../../app/actions/modalActions';

describe('modalActions', () => {
  it('should create an action to turn on modal state', () => {
    expect(actions.toggleModalState()).toMatchSnapshot();
  });
  it('should create an action to turn modal error state and pass object message', () => {
    expect(actions.toggleErrorModalState({ error: 'Error Message' })).toMatchSnapshot();
  });
  it('should create an action to turn on modal success state and pass string message', () => {
    expect(actions.toggleSuccessModalState('Success String')).toMatchSnapshot();
  });
  it('should create an action to turn on modal warning state and pass object message', () => {
    expect(actions.toggleWarningModalState({ warningMsg: 'Warning' })).toMatchSnapshot();
  });
});
