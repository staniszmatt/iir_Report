/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import TearDownSummery from '../components/tearDownSummery';
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
