const sql = require('mssql/msnodesqlv8');

const config = {
  driver: 'msnodesqlv8',
  connectionString: ''
};

const pool = new sql.ConnectionPool(config);

export default pool;
