import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    bad_patch = '''                            detail.classList.add('open');

            var _cg = document.getElementById('career-grid');
            if (_cg) _cg.style.display = 'none';
            var _dc = document.querySelector('.dash-controls');
            if (_dc) _dc.style.display = 'none';
            var _dov = document.getElementById('dash-overall');
            if (_dov) _dov.style.display = 'none';'''

    idx = content.find(bad_patch)
    if idx != -1:
        # Check if this is the first one (in initFeatureShowcase)
        # We can just replace the first occurrence
        content = content[:idx] + "                detail.classList.add('open');" + content[idx + len(bad_patch):]
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {filepath}')
    else:
        print(f'Bad patch not found in {filepath}')

fix_file('public/app.js')
fix_file('public/dist/app.d8f7c234.js')
