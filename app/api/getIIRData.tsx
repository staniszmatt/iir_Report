/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

const odbc = require('odbc');

interface Request {
  workOrder: {
    workOrderSearch: string;
    workOrderSearchLineItem: string;
  };
}

interface ReturnData {
  success: boolean;
  error: {};
  data: {} | any;
}

async function getWorkOrderData(request: Request) {
  const returnData: ReturnData = {
    error: {},
    data: [],
    success: false
  };
  const { workOrderSearch, workOrderSearchLineItem } = request.workOrder;

  try {
    const db = await odbc.connect('DSN=AeroSuper');
    const data = await db.query(`SELECT *
      FROM sales_order_line
      WHERE sales_order_line.SalesOrderNumber = '${workOrderSearch}' AND sales_order_line.ItemNumber = '${workOrderSearchLineItem}'`);

    if (data.length > 0) {
      try {
        const dbIIR = await pool.connect();
        const iirQuery = `SELECT *
        FROM tear_down_notes AS i
        WHERE i.SalesOrderNumber = '${workOrderSearch}' AND i.salesOrderNumberLine = '${workOrderSearchLineItem}'`;

        const getIIRData = await dbIIR.query(iirQuery);

        if (getIIRData.recordset.length > 0) {
          returnData.data = getIIRData.recordset[0];
          returnData.success = true;
        } else {
          returnData.success = true;
        }
      } catch (error) {
        returnData.error = error;
      }
    } else {
      returnData.error = {
        noWorkOrder: `Couldn't find WO: ${workOrderSearch}-${workOrderSearchLineItem}. Double check WO is correct.`
      };
    }
  } catch (error) {
    returnData.error = error;
  }
  return returnData;
}

export default getWorkOrderData;
