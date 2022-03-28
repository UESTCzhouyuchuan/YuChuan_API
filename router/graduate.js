const router = require('express').Router();
const post_get_data = require('../utils/request-data.js');
const {
  sendCode,
  checkEmailPwd,
  register,
  setPwd,
  changePwdConfirmCode,
  addDevice,
  getDevices,
  deleteDevices,
  queryData,
} = require('../graduate');
router.all('/', (req, res) => {
  res.send('Yuchuan Graduate Exhibition version1.0');
});
router.post('/login', (req, res) => {
  const reqData = post_get_data(req);
  if (!reqData || !reqData.email || !reqData.pwd) {
    res.send({ status: 400, errMsg: '账号或者密码为空' });
  }
  checkEmailPwd(reqData).then(success => {
    req.session['user'] = reqData;
    res.send({ status: 200, ...success });
  }, err => {
    res.send({ status: 401, ...err });
  });
});
router.all('/logout', (req, res) => {
  req.session['user'] = null;
  res.send({ status: 200, errMsg: 'ok' });
});
router.all('/checkLogin', (req, res) => {
  const data = req.session['user'];
  if (!data) {
    res.send({ status: 401, errMsg: 'not Login' });
    return;
  }
  checkEmailPwd(data).then(success => {
    res.send({ status: 200, email: data.email, ...success });
  }, err => {
    res.send({ status: 400, ...err });
  });
});
router.all('/registerCode', (req, res) => {
  const reqData = post_get_data(req);
  const email = reqData.email;
  if (!email) {
    res.send({ status: 400, errMsg: '邮箱不能为空' });
    return;
  }
  sendCode(email, true).then(success => {
    res.send({ status: 200, ...success });
  }, err => {
    res.send({ status: 400, ...err });
  }).catch(err => {
    res.send({ status: 500, ...err });
  });
});
router.all('/sendCode', (req, res) => {
  const reqData = post_get_data(req);
  const email = reqData.email;
  if (!email) {
    res.send({ status: 400, errMsg: '邮箱不能为空' });
    return;
  }
  sendCode(email, false).then(success => {
    res.send({ status: 200, ...success });
  }, err => {
    res.send({ status: 400, ...err });
  }).catch(err => {
    res.send({ status: 500, ...err });
  });
});
router.all('/register', (req, res) => {
  const data = post_get_data(req);
  register(data).then((result) => {
    req.session['setMail'] = data.email;
    res.send({ status: 200, ...result });
  }, err => {
    res.send({ status: 400, ...err });
  }).catch(err => {
    console.log('/register  ', err);
    res.send({ status: 500, ...err });
  });
});

router.all('/changePwdConfirmCode', (req, res) => {
  const data = post_get_data(req);
  changePwdConfirmCode(data).then((result) => {
    req.session['setMail'] = data.email;
    res.send({ status: 200, ...result });
  }, err => {
    res.send({ status: 400, ...err });
  }).catch(err => {
    console.log('/changePwdConfirmCode  ', err);
    res.send({ status: 500, err });
  });
});
router.all('/setpwd', (req, res) => {
  const email = req.session['setMail'];
  if (!email) {
    res.send({ status: 400, errMsg: `can't set pwd` });
    return;
  }
  const { pwd } = post_get_data(req);
  setPwd({ email, pwd }).then((success) => {
    req.session['setMail'] = null;
    res.send({ status: 200, ...success });
  }, err => {
    res.send({ status: 400, ...err });
  }).catch((err) => {
    console.log('/setpwd, ', err);
    res.send({ status: 500, ...err });
  });
});
router.post('/addDevice', (req, res) => {
  const user = req.session['user'];
  const data = post_get_data(req);
  if (!user || !user.email || !user.pwd) {
    res.send({ status: 401, errMsg: '未登录' });
    return;
  }
  if (!data) {
    res.send({ status: 400, errMsg: '数据为空' });
    return;
  }
  const { email } = user;
  addDevice({ email, data }).then(success => {
    res.send({ status: 200, ...success });
  }, err => {
    res.send({ status: 400, ...err });
  }).catch(err => {
    res.send({ status: 500, ...err });
  });
});

router.all('/getDevices', (req, res) => {
  const user = req.session['user'];
  if (!user) {
    res.send({ status: 401, errMsg: '请登录' });
    return;
  }
  getDevices(user.email).then(success => {
    res.send({ status: 200, ...success });
  }, err => {
    res.send({ status: 400, ...err });
  }).catch(err => {
    res.send({ status: 500, ...err });
  });
});

router.all('/deleteDevice', (req, res) => {
  const user = req.session['user'];
  const { email } = user;
  if (!email) {
    res.send({ status: 401, errMsg: '请登录' });
    return;
  }
  const { id } = post_get_data(req);
  if (!id) {
    res.send({ status: 400, errMsg: '参数为空' });
    return;
  }
  deleteDevices({ email, id }).then(success => {
    res.send({ status: 200, errMsg: 'ok', ...success });
  }, err => {
    res.send({ status: 401, ...err });
  }).catch(e => {
    res.send({ status: 500, ...e });
  });
});
router.all('/queryData',(req, res)=>{
  const {type, begin, end} = post_get_data(req);
  if(!type){
    res.send({errMsg: 'type is empty', status: 400});
    return;
  }
  queryData({type, begin, end}).then(success=>{
    res.send({errMsg: 'ok', status: 200, ...success});
  }).catch(err=>{
    res.send({errMsg: 'err', status: 500, ...err});
  })
})
router.all('/cookie-session', (req, res) => {
  res.send(req.session);
});
router.all('/clear-session', (req, res) => {
  req.session = null;
  res.send({ errMsg: 'ok' });
});
module.exports = router;
