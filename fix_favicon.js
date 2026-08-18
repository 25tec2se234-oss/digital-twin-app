const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;
            
            if (content.includes('<link rel="icon" href="/favicon.png" type="image/png">')) {
                content = content.replace(/<link rel="icon" href="\/favicon\.png" type="image\/png">/g, '<link rel="icon" href="/favicon.png" type="image/png" sizes="192x192">');
                updated = true;
            }
            if (content.includes('<link rel="apple-touch-icon" href="/img/dtv-logo.jpg">')) {
                content = content.replace(/<link rel="apple-touch-icon" href="\/img\/dtv-logo\.jpg">/g, '<link rel="apple-touch-icon" href="/favicon.png">');
                updated = true;
            }
            // For other templates
            if (content.includes('href="/img/dtv-logo.jpg"')) {
                content = content.replace(/href="\/img\/dtv-logo\.jpg"/g, 'href="/favicon.png"');
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'public'));
processDirectory(path.join(__dirname, 'deploy-digital-twin', 'public'));
console.log('Favicon update complete.');
