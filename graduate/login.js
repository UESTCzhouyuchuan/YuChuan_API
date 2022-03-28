const DB = require('../mongodb/DB')
const {sendMailCode} = require('../mail')
const Login = (userData)=>{
    return new Promise((resolve, reject)=>{
        if(!userData.email){
            return reject({errMsg: 'email empty'})
        }else if(!userData.pwd){
            return reject({errMsg: 'pwd empty'})
        }
        DB.find('Users', userData).then(res=>{
            if(res.length === 0){
                reject({errMsg: '账号或者密码不正确'})
            }else{
                resolve({errMsg:'ok'})
            }
        })
    })
}
const checkEmail = (email)=>{
    return new Promise((resolve, reject)=>{
        DB.find('Users', {email: email}).then(res=>{
            if(res.length === 0){
                resolve(true)
            }else{
                resolve(false)
            }
        },err=>reject(err))
    })
}
const emailToCode = {}
const sendEmail = (email)=>{
    return new Promise((resolve, reject)=>{
        checkEmail(email).then(res=>{
            if(res === false){
                reject({errMsg: '邮箱已经存在'})
            }else{
                sendMailCode({to: email}).then(info=>{
                    emailToCode[email] = info.code
                    resolve({errMsg: 'success'})
                }, err=>{
                    reject({errMsg: err})
                })
            }
        }).catch(err=>{
            reject({errMsg: err})
        })
    })
}
const confirmCode = (data)=>{
    const email = data.email;
    const code = data.code;
    return emailToCode;
}

module.exports = {
    sendEmail,
    Login,
    confirmCode
}
