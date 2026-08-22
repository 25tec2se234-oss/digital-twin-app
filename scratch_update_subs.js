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

async function updateSubscriptions() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });
    await client.connect();
    
    try {
        await client.query('BEGIN');
        
        const placeholders = emails.map((_, i) => `$${i + 1}`).join(', ');
        
        const queryText = `
            UPDATE users
            SET 
                subscription_status = 'ACTIVE',
                plan_id = 'monthly',
                subscription_start_date = NOW(),
                subscription_end_date = NOW() + INTERVAL '1 month',
                subscription_expires_at = NOW() + INTERVAL '1 month',
                auto_renew = false,
                updated_at = NOW()
            WHERE email IN (${placeholders})
            RETURNING email;
        `;
        
        const res = await client.query(queryText, emails);
        
        await client.query('COMMIT');
        
        console.log(`Successfully updated ${res.rowCount} users.`);
        const updatedEmails = res.rows.map(r => r.email);
        
        const notFound = emails.filter(e => !updatedEmails.includes(e));
        if (notFound.length > 0) {
            console.log(`Warning: The following emails were not found in the database:`);
            console.log(notFound);
        }
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error updating subscriptions:', e);
    } finally {
        await client.end();
    }
}

updateSubscriptions();
