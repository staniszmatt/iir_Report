import getDriver from '../config/configODBC';
/* eslint-disable @typescript-eslint/no-explicit-any */
const odbc = require('odbc');

interface ReturnData {
  error: {};
  data: any;
}

interface QueryString {
  query: string;
}

async function testDB(queryString: QueryString) {

  console.log('test JobCost query string: ', queryString.query);

  const returnData: ReturnData = {
    error: {},
    data: null
  };
  const { query } = queryString;
  console.log('DB query string: ', query);

  const odbcDriverString = getDriver();
  try {
    const db = await odbc.connect(odbcDriverString);
    const data = await db.query(query);

    console.log('return data resp:', data);
    console.log('resp check 0: ********************:', data[0]);

    returnData.data = data;

  } catch (err) {
    console.log('Error Resp: ', err);
    returnData.error = err;
  }
  return returnData;
}

export default testDB;
