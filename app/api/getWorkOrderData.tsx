/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

// const odbc = require('odbc');

interface Request {
  workOrderNumber: string;
}

interface ReturnData {
  error: {};
  data: {} | any;
}

async function getWorkOrderData(request: Request) {
  console.log('request', request);
  const returnData: ReturnData = {
    error: {},
    data: {}
  };
  try {
    // const db = await odbc.connect('DSN=AeroSuper');
    // const data = await db.query(`SELECT sales_order.SalesOrderNumber, sales_order_line.SalesOrderAndLineNumber, sales_order_line.ItemNumber, sales_order_line.PartNumber, sales_order_line.PartDescription, sales_order_line.SerialNumber, sales_order_line.Quantity, sales_order_line.TSN, sales_order_line.TSR, sales_order_line.TSO,
    // sales_order.CustomerNumber, sales_order.CustomerName, sales_order.CustomerOrderNumber, sales_order.DateIssuedYYMMDD, sales_order.Warrenty_Y_N, sales_order.OrderType
    // FROM sales_order_line
    // INNER JOIN sales_order ON sales_order_line.SalesOrderNumber = sales_order.SalesOrderNumber
    // WHERE sales_order_line.SalesOrderAndLineNumber = '${request.workOrderNumber}'`);
    // console.log('data', data);
    // returnData.data = data;
    // // Can't get the server to do more than one join for some reason, work around is a second query.
    // const secondData: any = await db.query(`SELECT traveler_header.Manual_Combined, traveler_header.Work_Order_Number, traveler_header.Trv_Num
    // FROM traveler_header
    // WHERE traveler_header.Sales_Order_Number = 'CN101'`);

    // console.log('second data ', secondData);

    // const { Manual_Combined, Work_Order_Number, Trv_Num } = secondData[0];

    // returnData.data[0].Manual_Combined = Manual_Combined;
    // returnData.data[0].Work_Order_Number = Work_Order_Number;
    // returnData.data[0].Trv_Num = Trv_Num;

    // db.close();

    const dbIIR = await pool.connect();
    // const iirQuery = `SELECT *
    // FROM iir_report_dev AS i
    // WHERE i.SalesOrderNumber = '${returnData.data[0].SalesOrderNumber}' AND i.salesOrderNumberLine = '${returnData.data[0].ItemNumber}'`;
    const iirQuery = `SELECT *
    FROM iir_report_dev AS i
    WHERE i.SalesOrderNumber = 'CN101' AND i.salesOrderNumberLine = '01'`;
    const getIIRData = await dbIIR.query(iirQuery);

    console.log('IIR DB Request resp', getIIRData);
    returnData.data.getIIRData = getIIRData;

  } catch (error) {
    console.log('error', error);
    returnData.error = error;
  }
  console.log('return data: ', returnData);
  return returnData;
}

export default getWorkOrderData;
