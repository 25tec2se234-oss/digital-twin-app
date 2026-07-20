const fs = require('fs');
const lines = fs.readFileSync('public/index.html', 'utf8').split('\n');
const revIdx = lines.findIndex(l => l.includes('LATEST CAREER BLOGS'));
console.log('Line with LATEST CAREER BLOGS:', revIdx);
