export default function dummyIIRData() {
  const dummyData = {
    loadPDF: true,
    loadingScreen: true,
    workOrderInfo: {
      CustomerName: 'LUFTHANSA TECHNIK',
      CustomerNumber: 'LUFTHA',
      CustomerOrderNumber: '252047863',
      DateIssuedYYMMDD: '2019-11-05',
      ItemNumber: '01',
      Manual_Combined: 'OEM       BASF ACMM           21-11-15         3092108',
      OrderType: 'FAAI',
      PartDescription: 'CONVERTER, OZONE (VOC)',
      PartNumber: '44018005',
      Quantity: 1,
      SalesOrderAndLineNumber: 'CN101   01',
      SalesOrderNumber: 'CN101',
      SerialNumber: '10898',
      TSN: 0,
      TSO: 0,
      TSR: 0,
      Trv_Num: '01',
      Warrenty_Y_N: 'N',
      Work_Order_Number: 'CN101',
      customerReasonForRemoval: 'Customer Reason',
      evalFindings: 'Findings',
      genConditionReceived: 'Condition Received',
      workedPerformed: 'Work Done'
    },
    workOrder: {
      workOrderSearch: 'CN101',
      workOrderSearchLineItem: '01'
    },
    error: {}
  };
  return dummyData;
}
