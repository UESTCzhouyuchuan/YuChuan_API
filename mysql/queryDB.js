const mysql = require('mysql');
const $dbConfig = require('./mysql-config-gitignore.js');
/**
 * {
    host: 'your host',
    user: 'your password',
    password: 'your password',
    database: 'your database'
}
 */
const pool = mysql.createPool($dbConfig); // 使用连接池，避免开太多的线程，提升性能
module.exports = function get_unicode_info(str, ...args) {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection(function(err, connection) {
        connection.query(str, [...args], function(err, data) {
          if (err) reject(err);
          resolve(data);
          connection.release(); //释放链接
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};
