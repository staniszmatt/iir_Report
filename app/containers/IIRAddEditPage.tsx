/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import IIRAddEdit from '../components/IIRAddEdit';
import {
  postUpdatePDFCheck,
  getIIRData,
  handleReviewIIRPDF,
  openPDF,
  cancelLoading
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
      postUpdatePDFCheck,
      getIIRData,
      handleReviewIIRPDF,
      openPDF,
      cancelLoading
    },
    dispatch
  );
}
// TODO: Fix typescript, either the rules or the interface.
export default connect(mapStateToProps, mapDispatchToProps)(IIRAddEdit);
