import getPass from '../config/configEmail';

const userName = require('username');
const nodemailer = require('nodemailer');

interface Request {
  testInfo: {
    workOrder: string;
    CustomerName: string;
    PartNumber: string;
    customerReasonForRemoval: string;
    genConditionReceived: string;
    evalFindings: string;
  };
}

async function emailer(request: Request) {

  console.log('emailer request', request);

  const {
    workOrder,
    CustomerName,
    PartNumber,
    customerReasonForRemoval,
    genConditionReceived,
    evalFindings
  } = request.testInfo;

  const returnData = {
    error: {},
    success: false,
    infoResp: {},
    user: ''
  };
  const emailPass = getPass();

  try {
    const user = await userName();
    returnData.user = user;

    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: `NODEMON@aeroparts.aero`,
        pass: `${emailPass}`
      }
    });

    const info = await transporter.sendMail({
      from: '"NODEMON" <NODEMON@aeroparts.aero>',
      to: 'mstaniszewski@aeroparts.aero',
      subject: `TEAR DOWN UPDATE: ${CustomerName}, WO: ${workOrder}, PN: ${PartNumber}`,
      html: `<!DOCUMENT html>
      <html>
        <head></head>
        <body>
          <div style="font-size:14pt">
            <div>Tear Down has been updated by: ${user} For WO: ${workOrder}.</div>
            <pre> </pre>
            <div>Current notes:</div>
            <pre> </pre>
            <div style="text-decoration:underline">Reason for Removal:</div>
            <pre style="margin-left:10px; font-family:serif; font-size:10pt">${customerReasonForRemoval}</pre>
            <pre> </pre>
            <div style="text-decoration:underline">General Condition:</div>
            <pre style="margin-left:10px; font-family:serif; font-size:10pt">${genConditionReceived}</pre>
            <pre> </pre>
            <div style="text-decoration:underline">Evaluation Findings:</div>
            <pre style="margin-left:10px; font-family:serif; font-size:10pt">${evalFindings}</pre>
          </div>
        </body>
      </html>
      `
    });

    if (info.rejected.length === 0) {
      returnData.infoResp = info;
      returnData.success = true;
    } else {
      returnData.infoResp = info.rejected;
      returnData.success = false;
    }
  } catch (err) {
    returnData.error = err;
  }
  return returnData;
}

export default emailer;
