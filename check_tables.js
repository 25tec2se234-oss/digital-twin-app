const { pool } = require('./src/db');
pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name")
  .then(r => {
    const org = r.rows.filter(x => x.table_name.includes('member') || x.table_name.startsWith('org_'));
    org.forEach(x => console.log(x.table_name));
    pool.end();
  }).catch(e => { console.error(e.message); pool.end(); });
