/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

const sql = require('mssql/msnodesqlv8');

interface Request {
  SalesOrderNumber: string;
  salesOrderNumberLine: string;
  customerReasonForRemoval: string | null;
  genConditionReceived: string | null;
  evalFindings: string | null;
  workedPerformed: string | null;
  tearDownTSN: string | null;
  tearDownTSO: string | null;
  tearDownTSR: string | null;
}

interface ReturnData {
  error: {} | any;
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
    tearDownTSN,
    tearDownTSO,
    tearDownTSR
  } = request;

  const returnData: ReturnData = {
    error: {},
    resp: {},
    succuss: false
  };
  // Setup of an empty string for adding to the Query.
  let keyName = `SalesOrderNumber, salesOrderNumberLine, `;
  // This is to setup the object of only values that can be set null
  const nullableKeys: any = {
    customerReasonForRemoval,
    genConditionReceived,
    evalFindings,
    workedPerformed,
    tearDownTSN,
    tearDownTSO,
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
  // Sanitize work order strings.
  const cleanWorkOrder = SalesOrderNumber.replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');
  const cleanLineItem = salesOrderNumberLine
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');
  // Start Setup the @param count to add to query string to help setup prepare statement
  let params = '@param1, @param2, ';
  // Setup the values for params to pass through execute below.
  const preStateParams: any = {
    param1: cleanWorkOrder,
    param2: cleanLineItem
  };
  // Start Connection for setup of prepare statement
  const db = await pool.connect();
  const preState = await new sql.PreparedStatement(db);
  preState.input('param1', sql.VarChar);
  preState.input('param2', sql.VarChar);
  // Setup the query string based off the none null values stored in dbQueryRequest.
  // The else statement removes the comma to complete the query string.

  Object.keys(dbQueryRequest).map((key, index) => {
    const keyLastIndex = Object.keys(dbQueryRequest).length - 1;
    // Start Count at three because we start work order number and line item at 1 and 2
    // This is where we add the param values to use in query string
    const paramCount = index + 3;
    const cleanName = key.replace(/[^a-zA-Z-0-9-_ ]/g, '');
    const cleanKeyValue = dbQueryRequest[key]
      .replace(/  +/g, ' ')
      .replace(/[`']/g, '"')
      .replace(/[#^&*<>()@~]/g, '');
    const paramKeyName = `param${paramCount}`;
    preStateParams[paramKeyName] = cleanKeyValue;
    preState.input(paramKeyName, sql.VarChar);
    // Set the last index to add to string without the comma.
    if (index !== keyLastIndex) {
      keyName += `${cleanName}, `;
      params += ` @param${paramCount},`;
    } else {
      keyName += `${cleanName}`;
      params += ` @param${paramCount}`;
    }
    // Do not want to return anything, not sure at the moment if I need to restructure this.
    // eslint-disable-next-line no-useless-return
    return;
  });

  try {
    const queryString = `INSERT INTO tear_down_notes_dev (${keyName})
    OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
    VALUES (${params})`;

    await preState.prepare(queryString);
    const postIIRReportData = await preState.execute(preStateParams);
    await preState.unprepare();

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
    // Not sure if there is a better way but don't need to return the array of key value pairs.
    // eslint-disable-next-line array-callback-return
    Object.getOwnPropertyNames(error).map(key => {
      // eslint-disable-next-line no-useless-return
      returnData.error[key] = error[key];
    });
  }
  return returnData;
}

export default postIIRReport;
