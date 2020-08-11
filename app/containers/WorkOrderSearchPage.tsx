import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import WorkOrderSearch from '../components/WorkOrderSearch';
import { toggleIIRState, getData } from '../actions/iirActions';
import { iirStateType } from '../reducers/types';

function mapStateToProps(state: iirStateType) {
  return {
    iir: state.iir
  };
}

function mapDispatchToProps(dispatch: Dispatch<null>) {
  return bindActionCreators({ toggleIIRState, getData }, dispatch);
}
// TODO: Fix typescript, either the rules or the interface.
export default connect(mapStateToProps, mapDispatchToProps)(WorkOrderSearch);
