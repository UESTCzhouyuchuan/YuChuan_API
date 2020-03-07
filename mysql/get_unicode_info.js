const queryDB = require('./queryDB.js');
module.exports = function get_unicode_info(arr, columns = 'browser', table = 'emojis') {
  const queryString = `SELECT ${columns} FROM ${table} where code in (?) order by number`;
  return queryDB(queryString, arr);
};
