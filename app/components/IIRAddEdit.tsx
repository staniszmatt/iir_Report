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
      Cert_type_Description: string;
      CustomerName: string;
      CustomerNumber: string;
      CustomerOrderNumber: string;
      DateIssuedYYMMDD: string;
      ItemNumber: string;
      Manual_Combined: string;
      OrderType: string;
      PartDescription: string;
      PartNumber: string;
      Quantity: number;
      SalesOrderAndLineNumber: string;
      SalesOrderNumber: string;
      SerialNumber: string;
      TSN: number;
      TSO: number;
      TSR: number;
      Trv_Num: string;
      Warrenty_Y_N: string;
      Work_Order_Number: string;
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

  console.log('edit page data: ', workOrderInfo);

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
              <div className={styles['header-info']}>
                <div>Setup Additional Info HERE!</div>
                <div>
                  <div>
                    <div>Work Order:</div>
                    <div>XXXX-XX</div>
                  </div>
                  <div>
                    <div>Customer:</div>
                    <div>TEST NAME</div>
                  </div>
                  <div>
                    <div>Customer Order Number:</div>
                    <div>123456</div>
                  </div>
                  <div>
                    <div>Date Issued:</div>
                    <div>0000-00-00</div>
                  </div>
                </div>
              </div>
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
