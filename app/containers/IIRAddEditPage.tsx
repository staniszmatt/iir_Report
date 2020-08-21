/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindActionCreators, Dispatch } from 'redux';
import { reset } from 'redux-form';
import { connect } from 'react-redux';
import IIRAddEdit from '../components/IIRAddEdit';
import {
  postOrUpdateIIRReport,
  getIIRData,
  resetState,
  handleReviewIIRPDF
} from '../actions/iirActions';
import { iirStateType } from '../reducers/types';

function mapStateToProps(state: iirStateType) {
  return {
    iir: state.iir
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  // Reset Search Form when loading the page.
  dispatch(reset('workOrderSearchForm'));
  dispatch(reset('iirForm'));
  dispatch(resetState());
  return bindActionCreators(
    {
      postOrUpdateIIRReport,
      getIIRData,
      handleReviewIIRPDF
    },
    dispatch
  );
}
// TODO: Fix typescript, either the rules or the interface.
export default connect(mapStateToProps, mapDispatchToProps)(IIRAddEdit);
