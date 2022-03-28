const express = require('express');
const router = express.Router();
const requestData = require('../utils/request-data.js');
const {sendTip} = require('../mail');
router.all('/', (req, res) => {
  const data = requestData(req);
  sendTip(data).then((info)=>{
    res.send({status: 200, ...info})
  }, err=>{
    res.send({status: 500, ...err})
  })
});
module.exports = router;
