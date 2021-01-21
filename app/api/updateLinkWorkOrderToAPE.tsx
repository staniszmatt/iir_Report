/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

const sql = require('mssql/msnodesqlv8');

interface Request {
  workOrderToLink: string;
  workOrderToLinkLineItem: string;
  originalWorkOrder: {
    workOrder: string;
    lineItem: string;
  };
}

interface ReturnData {
  error: {} | any;
  resp: {
    linkAPEData: {};
    linkWOData: {};
  };
  succuss: boolean;
}

async function postLinkWorkOrderToAPE(request: Request) {
  const {
    workOrderToLink,
    workOrderToLinkLineItem,
    originalWorkOrder
  } = request;
  const { workOrder, lineItem } = originalWorkOrder;
  const returnData: ReturnData = {
    error: {},
    resp: {
      linkAPEData: {},
      linkWOData: {}
    },
    succuss: false
  };
  // Sanitize work order strings.
  const cleanWorkOrder = workOrder
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');
  const cleanLinkWorkOrder = workOrderToLink
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');
  const cleanWorkOrderToLinkLineItem = workOrderToLinkLineItem
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');
  const cleanLineItem = lineItem
    .replace(/  +/g, '')
    .replace(/[`']/g, '"')
    .replace(/[#^&*<>()@~]/g, '');

  // Start Connection for setup of prepare statement
  const db = await pool.connect();
  // Initial setup for the APE order
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
      woLine: cleanWorkOrderToLinkLineItem
    };
    const queryStringAPE = `
    IF EXISTS (SELECT * FROM tear_down_notes WHERE tear_down_notes.SalesOrderNumber = @ape AND tear_down_notes.salesOrderNumberLine = @line)
      BEGIN
        UPDATE tear_down_notes
          SET linkedWorkOrderIfAPE = @wo, linkedWorkOrderIfAPELineItem = @woLine
            OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
              WHERE tear_down_notes.SalesOrderNumber = @ape AND tear_down_notes.salesOrderNumberLine = @line
    END
    ELSE
      BEGIN
        INSERT INTO tear_down_notes (SalesOrderNumber, linkedWorkOrderIfAPE, linkedWorkOrderIfAPELineItem, salesOrderNumberLine)
          OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
        VALUES (@ape, @wo, @woLine, @line)
    END`;

    await preState.prepare(queryStringAPE);
    const linkAPEData = await preState.execute(preAPEStateParams);
    await preState.unprepare();

    if (linkAPEData.recordset[0].id) {
      returnData.resp.linkAPEData = linkAPEData;
      // If successfully updated APE, Update work order with APE order.
      try {
        const preStateWO = await new sql.PreparedStatement(db);
        preStateWO.input('ape', sql.VarChar(12));
        preStateWO.input('wo', sql.VarChar(12));
        preStateWO.input('line', sql.VarChar(2));
        preStateWO.input('woLine', sql.VarChar(2));
        const queryStringWO = `
        IF EXISTS (SELECT * FROM tear_down_notes WHERE SalesOrderNumber = @wo AND tear_down_notes.salesOrderNumberLine = @woLine)
        BEGIN
          UPDATE tear_down_notes
            SET linkedAPEWorkOrder = @ape, linkedAPEWorkOrderLineItem = @line
              OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
                WHERE tear_down_notes.SalesOrderNumber = @wo AND tear_down_notes.salesOrderNumberLine = @woLine
        END
        ELSE
          BEGIN
            INSERT INTO tear_down_notes (SalesOrderNumber, linkedAPEWorkOrder, linkedAPEWorkOrderLineItem, salesOrderNumberLine)
              OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
            VALUES (@wo, @ape, @line, @woLine)
        END`;

        await preStateWO.prepare(queryStringWO);
        const linkWOData = await preStateWO.execute(preAPEStateParams);
        await preStateWO.unprepare();

        if (linkWOData.recordset[0].id) {
          returnData.succuss = true;
          returnData.resp.linkWOData = linkWOData;
        } else {
          returnData.succuss = true;
          returnData.resp.linkWOData = linkWOData;
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

export default postLinkWorkOrderToAPE;
