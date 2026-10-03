const fs = require('fs');

const htmlPath = 'public/achievement-analyzer.html';
const html = fs.readFileSync(htmlPath, 'utf8');

// Match from <script> to </script> wrapping the main logic
// The script starts with <script> and ends with </script> right before <script src="index.js"></script>
const scriptStartIdx = html.indexOf('<script>\n        /* ========== DATA ========== */');
const scriptEndIdx = html.lastIndexOf('</script>');
// But wait, the last </script> is for index.js. We need the one before it.
// Actually, using regex is easier:
const match = html.match(/<script>\s*\/\* ========== DATA ========== \*\/(.*?)<\/script>/s);

if (match) {
    const scriptContent = match[1];
    fs.writeFileSync('public/analyzer-script.js', scriptContent);
    const newHtml = html.replace(match[0], '<script src="analyzer-script.js"></script>');
    fs.writeFileSync(htmlPath, newHtml);
    console.log("Successfully extracted script to analyzer-script.js and linked it.");
} else {
    console.log("Could not find the script block!");
}
