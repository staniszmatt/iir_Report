import { bindActionCreators, Dispatch } from 'redux';
import { reset } from 'redux-form';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { getVersion } from '../actions/iirActions';
import { iirStateType } from '../reducers/types';

function mapStateToProps(state: iirStateType) {
  return {
    iir: state.iir
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDispatchToProps(dispatch: Dispatch<any>) {
  // Reset Search Form when loading the page.
  dispatch(reset('workOrderSearchForm'));
  return bindActionCreators({ getVersion }, dispatch);
}
// TODO: Fix typescript, either the rules or the interface.
export default connect(mapStateToProps, mapDispatchToProps)(Home);
