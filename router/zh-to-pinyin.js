const pinyin = require('pinyin');
const router = require('express').Router();
const post_get_data = require('../utils/request-data');
function zh_to_py(zh, heteronym, segment, style) {
  return pinyin(zh, {
    heteronym,
    segment,
    style: pinyin[style],
  });
}

router.all('/', (req, res) => {
  const data = post_get_data(req);
  const zh = data.string;
  if (zh === undefined) {
    res.status(400).json({ errMsg: 'empty string send' });
    return;
  }
  // 启用多音字
  const heteronym = data.heteronym;
  // 启用分词
  const segment = data.segment;
  // 不带声调 STYLE_NORMAL
  // 带声调这是默认风格 STYLE_TONE
  // 声调作为数字放在拼音尾部 STYLE_TONE2
  // 声调在注音字符之后 STYLE_TO3NE
  // 只返回声母 STYLE_INITIALS
  // 返回首字母 STYLE_FIRST_LETTER
  const style = (data.style && data.style.toUpperCase()) || 'STYLE_TONE';
  const py = zh_to_py(zh, heteronym, segment, style);
  res.json({ errMsg: 'ok', pinyin: py });
});
router.all('/sort', (req, res) => {
  const data = post_get_data(req);
  const zh = data.string;
  if (zh === undefined) {
    res.status.json({ errMsg: 'empty string send' });
  }
  const splitZh = zh.split('');
  let sortedZh = splitZh.sort(pinyin.compare);
  // descend,ascend
  const desc = data.desc;
  if (desc) {
    sortedZh = sortedZh.reverse();
  }
  res.json({ sortedZh, errMsg: 'ok' });
});
module.exports = router;
