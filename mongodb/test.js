const DB = require('./DB')
DB.find('Users', { email: 'zycuestc@163.com', pwd: '123' }).then(res => {
  console.log(res)
})
DB.find('Users', {}).then(res => {
  console.log(res)
})
