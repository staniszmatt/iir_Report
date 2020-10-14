/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';
import getDriver from '../config/configODBC';

const odbc = require('odbc');
const sql = require('mssql/msnodesqlv8');

interface Request {
  workOrder: {
    workOrderSearch: string;
    workOrderSearchLineItem: string;
  };
}

interface ReturnData {
  success: boolean;
  error: {} | any;
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

async function getIIRDataAPI(request: Request) {
  const returnData: ReturnData = {
    error: {},
    data: {},
    success: false
  };
  const { workOrderSearch, workOrderSearchLineItem } = request.workOrder;
  const odbcDriverString = getDriver();

  try {
    const cleanWorkOrder = workOrderSearch
      .replace(/  +/g, '')
      .replace(/[`']/g, '"')
      .replace(/[#^&*<>()@~]/g, '');
    const cleanLineItem = workOrderSearchLineItem
      .replace(/  +/g, '')
      .replace(/[`']/g, '"')
      .replace(/[#^&*<>()@~]/g, '');
    const queryString = `SELECT sales_order_line.SalesOrderAndLineNumber, sales_order_line.ItemNumber, sales_order_line.PartNumber, sales_order_line.PartDescription, sales_order_line.SerialNumber, sales_order_line.Quantity, sales_order_line.TSN, sales_order_line.TSR, sales_order_line.TSO,
    sales_order.SalesOrderNumber, sales_order.CustomerNumber, sales_order.CustomerName, sales_order.CustomerOrderNumber, sales_order.DateIssuedYYMMDD, sales_order.Warrenty_Y_N, sales_order.OrderType
    FROM sales_order_line
    INNER JOIN sales_order ON sales_order_line.SalesOrderNumber = sales_order.SalesOrderNumber
    WHERE sales_order_line.SalesOrderNumber = ? AND sales_order_line.ItemNumber = ?`;

    const db = await odbc.connect(odbcDriverString);
    const query = await db.createStatement();
    await query.prepare(queryString);
    await query.bind([cleanWorkOrder, cleanLineItem]);
    const data = await query.execute();
    // Must close otherwise could tie up connection pool
    await query.close();

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

      try {
        // Can't get the server to do more than one join for some reason, work around is a second query to JobCost DB.
        const query2String = `SELECT traveler_header.Manual_Combined, traveler_header.Work_Order_Number, traveler_header.Trv_Num, traveler_header.CustomerName,
        sales_order_8130_types.Cert_type_Description, sales_order_8130_types.Sales_Order_Number
          FROM traveler_header
          INNER JOIN sales_order_8130_types ON traveler_header.Work_Order_Number = sales_order_8130_types.Sales_Order_Number
              WHERE traveler_header.Work_Order_Number = ? AND traveler_header.Sales_Order_Line_Item = ?`;
        const query2 = await db.createStatement();
        await query2.prepare(query2String);
        await query2.bind([cleanWorkOrder, cleanLineItem]);
        const secondData = await query2.execute();
        query2.close();
        db.close();

        if (secondData.length > 0) {
          if (
            Object.prototype.hasOwnProperty.call(
              secondData[0],
              'Manual_Combined'
            )
          ) {
            const {
              Manual_Combined,
              Work_Order_Number,
              Trv_Num
            } = secondData[0];

            returnData.data.Manual_Combined = Manual_Combined;
            returnData.data.Work_Order_Number = Work_Order_Number;
            returnData.data.Trv_Num = Trv_Num;
            if (
              Object.prototype.hasOwnProperty.call(
                secondData[0],
                'Cert_type_Description'
              )
            ) {
              // Grab all cert types if available and store into array.
              returnData.data.Cert_type_Description = [];
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

              returnData.data.Cert_type_Description = removedDuplicates;
            } else {
              returnData.data.Cert_type_Description = 'N/A';
            }
          }
        } else {
          returnData.data.Manual_Combined = 'N/A';
          returnData.data.Work_Order_Number = 'N/A';
          returnData.data.Trv_Num = 'N/A';
          returnData.data.Cert_type_Description = 'N/A';
          returnData.data.Cert_type_Description = 'N/A';
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
    }
    if (data.length > 0) {
      try {
        const dbIIR = await pool.connect();
        const preState = await new sql.PreparedStatement(dbIIR);
        preState.input('param1', sql.VarChar(12));
        preState.input('param2', sql.VarChar(2));
        const preStateParams: any = {
          param1: cleanWorkOrder,
          param2: cleanLineItem
        };
        const iirQuery = `SELECT *
        FROM tear_down_notes_dev AS i
        WHERE i.SalesOrderNumber = @param1 AND i.salesOrderNumberLine = @param2`;

        await preState.prepare(iirQuery);
        const getIIRData = await preState.execute(preStateParams);
        await preState.unprepare();

        if (getIIRData.recordset.length === 0) {
          returnData.data.customerReasonForRemoval = null;
          returnData.data.genConditionReceived = null;
          returnData.data.evalFindings = null;
          returnData.data.workedPerformed = null;
          returnData.data.tearDownTSO = null;
          returnData.data.tearDownTSN = null;
          returnData.data.tearDownTSR = null;
        } else {
          returnData.data.customerReasonForRemoval = '';
          returnData.data.genConditionReceived = '';
          returnData.data.evalFindings = '';
          returnData.data.workedPerformed = '';
        }

        if (getIIRData.recordset.length > 0) {
          const {
            customerReasonForRemoval,
            genConditionReceived,
            evalFindings,
            workedPerformed,
            tearDownTSN,
            tearDownTSR,
            tearDownTSO
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
          returnData.data.tearDownTSO = tearDownTSO;
          returnData.data.tearDownTSN = tearDownTSN;
          returnData.data.tearDownTSR = tearDownTSR;
          returnData.success = true;
        } else {
          returnData.success = true;
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
        noWorkOrder: `Couldn't find WO: ${workOrderSearch}-${workOrderSearchLineItem}. Double check WO is correct.`
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

export default getIIRDataAPI;
