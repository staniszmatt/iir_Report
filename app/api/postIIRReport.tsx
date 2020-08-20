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
    salesOrderNumberLine,
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
  // Setup of an empty string for adding to the Query.
  let keyName = '';
  let keyValue = '';
  // This is to setup the object of only values that can be set null
  const nullableKeys: any = {
    customerReasonForRemoval,
    genConditionReceived,
    evalFindings,
    workedPerformed
  };

  const dbQueryRequest: any = {};
  // This will load objects but ignore null value objects.
  // Needed to do this so we can get a count of the total number posts to be made
  // eslint-disable-next-line array-callback-return
  Object.keys(nullableKeys).map(key => {

    console.log('Null Key value check : ', nullableKeys[key]);
    // Do not return anything if set to null!
    if (nullableKeys[key] !== null) {
      dbQueryRequest[key] = nullableKeys[key];
    }
  });

  console.log('key values added: ', dbQueryRequest);

  // Setup the query string based off the none null values stored in dbQueryRequest.
  // The else statement removes the comma to complete the query string.
  Object.keys(dbQueryRequest).map((key, index) => {
    const keyLastIndex = Object.keys(dbQueryRequest).length - 1;
    if (index !== keyLastIndex) {
      console.log('single key: ', key);
      console.log('single key value: ', dbQueryRequest[key]);
      keyName += `${key}, `;
      keyValue += `'${dbQueryRequest[key]}', `;
    } else {
      keyName += `${key}`;
      keyValue += `'${dbQueryRequest[key]}'`;
    }
  });

  console.log('Key Names', keyName);
  console.log('key values', keyValue);

  try {
    // TODO: Add line item to query!
    const db = await pool.connect();
    const query = `INSERT INTO iir_report_dev (SalesOrderNumber, salesOrderNumberLine, ${keyName})
    OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
    VALUES ('${SalesOrderNumber}', '${salesOrderNumberLine}', ${keyValue})`;

    console.log('Query Check: ', query);

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
