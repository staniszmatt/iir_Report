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
  const {
    SalesOrderNumber,
    salesOrderNumberLine,
    customerReasonForRemoval,
    genConditionReceived,
    evalFindings,
    workedPerformed
  } = request;

  console.log('post tear down notes, request:', request);

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
      keyName += `${key}, `;
      keyValue += `'${dbQueryRequest[key]}', `;
    } else {
      keyName += `${key}`;
      keyValue += `'${dbQueryRequest[key]}'`;
    }
    // Do not want to return anything, not sure at the moment if I need to restructure this.
    // eslint-disable-next-line no-useless-return
    return;
  });

  console.log(
    'DB Query: **********',
    `INSERT INTO iir_report_dev (SalesOrderNumber, salesOrderNumberLine, ${keyName})
  OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
  VALUES ('${SalesOrderNumber}', '${salesOrderNumberLine}', ${keyValue})`)

  try {
    // TODO: Add line item to query!
    const db = await pool.connect();
    const query = `INSERT INTO iir_report_dev (SalesOrderNumber, salesOrderNumberLine, ${keyName})
    OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
    VALUES ('${SalesOrderNumber}', '${salesOrderNumberLine}', ${keyValue})`;

    const postIIRReportData = await db.query(query);

    console.log('Post tear down notes resp: ', postIIRReport);

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

    console.log('error resp: ', error);

  }
  return returnData;
}

export default postIIRReport;
