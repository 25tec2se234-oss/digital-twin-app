const db = require('./src/db');
db.query("SELECT column_name, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'orders'")
  .then(res => {
    console.log(res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
