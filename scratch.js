const { Client } = require('pg');
require('dotenv').config();

async function run() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });
    await client.connect();

    const res = await client.query(`
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
    `);

    const tables = {};
    for (const row of res.rows) {
        if (!tables[row.table_name]) tables[row.table_name] = [];
        tables[row.table_name].push(`${row.column_name} (${row.data_type})`);
    }

    for (const [table, cols] of Object.entries(tables)) {
        console.log(`Table: ${table}`);
        console.log(cols.join('\n'));
        console.log('---');
    }
    await client.end();
}

run().catch(console.error);
