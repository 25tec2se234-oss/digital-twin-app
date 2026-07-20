import os
import re

open_career_patch = """            detail.classList.add('open');

            var _cg = document.getElementById('career-grid');
            if (_cg) _cg.style.display = 'none';
            var _dc = document.querySelector('.dash-controls');
            if (_dc) _dc.style.display = 'none';
            var _dov = document.getElementById('dash-overall');
            if (_dov) _dov.style.display = 'none';
"""

close_career_patch = """        function closeCareer() {
            var detail = document.getElementById('career-detail');
            detail.classList.remove('open');
            detail.innerHTML = '';
            document.querySelectorAll('.ccard').forEach(function(el) {
                el.classList.remove('selected');
            });
            
            var _cg = document.getElementById('career-grid');
            if (_cg) _cg.style.display = '';
            var _dc = document.querySelector('.dash-controls');
            if (_dc) _dc.style.display = '';
            var _dov = document.getElementById('dash-overall');
            if (_dov) _dov.style.display = '';
            
            var _db = document.getElementById('dashboard');
            if (_db) _db.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
"""

updated = 0
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        if file.endswith('.js') and 'app' in file.lower():
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                changed = False
                
                # Patch openCareer
                if "detail.classList.add('open');" in content and "var _cg = document.getElementById('career-grid');" not in content:
                    content = content.replace("detail.classList.add('open');", open_career_patch)
                    changed = True
                
                # Patch closeCareer
                # Look for the exact closeCareer function signature and body
                old_close = '''        function closeCareer() {
            var detail = document.getElementById('career-detail');
            detail.classList.remove('open');
            detail.innerHTML = '';
            document.querySelectorAll('.ccard').forEach(function(el) {
                el.classList.remove('selected');
            });
        }'''
                if old_close in content:
                    content = content.replace(old_close, close_career_patch)
                    changed = True
                else:
                    # try a regex if spacing is different
                    old_close_regex = re.compile(r"function\s+closeCareer\s*\(\)\s*\{[\s\S]*?el\.classList\.remove\('selected'\);\s*\n\s*\}\);\s*\}")
                    if old_close_regex.search(content):
                        content = old_close_regex.sub(close_career_patch.strip(), content)
                        changed = True

                if changed:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Patched {path}")
                    updated += 1
            except Exception as e:
                print(f"Error {path}: {e}")

print(f"Total files updated: {updated}")
