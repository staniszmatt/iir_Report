const sql = require('mssql/msnodesqlv8');

const config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server={AMR-FS1\\SQLEXPRESS};Database={Repair};Trusted_Connection={yes};'
};

const pool = new sql.ConnectionPool(config);

// const pool = new sql.ConnectionPool({
//   driver: 'msnodesqlv8',
//   server: `AMR-FS1\\SQLEXPRESS`,
//   database: 'Repair',
//   // Add when one can use the windows cred
//   options: {
//     trustedConnection: true,
//     useUTC: true
//   }
// });

module.exports = pool;
