const fs = require('fs');
const lines = fs.readFileSync('deploy-digital-twin/public/index.html', 'utf8').split('\n');
const revIdx = lines.findIndex(l => l.includes('id="rev"'));
console.log('Line with id="rev":', revIdx);
