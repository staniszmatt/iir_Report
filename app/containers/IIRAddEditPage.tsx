/* eslint-disable @typescript-eslint/no-explicit-any */
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
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

export interface DispatchFromProps {
  postUpdatePDFCheck: () => {};
  getIIRData: () => {};
  handleReviewIIRPDF: () => {};
  openPDF: () => {};
  cancelLoading: () => {};
  linkWorkOrder: () => {};
}

function mapStateToProps(state: IIRStateType) {
  return {
    postUpdatePDFCheck,
    getIIRData,
    handleReviewIIRPDF,
    cancelLoading,
    openPDF,
    linkWorkOrder,
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

export default connect(mapStateToProps, mapDispatchToProps)(IIRAddEdit);
// export default connect(mapStateToProps)(IIRAddEdit);
