const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modified = 0;
walkDir(path.join(__dirname, 'public'), function(filePath) {
    if (filePath.endsWith('.html') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        // We only want to replace width: 100vw and max-width: 100vw, not necessarily height: 100vw
        let newContent = content.replace(/width:\s*100vw/g, 'width: 100%')
                                .replace(/max-width:\s*100vw/g, 'max-width: 100%');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            modified++;
            console.log('Modified:', filePath);
        }
    }
});
console.log('Total files modified:', modified);
