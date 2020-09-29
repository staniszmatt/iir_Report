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
    diplayOpenPDFBtn: boolean;
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

export default function TearDownSummery(props: Props | any) {
  const {
    getWorkOrderData,
    postOrUpdateIIRReport,
    handleEditIIRPDF,
    cancelLoading,
    openPDF,
    savePDF,
    softResetState
  } = props;
  // eslint-disable-next-line react/destructuring-assignment
  const { loadingScreen, loadPDF, workOrder, workOrderInfo, diplayOpenPDFBtn } = props.iir;
  let displayPDFBtn = true;
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

  if (
    workOrderInfo.Manual_Combined === 'N/A' ||
    workOrderInfo.Manual_Combined === ''
  ) {
    displayPDFBtn = false;
  }

  const cancelProp = { cancelLoading };
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
    input.style.width = '8.27in';
    input.style.height = '11.69in';


    html2canvas(input, { scrollY: -window.scrollY, scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new JsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      console.log('width, height of pdf size: ', width, height);

      pdf.addImage(imgData, 'JPEG', -2, 0, width, height);
      savePDF(pdf.output('arraybuffer'));
    });
    input.style.margin = 'auto';
    input.style.border = '1px solid black';
    input.style.position = 'unset';
  };

  return (
    <div>
      <div className={styles['faded-backgroundImageContainer']}>
        <img src={logo} alt="AeroParts Logo" />
      </div>
      <div className={styles['form-container']}>
        <div>TEAR DONW FORM REVIEW</div>
        {!loadingScreen && (
          <div>
            <WorkOrderSearchForm onSubmit={getWorkOrderData} />
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
        {loadPDF && (
          <div className={styles['form-page-container']}>
            {!diplayOpenPDFBtn && <div className={styles['open-pdf-btn']}><div>PDF Needs Saved.</div></div>}
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
                          <div>Warranty:</div>
                          <div>{warrentyString}</div>
                        </div>
                        <div>
                          <div>Cert Type:</div>
                          <div>{workOrderInfo.Cert_type_Description}</div>
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
                {!diplayOpenPDFBtn && (
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
