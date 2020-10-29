/* eslint-disable react/no-unescaped-entities */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import React from 'react';
import { Link } from 'react-router-dom';
import html2canvas from '@nidi/html2canvas';
import JsPDF from 'jspdf';
import routes from '../constants/routes.json';
import LoadingScreen from './LoadingDisplay';
import ArrayComponents from './ReturnArrayComponents';
import Btn from './buttonFunctions/buttonClickHandler';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import IIRFromFiledPDF from './IIRFromFiledPDF';
import styles from './tearDownSummer.css';
import logo from '../img/logo.png';

interface Props {
  getWorkOrderData: () => {};
  postOrUpdateIIRReport: () => {};
  handleEditIIRPDF: () => {};
  cancelLoading: () => {};
  openPDF: () => {};
  savePDF: (data: {}) => {};
  softResetState: () => {};
  iir: {
    loadingScreen: boolean;
    loadPDF: boolean;
    displayOpenPDFBtn: boolean;
    workOrder: {
      workOrderSearch: string;
      workOrderSearchLineItem: string;
    };
    workOrderInfo: {
      Cert_type_Description: string;
      CustomerName: string;
      CustomerNumber: string;
      CustomerOrderNumber: string;
      DateIssuedYYMMDD: string;
      ItemNumber: string;
      Manual_Combined: string;
      Manual: string;
      Manual_Document: string;
      Manual_Section: string;
      Manual_Revision: string;
      Manual_Rev_Date_MMDDYY: string;
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

function tsDataCheck(tsData: string | number) {
  // Could come in as a string or a number so testing for abstract equality
  // eslint-disable-next-line eqeqeq
  return (tsData == 0 ? '-' : tsData)
}

export default function TearDownSummery(props: Props | any) {
  // Action calls:
  const {
    getWorkOrderData,
    postOrUpdateIIRReport,
    handleEditIIRPDF,
    cancelLoading,
    openPDF,
    savePDF,
    softResetState
  } = props;
  // Tear Down State:
  // eslint-disable-next-line react/destructuring-assignment
  const { loadingScreen, loadPDF, workOrder, workOrderInfo, displayOpenPDFBtn } = props.iir;
  let displayPDFBtn = true;
  let warrentyString = 'No';

  // Verify TS values and display "-" if zero
  const {
    tearDownTSO,
    tearDownTSN,
    tearDownTSR
  } = workOrderInfo

  const tsoValues = tsDataCheck(tearDownTSO);
  const tsnValues = tsDataCheck(tearDownTSN);
  const tsrValues = tsDataCheck(tearDownTSR);

  if (workOrderInfo.Warrenty_Y_N === 'Y') {
    warrentyString = 'Yes';
  }

  const iirProps = {
    customerReasonForRemoval: workOrderInfo.customerReasonForRemoval,
    evalFindings: workOrderInfo.evalFindings,
    genConditionReceived: workOrderInfo.genConditionReceived,
    workedPerformedNote: workOrderInfo.workedPerformed,
    workedPerformed: workOrderInfo.Manual_Combined,
    Manual: workOrderInfo.Manual,
    Manual_Document: workOrderInfo.Manual_Document,
    Manual_Section: workOrderInfo.Manual_Section,
    Manual_Revision: workOrderInfo.Manual_Revision,
    Manual_Rev_Date_MMDDYY: workOrderInfo.Manual_Rev_Date_MMDDYY
  };

  if (
    workOrderInfo.Manual_Combined === 'N/A' ||
    workOrderInfo.Manual_Combined === ''
  ) {
    displayPDFBtn = false;
  }

  const cancelProp = { cancelLoading };
  // TODO: If selectable content is required, try using @progress/kendo-react-pdf.
  // Sets up the React component with the id to create a image and convert it to PNG then
  // save that image as a PDF to print. Text is un-selectable but is a quick easy way to
  // create a PDF from a component.
  const getPDF = () => {
    softResetState();
    const input: any = document.getElementById('capture');
    input.style.margin = 'unset';
    input.style.padding = 'unset';
    input.style.border = 'unset';
    input.style.position = 'absolute';
    input.style.background = 'white';
    input.style.left = '0';
    input.style.top = '0';
    input.style.width = '8.3in';
    input.style.height = '10.9in';


    html2canvas(input, { scrollY: -window.scrollY, scale: 1.25 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', -0.25, 0, width, height);
      savePDF(pdf.output('arraybuffer'));
    });
    input.style.margin = 'auto';
    input.style.border = '1px solid black';
    input.style.position = 'unset';
    input.style.left = 'unset';
    input.style.top = 'unset';
  };

  return (
    <div>
      <div className={styles['faded-backgroundImageContainer']}>
        <img src={logo} alt="AeroParts Logo" />
      </div>
      <div className={styles['form-container']}>
        <div>TEAR DOWN FORM REVIEW</div>
        {!loadingScreen && (
          <div>
            <WorkOrderSearchForm onSubmit={getWorkOrderData} />
          </div>
        )}
        {loadingScreen && <LoadingScreen props={cancelProp} />}
        {displayOpenPDFBtn && (
          <div className={styles['open-pdf-btn']}>
            <div>
              File Location: scanned (\\amr-fs1)(T:) CPLT_TRAVELERS\TearDowns
            </div>
            <div>
              <Btn buttonName="Open Current PDF" ClickHandler={openPDF} />
            </div>
          </div>
        )}
        {loadPDF && (
          <div className={styles['form-page-container']}>
            {!displayOpenPDFBtn && <div className={styles['open-pdf-btn']}><div>PDF Needs Saved.</div></div>}
            <div className={styles['form-page']}>
              <div id="capture">
                <div className={styles['form-header']}>
                  <div>
                    <img src={logo} alt="Aero Parts Logo" />
                  </div>
                  <div>TEARDOWN REPORT</div>
                  {/** Filler for centering as seen below */}
                  <div />
                </div>
                <div className={styles['form-body']}>
                  <div>
                    <div>
                      <div>
                        <div>
                          <div>Work Order:</div>
                          <div>{`${workOrder.workOrderSearch}-${workOrder.workOrderSearchLineItem}`}</div>
                        </div>
                        <div>
                          <div>Customer:</div>
                          <div>{workOrderInfo.CustomerName}</div>
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
                            <div>{tsnValues}</div>
                          </div>
                          <div>
                            <div>TSR:</div>
                            <div>{tsrValues}</div>
                          </div>
                          <div>
                            <div>TSO:</div>
                            <div>{tsoValues}</div>
                          </div>
                        </div>
                        <div>
                          <div>Order Type:</div>
                          <div>{workOrderInfo.OrderType}</div>
                        </div>
                        <div>
                          <div>Warranty:</div>
                          <div>{warrentyString}</div>
                        </div>
                        <div>
                          <div>Cert Type:</div>
                          <ArrayComponents props={workOrderInfo.Cert_type_Description} />
                        </div>
                      </div>
                      <div>
                        <IIRFromFiledPDF
                          onSubmit={postOrUpdateIIRReport}
                          props={iirProps}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    Authorized Signature:_____________________________________   Date:___________________
                  </div>
                </div>
                <div className={styles['form-footer']}>
                  <div>AeroParts Manufacturing & Repair, Inc.</div>
                  <div>Form 1230 Rev. NC</div>
                </div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <Link to={routes.EDITFORM}>
                    <Btn buttonName="EDIT NOTES" ClickHandler={handleEditIIRPDF} />
                  </Link>
                </div>
                {!displayOpenPDFBtn && (
                  <div>
                    {displayPDFBtn  && (
                    <button onClick={getPDF} type="button">
                      SAVE PDF
                    </button>
                  )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
