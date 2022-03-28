const DB = require('../mongodb/DB');
const Redis = require('../redis/Redis');
const { sendMailCode } = require('../mail');

const checkEmailPwd = (userData) => {
  return new Promise((resolve, reject) => {
    if (!userData.email) {
      return reject({ errMsg: 'email empty' });
    } else if (!userData.pwd) {
      return reject({ errMsg: 'pwd empty' });
    }
    DB.find('Users', userData).then(res => {
      if (res.length === 0) {
        reject({ errMsg: '账号或者密码不正确' });
      } else {
        resolve({ errMsg: 'ok' });
      }
    });
  });
};
const checkExistsEmail = (email) => {
  return new Promise((resolve, reject) => {
    DB.find('Users', { email: email }).then(res => {
      if (res.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    }, err => reject(err));
  });
};
const sendCode = async (email, isRegister = false, expireTime = 2) => {
  const isRepeatSendMail = await Redis.exists(email);
  if (isRepeatSendMail) {
    throw { errMsg: `避免重复发送,请${expireTime}分钟后再操作` };
  }
  const isExistsMail = await checkExistsEmail(email);
  let subject = '';
  if (isRegister) {
    subject = '注册验证码';
  } else {
    subject = '验证码';
  }
  if (isRegister && isExistsMail) {
    throw { errMsg: '邮箱已经存在' };
  }
  if (!isRegister && !isExistsMail) {
    throw { errMsg: '邮箱还未注册' };
  }
  const { code } = await sendMailCode({ to: email, expireTime, subject: subject });
  await Redis.set(email, code);
  await Redis.expire(email, 60 * expireTime);
  return { errMsg: 'success' };
};
const register = async ({ email, code }) => {
  if (!email) {
    throw { errMsg: 'email不能为空' };
  }
  if (!code) {
    throw { errMsg: '验证码不能为空' };
  }
  const isExistsEmail = await checkExistsEmail(email);
  if (isExistsEmail === true) {
    throw { errMsg: '邮箱已经被注册' };
  }
  const res = await checkEmailCode(email, code);
  if (res === false) {
    throw { errMsg: '验证码不正确或者已经过期' };
  }
  await Redis.del(email);
  await insertUser({ email: email, pwd: '', role: 'user', name: '' });
  return { errMsg: 'ok' };
};
const checkEmailCode = async (email, code) => {
  const res = await Redis.get(email);
  console.log(email, code, res);
  if (!email || !code || (res !== code)) {
    return false;
  }
  return true;
};
const insertUser = async (user) => {
  await DB.insert('Users', user);
  return { errMsg: 'ok' };
};
const setPwd = async ({ email, pwd }) => {
  await DB.update('Users', { email }, { pwd });
  console.log('setPwd', { email, pwd });
  return { errMsg: 'ok' };
};
const changePwdConfirmCode = async ({ email, code }) => {
  if (!email) {
    throw { errMsg: 'email不能为空' };
  }
  if (!code) {
    throw { errMsg: '验证码不能为空' };
  }
  const isExistsEmail = await checkExistsEmail(email);
  if (isExistsEmail === false) {
    throw { errMsg: '邮箱还未注册' };
  }
  const res = await checkEmailCode(email, code);
  if (res === false) {
    throw { errMsg: '验证码不正确或者已经过期' };
  }
  await Redis.del(email);
  return { errMsg: 'ok' };
};

const addDevice = async ({ email, data }) => {
  if (!data) {
    throw { errMsg: '数据不能为空' };
  }
  const user = await DB.find('Users', { email });
  if (user.length <= 0) {
    throw { errMsg: 'cookie过期' };
  }
  await DB.insert('Devices', { ...data, belongTo: email, time: Date.now() });
  return { errMsg: 'ok' };
};
const getDevices = async (email) => {
  if (!email) {
    throw { errMsg: ' email is empty' };
  }
  const client = await DB.connect();
  const result = client.collection('Devices').find(
    { belongTo: email },
    { projection: { _id: 1, allSensors: 1, units: 1, deviceName: 1, time: 1 } },
  ).sort({ time: -1 }).limit(10);
  return new Promise((resolve, reject) => {
    result.toArray((error, docs) => {
      if (error) {
        reject({ errMsg: error });
      } else {
        resolve({ devices: docs, errMsg: 'ok' });
      }
    });
  });
};

const deleteDevices = async ({ email, id }) => {
  if (!email || !id) {
    throw { errMsg: 'email或者id为空' };
  }
  const res = await DB.delete('Devices', { belongTo: email, _id: DB.getObjectId(id) });
  return { result: res.result, deleteCount: res.deleteCount };
};
const queryData = async ({ type, begin, end,  }) => {
  if (!type) {
    throw { errMsg: 'type 为空' };
  }
  let limit = 400;
  if (!begin) {
    begin = new Date();
    begin.setUTCHours(0);
    begin.setUTCMinutes(0);
    begin.setUTCSeconds(0);
    begin.setUTCMilliseconds(0);
  }
  if (!end) {
    end = new Date();
  }
  begin = new Date(begin);
  end = new Date(end);
  const client = await DB.connect();
  const cursor = client.collection('Mqtts').find(
    { type, time: { $gte: begin, $lte: end }, },
    { projection: { _id: 0, data: 1, time: 1 }
  }).sort({time: 1});
  let length = await cursor.count();
  let len = Math.floor(length / limit);
  let ret = []
  // console.log(new Date().toLocaleString())
  let i =0;
  await cursor.forEach((item)=>{
    if(i%len === 0){
      ret.push(item)
    }
    i++;
  })
  // console.log(new Date().toLocaleString())
  return { result: ret, errMsg: 'ok' };
};
module.exports = {
  changePwdConfirmCode,
  sendCode,
  checkEmailPwd,
  register,
  setPwd,
  addDevice,
  getDevices,
  deleteDevices,
  queryData,
};
