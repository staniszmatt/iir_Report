import React from 'react';
import LoadingScreen from './LoadingDisplay';
import WorkOrderSearchForm from './WorkOrderSearchForm';
import IIRFormFields from './IIRFormFields';
import styles from './IIRAddEdit.css';
import logo from '../img/logo.png';
import dummyData from '../dummyData/getDummyIIRData';

interface Props {
  postIIRReport: () => {};
  getIIRData: () => {};
  iir: {
    loadingScreen: boolean;
    loadPDF: boolean;
    iirFormDisplay: boolean;
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

export default function IIRAddEdit(props: Props) {

  console.log('tear down component, props:', props);

  const data = dummyData();

  const { postIIRReport, getIIRData } = props;
  // eslint-disable-next-line react/destructuring-assignment
  // const { loadingScreen, loadPDF, workOrder, workOrderInfo } = props.iir;
  const { loadingScreen, iirFormDisplay, workOrder, workOrderInfo } = data;


  const iirProps = {
    customerReasonForRemoval: workOrderInfo.customerReasonForRemoval,
    evalFindings: workOrderInfo.evalFindings,
    genConditionReceived: workOrderInfo.genConditionReceived,
    workedPerformedNote: workOrderInfo.workedPerformed
  };

  return (
    <div className={styles['iir-container']}>
      <div>
        <WorkOrderSearchForm onSubmit={getIIRData} />
      </div>
      {loadingScreen && <LoadingScreen />}
      <div>
        {iirFormDisplay && (
          <IIRFormFields onSubmit={postIIRReport} props={iirProps} />
        )}
      </div>
    </div>
  );
}
