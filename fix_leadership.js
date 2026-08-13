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

const newLeadershipHTML = `<div class="ft-col leadership-col">
                    <h4>Leadership</h4>
                    <div class="leader-item">
                        <span class="leader-name">Kumar Kartikey</span>
                        <span class="leader-title">Founder &amp; CEO</span>
                    </div>
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

let updatedCount = 0;

allHtmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace the old leadership column
    const leadershipRegex = /<div class="ft-col">\s*<h4>Leadership<\/h4>[\s\S]*?<\/div>/;
    
    if (leadershipRegex.test(content)) {
        content = content.replace(leadershipRegex, newLeadershipHTML);
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
        console.log(`Updated ${file}`);
    }
});

console.log(`Updated ${updatedCount} files.`);
