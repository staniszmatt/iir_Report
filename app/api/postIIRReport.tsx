import 'mssql/msnodesqlv8';
import pool from '../config/config';

interface Request {
  SalesOrderNumber: string;
  customerReasonForRemoval: string;
  genConditionReceived: string;
  evalFindings: string;
  workedPerformed: string;
}

interface ReturnData {
  error: {};
  resp: {};
  succuss: boolean;
}

async function postIIRReport(request: Request) {
  console.log('post iir report request', request);

  const {
    SalesOrderNumber,
    customerReasonForRemoval,
    genConditionReceived,
    evalFindings,
    workedPerformed
  } = request;

  const returnData: ReturnData = {
    error: {},
    resp: {},
    succuss: false
  };

  try {
    const db = await pool.connect();
    const query = `INSERT INTO iir_report_dev (SalesOrderNumber, customerReasonForRemoval, genConditionReceived, evalFindings, workedPerformed)
    OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
    VALUES ('${SalesOrderNumber}', '${customerReasonForRemoval}', '${genConditionReceived}', '${evalFindings}', '${workedPerformed}')`;
    const postIIRReportData = await db.query(query);

    console.log('return resp:', postIIRReportData);

    if (postIIRReportData.recordset[0].id) {
      returnData.succuss = true;
      returnData.resp = postIIRReportData;
    } else {
      returnData.succuss = true;
      returnData.resp = postIIRReportData;
      returnData.error = {
        errorMsg: 'Something went wrong adding IIR report!'
      };
    }
  } catch (error) {
    console.log('iir post error: ', error);
    returnData.error = error;
  }
  return returnData;
}

export default postIIRReport;
