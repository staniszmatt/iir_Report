/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

interface ReturnData {
  error: {};
  data: any;
}

interface QueryString {
  query: string;
}

async function testDB(queryString: QueryString) {

  console.log('test qury string: ', queryString);

  const returnData: ReturnData = {
    error: {},
    data: null
  };
  const { query } = queryString;
  console.log('DB query string: ', query);
  try {
    const db = await pool.connect();
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