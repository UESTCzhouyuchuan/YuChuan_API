// const Redis= require('./redis/Redis')
// try{
//   Redis.set('h2', 'h1').then(res=>{
//     console.log(res)
//   })
//   const t = async()=>{
//     return await Redis.del('h1')
//   }
//   t().then(res=>{
//     console.log(res)
//   })
// }
// catch (e){
//   console.log(e)
// }

console.log(Date.now())
const { sendTip } = require("./mail")
sendTip({to: '1738733078@qq.com', tip: '提醒'})
