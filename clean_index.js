const fs = require('fs');

let content = fs.readFileSync('public/futureverse/index.html', 'utf8');

// Replace universeData
const startMatch = content.indexOf('const universeData = {');
// we know universeData ends with }; followed by some space
// The safest way is to find the next function or variable declaration after universeData
const endMatch = content.indexOf('// --- FUTUREVERSE 2.0 PROGRESSION ENGINE ---');

if (startMatch !== -1 && endMatch !== -1) {
    // startMatch is inside the <script> block.
    // The <script> block starts a few lines before it.
    const scriptStart = content.lastIndexOf('<script>', startMatch);
    
    content = content.substring(0, scriptStart) + 
              '<script src="data.js"></script>\n    <script>\n        ' + 
              content.substring(endMatch);
    console.log('Replaced universeData');
} else {
    console.log('Could not find universeData boundaries', startMatch, endMatch);
}

// Remove SEMANTIC HTML
const srStart = content.indexOf('<!-- SEMANTIC HTML FOR SEO');
// Since semantic HTML is at the end, let's find where it stops by looking for the next <script> or copyShareLink
const srEnd = content.indexOf('<!-- LEADERBOARD / SHARE LOGIC', srStart);
if (srEnd === -1) {
    // If we can't find that, look for function copyShareLink
    const copyLink = content.indexOf('function copyShareLink', srStart);
    if (copyLink !== -1) {
        // Find the script tag closing before it
        const scriptClose = content.lastIndexOf('</script>', copyLink);
        // Remove from srStart to scriptClose
        content = content.substring(0, srStart) + '\n' + content.substring(scriptClose);
        console.log('Removed Semantic HTML');
    }
} else {
    content = content.substring(0, srStart) + content.substring(srEnd);
    console.log('Removed Semantic HTML');
}

fs.writeFileSync('public/futureverse/index.html', content);
console.log('Done, new size:', content.length);
