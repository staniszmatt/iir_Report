import React from 'react';
import LoadingScreen from './LoadingDisplay';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import IIRFormFields from './IIRFormFields';
import styles from './IIRAddEdit.css';

interface Props {
  postOrUpdateIIRReport: () => {};
  getIIRData: () => {};
  handleReviewIIRPDF: () => {};
  iir: {
    loadingScreen: boolean;
    iirFormDisplay: boolean;
    workOrderInfo: {
      customerReasonForRemoval: string;
      evalFindings: string;
      genConditionReceived: string;
      workedPerformed: string;
    };
  };
}

export default function IIRAddEdit(props: Props) {
  const { postOrUpdateIIRReport, getIIRData, handleReviewIIRPDF } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const { loadingScreen, iirFormDisplay, workOrderInfo } = props.iir;

  // TODO: Remove when done with testing, this is the dummy data setup.
  // const data = dummyData();
  // const { loadingScreen, iirFormDisplay, workOrder, workOrderInfo } = data;

  const iirProps = {
    customerReasonForRemoval: workOrderInfo.customerReasonForRemoval,
    evalFindings: workOrderInfo.evalFindings,
    genConditionReceived: workOrderInfo.genConditionReceived,
    workedPerformedNote: workOrderInfo.workedPerformed,
    handleReviewIIRPDF
  };

  return (
    <div className={styles['iir-container']}>
      <div>ADD/EDIT TEAR DOWN NOTES</div>
      <div>
        <WorkOrderSearchForm onSubmit={getIIRData} />
      </div>
      {loadingScreen && <LoadingScreen props={null} />}
      <div>
        {iirFormDisplay && (
          <IIRFormFields onSubmit={postOrUpdateIIRReport} props={iirProps} />
        )}
      </div>
    </div>
  );
}
