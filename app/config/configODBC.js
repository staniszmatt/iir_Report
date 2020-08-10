const sql = require('mssql/msnodesqlv8');

const pool = new sql.Pool({
  connectionString: 'server=.:9635;Database=jcs;Trusted_Connection=Yes;Driver={ODBC dl4 Driver 64}'
});

pool.on('debug', msg => {
  console.log(
    `\t\t\t\t\t\t${new Date().toLocaleTimeString()} <pool.debug> ${msg}`
  );
});

pool.on('status', s => {
  console.log(`status = ${JSON.stringify(s, null, 4)}`);
});

pool.on('error', e => {
  console.log(e);
});

pool.query();

module.export = pool;
// 172.31.0.126:9635
