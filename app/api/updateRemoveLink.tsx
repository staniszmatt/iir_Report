/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

const sql = require('mssql/msnodesqlv8');

interface Request {
  workOrderAPE: string;
  workOrderLink: string;
  workOrderLinkLineItem: string;
  lineItem: string;
}

interface ReturnData {
  error: {} | any;
  resp: {
    linkAPEData: {};
  };
  succuss: boolean;
}

async function updateRemoveLink(request: Request) {
  const {
    workOrderAPE,
    workOrderLink,
    lineItem,
    workOrderLinkLineItem
  } = request;
  const returnData: ReturnData = {
    error: {},
    resp: {
      linkAPEData: {}
    },
    succuss: false
  };
  // Sanitize work order strings.
  const cleanWorkOrder = workOrderAPE
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');
  const cleanLinkWorkOrder = workOrderLink
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');
  const cleanLineItem = lineItem
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');
  const cleanWorkOrderLinkLineItem = workOrderLinkLineItem
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');

  // Start Connection for setup of prepare statement
  const db = await pool.connect();

  try {
    const preState = await new sql.PreparedStatement(db);
    preState.input('ape', sql.VarChar(12));
    preState.input('wo', sql.VarChar(12));
    preState.input('line', sql.VarChar(2));
    preState.input('woLine', sql.VarChar(2));
    // Setup the values for params to pass through execute below.
    const preAPEStateParams: any = {
      ape: cleanWorkOrder,
      wo: cleanLinkWorkOrder,
      line: cleanLineItem,
      woLine: cleanWorkOrderLinkLineItem
    };
    const queryStringAPE = `
      UPDATE tear_down_notes
        SET linkedWorkOrderIfAPE = null, linkedWorkOrderIfAPELineItem = null
        OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
          WHERE SalesOrderNumber = @ape AND salesOrderNumberLine = @line

      UPDATE tear_down_notes
        SET linkedAPEWorkOrder = null, linkedAPEWorkOrderLineItem = null
          WHERE SalesOrderNumber = @wo AND salesOrderNumberLine = @woLine`;

    await preState.prepare(queryStringAPE);
    const linkAPEData = await preState.execute(preAPEStateParams);
    await preState.unprepare();

    if (linkAPEData.recordset[0].id) {
      returnData.resp.linkAPEData = linkAPEData;
      returnData.succuss = true;
    } else {
      returnData.succuss = true;
      returnData.resp.linkAPEData = linkAPEData;
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

export default updateRemoveLink;
