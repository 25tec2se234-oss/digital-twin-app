const { Client } = require('pg');
require('dotenv').config();

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });
    await client.connect();

    const res = await client.query(`
        SELECT pg_get_constraintdef(c.oid) AS constraint_def
        FROM pg_constraint c
        JOIN pg_class t ON c.conrelid = t.oid
        WHERE c.conname = 'users_subscription_status_check';
    `);
    
    console.log(res.rows[0].constraint_def);
    await client.end();
}

run().catch(console.error);
