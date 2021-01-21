/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'mssql/msnodesqlv8';
import pool from '../config/config';
import getDriver from '../config/configODBC';

const odbc = require('odbc');
const sql = require('mssql/msnodesqlv8');

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
  if (stringToCheck === undefined || stringToCheck === null || stringToCheck.length === 0) {
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
    noData: false
  };
  const odbcDriverString = getDriver();

  try {
    const workOrder = request.workOrderSearch
      .replace(/  +/g, '')
      .replace(/[`']/g, '"')
      .replace(/[#^&*<>()@~]/g, '');
    const lineItem = request.workOrderSearchLineItem
      .replace(/  +/g, '')
      .replace(/[`']/g, '"')
      .replace(/[#^&*<>()@~]/g, '');
    // Set this up so it can visually be better when creating the query string.
    const queryString = `SELECT sales_order_line.SalesOrderAndLineNumber, sales_order_line.ItemNumber, sales_order_line.PartNumber, sales_order_line.PartDescription, sales_order_line.SerialNumber, sales_order_line.Quantity, sales_order_line.TSN, sales_order_line.TSR, sales_order_line.TSO,
      sales_order.SalesOrderNumber, sales_order.CustomerNumber, sales_order.CustomerName, sales_order.CustomerOrderNumber, sales_order.DateIssuedYYMMDD, sales_order.Warrenty_Y_N FROM sales_order_line INNER JOIN sales_order ON sales_order_line.SalesOrderNumber = sales_order.SalesOrderNumber
      WHERE sales_order_line.SalesOrderNumber = ? AND sales_order_line.ItemNumber = ?`;
    // Prepare query statement
    const db = await odbc.connect(odbcDriverString);
    const query = await db.createStatement();
    await query.prepare(queryString);
    await query.bind([workOrder, lineItem]);
    const data = await query.execute();
    // Must close otherwise could tie up connection pool
    await query.close();

    if (data.length > 0) {
      // Initial data object setup so no need to destructor object.
      // eslint-disable-next-line prefer-destructuring
      returnData.data = data[0];
      const query2String = `SELECT traveler_header.Manual_Combined, traveler_header.Manual, traveler_header.Manual_Document, traveler_header.Manual_Section, traveler_header.Manual_Revision, traveler_header.Manual_Rev_Date_MMDDYY, traveler_header.Work_Order_Number, traveler_header.Trv_Num, traveler_header.CustomerName,
        sales_order_8130_types.Cert_type_Description, sales_order_8130_types.Sales_Order_Number, sales_order_8130_types.Cert_Type_Code
        FROM traveler_header INNER JOIN sales_order_8130_types ON traveler_header.Work_Order_Number = sales_order_8130_types.Sales_Order_Number
        WHERE traveler_header.Work_Order_Number = ? AND traveler_header.Sales_Order_Line_Item = ?`;
      try {
        // Can't get the server to do more than one join for some reason, work around is a second query.
        const query2 = await db.createStatement();
        await query2.prepare(query2String);
        await query2.bind([workOrder, lineItem]);
        const secondData = await query2.execute();
        query2.close();
        db.close();

        if (
          secondData.length > 0 &&
          Object.prototype.hasOwnProperty.call(secondData[0], 'Manual_Combined')
        ) {
          const {
            Manual_Combined,
            Manual,
            Manual_Document,
            Manual_Section,
            Manual_Revision,
            Manual_Rev_Date_MMDDYY,
            Work_Order_Number,
            Trv_Num
          } = secondData[0];

          returnData.data.Manual_Combined = Manual_Combined;
          returnData.data.Manual = Manual;
          returnData.data.Manual_Document = Manual_Document;
          returnData.data.Manual_Section = Manual_Section;
          returnData.data.Manual_Revision = Manual_Revision;
          returnData.data.Manual_Rev_Date_MMDDYY = Manual_Rev_Date_MMDDYY;
          returnData.data.Work_Order_Number = Work_Order_Number;
          returnData.data.Trv_Num = Trv_Num;
          // Sometimes Cert type may not be entered yet.
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
              (objData: { Cert_type_Description: string; Cert_Type_Code: string; }) => {
                if (objData.Cert_Type_Code === lineItem) {
                  return objData.Cert_type_Description;
                }
                return null;
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
        } else {
          returnData.data.Manual_Combined = 'N/A';
          returnData.data.Manual = 'N/A';
          returnData.data.Manual_Document = 'N/A';
          returnData.data.Manual_Section = 'N/A';
          returnData.data.Manual_Revision = 'N/A';
          returnData.data.Manual_Rev_Date_MMDDYY = 'N/A';
          returnData.data.Work_Order_Number = 'N/A';
          returnData.data.Trv_Num = 'N/A';
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

      try {
        const dbIIR = await pool.connect();
        const preState = await new sql.PreparedStatement(dbIIR);
        preState.input('param1', sql.VarChar(12));
        preState.input('param2', sql.VarChar(2));
        const preStateParams: any = {
          param1: workOrder,
          param2: lineItem
        };

        const iirQuery = `SELECT *
        FROM tear_down_notes_dev AS i
        WHERE i.SalesOrderNumber = @param1 AND i.salesOrderNumberLine = @param2`;

        await preState.prepare(iirQuery);
        const getIIRData = await preState.execute(preStateParams);
        await preState.unprepare();

        // Setup assuming no data is available.
        returnData.data.customerReasonForRemoval = 'NONE';
        returnData.data.genConditionReceived = 'NONE';
        returnData.data.evalFindings = 'NONE';
        returnData.data.workedPerformed = 'NONE';
        returnData.data.linkedWorkOrderIfAPE = null;
        returnData.data.linkedWorkOrderIfAPELineItem = null;
        returnData.data.linkedAPEWorkOrderLineItem = null;
        returnData.data.linkedAPEWorkOrder = null;
        returnData.data.recordPresent = false;
        // Add Data only if there is any.
        if (getIIRData.recordset.length > 0) {
          const {
            customerReasonForRemoval,
            genConditionReceived,
            evalFindings,
            workedPerformed,
            linkedWorkOrderIfAPE,
            linkedWorkOrderIfAPELineItem,
            linkedAPEWorkOrderLineItem,
            linkedAPEWorkOrder
          } = getIIRData.recordset[0];
          returnData.data.recordPresent = true;

          let noteCustomerReasonForRemoval;
          let noteGenConditionReceived;
          let noteEvalFindings;
          let noteWorkedPerformed = '';

          // Use Linked notes for APE jobs excluding workPerformed
          if (
            returnData.data.CustomerNumber === 'APE' &&
            linkedWorkOrderIfAPE
          ) {
            try {
              const preAPEState = await new sql.PreparedStatement(dbIIR);
              preAPEState.input('param1', sql.VarChar(12));
              preAPEState.input('param2', sql.VarChar(2));
              const preLinkedStateParams: any = {
                param1: linkedWorkOrderIfAPE,
                param2: linkedWorkOrderIfAPELineItem
              };
              const iirLinkedQuery = `SELECT *
              FROM tear_down_notes_dev AS i
              WHERE i.SalesOrderNumber = @param1 AND i.salesOrderNumberLine = @param2`;

              await preAPEState.prepare(iirLinkedQuery);
              const getLinkedIIRData = await preAPEState.execute(
                preLinkedStateParams
              );
              await preAPEState.unprepare();

              if (getLinkedIIRData.recordset.length > 0) {
                noteCustomerReasonForRemoval = getLinkedIIRData.recordset[0].customerReasonForRemoval;
                noteGenConditionReceived = getLinkedIIRData.recordset[0].genConditionReceived;
                noteEvalFindings = getLinkedIIRData.recordset[0].evalFindings;
                noteWorkedPerformed = getLinkedIIRData.recordset[0].workedPerformed;
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
            noteCustomerReasonForRemoval = customerReasonForRemoval;
            noteGenConditionReceived = genConditionReceived;
            noteEvalFindings = evalFindings;
            noteWorkedPerformed = workedPerformed;
          }
          returnData.data.customerReasonForRemoval = checkStringLength(noteCustomerReasonForRemoval);
          returnData.data.genConditionReceived = checkStringLength(noteGenConditionReceived);
          returnData.data.evalFindings = checkStringLength(noteEvalFindings);
          returnData.data.workedPerformed = checkStringLength(noteWorkedPerformed);
          returnData.data.linkedWorkOrderIfAPE = linkedWorkOrderIfAPE;
          returnData.data.linkedWorkOrderIfAPELineItem = linkedWorkOrderIfAPELineItem;
          returnData.data.linkedAPEWorkOrderLineItem = linkedAPEWorkOrderLineItem;
          returnData.data.linkedAPEWorkOrder = linkedAPEWorkOrder;
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
      returnData.noData = true;
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
