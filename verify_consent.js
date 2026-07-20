const db = require('./src/db');
const fetch = require('node-fetch'); // Assuming node-fetch or native fetch in node >= 18

(async () => {
    console.log("1. Starting local server temporarily...");
    // We assume the server is running on port 3000, or we can just call the model directly.
    // Actually, calling the model directly is easier and doesn't require a running server.
    
    console.log("2. Testing consentModel directly...");
    const consentModel = require('./src/models/consentModel');
    
    const mockData = {
        userId: 'test_user_id',
        termsVersion: 'v1.0',
        ipAddress: '127.0.0.1',
        userAgent: 'MockAgent/1.0',
        consents: {
            refundPolicyAccepted: true,
            disputePolicyAccepted: true,
            fraudLoggingAccepted: true
        }
    };
    
    try {
        const result = await consentModel.logConsent(mockData);
        console.log("Inserted ID:", result.id, "at", result.created_at);
        
        console.log("3. Verifying database insertion...");
        const dbResult = await db.query('SELECT * FROM payment_consents WHERE id = $1', [result.id]);
        
        if (dbResult.rows.length > 0) {
            console.log("SUCCESS! Row found in database:");
            console.log(dbResult.rows[0]);
        } else {
            console.error("FAIL: Row not found after insert.");
        }
        
    } catch (err) {
        console.error("Test failed with error:", err);
    } finally {
        // Close DB pool to allow script to exit
        require('./src/db').pool?.end();
        process.exit(0);
    }
})();
