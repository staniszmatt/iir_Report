const userName = require('username');
const sendmail = require('sendmail')();

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

    const info = await sendmail({
      from: '"NODEMON" <no-reply@aeroparts.aero>',
      to: 'mstaniszewski@aeroparts.aero',
      subject: 'Test Auto Email',
      text: 'Testing Auto Emailer'
    })

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
