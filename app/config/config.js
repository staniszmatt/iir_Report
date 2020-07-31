const sql = require('mssql/msnodesqlv8');

const pool = new sql.ConnectionPool({
  user: 'staniszmatt', // Remove user name and password when windows cred are being used.
  password: 'Neon199*',
  driver: 'msnodesqlv8',
  server: '127.0.0.1,1433',
  database: 'planningDB_Dev'
  // Add when one can use the windows cred
  //  options: {
  //    trustedConnection: true,
  //    useUTC: true
  //  }
});

module.exports = pool;
