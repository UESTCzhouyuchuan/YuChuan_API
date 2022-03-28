'use strict';
const nodemailer = require('nodemailer');
const config = require('./config-gitignore.js');
const randomNumber = require('../utils/randomNumber.js');
const checkArrayOrSimgleType = require('../utils/check-format.js');
const myTypeOf = require('../utils/type.js');

/**
 * to: Array，邮箱数组
 * number: 发送的验证码
 * time: 有效时间，单位分钟
 * subject: 邮件主题
 */
async function sendMailVerificationCode({to, number, time, subject}) {
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
        from: `"验证码" ${config.user}`, // sender address
        to: emailTo, // list of receivers
        subject: subject, // Subject line
        // text: '你的验证码', // plain text body
        html: `<b>你的应用验证码是(${time}分钟有效): </b><p style='width:100%;text-align:center;font-weight:500;font-size:24px;'>${number}<p>请勿回复此邮箱`, // html body
    });
    console.log('Message sent: %s, time: %s', info.messageId, new Date().toLocaleString());
    return info;
};
const sendMailCode = ({to, length= 6, time = 1, subject = '应用验证码'}) => {
    let emailTo = to;
    return new Promise((resolve, reject) => {
        if (!emailTo) {
            reject({
                errMsg: 'your emailTo is empty!输入的邮箱为空',
            });
            return;
        } else if (checkArrayOrSimgleType(emailTo, 'string', /^.+@.+\..+/) === false) {
            reject({
                errMsg: 'your emailTo is incorret format!你的邮箱格式不正确',
            });
            return;
        }
        const randomNumberLength = length;
        const randomN = randomNumber(randomNumberLength);
        // 统一格式为数组
        if (myTypeOf(emailTo) === 'string') {
            emailTo = [emailTo];
        }
        sendMailVerificationCode({to: emailTo, number: randomN, time, subject})
            .then(() => {
                resolve({
                    errMsg: 'ok',
                    code: randomN,
                    time: new Date().valueOf(),
                });
            })
            .catch(err => {
                reject({
                    errMsg: err,
                });
            });
    })
}
async function sendMail({ to, subject, text, html }) {
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
        from: `"玉川科技提醒你" ${config.user}`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });
    console.log('Message sent: %s, time: %s', info.messageId, new Date().toLocaleString());
    return info;
};
const sendTip = ({ to, tip }) => {
    let emailTo = to
    return new Promise((resolve, reject) => {
        if (!emailTo) {
            reject({
                errMsg: 'your emailTo is empty!输入的邮箱为空',
            });
            return;
        } else if (checkArrayOrSimgleType(emailTo, 'string', /^.+@.+\..+/) === false) {
            reject({
                errMsg: 'your emailTo is incorret format!你的邮箱格式不正确',
            });
            return;
        }
        // 统一格式为数组
        if (myTypeOf(emailTo) !== 'string') {
            emailTo = emailTo.toString();
        }
        sendMail({ to: emailTo, subject: '新的提醒', text: tip, html: tip })
            .then(() => {
                resolve({
                    errMsg: 'ok',
                    to: emailTo,
                    text: tip,
                    time: new Date().valueOf(),
                });
            })
            .catch(err => {
                reject({
                    errMsg: err,
                });
            });
    })

}
module.exports = {
    sendMailVerificationCode,
    sendMailCode,
    sendTip
}
