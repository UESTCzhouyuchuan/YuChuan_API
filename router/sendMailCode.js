const express = require('express');
const router = express.Router();
const requestData = require('../utils/request-data.js');
const {sendMailCode} = require('../mail');
router.all('/', (req, res) => {
  const data = requestData(req);
  sendMailCode(data).then((info)=>{
    res.send({status: 200, ...info})
  }, err=>{
    res.send({status: 500, ...err})
  })
});
module.exports = router;
