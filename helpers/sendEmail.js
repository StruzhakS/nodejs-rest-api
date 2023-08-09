import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import HttpError from './HttpError.js';

const { UKRNET_NAME, UKRNET_PASS } = process.env;
const nodemailerConfig = {
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: UKRNET_NAME,
    pass: UKRNET_PASS,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);
// const email = {
//   from: UKRNET_NAME,
//   to: 'nogab17652@touchend.com',
//   subject: 'Test email',
//   html: '<p>This is the test email</p>',
// };

export const sendEmail = async data => {
  try {
    const email = { ...data, from: UKRNET_NAME };
    await transport
      .sendMail(email)
      .then(() => console.log('Email was sent successfull'))
      .catch(error => console.log(error.message));
  } catch (error) {
    HttpError(error.status);
  }
};
