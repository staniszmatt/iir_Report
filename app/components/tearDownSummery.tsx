import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Link } from 'react-router-dom';
import LoadingScreen from './LoadingDisplay';
import TearDownPDF from './tearDownSummeryPDF';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import IIRFormPDF from './IIRFromFiledPDF';
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

  const iirProps = {
    customerReasonForRemoval: workOrderInfo.customerReasonForRemoval,
    evalFindings: workOrderInfo.evalFindings,
    genConditionReceived: workOrderInfo.genConditionReceived,
    workedPerformedNote: workOrderInfo.workedPerformed,
    workedPerformed: workOrderInfo.Manual_Combined
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
                      <div>
                        <div>Work Order:</div>
                        <div>{`${workOrder.workOrderSearch}-${workOrder.workOrderSearchLineItem}`}</div>
                      </div>
                      <div>
                        <div>Customer:</div>
                        <div>{workOrderInfo.CustomerOrderNumber}</div>
                      </div>
                      <div>
                        <div>Customer Order Number:</div>
                        <div>{workOrderInfo.CustomerOrderNumber}</div>
                      </div>
                      <div>
                        <div>Date Issued:</div>
                        <div>{workOrderInfo.DateIssuedYYMMDD}</div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div>Part Number:</div>
                        <div>{workOrderInfo.PartNumber}</div>
                      </div>
                      <div>
                        <div>Part Description:</div>
                        <div>{workOrderInfo.PartDescription}</div>
                      </div>
                      <div>
                        <div>Serial Number:</div>
                        <div>{workOrderInfo.SerialNumber}</div>
                      </div>
                      <div>
                        <div>Quantity:</div>
                        <div>{workOrderInfo.Quantity}</div>
                      </div>
                    </div>
                    <div>
                      <div>
                        <div>
                          <div>TSN:</div>
                          <div>{workOrderInfo.TSN}</div>
                        </div>
                        <div>
                          <div>TSR:</div>
                          <div>{workOrderInfo.TSR}</div>
                        </div>
                        <div>
                          <div>TSO:</div>
                          <div>{workOrderInfo.TSO}</div>
                        </div>
                      </div>
                      <div>
                        <div>Order Type:</div>
                        <div>{workOrderInfo.OrderType}</div>
                      </div>
                      <div>
                        <div>Warrenty:</div>
                        <div>{warrentyString}</div>
                      </div>
                    </div>
                    <div>
                      <IIRFormPDF onSubmit={postIIRReport} props={iirProps} />
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
            <div>
              <Link to={routes.EDITFORM}>
                <button type="button">Edit Form</button>
              </Link>
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
        </div>
      )}
    </div>
  );
}
