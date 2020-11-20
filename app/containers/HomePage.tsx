import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import { getVersion } from '../actions/iirActions';
import { IIRStateType } from '../reducers/types';

function mapStateToProps(state: IIRStateType) {
  return {
    iir: state.iir
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ getVersion }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
