const fs = require('fs');
const path = require('path');

const srcAssetsDir = path.join(__dirname, '..', 'scratch', 'digital-twin-frontend-repo', 'main-site', 'dist', 'assets');
const targetAssetsDirs = [
    path.join(__dirname, '..', 'public', 'assets'),
    path.join(__dirname, '..', 'deploy-digital-twin', 'public', 'assets')
];

const loginHtmlPaths = [
    path.join(__dirname, '..', 'public', 'login.html'),
    path.join(__dirname, '..', 'deploy-digital-twin', 'public', 'login.html'),
    path.join(__dirname, '..', 'public', 'wheel.html'),
    path.join(__dirname, '..', 'deploy-digital-twin', 'public', 'wheel.html')
];

console.log('--- STARTING LOGIN HTML AND ASSET SYNC ---');

if (!fs.existsSync(srcAssetsDir)) {
    console.error('Source assets directory not found:', srcAssetsDir);
    process.exit(1);
}

// 1. Find the main index.js and index.css files
const files = fs.readdirSync(srcAssetsDir);
let indexJsFile = null;
let indexCssFile = null;

files.forEach(file => {
    if (file.startsWith('index-') && file.endsWith('.js')) {
        indexJsFile = file;
    }
    if (file.startsWith('index-') && file.endsWith('.css')) {
        indexCssFile = file;
    }
});

if (!indexJsFile || !indexCssFile) {
    console.error('Could not find main index.js or index.css in built assets!');
    process.exit(1);
}

console.log(`Found built assets: JS=${indexJsFile}, CSS=${indexCssFile}`);

// 2. Clean and copy files to target assets directories
targetAssetsDirs.forEach(destDir => {
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    } else {
        // Clean old files in target assets folder
        fs.readdirSync(destDir).forEach(file => {
            fs.unlinkSync(path.join(destDir, file));
        });
    }

    // Copy all files
    files.forEach(file => {
        const srcPath = path.join(srcAssetsDir, file);
        const destPath = path.join(destDir, file);
        fs.copyFileSync(srcPath, destPath);
    });
    console.log(`Copied ${files.length} assets to ${destDir}`);
});

// 3. Update paths in login.html files
loginHtmlPaths.forEach(htmlPath => {
    if (!fs.existsSync(htmlPath)) {
        console.log(`Skipping missing html file: ${htmlPath}`);
        return;
    }

    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Replace script src path
    // Match: src="/assets/index-xxxxxxxx.js"
    const scriptRegex = /src="\/assets\/index-[a-zA-Z0-9_-]+\.js"/g;
    htmlContent = htmlContent.replace(scriptRegex, `src="/assets/${indexJsFile}"`);
    
    // Replace stylesheet href path
    // Match: href="/assets/index-xxxxxxxx.css"
    const stylesheetRegex = /href="\/assets\/index-[a-zA-Z0-9_-]+\.css"/g;
    htmlContent = htmlContent.replace(stylesheetRegex, `href="/assets/${indexCssFile}"`);
    
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Updated ${htmlPath} successfully.`);
});

console.log('--- LOGIN HTML AND ASSET SYNC COMPLETED ---');
