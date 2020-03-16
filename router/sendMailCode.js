const express = require('express');
const router = express.Router();
const requestData = require('../utils/request-data.js');
const randomNumber = require('../utils/randomNumber.js');
const checkArrayOrSimgleType = require('../utils/check-format.js');
const myTypeOf = require('../utils/type.js');
const sendMail = require('../mail');
router.all('/', (req, res) => {
  const data = requestData(req);
  let emailTo = data.to;
  if (!emailTo) {
    res.json({
      emailTo,
      errMsg: 'your emailTo is empty!输入的邮箱为空',
    });
    return;
  } else if (checkArrayOrSimgleType(emailTo, 'string', /^.+@.+\..+/) === false) {
    res.json({
      emailTo,
      errMsg: 'your emailTo is incorret format!你的邮箱格式不正确',
    });
    return;
  }
  const randomNumberLenght = data.length || 6;
  const random = randomNumber(randomNumberLenght);
  // 统一格式为数组
  if (myTypeOf(emailTo) === 'string') {
    emailTo = [emailTo];
  }
  sendMail(emailTo, random)
    .then(() => {
      res.json({
        emailTo,
        errMsg: 'ok',
        code: random,
        time: new Date().valueOf(),
      });
    })
    .catch(err => {
      res.json({
        emailTo,
        errMsg: String(err),
      });
    });
});
module.exports = router;
