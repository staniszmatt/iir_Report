const userName = require('username');
const nodemailer = require('nodemailer');
// const sendmail = require('sendmail')();

interface Request {};

async function emailer(request: Request){

  console.log('Emailer Request: ', request);

  const returnData = {
    error: {},
    success: false,
    infoResp: {},
    user: ''
  }

  try {
    const user = await userName();
    console.log('User Name: ', user);
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
      subject: 'Test Auto Email',
      text: 'Testing Auto Emailer'
    })

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

    console.log('Info resp: ', info);

    returnData.infoResp = info;
    returnData.success = true;
  } catch (err) {
    console.log('error: ', err);
    returnData.error = err;
  }
  return returnData;
}

export default emailer;
