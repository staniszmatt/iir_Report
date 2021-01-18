/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
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
import styles from './TearDownSummer.css'
import logo from '../img/logo.png';
// eslint-disable-next-line import/no-cycle
import { PropsFromRedux } from '../containers/TearDownSummeryPage';

function tsDataCheck(tsData: string | number) {
  // Could come in as a string or a number so testing for abstract equality
  // eslint-disable-next-line eqeqeq
  return tsData == 0 ? '-' : tsData;
}

export default function TearDownSummery(props: PropsFromRedux) {
  let displayPDFBtn = true;
  let warrentyString = 'No';
  let apeOrderNotLinked = false;
  // Action calls:
  const {
    getWorkOrderData,
    postOrUpdateIIRReport,
    handleEditIIRPDF,
    cancelLoading,
    openPDF,
    savePDF,
    softResetState,
    iir
  } = props;
  // Tear Down State:
  const {
    loadingScreen,
    loadPDF,
    workOrder,
    workOrderInfo,
    displayOpenPDFBtn
  } = iir;
  const {
    linkedWorkOrderIfAPE,
    CustomerNumber,
    linkedAPEWorkOrder,
    linkedWorkOrderIfAPELineItem,
    linkedAPEWorkOrderLineItem
  } = workOrderInfo;
  // Verify TS values and display "-" if zero
  const { TSO, TSN, TSR } = workOrderInfo;
  const tsoValues = tsDataCheck(TSO);
  const tsnValues = tsDataCheck(TSN);
  const tsrValues = tsDataCheck(TSR);
  const openAPEOrder = () => {
    const apeWorkOrder = {
      workOrderSearch: linkedAPEWorkOrder,
      workOrderSearchLineItem: linkedAPEWorkOrderLineItem
    };
    getWorkOrderData(apeWorkOrder);
  };
  // Convert Y to yes
  if (workOrderInfo.Warrenty_Y_N === 'Y') {
    warrentyString = 'Yes';
  }
  // If this is an APE work order and the customer work order isn't linked, display warning and hide pdf button.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  CustomerNumber === 'APE' && !linkedWorkOrderIfAPE
    ? (apeOrderNotLinked = true)
    : (apeOrderNotLinked = false);

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

    html2canvas(input, { scrollY: -window.scrollY, scale: 1.25 }).then(
      canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new JsPDF('p', 'mm', 'a4');
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', -0.25, 0, width, height);
        savePDF(pdf.output('arraybuffer'));
      }
    );
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
              <Btn buttonName="Open PDF" ClickHandler={openPDF} />
            </div>
          </div>
        )}
        {loadPDF && (
          <div className={styles['form-page-container']}>
            {!displayOpenPDFBtn && !apeOrderNotLinked && !linkedAPEWorkOrder && (
              <div className={styles['open-pdf-btn']}>
                <div>PDF Needs Saved.</div>
              </div>
            )}
            {linkedWorkOrderIfAPE && (
              <div className={styles['open-pdf-btn']}>
                <div>{`APE Linked To Customer Work Order: ${linkedWorkOrderIfAPE}-${linkedWorkOrderIfAPELineItem}`}</div>
              </div>
            )}
            {apeOrderNotLinked && (
              <div className={styles['blink-text']}>
                <div>LINK CUSTOMER WORK ORDER TO APE WORK ORDER!</div>
              </div>
            )}
            {linkedAPEWorkOrder && (
              <div className={styles['blink-text']}>
                <div>
                  {`PLEASE USE APE WORK ORDER ${linkedAPEWorkOrder}-${linkedAPEWorkOrderLineItem}!`}
                  <button type="button" onClick={openAPEOrder}>Open</button>
                </div>
              </div>
            )}
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
                      <div className={styles['row-data-container']}>
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
                      <div className={styles['row-data-container']}>
                        <div>
                          <div>Unit Received Information</div>
                        </div>
                      </div>
                      <div className={styles['row-data-container']}>
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
                      <div className={styles['ts-data-container']}>
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
              {apeOrderNotLinked && <div className={styles['blink-text']}><div>LINK CUSTOMER WORK ORDER TO APE WORK ORDER!</div></div>}
              <div className={styles['base-btn-container']}>
                <div>
                  <Link to={routes.EDITFORM}>
                    <Btn buttonName="EDIT NOTES" ClickHandler={handleEditIIRPDF} />
                  </Link>
                </div>
                {displayOpenPDFBtn && (
                  <div>
                    <Btn buttonName="Open PDF" ClickHandler={openPDF} />
                  </div>
                )}
                {!displayOpenPDFBtn && !linkedAPEWorkOrder && (
                  <div>
                    {displayPDFBtn && !apeOrderNotLinked && (
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
