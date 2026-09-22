const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const regex = /<section[^>]*id="([^"]+)"[^>]*>/g;
let match;
while ((match = regex.exec(html)) !== null) {
    console.log(match[1]);
}
