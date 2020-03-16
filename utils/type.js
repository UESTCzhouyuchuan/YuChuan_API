const firstWordLower = require('./first-word-lower.js');
const type = data => {
  const typeString = Object.prototype.toString.call(data);
  const type = typeString.slice(8, -1);
  return firstWordLower(type);
};

module.exports = type;
