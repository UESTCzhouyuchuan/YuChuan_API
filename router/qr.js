const router = require('express').Router();
const requestData = require('../utils/request-data');
const qr = require('qrcode');
const options = {
  margin: 1,
  scale: 6,
};
router.all('/', (req, res) => {
  const data = requestData(req);
  let { value, qrType = 'base64', type } = data;
  if (!value) {
    res.status(400).json({ errMsg: 'value is empty' });
    return;
  }
  if (type === 'string') {
    value = `'${value}'`;
  }
  switch (qrType) {
    // 返回base64图片信息
    case 'base64':
      qr.toDataURL(value, options, (err, data) => {
        if (err) {
          res.status(500).json({ errMsg: String(err) });
        } else {
          res.json({ data, errMsg: 'ok' });
        }
      });
      break;
    // 返回模拟二维码的字符
    case 'string':
      qr.toString(value, (err, data) => {
        if (err) {
          res.status(500).json({ errMsg: String(err) });
        } else {
          res.json({ data, errMsg: 'ok' });
        }
      });
      break;
    // 返回png图片格式
    case 'file':
      res.setHeader('Content-Type', `image/png`);
      qr.toFileStream(res, value, options);
      break;
    // 默认返回base64
    default:
      qr.toDataURL(value, options, (err, data) => {
        if (err) {
          res.status(500).json({ errMsg: String(err) });
        } else {
          res.json({ data, errMsg: 'ok' });
        }
      });
      break;
  }
});

module.exports = router;
