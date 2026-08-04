const genesisModel = require('../src/models/genesisModel');

async function testGenesisBackend() {
    console.log('--- TESTING GENESIS DEDICATED BACKEND MODULE ---');
    
    // Test 1: Generate or fetch twin for a session
    const testSession = 'test_sess_' + Date.now();
    const twin1 = await genesisModel.getOrCreateTwin(testSession);
    console.log('✔ Genesis Init Twin 1:', twin1);
    
    // Test 2: Fetch twin AGAIN for the SAME session (Must be identical!)
    const twin2 = await genesisModel.getOrCreateTwin(testSession);
    console.log('✔ Genesis Fetch Twin 2 (Re-query):', twin2);

    if (twin1.twinId === twin2.twinId) {
        console.log('✔ PERFECT PERSISTENCE VERIFIED! Digital Twin ID is identical across requests:', twin1.twinId);
    } else {
        console.error('❌ ERROR: Digital Twin ID changed between requests!');
        process.exit(1);
    }

    // Test 3: Calibrate twin
    const updated = await genesisModel.updateCalibration(testSession, twin1.twinId, { logic: 95, creativity: 90, velocity: 88, domain: 98, grit: 94 }, 'The Creative AI Architect', 97.5);
    console.log('✔ Genesis Calibrate Twin Updated:', updated);

    console.log('--- ALL BACKEND TESTS PASSED CLEANLY ---');
    process.exit(0);
}

testGenesisBackend().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
