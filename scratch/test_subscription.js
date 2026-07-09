const { pool } = require('../src/db');
const { requirePremium } = require('../src/middlewares/subscription');
const ApiError = require('../src/utils/apiError');

// Mock request and response
const req = {
    method: 'POST',
    baseUrl: '/api/v1',
    path: '/messages',
    originalUrl: '/api/v1/messages',
    ip: '127.0.0.1',
    body: {}
};

const res = {
    statusCode: 200,
    status(code) {
        this.statusCode = code;
        return this;
    },
    json(data) {
        this.data = data;
        return this;
    }
};

let nextCalled = false;
const next = (err) => {
    nextCalled = true;
    if (err) {
        console.error('Next called with error:', err);
    }
};

async function runTest() {
    console.log('--- Test 1: No User (Unauthorized) ---');
    req.user = null;
    await requirePremium(req, res, next);
    console.log('Result Status:', res.statusCode); // Expect 401
    
    console.log('\n--- Test 2: Admin User (Pass) ---');
    nextCalled = false;
    res.statusCode = 200;
    req.user = { id: 'admin123', role: 'admin' };
    await requirePremium(req, res, next);
    console.log('Next Called:', nextCalled); // Expect true

    console.log('\n--- Test 3: Expired User (Forbidden) ---');
    nextCalled = false;
    res.statusCode = 200;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    req.user = { 
        id: 'user123', 
        role: 'student',
        trialExpiresAt: yesterday.toISOString(),
        subscriptionExpiresAt: null
    };
    
    await requirePremium(req, res, next);
    console.log('Result Status:', res.statusCode); // Expect 403
    console.log('Result JSON:', res.data); // Expect { error: 'SubscriptionExpired', ... }

    console.log('\n--- Test 4: Active Trial User (Pass) ---');
    nextCalled = false;
    res.statusCode = 200;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    req.user = { 
        id: 'user123', 
        role: 'student',
        trialExpiresAt: tomorrow.toISOString(),
        subscriptionExpiresAt: null
    };
    
    await requirePremium(req, res, next);
    console.log('Next Called:', nextCalled); // Expect true

    pool.end();
}

runTest();
