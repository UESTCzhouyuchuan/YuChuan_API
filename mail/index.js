'use strict';
const nodemailer = require('nodemailer');
const config = require('./config-gitignore.js');
/**
 * to: Array，邮箱数组
 */
module.exports = async function main(to, number) {
  const emailTo = to.join(',');
  let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: config.user, // generated ethereal user
      pass: config.password, // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: `"玉川验证码" ${config.user}`, // sender address
    to: emailTo, // list of receivers
    subject: '验证码', // Subject line
    text: '你的验证码', // plain text body
    html: `<b>你的应用验证码是(一分钟有效): </b><p style='width:100%;text-align:center;font-weight:500;font-size:24px;'>${number}<p>请勿回复此邮箱`, // html body
  });
  console.log('Message sent: %s, time: %s', info.messageId, new Date().toLocaleString());
};
