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

// Checking for empty string or null fields to return NONE string or return note
function checkStringLength(stringToCheck: string) {
  let returnString = '';
  if (stringToCheck.length === 0 || stringToCheck === null) {
    returnString = 'NONE';
  } else {
    returnString = stringToCheck;
  }
  return returnString;
}

async function getWorkOrderData(request: Request) {
  const returnData: ReturnData = {
    error: {},
    data: {},
    success: false
  };
  const { workOrderSearch, workOrderSearchLineItem } = request.workOrder;

  try {
    const db = await odbc.connect('DSN=AeroSuper');
    const data = await db.query(`SELECT sales_order_line.SalesOrderAndLineNumber, sales_order_line.ItemNumber, sales_order_line.PartNumber, sales_order_line.PartDescription, sales_order_line.SerialNumber, sales_order_line.Quantity, sales_order_line.TSN, sales_order_line.TSR, sales_order_line.TSO,
    sales_order.SalesOrderNumber, sales_order.CustomerNumber, sales_order.CustomerName, sales_order.CustomerOrderNumber, sales_order.DateIssuedYYMMDD, sales_order.Warrenty_Y_N, sales_order.OrderType
    FROM sales_order_line
    INNER JOIN sales_order ON sales_order_line.SalesOrderNumber = sales_order.SalesOrderNumber
    WHERE sales_order_line.SalesOrderNumber = '${workOrderSearch}' AND sales_order_line.ItemNumber = '${workOrderSearchLineItem}'`);

    if (data.length > 0) {
      const {
        SalesOrderAndLineNumber,
        ItemNumber,
        PartNumber,
        PartDescription,
        SerialNumber,
        Quantity,
        TSN,
        TSR,
        TSO,
        SalesOrderNumber,
        CustomerNumber,
        CustomerName,
        CustomerOrderNumber,
        DateIssuedYYMMDD,
        Warrenty_Y_N,
        OrderType
      } = data[0];

      returnData.data.SalesOrderAndLineNumber = SalesOrderAndLineNumber;
      returnData.data.ItemNumber = ItemNumber;
      returnData.data.PartNumber = PartNumber;
      returnData.data.PartDescription = PartDescription;
      returnData.data.SerialNumber = SerialNumber;
      returnData.data.Quantity = Quantity;
      returnData.data.TSN = TSN;
      returnData.data.TSR = TSR;
      returnData.data.TSO = TSO;
      returnData.data.SalesOrderNumber = SalesOrderNumber;
      returnData.data.CustomerNumber = CustomerNumber;
      returnData.data.CustomerName = CustomerName;
      returnData.data.CustomerOrderNumber = CustomerOrderNumber;
      returnData.data.DateIssuedYYMMDD = DateIssuedYYMMDD;
      returnData.data.Warrenty_Y_N = Warrenty_Y_N;
      returnData.data.OrderType = OrderType;

      // Can't get the server to do more than one join for some reason, work around is a second query.
      const secondData: any = await db.query(`SELECT traveler_header.Manual_Combined, traveler_header.Work_Order_Number, traveler_header.Trv_Num, traveler_header.CustomerName,
      sales_cust_8130_types.Cert_type_Description, sales_cust_8130_types.CustomerName
        FROM traveler_header
          INNER JOIN sales_cust_8130_types ON traveler_header.CustomerName = sales_cust_8130_types.CustomerName
            WHERE traveler_header.Work_Order_Number = '${workOrderSearch}' AND traveler_header.Sales_Order_Line_Item = '${workOrderSearchLineItem}'`);

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

        returnData.data.Manual_Combined = Manual_Combined;
        returnData.data.Work_Order_Number = Work_Order_Number;
        returnData.data.Trv_Num = Trv_Num;
        returnData.data.Cert_type_Description = Cert_type_Description;
      } else {
        returnData.data.Manual_Combined = 'N/A';
        returnData.data.Work_Order_Number = 'N/A';
        returnData.data.Trv_Num = 'N/A';
        if (
          Object.prototype.hasOwnProperty.call(
            secondData[0],
            'Cert_type_Description'
          )
        ) {
          returnData.data.Cert_type_Description =
            secondData[0].Cert_type_Description;
        } else {
          returnData.data.Cert_type_Description = 'N/A';
        }
      }
      db.close();
    }

    if (data.length > 0) {
      try {
        const dbIIR = await pool.connect();
        const iirQuery = `SELECT *
        FROM tear_down_notes AS i
        WHERE i.SalesOrderNumber = '${workOrderSearch}' AND i.salesOrderNumberLine = '${workOrderSearchLineItem}'`;

        const getIIRData = await dbIIR.query(iirQuery);

        returnData.data.customerReasonForRemoval = '';
        returnData.data.genConditionReceived = '';
        returnData.data.evalFindings = '';
        returnData.data.workedPerformed = '';

        if (getIIRData.recordset.length > 0) {
          const {
            customerReasonForRemoval,
            genConditionReceived,
            evalFindings,
            workedPerformed
          } = getIIRData.recordset[0];

          returnData.data.customerReasonForRemoval = checkStringLength(
            customerReasonForRemoval
          );
          returnData.data.genConditionReceived = checkStringLength(
            genConditionReceived
          );
          returnData.data.evalFindings = checkStringLength(evalFindings);
          // eslint-disable-next-line prettier/prettier
          returnData.data.workedPerformed = checkStringLength(workedPerformed);
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
