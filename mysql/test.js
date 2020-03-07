// const get_unicode_info = require("./get_unicode_info.js");
// get_unicode_info(["1f499", "1f498"]).then((data) => {
//     console.log(data)
// }, (err) => {
//     console.log(err)
// })

// const mysql = require("mysql")
// let arr = ["1f499", "1f498"];
// let ret = mysql.format("SELECT number,code FROM emojis where code in(?) order by number", [arr]);
// console.log(ret)
function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}
console.log(isEmptyObject({}));
