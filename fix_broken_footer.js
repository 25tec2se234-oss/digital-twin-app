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
    
    // The broken regex string
    const brokenHtml = `                
                    <div class="leader-item">
                        <span class="leader-name">Kaushiki Singh</span>
                        <span class="leader-title">Co-Founder</span>
                    </div>
                    <div class="leader-item">
                        <span class="leader-name">Rani Singh</span>
                        <span class="leader-title">Director</span>
                    </div>
                    <div class="leader-item">
                        <span class="leader-name">Satyam Dubey</span>
                        <span class="leader-title">Chief Marketing Officer</span>
                    </div>
                </div>`;
    
    // Also consider the older broken HTML just in case
    // But since they were all generated exactly the same, let's use a regex to be safe and handle whitespace
    
    const brokenRegex = /\s*<div class="leader-item">\s*<span class="leader-name">Kaushiki Singh<\/span>[\s\S]*?<span class="leader-title">Chief Marketing Officer<\/span>\s*<\/div>\s*<\/div>/;

    if (brokenRegex.test(content)) {
        content = content.replace(brokenRegex, '');
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`Fixed ${file}`);
    } else {
        // Fallback: check if the string exists with slightly different whitespace
        const brokenRegex2 = /<div class="leader-item">\s*<span class="leader-name">Kaushiki Singh<\/span>[\s\S]*?Chief Marketing Officer<\/span>\s*<\/div>\s*<\/div>/;
        if (brokenRegex2.test(content)) {
            content = content.replace(brokenRegex2, '');
            fs.writeFileSync(file, content, 'utf8');
            updatedCount++;
            console.log(`Fixed ${file}`);
        }
    }
});

console.log(`Fixed ${updatedCount} files.`);
