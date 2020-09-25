/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';

const odbc = require('odbc');

interface Request {
  workOrderSearch: string;
  workOrderSearchLineItem: string;
}

interface ReturnData {
  error: {};
  data: {} | any;
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
    data: []
  };

  try {
    const db = await odbc.connect('DSN=AeroSuper');
    const data = await db.query(`SELECT sales_order_line.SalesOrderAndLineNumber, sales_order_line.ItemNumber, sales_order_line.PartNumber, sales_order_line.PartDescription, sales_order_line.SerialNumber, sales_order_line.Quantity, sales_order_line.TSN, sales_order_line.TSR, sales_order_line.TSO,
    sales_order.SalesOrderNumber, sales_order.CustomerNumber, sales_order.CustomerName, sales_order.CustomerOrderNumber, sales_order.DateIssuedYYMMDD, sales_order.Warrenty_Y_N, sales_order.OrderType
    FROM sales_order_line
    INNER JOIN sales_order ON sales_order_line.SalesOrderNumber = sales_order.SalesOrderNumber
    WHERE sales_order_line.SalesOrderNumber = '${request.workOrderSearch}' AND sales_order_line.ItemNumber = '${request.workOrderSearchLineItem}'`);

    if (data.length > 0) {
      returnData.data = data;
      // Can't get the server to do more than one join for some reason, work around is a second query.
      const secondData: any = await db.query(`SELECT traveler_header.Manual_Combined, traveler_header.Work_Order_Number, traveler_header.Trv_Num, traveler_header.CustomerName,
      sales_order_8130_types.Cert_type_Description, sales_order_8130_types.Sales_Order_Number
        FROM traveler_header
        INNER JOIN sales_order_8130_types ON traveler_header.Work_Order_Number = sales_order_8130_types.Sales_Order_Number
            WHERE traveler_header.Work_Order_Number = '${request.workOrderSearch}' AND traveler_header.Sales_Order_Line_Item = '${request.workOrderSearchLineItem}'`);

      if (
        secondData.length > 0 &&
        Object.prototype.hasOwnProperty.call(secondData[0], 'Manual_Combined')
      ) {
        const {
          Manual_Combined,
          Work_Order_Number,
          Trv_Num,
          Cert_type_Description
        } = secondData[0];

        returnData.data[0].Manual_Combined = Manual_Combined;
        returnData.data[0].Work_Order_Number = Work_Order_Number;
        returnData.data[0].Trv_Num = Trv_Num;
        returnData.data[0].Cert_type_Description = Cert_type_Description;
      } else {
        returnData.data[0].Manual_Combined = 'N/A';
        returnData.data[0].Work_Order_Number = 'N/A';
        returnData.data[0].Trv_Num = 'N/A';
        if (
          Object.prototype.hasOwnProperty.call(
            secondData[0],
            'Cert_type_Description'
          )
        ) {
          returnData.data[0].Cert_type_Description =
            secondData[0].Cert_type_Description;
        } else {
          returnData.data[0].Cert_type_Description = 'N/A';
        }
      }

      db.close();

      const dbIIR = await pool.connect();
      const iirQuery = `SELECT *
      FROM tear_down_notes AS i
      WHERE i.SalesOrderNumber = '${returnData.data[0].SalesOrderNumber}' AND i.salesOrderNumberLine = '${returnData.data[0].ItemNumber}'`;
      const getIIRData = await dbIIR.query(iirQuery);

      returnData.data[0].customerReasonForRemoval = 'NONE';
      returnData.data[0].genConditionReceived = 'NONE';
      returnData.data[0].evalFindings = 'NONE';
      returnData.data[0].workedPerformed = 'NONE';

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
        returnData.data[0].workedPerformed = checkStringLength(workedPerformed);
      }
    }
  } catch (error) {
    returnData.error = error;
  }
  console.log("data: ", returnData);
  return returnData;
}

export default getWorkOrderData;
