const express = require('express');
const cookieSession = require('cookie-session')

const emojis = require('./router/emojis.js');
const skinToneTmojis = require('./router/skin-tone-emojis.js');
const zhToPinyin = require('./router/zh-to-pinyin.js');
const sendMailCode = require('./router/sendMailCode.js');
const sendTip = require('./router/sendTip.js')
const qr = require('./router/qr.js');
const graduate = require('./router/graduate')
const lc_stats = require('./router/lc-stats')
const app = new express();
const process = require('process');

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieSession({
  name: 'session',
  secret: 'yuchuan secret',
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.all('*', function (req, res, next) {
  // 设置请求头为允许跨域
  res.header('Access-Control-Allow-Origin', '*');
  // 设置服务器支持的所有头信息字段
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild, sessionToken');
  // 设置服务器支持的所有跨域请求的方法
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method.toLowerCase() == 'options') {
      res.send(200);  // 让options尝试请求快速结束
  } else {
      next();
  }
});
app.use('/zh_to_pinyin', zhToPinyin);
app.use('/pinyin', zhToPinyin);
app.use('/emojis', emojis);
app.use('/skin_tone_emojis', skinToneTmojis);
app.use('/code', sendMailCode);
app.use('/mailTip', sendTip);
app.use('/qr', qr);
app.use('/graduate', graduate);
app.use('/lc-stats', lc_stats);
app.all('/', function(req, res) {
  res.send('this is yuchuan_api version2.0.0 \
  \nDocs on <a href = "https://github.com/UESTCzhouyuchuan/YuChuan_API"> https://github.com/UESTCzhouyuchuan/YuChuan_API</a>'
  );
});

const checkPostBody = require('./router/check-post-body.js');
app.post('/testPostBody', checkPostBody);

app.listen(process.env.PORT, function() {
  console.log('listen at ' + process.env.PORT + ' time at ', new Date().toLocaleString());
});
