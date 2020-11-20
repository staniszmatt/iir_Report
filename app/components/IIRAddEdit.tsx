/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import LoadingScreen from './LoadingDisplay';
import Btn from './buttonFunctions/buttonClickHandler';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import ArrayComponents from './ReturnArrayComponents';
import IIRFormFields from './IIRFormFields';
import LinkWorkOrderForm from './LinkWorkOrderForm';
import styles from './IIRAddEdit.css';
import logo from '../img/logo.png';
// Need to pull PropsFormRedux in IIRAddEditPage to set variable types
// eslint-disable-next-line import/no-cycle
import { PropsFromRedux } from '../containers/IIRAddEditPage';

export default function IIRAddEdit(props: PropsFromRedux) {
  let apeOrderNotLinked = false;
  let displayUpdateAPELink = false;
  const {
    postUpdatePDFCheck,
    getIIRData,
    handleReviewIIRPDF,
    openPDF,
    cancelLoading,
    linkWorkOrder,
    warnRemoveAPELinkWorkOrder,
    iir
  } = props;
  const {
    loadingScreen,
    iirFormDisplay,
    workOrder,
    workOrderInfo,
    displayOpenPDFBtn
  } = iir;
  const {
    linkedWorkOrderIfAPE,
    CustomerNumber,
    linkedAPEWorkOrder,
    ItemNumber
  } = workOrderInfo;
  const iirProps = {
    CustomerNumber,
    linkedWorkOrderIfAPE,
    handleReviewIIRPDF
  };
  const initialFormValues = {
    customerReasonForRemoval: workOrderInfo.customerReasonForRemoval,
    evalFindings: workOrderInfo.evalFindings,
    genConditionReceived: workOrderInfo.genConditionReceived,
    workedPerformed: workOrderInfo.workedPerformed
  };
  const cancelProp = { cancelLoading };

  // If this is an APE work order and the customer work order isn't linked, display warning and hide pdf button.
  CustomerNumber === 'APE' && !linkedWorkOrderIfAPE
    ? (apeOrderNotLinked = true)
    : (apeOrderNotLinked = false);

  linkedWorkOrderIfAPE
    ? (displayUpdateAPELink = true)
    : (displayUpdateAPELink = false);

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
        <div>
          {iirFormDisplay && (
            <div>
              {!displayOpenPDFBtn && !apeOrderNotLinked && !linkedAPEWorkOrder && (
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
                    <div>Quantity:</div>
                    <div>{`${workOrderInfo.Quantity}`}</div>
                  </div>
                  <div>
                    <div>Cert Type:</div>
                    <ArrayComponents
                      props={workOrderInfo.Cert_type_Description}
                    />
                  </div>
                </div>
              </div>
              {linkedAPEWorkOrder && (
                <div className={styles['link-ape-display']}>
                  <div>{`LINKED TO APE WORK ORDER ${linkedAPEWorkOrder}-${ItemNumber}.`}</div>
                </div>
              )}
              {linkedWorkOrderIfAPE && (
                <div className={styles['link-ape-display']}>
                  <div>{`APE LINKED TO WORK ORDER ${linkedWorkOrderIfAPE}-${ItemNumber}.`}</div>
                </div>
              )}
              {apeOrderNotLinked && (
                <div className={styles['link-input-container']}>
                  <LinkWorkOrderForm
                    onSubmit={linkWorkOrder}
                    props={workOrder}
                    label="REQUIRED TO LINK CUSTOMER WORK ORDER TO APE:"
                  />
                </div>
              )}
              {displayUpdateAPELink && (
                <div className={styles['link-edit-container']}>
                  <div>
                    <div>
                      <div>Separate Work Order Link:</div>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={warnRemoveAPELinkWorkOrder}
                      >
                        Remove Link
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <IIRFormFields
                onSubmit={postUpdatePDFCheck}
                initialValues={initialFormValues}
                props={iirProps}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
