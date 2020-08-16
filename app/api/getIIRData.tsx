/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

interface Request {
  workOrder: {
    workOrderSearch: string;
    workOrderSearchLineItem: string;
  }

}

interface ReturnData {
  success: boolean;
  error: {};
  data: {} | any;
}

async function getWorkOrderData(request: Request) {
  console.log('request', request);
  const returnData: ReturnData = {
    error: {},
    data: [],
    success: false
  };
  const { workOrderSearch, workOrderSearchLineItem } = request.workOrder;
  try {
    const dbIIR = await pool.connect();
    const iirQuery = `SELECT *
    FROM iir_report_dev AS i
    WHERE i.SalesOrderNumber = '${workOrderSearch}' AND i.salesOrderNumberLine = '${workOrderSearchLineItem}'`;

    console.log('iir data query:', iirQuery);

    const getIIRData = await dbIIR.query(iirQuery);

    console.log('IIR DB Request resp', getIIRData.recordset[0]);

    if (getIIRData.recordset.length > 0) {
      returnData.data = getIIRData.recordset[0];
      returnData.success = true;
    } else {
      returnData.success = true;
    }
  } catch (error) {
    console.log('error', error);
    returnData.error = error;
  }
  console.log('return data: ', returnData);
  return returnData;
}

export default getWorkOrderData;
