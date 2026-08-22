const { Client } = require('pg');
require('dotenv').config();

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });
    await client.connect();

    const res = await client.query('SELECT id, plan_name FROM plans');
    
    console.log(res.rows);
    await client.end();
}

run().catch(console.error);
