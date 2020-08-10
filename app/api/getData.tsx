import { SqlClient } from 'msnodesqlv8';

const sql: SqlClient = require('msnodesqlv8');

const connectionString =
  'Driver={ODBC dl4 Driver 64};server=(AeroSuper)\\Database=jcs;Trusted_Connection=Yes';

async function getData() {
  const returnData = {
    error: {},
    data: {}
  };
  try {
    const query = `
      SELECT TOP 10 * FROM sales_order
    `
    const data = await sql.query(connectionString, query, (err, rows) => {
      console.log('data errors', err);
      console.log('data rows', rows);
      const resp = {
        err,
        rows
      }
      return resp;
    });
    console.log('data', data);
    returnData.data = data;
  } catch (error) {
    console.log('error', error);
    returnData.error = error;
  }
  return returnData;
}

export default getData;
