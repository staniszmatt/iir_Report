/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

interface Request {
  SalesOrderNumber: string;
  salesOrderNumberLine: string;
  customerReasonForRemoval: string | null;
  genConditionReceived: string | null;
  evalFindings: string | null;
  workedPerformed: string | null;
  tearDownTSO: string | null;
  tearDownTSN: string | null;
  tearDownTSR: string | null;
}

interface ReturnData {
  error: {};
  resp: {};
  succuss: boolean;
}

async function postIIRReport(request: Request) {
  const {
    SalesOrderNumber,
    salesOrderNumberLine,
    customerReasonForRemoval,
    genConditionReceived,
    evalFindings,
    workedPerformed,
    tearDownTSO,
    tearDownTSN,
    tearDownTSR
  } = request;

  const returnData: ReturnData = {
    error: {},
    resp: {},
    succuss: false
  };
  // Setup of an empty string for adding to the Query.
  let keyValue = '';
  // This is to setup the object of only values that can be set null
  const nullableKeys: any = {
    customerReasonForRemoval,
    genConditionReceived,
    evalFindings,
    workedPerformed,
    tearDownTSO,
    tearDownTSN,
    tearDownTSR
  };

  const dbQueryRequest: any = {};
  // This will load objects but ignore null value objects.
  // Needed to do this so we can get a count of the total number posts to be made
  // eslint-disable-next-line array-callback-return
  Object.keys(nullableKeys).map(key => {
    // Do not return anything if set to null!
    if (nullableKeys[key] !== null) {
      dbQueryRequest[key] = nullableKeys[key];
    }
  });

  // Setup the query string based off the none null values stored in dbQueryRequest.
  // The else statement removes the comma to complete the query string.
  Object.keys(dbQueryRequest).map((key, index) => {
    const keyLastIndex = Object.keys(dbQueryRequest).length - 1;
    if (index !== keyLastIndex) {
      keyValue += `${key} = '${dbQueryRequest[key]}', `;
    } else {
      keyValue += `${key} = '${dbQueryRequest[key]}'`;
    }
    // Do not need to return anything, not sure how to fix typescript error just yet.
    // eslint-disable-next-line no-useless-return
    return;
  });

  try {
    const db = await pool.connect();

    const query = `UPDATE tear_down_notes_dev
    SET ${keyValue}
    OUTPUT INSERTED.id, GETDATE() as dateStamp, CURRENT_USER as UserName
    WHERE SalesOrderNumber = '${SalesOrderNumber}' AND salesOrderNumberLine = '${salesOrderNumberLine}'`;

    const postIIRReportData = await db.query(query);

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
    returnData.error = error;
  }
  return returnData;
}

export default postIIRReport;
