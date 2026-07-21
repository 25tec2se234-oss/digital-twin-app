const http = require('http');
async function makeRequest(path) {
    return new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:3000' + path, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(res.statusCode));
        }).on('error', reject);
    });
}
async function runTest() {
    console.log("Making 120 requests to / (static HTML)...");
    let okCount = 0;
    let rateLimitedCount = 0;
    for (let i = 0; i < 120; i++) {
        let status = await makeRequest('/');
        if (status === 200) okCount++;
        else if (status === 429) rateLimitedCount++;
    }
    console.log(`Static / Results: 200 OK: ${okCount}, 429 Rate Limited: ${rateLimitedCount}`);
    
    console.log("\nMaking 120 requests to /api/version (API)...");
    let apiOk = 0;
    let apiRateLimited = 0;
    for (let i = 0; i < 120; i++) {
        let status = await makeRequest('/api/version');
        if (status === 200) apiOk++;
        else if (status === 429) apiRateLimited++;
    }
    console.log(`API /api/version Results: 200 OK: ${apiOk}, 429 Rate Limited: ${apiRateLimited}`);
}
runTest();
