const userName = require('username');
const nodemailer = require('nodemailer');
// const sendmail = require('sendmail')();

interface Request {
  testInfo: {
    workOrder: string;
    CustomerName: string;
    PartNumber: string;
    customerReasonForRemoval: string;
    genConditionReceived: string;
    evalFindings: string;
    workedPerformed: string;
  };
}

async function emailer(request: Request) {
  const {
    workOrder,
    CustomerName,
    PartNumber,
    customerReasonForRemoval,
    genConditionReceived,
    evalFindings,
    workedPerformed
  } = request.testInfo;

  const returnData = {
    error: {},
    success: false,
    infoResp: {},
    user: ''
  };

  try {
    const user = await userName();
    returnData.user = user;

    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: `mstaniszewski@aeroparts.aero`,
        pass: ''
      }
    });

    const info = await transporter.sendMail({
      from: '"My Self" <mstaniszewski@aeroparts.aero>',
      to: 'mstaniszewski@aeroparts.aero',
      subject: `TEAR DOWN UPDATE: ${CustomerName}, WO: ${workOrder}, PN: ${PartNumber}`,
      // text: `Text Tear Down has been updated by: ${user} For WO: ${workOrder}. \n
      //   \n
      //   Current notes: \n
      //   \n
      //   \t Reason for Removal: \n
      //   ${customerReasonForRemoval} \n
      //   \n
      //   \t General Condition: \n
      //   ${genConditionReceived} \n
      //   \n
      //   \t Evaluation Findings: \n
      //   ${evalFindings} \n
      //   \n
      //   \t Worked Performed: \n
      //   ${workedPerformed}`
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
            <pre> </pre>
            <div style="text-decoration:underline">Worked Performed:</div>
            <pre style="margin-left:10px; font-family:serif; font-size:10pt">${workedPerformed}</pre>
          </div>
        </body>
      </html>
      `
    });

    // TODO: For none logging in emailing, restricted tho.
    // TODO: This is working but requires email settings to be trusted.
    // const info = await sendmail({
    //   // from: '"NODEMON" <no-reply@aeroparts.aero>',
    //   from: '"Matthew Staniszewski" <mstaniszewski@aeroparts.aero>',
    //   to: 'mstaniszewski@aeroparts.aero',
    //   subject: 'Test Auto Email',
    //   text: 'Testing Auto Emailer'
    //   // Link not good because the updates do not update pdf.
    //   // html: '<p>CLICK <a href="T:CPLT_TRAVELERS\\TearDowns\\CN101-01_TEAR_DOWN.pdf"> HERE </a> to open PDF</p>'
    // });

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
