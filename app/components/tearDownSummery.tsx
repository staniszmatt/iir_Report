import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import LoadingScreen from './LoadingDisplay';
import TearDownPDF from './tearDownSummeryPDF';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import IIRForm from './IIRFormFields';
import styles from './tearDownSummer.css';
import logo from '../img/logo.png';
import dummyData from '../dummyData/getDummyIIRData';
import postIIRReport from '../actions/iirActions';

interface Props {
  getWorkOrderData: () => {};
  postIIRReport: () => {};
  iir: {
    loadingScreen: boolean;
    loadPDF: boolean;
    workOrder: {
      workOrderSearch: string;
      workOrderSearchLineItem: string;
    };
    workOrderInfo: {
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
  }
}

export default function TearDownSummery(props: Props) {

  console.log('tear down component, props:', props);

  const data = dummyData();

  const { getWorkOrderData, postIIRReport } = props;
  // eslint-disable-next-line react/destructuring-assignment
  // const { loadingScreen, loadPDF, workOrder, workOrderInfo } = props.iir;
  const { loadingScreen, loadPDF, workOrder, workOrderInfo } = data;

  let warrentyString = 'No';

  if (workOrderInfo.Warrenty_Y_N === 'Y') {
    warrentyString = 'Yes';
  }

  const workOrderNumber = `Work Order: ${workOrder.workOrderSearch}-${workOrder.workOrderSearchLineItem}`;
  const customerName = `Customer: ${workOrderInfo.CustomerName}`;
  const customerNumber = `Customer Order Number: ${workOrderInfo.CustomerOrderNumber}`;
  const dateIssued = `Date Issued: ${workOrderInfo.DateIssuedYYMMDD}`;

  const partNumber = `Part Number: ${workOrderInfo.PartNumber}`;
  const partNumberDescription = `Part Description: ${workOrderInfo.PartDescription}`;
  const partSerialNumber = `Serial Number: ${workOrderInfo.SerialNumber}`;
  const partQuantity = `Quantity: ${workOrderInfo.Quantity}`;

  const tsnNum = `TSN: ${workOrderInfo.TSN}`;
  const tsrNum = `TSR: ${workOrderInfo.TSR}`;
  const tsoNum = `TSO: ${workOrderInfo.TSO}`;
  const orderType = `Order Type: ${workOrderInfo.OrderType}`;
  const warrenty = `Warrenty: ${warrentyString}`;

  const iirProps = {
    customerReasonForRemoval: workOrderInfo.customerReasonForRemoval,
    evalFindings: workOrderInfo.evalFindings,
    genConditionReceived: workOrderInfo.genConditionReceived,
    workedPerformed: workOrderInfo.workedPerformed
  };

  return (
    <div className={styles['form-container']}>
      <div>
        <WorkOrderSearchForm onSubmit={getWorkOrderData} />
      </div>
      {loadingScreen && <LoadingScreen />}
      {loadPDF && (
        <div>
          <div className={styles['form-page']}>
            <div>
              <div className={styles['form-header']}>
                <div>
                  <img src={logo} alt="Aero Parts Logo" />
                </div>
                <div>TEARDOWN REPORT</div>
                {/** Filler for centering as seen below */}
                <div />
              </div>
              <div className={styles['form-body']}>
                <div />
                <div>
                  <div>
                    <div >
                      <div>{workOrderNumber}</div>
                      <div>{customerName}</div>
                      <div>{customerNumber}</div>
                      <div>{dateIssued}</div>
                    </div>
                    <div>
                      <div>{partNumber}</div>
                      <div>{partNumberDescription}</div>
                      <div>{partSerialNumber}</div>
                      <div>{partQuantity}</div>
                    </div>
                    <div>
                      <div>
                        <div>{tsnNum}</div>
                        <div>{tsrNum}</div>
                        <div>{tsoNum}</div>
                      </div>
                      <div>{orderType}</div>
                      <div>{warrenty}</div>
                    </div>
                    <div>
                      <IIRForm onSubmit={postIIRReport} props={iirProps} />
                    </div>
                  </div>
                </div>
                <div />
              </div>
              <div className={styles['form-footer']}>
                <div>FORM-X-XX-XXXX Rev.X</div>
                <div>PRINT DATE: XX-XX-XXXX</div>
              </div>
            </div>
          </div>

          <div>
            <button type="button">
              <PDFDownloadLink document={<TearDownPDF />} fileName="IIR.pdf">
                {({ blob, url, loading, error }) =>
                  loading ? <i> Loading document...</i> : <i> Download Pdf </i>}
              </PDFDownloadLink>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
