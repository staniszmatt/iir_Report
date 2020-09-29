/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import LoadingScreen from './LoadingDisplay';
import Btn from './buttonFunctions/buttonClickHandler';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import IIRFormFields from './IIRFormFields';
import styles from './IIRAddEdit.css';
import logo from '../img/logo.png';

interface Props {
  postUpdatePDFCheck: () => {};
  getIIRData: () => {};
  handleReviewIIRPDF: () => {};
  openPDF: () => {};
  cancelLoading: () => {};
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
      tearDownTSO: string;
      tearDownTSN: string;
      tearDownTSR: string;
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

export default function IIRAddEdit(props: Props | any) {

  console.log('addEdit page props', props);

  const {
    postUpdatePDFCheck,
    getIIRData,
    handleReviewIIRPDF,
    openPDF,
    cancelLoading
  } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const {
    loadingScreen,
    iirFormDisplay,
    workOrderInfo,
    diplayOpenPDFBtn
    // eslint-disable-next-line react/destructuring-assignment
  } = props.iir;
  const {
    TSN,
    TSO,
    TSR,
    tearDownTSO,
    tearDownTSN,
    tearDownTSR
  // eslint-disable-next-line react/destructuring-assignment
  } = props.iir.workOrderInfo;
  // Check if we need to send the JobCost data or AeroParts Data
  let tsnProps: string;
  let tsoProps: string;
  let tsrProps: string;
  let displayTSData: boolean;

  if (tearDownTSO === null || tearDownTSN === null || tearDownTSR === null) {
    tsnProps = TSN.toString();
    tsoProps = TSO.toString();
    tsrProps = TSR.toString();
    displayTSData = true;
  } else {
    tsnProps = tearDownTSN;
    tsoProps = tearDownTSO;
    tsrProps = tearDownTSR;
    displayTSData = false;
  }

  const iirProps = {
    customerReasonForRemoval: workOrderInfo.customerReasonForRemoval,
    evalFindings: workOrderInfo.evalFindings,
    genConditionReceived: workOrderInfo.genConditionReceived,
    workedPerformedNote: workOrderInfo.workedPerformed,
    handleReviewIIRPDF,
    tsnValue: tsnProps,
    tsoValue: tsoProps,
    tsrValue: tsrProps,
    displayTSData
  };
  const cancelProp = { cancelLoading };

  return (
    <div>
      <div className={styles['faded-backgroundImageContainer']}>
        <img src={logo} alt="AeroParts Logo" />
      </div>
      <div className={styles['iir-container']}>
        <div>ADD/EDIT TEAR DOWN NOTES</div>
        {!loadingScreen && (
          <div>
            <WorkOrderSearchForm onSubmit={getIIRData} />
          </div>
        )}
        {loadingScreen && <LoadingScreen props={cancelProp} />}
        {diplayOpenPDFBtn && (
          <div className={styles['open-pdf-btn']}>
            <div>
              File Location: scanned (\\amr-fs1)(T:) CPLT_TRAVELERS\TearDowns
            </div>
            <div>
              <Btn buttonName="Open Current PDF" ClickHandler={openPDF} />
            </div>
          </div>
        )}
        <div>
          {iirFormDisplay && (
            <div>
              {!diplayOpenPDFBtn && (
                <div className={styles['open-pdf-btn']}>
                  <div>PDF Needs Saved.</div>
                </div>
              )}
              <div className={styles['header-info']}>
                <div>
                  <div>Work Order Information:</div>
                </div>
                <div>
                  <div>
                    <div>Work Order:</div>
                    <div>{`${workOrderInfo.SalesOrderNumber}-${workOrderInfo.ItemNumber}`}</div>
                  </div>
                  <div>
                    <div>Customer:</div>
                    <div>{`${workOrderInfo.CustomerName}`}</div>
                  </div>
                  <div>
                    <div>Customer Order Number:</div>
                    <div>{`${workOrderInfo.CustomerOrderNumber}`}</div>
                  </div>
                  <div>
                    <div>Part Number:</div>
                    <div>{`${workOrderInfo.PartNumber}`}</div>
                  </div>
                </div>
                <div>
                  <div>
                    <div>Part Description:</div>
                    <div>{`${workOrderInfo.PartDescription}`}</div>
                  </div>
                  <div>
                    <div>Serial Number:</div>
                    <div>{`${workOrderInfo.SerialNumber}`}</div>
                  </div>
                  <div>
                    <div>Quantitiy:</div>
                    <div>{`${workOrderInfo.Quantity}`}</div>
                  </div>
                  <div>
                    <div>Cert Type:</div>
                    <div>{`${workOrderInfo.Cert_type_Description}`}</div>
                  </div>
                </div>
              </div>
              <IIRFormFields onSubmit={postUpdatePDFCheck} props={iirProps} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
