/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import IIRAddEdit from '../components/IIRAddEdit';
import {
  postUpdatePDFCheck,
  getIIRData,
  handleReviewIIRPDF,
  openPDF,
  cancelLoading,
  linkWorkOrder
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
      postUpdatePDFCheck,
      getIIRData,
      handleReviewIIRPDF,
      openPDF,
      cancelLoading,
      linkWorkOrder
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(IIRAddEdit);
