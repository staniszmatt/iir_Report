const odbc = require('odbc');

async function getData(request) {
  console.log('request', request);
  const returnData = {
    error: {},
    data: {}
  };
  try {
    const db = await odbc.connect('DSN=AeroSuper');
    const data = await db.query(`SELECT * FROM sales_order_line
    WHERE sales_order_line.SalesOrderAndLineNumber = '12939   01'`);
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

export default getData;
