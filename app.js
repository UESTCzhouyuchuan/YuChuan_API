const express = require('express');
const emojis = require('./router/emojis.js');
const skinToneTmojis = require('./router/skin-tone-emojis.js');
const zhToPinyin = require('./router/zh-to-pinyin.js');
const sendMailCode = require('./router/sendMailCode.js');
const app = new express();
const process = require('process');
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/zh_to_pinyin', zhToPinyin);
app.use('/pinyin', zhToPinyin);
app.use('/emojis', emojis);
app.use('/skin_tone_emojis', skinToneTmojis);
app.use('/code', sendMailCode);
app.all('/', function(req, res) {
  res.send('this is yuchuan_api version2.0.0');
});

const checkPostBody = require('./router/check-post-body.js');
app.post('/testPostBody', checkPostBody);

app.listen(process.env.PORT, function() {
  console.log('listen at ' + process.env.PORT + ' time at ', new Date().toLocaleString());
});
