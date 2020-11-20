/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
// Need to pass combined TypeScript PropsFromRedux to TearDownSummery component.
// eslint-disable-next-line import/no-cycle
import TearDownSummery from '../components/TearDownSummery';
import {
  getWorkOrderData,
  postOrUpdateIIRReport,
  handleEditIIRPDF,
  cancelLoading,
  openPDF,
  savePDF,
  softResetState
} from '../actions/iirActions';
import { IIRStateType } from '../reducers/types';

function mapStateToProps(state: IIRStateType) {
  return {
    iir: state.iir
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      getWorkOrderData,
      postOrUpdateIIRReport,
      handleEditIIRPDF,
      cancelLoading,
      openPDF,
      savePDF,
      softResetState
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(TearDownSummery);
