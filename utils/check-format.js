const myTypeOf = require('./type.js');
const checkArrayOrSimgleType = (data, type, reg) => {
  const dataType = myTypeOf(data);
  const regType = myTypeOf(reg);
  let flag = true;
  switch (dataType) {
    case 'array':
      flag = data.every(v => myTypeOf(v) === type);
      if (flag && regType === 'regExp') {
        flag = data.every(v => reg.test(v));
      }
      break;
    case type:
      flag = true;
      if (regType === 'regExp') {
        flag = reg.test(data);
      }
      break;
    default:
      flag = false;
  }
  return flag;
};
module.exports = checkArrayOrSimgleType;
// console.log(checkArrayOrSimgleType(['12222@qq.com'], 'string', /^.+@.+\..+/));
