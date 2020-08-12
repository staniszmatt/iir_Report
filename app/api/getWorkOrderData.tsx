const odbc = require('odbc');

interface Request {
  workOrderNumber: string;
}

async function getWorkOrderData(request: Request) {
  console.log('request', request);
  const returnData = {
    error: {},
    data: {}
  };
  try {
    const db = await odbc.connect('DSN=AeroSuper');
    const data = await db.query(`SELECT * FROM sales_order_line
    WHERE sales_order_line.SalesOrderAndLineNumber = '${request.workOrderNumber}'`);
    console.log('data', data);
    returnData.data = data;
    db.close();
  } catch (error) {
    console.log('error', error);
    returnData.error = error;
  }
  console.log('return data: ', returnData);
  return returnData;
}

export default getWorkOrderData;
