/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';
import getDriver from '../config/configODBC';

const odbc = require('odbc');

interface Request {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}

interface ReturnData {
  error: {} | any;
  data: {} | any;
  noData: boolean;
}
// Checking for empty string or null fields to return NONE string or return note
function checkStringLength(stringToCheck: string) {
  let returnString = '';
  if (stringToCheck === null || stringToCheck.length === 0) {
    returnString = 'NONE';
  } else {
    returnString = stringToCheck;
  }
  return returnString;
}

async function getWorkOrderData(request: Request) {
  const returnData: ReturnData = {
    error: {},
    data: [],
    noData: false
  };
  const odbcDriverString = getDriver();

  try {
    const workOrder = request.workOrderSearch;
    const lineItme = request.workOrderSearchLineItem;
    // Set this up so it can visually be better when creating the query string.
    const queryString = `SELECT sales_order_line.SalesOrderAndLineNumber, sales_order_line.ItemNumber, sales_order_line.PartNumber, sales_order_line.PartDescription, sales_order_line.SerialNumber, sales_order_line.Quantity, sales_order_line.TSN, sales_order_line.TSR, sales_order_line.TSO,
      sales_order.SalesOrderNumber, sales_order.CustomerNumber, sales_order.CustomerName, sales_order.CustomerOrderNumber, sales_order.DateIssuedYYMMDD, sales_order.Warrenty_Y_N, sales_order.OrderType FROM sales_order_line INNER JOIN sales_order ON sales_order_line.SalesOrderNumber = sales_order.SalesOrderNumber
      WHERE sales_order_line.SalesOrderNumber = ? AND sales_order_line.ItemNumber = ?`;
    // Prepard query statement
    const db = await odbc.connect(odbcDriverString);
    const query = await db.createStatement();
    await query.prepare(queryString);
    await query.bind([workOrder, lineItme]);
    const data = await query.execute();
    // Must close otherwise could tie up connection pool
    await query.close();

    if (data.length > 0) {
      returnData.data = data;
      const query2String = `SELECT traveler_header.Manual_Combined, traveler_header.Work_Order_Number, traveler_header.Trv_Num, traveler_header.CustomerName,
        sales_order_8130_types.Cert_type_Description, sales_order_8130_types.Sales_Order_Number
        FROM traveler_header INNER JOIN sales_order_8130_types ON traveler_header.Work_Order_Number = sales_order_8130_types.Sales_Order_Number
        WHERE traveler_header.Work_Order_Number = ? AND traveler_header.Sales_Order_Line_Item = ?`;
      try {
        // Can't get the server to do more than one join for some reason, work around is a second query.
        const query2 = await db.createStatement();
        await query2.prepare(query2String);
        await query2.bind([workOrder, lineItme]);
        const secondData = await query2.execute();
        query2.close();
        db.close();

        if (
          secondData.length > 0 &&
          Object.prototype.hasOwnProperty.call(secondData[0], 'Manual_Combined')
        ) {
          const { Manual_Combined, Work_Order_Number, Trv_Num } = secondData[0];

          returnData.data[0].Manual_Combined = Manual_Combined;
          returnData.data[0].Work_Order_Number = Work_Order_Number;
          returnData.data[0].Trv_Num = Trv_Num;
          // Sometimes Cert type may not be entered yet.
          if (
            Object.prototype.hasOwnProperty.call(
              secondData[0],
              'Cert_type_Description'
            )
          ) {
            // Grab all cert types if available and store into array.
            returnData.data[0].Cert_type_Description = [];
            // Set the list of cert types into a array list
            const collectArrayCertList = secondData.map(
              (objData: { Cert_type_Description: string }) => {
                return objData.Cert_type_Description;
              }
            );
            // Filter out all the duplicates
            const removedDuplicates = collectArrayCertList.filter(
              (elem: never, index: number, arrayData: []) => {
                return index === arrayData.indexOf(elem);
              }
            );
            returnData.data[0].Cert_type_Description = removedDuplicates;
          } else {
            returnData.data[0].Cert_type_Description = 'N/A';
          }
        } else {
          returnData.data[0].Manual_Combined = 'N/A';
          returnData.data[0].Work_Order_Number = 'N/A';
          returnData.data[0].Trv_Num = 'N/A';
          returnData.data[0].Cert_type_Description = 'N/A';
        }
      } catch (error) {
        // Not sure if there is a better way but don't need to return the array of key value pairs.
        // eslint-disable-next-line array-callback-return
        Object.getOwnPropertyNames(error).map(key => {
          // eslint-disable-next-line no-useless-return
          returnData.error[key] = error[key];
        });
      }

      db.close();

      try {
        const dbIIR = await pool.connect();
        /**
         * NOTE: Per mssql libray referenced: https://www.npmjs.com/package/mssql
         * All values are automatically sanitized against sql injection. This is because it is rendered as
         * prepared statement, and thus all limitations imposed in MS SQL on parameters apply. e.g.
         * Column names cannot be passed/set in statements using variables.
         */
        const iirQuery = `SELECT *
        FROM tear_down_notes_dev AS i
        WHERE i.SalesOrderNumber = '${returnData.data[0].SalesOrderNumber}' AND i.salesOrderNumberLine = '${returnData.data[0].ItemNumber}'`;
        const getIIRData = await dbIIR.query(iirQuery);
        // Setup assuming no data is available.
        returnData.data[0].customerReasonForRemoval = 'NONE';
        returnData.data[0].genConditionReceived = 'NONE';
        returnData.data[0].evalFindings = 'NONE';
        returnData.data[0].workedPerformed = 'NONE';
        returnData.data[0].tearDownTSO = null;
        returnData.data[0].tearDownTSN = null;
        returnData.data[0].tearDownTSR = null;
        // Add Data only if there is any.
        if (getIIRData.recordset.length > 0) {
          const {
            customerReasonForRemoval,
            genConditionReceived,
            evalFindings,
            workedPerformed
          } = getIIRData.recordset[0];

          returnData.data[0].customerReasonForRemoval = checkStringLength(
            customerReasonForRemoval
          );
          returnData.data[0].genConditionReceived = checkStringLength(
            genConditionReceived
          );
          returnData.data[0].evalFindings = checkStringLength(evalFindings);
          returnData.data[0].workedPerformed = checkStringLength(
            workedPerformed
          );
          returnData.data[0].tearDownTSO = getIIRData.recordset[0].tearDownTSO;
          returnData.data[0].tearDownTSN = getIIRData.recordset[0].tearDownTSN;
          returnData.data[0].tearDownTSR = getIIRData.recordset[0].tearDownTSR;
        }
      } catch (error) {
        // Not sure if there is a better way but don't need to return the array of key value pairs.
        // eslint-disable-next-line array-callback-return
        Object.getOwnPropertyNames(error).map(key => {
          // eslint-disable-next-line no-useless-return
          returnData.error[key] = error[key];
        });
      }
    } else {
      returnData.error = {
        noWorkOrder: `Couldn't find WO: ${request.workOrderSearch}-${request.workOrderSearchLineItem}. Double check WO is correct.`
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

export default getWorkOrderData;
