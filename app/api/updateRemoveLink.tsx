/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

const sql = require('mssql/msnodesqlv8');

interface Request {
  workOrderAPE: string;
  workOrderLink: string;
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
  const { workOrderAPE, workOrderLink, lineItem } = request;
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

  // Start Connection for setup of prepare statement
  const db = await pool.connect();

  try {
    const preState = await new sql.PreparedStatement(db);
    preState.input('ape', sql.VarChar(12));
    preState.input('wo', sql.VarChar(12));
    preState.input('line', sql.VarChar(2));
    // Setup the values for params to pass through execute below.
    const preAPEStateParams: any = {
      ape: cleanWorkOrder,
      wo: cleanLinkWorkOrder,
      line: cleanLineItem
    };
    const queryStringAPE = `
      UPDATE tear_down_notes_dev
        SET linkedWorkOrderIfAPE = null
        OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
          WHERE SalesOrderNumber = @ape AND salesOrderNumberLine = @line

      UPDATE tear_down_notes_dev
        SET linkedAPEWorkOrder = null
          WHERE SalesOrderNumber = @wo AND salesOrderNumberLine = @line`;

    await preState.prepare(queryStringAPE);
    const linkAPEData = await preState.execute(preAPEStateParams);
    await preState.unprepare();

    if (linkAPEData.recordset[0].id) {
      returnData.resp.linkAPEData = linkAPEData;
      returnData.succuss = true;

      // try {
      //   const preStateWO = await new sql.PreparedStatement(db);
      //   preStateWO.input('ape', sql.VarChar(12));
      //   preStateWO.input('wo', sql.VarChar(12));
      //   preStateWO.input('line', sql.VarChar(2));
      //   const queryStringWO = `
      //   IF EXISTS (SELECT * FROM tear_down_notes_dev WHERE SalesOrderNumber = @wo AND tear_down_notes_dev.salesOrderNumberLine = @line)
      //   BEGIN
      //     UPDATE tear_down_notes_dev
      //       SET linkedAPEWorkOrder = @ape
      //         OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
      //           WHERE tear_down_notes_dev.SalesOrderNumber = @wo AND tear_down_notes_dev.salesOrderNumberLine = @line
      //   END
      //   ELSE
      //     BEGIN
      //       INSERT INTO tear_down_notes_dev (SalesOrderNumber, linkedAPEWorkOrder, salesOrderNumberLine)
      //         OUTPUT inserted.id, GETDATE() as dateStamp, CURRENT_USER as userName, HOST_NAME() AS hostName
      //       VALUES (@wo, @ape, @line)
      //   END`;

      //   await preStateWO.prepare(queryStringWO);
      //   const linkWOData = await preStateWO.execute(preAPEStateParams);
      //   await preStateWO.unprepare();

      //   if (linkWOData.recordset[0].id) {
      //     returnData.succuss = true;
      //     returnData.resp.linkWOData = linkWOData;
      //   } else {
      //     returnData.succuss = true;
      //     returnData.resp.linkWOData = linkWOData;
      //     returnData.error = {
      //       errorMsg: 'Something went wrong adding IIR report!'
      //     };
      //   }
      // } catch (error) {
      //   // Not sure if there is a better way but don't need to return the array of key value pairs.
      //   // eslint-disable-next-line array-callback-return
      //   Object.getOwnPropertyNames(error).map(key => {
      //     // eslint-disable-next-line no-useless-return
      //     returnData.error[key] = error[key];
      //   });
      // }
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
