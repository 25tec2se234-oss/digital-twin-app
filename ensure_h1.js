const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function ensureH1(filePath) {
    try {
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const doc = dom.window.document;
        
        const h1s = doc.querySelectorAll('h1');
        if (h1s.length === 0) {
            const h1 = doc.createElement('h1');
            h1.textContent = "Digital Twin Verse Login";
            // visually hidden style
            h1.setAttribute('style', 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;');
            
            if (doc.body) {
                doc.body.insertBefore(h1, doc.body.firstChild);
            } else {
                doc.documentElement.appendChild(h1);
            }
            
            fs.writeFileSync(filePath, dom.serialize(), 'utf-8');
            console.log(`Added hidden H1 to ${filePath}`);
        }
    } catch (e) {
        console.error(e);
    }
}

const targets = [
    path.join(__dirname, 'public', 'login.html'),
    path.join(__dirname, 'deploy-digital-twin', 'public', 'login.html')
];

targets.forEach(t => {
    if (fs.existsSync(t)) ensureH1(t);
});
