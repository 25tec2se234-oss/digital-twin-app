const fs = require('fs');
let c = fs.readFileSync('public/futureverse/index.html', 'utf8');
c = c.replace('<script src="data.js"></script>', '<script src="/futureverse/data.js"></script>');
fs.writeFileSync('public/futureverse/index.html', c);
console.log('Fixed src');
