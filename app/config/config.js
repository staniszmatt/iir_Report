const sql = require('mssql');
require('msnodesqlv8');

const pool = new sql.ConnectionPool({
  driver: 'msnodesqlv8',
  server: 'AMR-FS1\\SQLEXPRESS',
  database: 'Repair',
  // Add when one can use the windows cred
  options: {
    trustedConnection: true,
    useUTC: true
  }
});

module.exports = pool;
