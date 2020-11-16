/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
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
import { iirStateType } from '../reducers/types';

function mapStateToProps(state: iirStateType) {
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
// TODO: Fix typescript, either the rules or the interface.
export default connect(mapStateToProps, mapDispatchToProps)(TearDownSummery);
