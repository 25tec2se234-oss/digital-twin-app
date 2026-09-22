const fs = require('fs');
async function test() {
  require('dotenv').config();
  const { Client } = require('pg');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("SELECT * FROM users WHERE role = 'admin' LIMIT 1");
  await client.end();
  const admin = res.rows[0];
  console.log('Admin:', admin.email);

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ sub: admin.id, email: admin.email, role: admin.role }, process.env.JWT_ACCESS_SECRET || 'dt_verse_super_secret_access_key_2024', { expiresIn: '1h' });

  console.log('TOKEN=', token);
}
test().catch(console.error);
