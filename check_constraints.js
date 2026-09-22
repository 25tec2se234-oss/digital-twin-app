const db = require('./src/db');
db.query("SELECT constraint_name, constraint_type FROM information_schema.table_constraints WHERE table_name = 'orders'")
  .then(res => {
    console.log(res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
