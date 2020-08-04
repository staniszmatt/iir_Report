import React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import TearDownSummery from '../components/tearDownSummery';
// import { tearDownSummerStateType } from '../reducers/types';

export default function HomePage() {
  return (
    <div>
      <TearDownSummery />
    </div>
  );
}

// function mapStateToProps(state: tearDownSummerStateType) {
//   return {
//     tearDownSummery: state.tearDownSummery
//   };
// }

// function mapDispatchToProps(dispatch: Dispatch<null>) {
//   return bindActionCreators(
//     {  },
//     dispatch
//   );
// }
// // TODO: Fix typescript, either the rules or the interface.
// export default connect(mapStateToProps, mapDispatchToProps)(TearDownSummer);
