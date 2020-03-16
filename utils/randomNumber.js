module.exports = len => {
  let ret = [];
  while (len > 0) {
    const rand = Math.floor(Math.random() * 9) + 1;
    ret.push(rand);
    len--;
  }
  return ret.join('');
};
