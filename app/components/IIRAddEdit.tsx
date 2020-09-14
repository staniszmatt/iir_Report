import React from 'react';
import LoadingScreen from './LoadingDisplay';
import Btn from './buttonFunctions/buttonClickHandler';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import IIRFormFields from './IIRFormFields';
import styles from './IIRAddEdit.css';
import logo from '../img/logo.png';

interface Props {
  postOrUpdateIIRReport: () => {};
  getIIRData: () => {};
  handleReviewIIRPDF: () => {};
  openPDF: () => {};
  iir: {
    loadingScreen: boolean;
    iirFormDisplay: boolean;
    diplayOpenPDFBtn: boolean;
    workOrderInfo: {
      customerReasonForRemoval: string;
      evalFindings: string;
      genConditionReceived: string;
      workedPerformed: string;
    };
  };
}

export default function IIRAddEdit(props: Props) {
  const {
    postOrUpdateIIRReport,
    getIIRData,
    handleReviewIIRPDF,
    openPDF
  } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const {
    loadingScreen,
    iirFormDisplay,
    workOrderInfo,
    diplayOpenPDFBtn
    // eslint-disable-next-line react/destructuring-assignment
  } = props.iir;

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
    <div>
      <div className={styles['faded-backgroundImageContainer']}>
        <img src={logo} alt="AeroParts Logo" />
      </div>
      <div className={styles['iir-container']}>
        <div>ADD/EDIT TEAR DOWN NOTES</div>
        <div>
          <WorkOrderSearchForm onSubmit={getIIRData} />
        </div>
        {loadingScreen && <LoadingScreen props={null} />}
        {diplayOpenPDFBtn && (
          <div className={styles['open-pdf-btn']}>
            <Btn buttonName="Open Current PDF" ClickHandler={openPDF} />
          </div>
        )}
        <div>
          {iirFormDisplay && (
            <div>
              {!diplayOpenPDFBtn && (
                <div className={styles['open-pdf-btn']}>
                  <div>PDF Needs Saved In Scanned Directory.</div>
                </div>
              )}
              <IIRFormFields
                onSubmit={postOrUpdateIIRReport}
                props={iirProps}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
