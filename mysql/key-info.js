const queryDB = require('./queryDB.js');
module.exports = function key_info(key, columns = 'browser', table = 'emojis') {
  const like = `'%${String(key)}%'`;
  const queryString = `SELECT ${columns} FROM ${table}
    where lower(cldr_short_name) like ${like} or lower(mediumhead) like ${like} or upper(cldr_short_name) like ${like} or upper(mediumhead) like ${like}
    order by number`;
  return queryDB(queryString);
};
