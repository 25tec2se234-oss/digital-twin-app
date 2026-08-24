import os
import re

path = "c:/Users/Kumar Kartikey/.vscode DTwin/public/achievement-analyzer.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the entire :root block with our new CSS
new_css = """
        :root {
            --bg: #ffffff;
            --surf: #ffffff;
            --surf2: #f9fafb;
            --surf3: #f3f4f6;
            --blue: #2563eb;
            --blue2: #3b82f6;
            --cyan: #06b6d4;
            --purple: #7c3aed;
            --purple2: #8b5cf6;
            --pink: #db2777;
            --red: #dc2626;
            --wh: #111827;
            --wh2: #374151;
            --mu: #6b7280;
            --bdr: #e5e7eb;
            --card: #ffffff;
            --grad-bg: linear-gradient(135deg, #f0fdfa, #eff6ff, #f3e8ff);
            --grad-text: linear-gradient(135deg, #2563eb, #7c3aed);
            --nh: 58px;
            --sw: 248px;
            --r: 12px;
            --r2: 18px;
        }
"""
content = re.sub(r':root\s*\{.*?\-\-nh:\s*58px;\s*\}', new_css.strip(), content, flags=re.DOTALL)
content = re.sub(r'\[data-theme="light"\]\s*\{.*?\}', '', content, flags=re.DOTALL)

# 2. Fix the initial theme default
content = content.replace('<body data-theme="dark">', '<body data-theme="light">')
content = content.replace("theme: 'dark',", "theme: 'light',")

# 3. Add spline script
spline_script = '<script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js"></script>'
content = content.replace('</head>', f'    {spline_script}\n</head>')

# 4. Add spline viewer to dashboard
spline_html = """
    <div style="width:100%; height:250px; border-radius:12px; overflow:hidden; margin-bottom:1.5rem; position:relative; background:var(--surf2); border:1px solid var(--bdr);">
        <spline-viewer url="https://prod.spline.design/iWj6gB3bE2x6qD7P/scene.splinecode"></spline-viewer>
    </div>
"""
content = content.replace('<div class="view" id="view-dashboard">', '<div class="view" id="view-dashboard">\n' + spline_html)

# 5. Stop nav from hiding on load
nav_hide_code = """
                var nav2 = document.getElementById('main-nav');
                if (nav2) nav2.style.display = 'none';
                var sidebar2 = document.getElementById('sidebar');
                if (sidebar2) sidebar2.style.display = 'none';
"""
content = content.replace(nav_hide_code, "\n                showMainNav();\n")

# 6. Stop main-nav and sidebar from being display:none by default in HTML
content = content.replace('<nav id="main-nav" style="display:none">', '<nav id="main-nav">')
content = content.replace('<aside id="sidebar" style="display:none">', '<aside id="sidebar">')

# 7. Fix broken links to landing page
content = content.replace('href="digitaltwin-landing.html"', 'href="index.html"')

# 8. SaaS Contrast Fixes
saas_css = """
    <style>
    /* SaaS Light Theme Contrast Fixes */
    #sidebar { background: var(--surf) !important; border-right: 1px solid var(--bdr) !important; }
    #main-nav { background: var(--surf) !important; border-bottom: 1px solid var(--bdr) !important; box-shadow: none !important; }
    .nav-item { color: var(--mu) !important; }
    .nav-item:hover, .nav-item.active { background: var(--surf3) !important; color: var(--blue) !important; border-left-color: var(--blue) !important; }
    .nav-section-label { color: var(--wh2) !important; }
    .sidebar-brand, .nav-brand { color: var(--wh) !important; }
    </style>
</head>
"""
content = content.replace('</head>', saas_css)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched completely!")
