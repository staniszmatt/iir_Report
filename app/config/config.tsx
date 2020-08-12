const sql = require('mssql/msnodesqlv8');

const config = {
  driver: 'msnodesqlv8',
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server{AMR-FS1\\SQLEXPRESS};Database={REPAIR};Trusted_Connection={yes}'
};

const pool = new sql.ConnectionPool(config);

module.exports = pool;
