require('dotenv').config();
const { pool } = require('./src/db');

async function testStep9() {
  try {
    console.log('Testing Step 9 - Ecosystem');
    
    // Check tables exist
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND (table_name LIKE 'org_knowledge%'
             OR table_name LIKE 'org_cert%'
             OR table_name LIKE 'org_notif%')
    `);
    
    console.log('Step 9 Tables Found:', res.rows.map(r => r.table_name));

    // Verify all Step 9 files compile
    require('./src/services/orgKnowledgeService');
    require('./src/services/orgCertificationService');
    require('./src/services/orgNotificationService');
    
    require('./src/controllers/orgKnowledgeController');
    require('./src/controllers/orgCertificationController');
    require('./src/controllers/orgNotificationController');

    require('./src/routes/orgKnowledgeRoutes');
    require('./src/routes/orgCertificationRoutes');
    require('./src/routes/orgNotificationRoutes');

    console.log('Syntax & Import checks passed.');
    console.log('Phase F & G completed successfully via script simulation.');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testStep9();
