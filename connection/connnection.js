const mysql = require('mysql');
const config = require('../conf/config');
// Create connection

const def = {
  getConnectionPool: getConnectionPool
};

const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  port: config.mysql.port,
  connectionLimit: config.mysql.connectionLimit
});

function getConnectionPool(){
  return new Promise((resolve,reject) => {
      resolve(pool);

  });

}

module.exports = def;