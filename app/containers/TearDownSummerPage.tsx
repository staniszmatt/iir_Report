import { bindActionCreators, Dispatch } from 'redux';
import { reset } from 'redux-form';
import { connect } from 'react-redux';
import TearDownSummery from '../components/tearDownSummery';
import {
  getWorkOrderData,
  postOrUpdateIIRReport,
  handleEditIIRPDF
} from '../actions/iirActions';
import { iirStateType } from '../reducers/types';

function mapStateToProps(state: iirStateType) {
  return {
    iir: state.iir
  };
}

function mapDispatchToProps(dispatch: Dispatch<null>) {
  // Reset Search Form when loading the page.
  dispatch(reset('workOrderSearchForm'));
  return bindActionCreators(
    {
      getWorkOrderData,
      postOrUpdateIIRReport,
      handleEditIIRPDF
    },
    dispatch
  );
}
// TODO: Fix typescript, either the rules or the interface.
export default connect(mapStateToProps, mapDispatchToProps)(TearDownSummery);
