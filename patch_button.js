const fs = require('fs');
const path = require('path');

const files = [
    'c:/Users/Kumar Kartikey/.vscode DTwin/public/assets/index-C-QCogKD.js',
    'c:/Users/Kumar Kartikey/.vscode DTwin/deploy-digital-twin/public/assets/index-C-QCogKD.js'
];

files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.log('Skipping missing file:', filePath);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // The exact variable name varies (e.g. m.jsxs vs d.jsxs, b vs other vars), so we'll use regex.
    // 1. Remove the top button.
    // It looks like: [m.jsxs("button",{onClick:()=>window.parent.location.href="/index.html",className:"absolute top-2 left-6 flex items-center gap-1.5 text-xs font-semibold text-[#cbc3d7]/60 hover:text-[#d4af37] transition-colors cursor-pointer group",children:[m.jsx("span",{className:"group-hover:-translate-x-1 transition-transform",children:"?"})," Back to Home"]}),m.jsxs("div",{className:"mb-8 flex flex-col items-center text-center"
    
    const topBtnRegex = /\[([a-z]\.jsxs?)\("button",\{onClick:\(\)=>(?:window\.parent\.)?location\.href="\/index\.html",className:"absolute top-2 left-6 flex items-center gap-1\.5 text-xs font-semibold text-\[#cbc3d7\]\/60 hover:text-\[#d4af37\] transition-colors cursor-pointer group",children:\[\1\("span",\{className:"group-hover:-translate-x-1 transition-transform",children:"?"\}\)," Back to Home"\]\}\),(\1\("div",\{className:"mb-8 flex flex-col items-center text-center")/g;
    
    content = content.replace(topBtnRegex, '[');
    
    // 2. Insert it next to Remember Me
    // The Remember Me section looks like:
    // className:"flex items-center gap-3 pt-2",children:[ ... m.jsx("span",{className:"text-xs font-semibold text-[#cbc3d7] select-none",children:"Remember Me"})]})
    
    const rememberMeRegex = /(className:"flex items-center gap-3 pt-2",children:\[(.*?children:"Remember Me"\}\)\]\})\},([a-z]\.jsxs?\("button",\{id:"signin-submit-btn")/g;
    
    content = content.replace(rememberMeRegex, (match, p1, p2, p3) => {
        const createEl = match.match(/([a-z]\.jsxs?)\("button",\{id:"signin-submit-btn"/)[1];
        return `className:"flex justify-between items-center pt-2 w-full",children:[${createEl}("div",{className:"flex items-center gap-3",children:[${p2}]}),${createEl}("button",{type:"button",onClick:()=>window.parent.location.href="/index.html",className:"flex items-center gap-1.5 text-xs font-semibold text-[#cbc3d7]/60 hover:text-[#d4af37] transition-colors cursor-pointer group",children:[${createEl}("span",{className:"group-hover:-translate-x-1 transition-transform",children:"?"})," Back to Home"]})]},${p3}`;
    });
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
});
