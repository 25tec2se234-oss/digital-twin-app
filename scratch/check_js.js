const fs = require('fs');
const html = fs.readFileSync('c:/Users/Kumar Kartikey/.vscode DTwin/public/achievement-analyzer.html', 'utf8');
const scriptMatch = html.match(/<script>\s*\/\* ========== DATA ========== \*\/([\s\S]*?)<\/script>/);
if (scriptMatch) {
    fs.writeFileSync('c:/Users/Kumar Kartikey/.vscode DTwin/scratch/temp.js', scriptMatch[1]);
    console.log('Extracted JS to temp.js');
}
