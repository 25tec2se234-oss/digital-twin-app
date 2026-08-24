import os
import re

orig_path = "c:/Users/Kumar Kartikey/.vscode DTwin/scratch/analyzer_original.html"
new_path = "c:/Users/Kumar Kartikey/.vscode DTwin/public/achievement-analyzer.html"

with open(orig_path, 'r', encoding='utf-8') as f:
    orig = f.read()

# 1. Inject the light theme CSS tokens
new_root = """
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
            --nh: 64px;
        }
"""
# Replace the original :root and [data-theme="light"] completely
orig = re.sub(r':root\s*\{.*?\-\-nh:\s*64px;\s*\}', new_root.strip(), orig, flags=re.DOTALL)
orig = re.sub(r'\[data-theme="light"\]\s*\{.*?\}', '', orig, flags=re.DOTALL)

# 2. Force light theme by default (remove data-theme="dark" from body)
orig = orig.replace('<body data-theme="dark">', '<body>')

# 3. Add 3D spline to head
spline_script = '<script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.5/build/spline-viewer.js"></script>'
orig = orig.replace('</head>', f'    {spline_script}\n</head>')

# 4. Integrate 3D Spline in dashboard view
# We will just inject it into the dashboard view directly.
spline_html = """
    <div style="width:100%; height:250px; border-radius:12px; overflow:hidden; margin-bottom:1.5rem; position:relative; background:var(--surf2); border:1px solid var(--bdr);">
        <spline-viewer url="https://prod.spline.design/iWj6gB3bE2x6qD7P/scene.splinecode"></spline-viewer>
    </div>
"""
orig = orig.replace('<div class="view" id="view-dashboard">', '<div class="view" id="view-dashboard">\n' + spline_html)

# 5. Replace chat logic
chat_logic_new = """function sendChatMsg() {
  var inp = document.getElementById('chat-inp');
  if(!inp) return;
  var text = inp.value.trim();
  if (!text) return;

  appendChatMsg(text, 'user');
  STATE.chatHistory.push({ role: 'user', content: text });
  STATE.data.chatHistory = STATE.data.chatHistory || [];
  STATE.data.chatHistory.push({ role: 'user', content: text, ts: new Date().toISOString() });
  INTEL.save(STATE.data);
  inp.value = '';

  showChatTyping();

  var msgs = STATE.chatHistory.slice(-12);
  fetch('/api/public-analyzer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_tokens: 600,
        system: "You are an expert AI Career Mentor for Indian students. Be concise, professional, and empathetic.",
        messages: msgs
      })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
      removeChatTyping();
      var reply = d.content && d.content[0] ? d.content[0].text : 'Could not get response. Try again.';
      appendChatMsg(reply, 'bot');
      STATE.chatHistory.push({ role: 'assistant', content: reply });
      STATE.data.chatHistory.push({ role: 'assistant', content: reply, ts: new Date().toISOString() });
      INTEL.save(STATE.data);
  })
  .catch(function() {
      removeChatTyping();
      var reply = "Connection Error. I am currently unable to reach the digital servers.";
      appendChatMsg(reply, 'bot');
      STATE.chatHistory.push({ role: 'assistant', content: reply });
      INTEL.save(STATE.data);
  });
}"""

# original chat logic might be inside sendChatMsg()
# let's just do a regex replace for the whole function
orig = re.sub(r'function sendChatMsg\(\)\s*\{.*?\}\s*function', chat_logic_new + '\n\nfunction', orig, flags=re.DOTALL)

# 6. We also need to fix color contrast issues.
# In the original, the nav-item active state might use white text. Let's make sure text is readable on light.
orig = orig.replace('color: #fff;', 'color: var(--wh);')
orig = orig.replace('color:#fff;', 'color:var(--wh);')

# 7. Write to achievement-analyzer.html
with open(new_path, 'w', encoding='utf-8') as f:
    f.write(orig)

print("Merged!")
