const { Client } = require('pg');
require('dotenv').config();

const emails = [
    "rudraism19@gmail.com",
    "ag1655040@gmail.com",
    "originalpratik@gmail.com",
    "shivam8210973372@gmail.com",
    "parmaratharvsingh108@gmail.com",
    "chauhanvs290@gmail.com",
    "raiaryan1807@gmail.com",
    "devanshsirotiya@gmail.com",
    "kartikswarnkarff@gmail.com",
    "shuchita1106@gmail.com",
    "pritika470@gmail.com",
    "mohasingh2008@gmail.com",
    "princeshrivastav288@gmail.com",
    "jainaakriti1115@gmail.com",
    "shubhr712@gmail.com"
];

async function verifySubscriptions() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });
    await client.connect();
    
    try {
        const placeholders = emails.map((_, i) => `$${i + 1}`).join(', ');
        
        const queryText = `
            SELECT email, subscription_status, plan_id, subscription_start_date, subscription_end_date 
            FROM users
            WHERE email IN (${placeholders});
        `;
        
        const res = await client.query(queryText, emails);
        
        console.log("=== SUBSCRIPTION STATUS REPORT ===");
        console.log(`Found ${res.rowCount} users in the database out of 15 requested.\n`);
        
        const foundEmails = [];
        for (const row of res.rows) {
            foundEmails.push(row.email);
            console.log(`Email: ${row.email}`);
            console.log(`  Status: ${row.subscription_status}`);
            console.log(`  Plan: ${row.plan_id}`);
            console.log(`  Start Date: ${row.subscription_start_date}`);
            console.log(`  End Date: ${row.subscription_end_date}`);
            console.log('---');
        }
        
        const notFound = emails.filter(e => !foundEmails.includes(e));
        if (notFound.length > 0) {
            console.log(`\nThe following ${notFound.length} emails DO NOT EXIST in the database yet:`);
            notFound.forEach(e => console.log(` - ${e}`));
        }
        
    } catch (e) {
        console.error('Error verifying subscriptions:', e);
    } finally {
        await client.end();
    }
}

verifySubscriptions();
