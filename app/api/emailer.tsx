import React from 'react';

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
        pass: 'Izybell199*'
      }
    });

    const info = await transporter.sendMail({
      from: '"My Self" <mstaniszewski@aeroparts.aero>',
      to: 'mstaniszewski@aeroparts.aero',
      subject: `TEAR DOWN UPDATE: ${CustomerName}, WO: ${workOrder}, PN: ${PartNumber}`,
      html: (
        <div>
          <div>{`Tear Down has been updated by: ${user} For WO: ${workOrder}.`}</div>
          <div />
          <div>Current notes:</div>
          <div />
          <div>Reason for Removal:</div>
          <div>{`${customerReasonForRemoval}`}</div>
          <div />
          <div>General Condition:</div>
          <div>{`${genConditionReceived}`}</div>
          <div />
          <div>Evaluation Findings:</div>
          <div>{`${evalFindings}`}</div>
          <div />
          <div>Worked Performed:</div>
          <div>{`${workedPerformed}`}</div>
        </div>
      )
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
