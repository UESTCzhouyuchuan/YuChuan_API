function check(str) {
  let keyWords = ['select', 'update', 'delete', 'insert'];
  return keyWords.some(v => str.indexOf(v) > -1);
}
module.exports = check;
