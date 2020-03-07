const express = require('express');
const emojis = require('./router/emojis.js');
const skinToneTmojis = require('./router/skin_tone_emojis.js');
const zhToPinyin = require('./router/zh_to_pinyin');
const app = new express();
const process = require('process');
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/zh_to_pinyin', zhToPinyin);
app.use('/pinyin', zhToPinyin);
app.use('/emojis', emojis);
app.use('/skin_tone_emojis', skinToneTmojis);
app.all('/', function(req, res) {
  res.send('this is yuchuan_api version2.0.0');
});

const checkPostBody = require('./router/check_post_body.js');
app.post('/testPostBody', checkPostBody);

app.listen(process.env.PORT, function() {
  console.log('listen at ' + process.env.PORT + ' time at ', new Date().toLocaleString());
});
