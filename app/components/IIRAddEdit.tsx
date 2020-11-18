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
// eslint-disable-next-line import/no-cycle
import { PropsFromRedux } from '../containers/IIRAddEditPage';

export default function IIRAddEdit(props: PropsFromRedux) {
  console.log('edit page props', props);

  let apeOrderNotLinked = false;
  const {
    postUpdatePDFCheck,
    getIIRData,
    handleReviewIIRPDF,
    openPDF,
    cancelLoading,
    linkWorkOrder,
    iir
  } = props;
  const {
    loadingScreen,
    iirFormDisplay,
    workOrderInfo,
    displayOpenPDFBtn
  } = iir;
  const { linkedWorkOrderIfAPE, CustomerNumber } = workOrderInfo;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  CustomerNumber === 'APE' && !linkedWorkOrderIfAPE
    ? (apeOrderNotLinked = true)
    : (apeOrderNotLinked = false);

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
              {!displayOpenPDFBtn && !apeOrderNotLinked && (
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
              {apeOrderNotLinked && (
                <div className={styles['link-input-container']}>
                  <LinkWorkOrderForm
                    onSubmit={linkWorkOrder}
                    label="REQUIRED TO LINK CUSTOMER WORK ORDER TO APE:"
                  />
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
