/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import 'mssql/msnodesqlv8';
// import pool from '../config/config';

const sql = require('mssql/msnodesqlv8');

interface Request {
  workOrder: {
    workOrderSearch: string;
    workOrderSearchLineItem: string;
    connectionString: string;
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
  const {
    workOrderSearch,
    workOrderSearchLineItem,
    connectionString
  } = request.workOrder;

  const config = {
    driver: '',
    server: 'AMR-FS1\\SQLEXPRESS',
    database: 'Repair',
    options: {
      trustedConnection: true
    }
  };

  if (connectionString.length > 0) {
    config.driver = connectionString;
  } else {
    // config.driver = 'msnodesqlv8';
  }

  console.log('Config: ', config);

  // const pool = new sql.ConnectionPool(config);



  try {
    // const dbIIR = await pool.connect();
    const dbIIR = await sql.connect('DSN=AeroRepair');
    const iirQuery = `SELECT *
    FROM iir_report_dev AS i
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
  return returnData;
}

export default getWorkOrderData;
