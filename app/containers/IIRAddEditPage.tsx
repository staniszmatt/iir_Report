/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindActionCreators, Dispatch } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
// Need to pull PropsFormRedux in IIRAddEdit to set variable types
// eslint-disable-next-line import/no-cycle
import IIRAddEdit from '../components/IIRAddEdit';
import {
  postUpdatePDFCheck,
  getIIRData,
  handleReviewIIRPDF,
  openPDF,
  cancelLoading,
  linkWorkOrder,
  warnRemoveAPELinkWorkOrder
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
      linkWorkOrder,
      warnRemoveAPELinkWorkOrder
    },
    dispatch
  );
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(IIRAddEdit);
