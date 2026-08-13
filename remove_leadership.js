const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const deployDir = path.join(__dirname, 'deploy-digital-twin', 'public');

function getHtmlFilesRecursively(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getHtmlFilesRecursively(filePath));
        } else if (file.endsWith('.html')) {
            results.push(filePath);
        }
    });
    return results;
}

const allHtmlFiles = [...getHtmlFilesRecursively(publicDir), ...getHtmlFilesRecursively(deployDir)];

let updatedCount = 0;

allHtmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Regex to match the leadership column (either old or new format)
    const leadershipRegex1 = /<div class="ft-col">\s*<h4>Leadership<\/h4>[\s\S]*?<\/div>/;
    const leadershipRegex2 = /<div class="ft-col leadership-col">\s*<h4>Leadership<\/h4>[\s\S]*?<\/div>/;
    
    let changed = false;
    if (leadershipRegex1.test(content)) {
        content = content.replace(leadershipRegex1, '');
        changed = true;
    }
    if (leadershipRegex2.test(content)) {
        content = content.replace(leadershipRegex2, '');
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }
});

console.log(`Removed from ${updatedCount} files.`);
