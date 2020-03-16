const express = require('express');
const router = express.Router();
const getUnicodeInfo = require('../mysql/get-unicode-info.js');
const requestData = require('../utils/request-data.js');
const keyInfo = require('../mysql/key-info.js');
const table = 'skin_tone_emojis';
router.all('/key', function(req, res) {
  const reqData = requestData(req);
  const key = reqData.key;
  const columns = reqData.columns;
  keyInfo(key, columns, table).then(
    result => res.json(result),
    err => res.status(500).send(String(err)),
  );
});
router.all('/', function(req, res) {
  const query = requestData(req);
  let unicode = query.unicode;
  const columns = query.columns;
  let sendJson = { errMsg: '', unicode_info: [] };
  if (unicode == null) {
    // 判断unicode参数为空
    sendJson.errMsg = 'unicode value is empty!!';
    res.status(400).json(sendJson);
  } else if (typeof unicode !== 'string' && unicode instanceof Array === false) {
    sendJson.errMsg = 'unicode type must be string or array';
    res.status(400).json(sendJson);
  } else {
    if (typeof unicode === 'string') {
      unicode = [unicode];
    }
    getUnicodeInfo(unicode, columns, table).then(
      data => {
        sendJson.unicode_info = data;
        sendJson.errMsg = 'ok';
        res.json(sendJson);
      },
      err => {
        sendJson.errMsg = err;
        res.status(500).json(sendJson);
      },
    );
  }
});
module.exports = router;
