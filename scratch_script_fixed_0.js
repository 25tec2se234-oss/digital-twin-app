
/* ============================================================
   DIGITAL TWIN — Achievement Analyzer & Career Roadmap Generator
   All strings use \n escapes. No template literals. No IIFE at top.
   All DOM listeners inside DOMContentLoaded.
   ============================================================ */

/* ── CONFIG ─────────────────────────────────────────────────── */
var API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'https://digital-twin-verse-app.onrender.com/api/public-analyzer' : '/api/public-analyzer';
  var CFG = {
  apiKey: '',
  model: 'claude-sonnet-4-20250514',
  WA_LINK: 'https://chat.whatsapp.com/EoeMkImMW9u2NzEn2XTjr9'
};

/* ── INTELLIGENCE LAYER (localStorage persistence) ──────────── */
var INTEL = {
  key: 'dt_analyzer_v1',
  load: function() {
    try { return JSON.parse(localStorage.getItem(INTEL.key) || 'null') || INTEL.fresh(); }
    catch(e) { return INTEL.fresh(); }
  },
  fresh: function() {
    return {
      profile: { name:'', cgpa:'', skills:[], strengths:[], goals:'', interests:'', resumeText:'', certs:[] },
      analysis: null,
      roadmap: null,
      chatHistory: [],
      sessions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },
  save: function(data) {
    try {
      data.updatedAt = new Date().toISOString();
      localStorage.setItem(INTEL.key, JSON.stringify(data));
    } catch(e) {}
  }
};

/* ── APP STATE ───────────────────────────────────────────────── */
var STATE = {
  data: INTEL.load(),
  uploadedFiles: [],
  isAnalyzing: false,
  chatHistory: [],
  roadmapGenerated: false,
  currentView: 'upload'  /* upload | analyzing | dashboard | chat */
};

/* ── VIEW ROUTER ─────────────────────────────────────────────── */
function showView(id) {
  var views = ['view-upload','view-analyzing','view-dashboard','view-chat'];
  views.forEach(function(v) {
    var el = document.getElementById(v);
    if (el) el.classList.toggle('active', v === id);
  });
  STATE.currentView = id.replace('view-','');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── FILE UPLOAD ─────────────────────────────────────────────── */
function initDropZones() {
  ['drop-resume','drop-certs'].forEach(function(zoneId) {
    var zone = document.getElementById(zoneId);
    if (!zone) return;
    zone.addEventListener('dragover', function(e) {
      e.preventDefault();
      zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', function() {
      zone.classList.remove('dragover');
    });
    zone.addEventListener('drop', function(e) {
      e.preventDefault();
      zone.classList.remove('dragover');
      handleFiles(Array.from(e.dataTransfer.files), zoneId);
    });
    zone.addEventListener('click', function() {
      var inp = document.getElementById(zoneId === 'drop-resume' ? 'inp-resume' : 'inp-certs');
      if (inp) inp.click();
    });
  });

  var inpResume = document.getElementById('inp-resume');
  if (inpResume) inpResume.addEventListener('change', function() {
    handleFiles(Array.from(this.files), 'drop-resume');
  });
  var inpCerts = document.getElementById('inp-certs');
  if (inpCerts) inpCerts.addEventListener('change', function() {
    handleFiles(Array.from(this.files), 'drop-certs');
  });
}

function handleFiles(files, zoneId) {
  var isResume = zoneId === 'drop-resume';
  var listId = isResume ? 'resume-list' : 'certs-list';
  var list = document.getElementById(listId);
  files.forEach(function(file) {
    STATE.uploadedFiles.push({ name: file.name, type: file.type, size: file.size, zone: zoneId });
    if (isResume) STATE.data.profile.resumeText = '[Uploaded: ' + file.name + ']';
    else STATE.data.profile.certs.push(file.name);
    if (list) {
      var item = document.createElement('div');
      item.className = 'file-chip';
      item.innerHTML = '<span class="file-ic">' + (file.type.includes('pdf') ? '📄' : '🖼') + '</span>'
        + '<span class="file-nm">' + file.name + '</span>'
        + '<button class="file-rm" onclick="removeFileChip(this)">✕</button>';
      list.appendChild(item);
    }
  });
  INTEL.save(STATE.data);
  showToast('📎', files.length + ' file(s) added');
}

function removeFileChip(btn) {
  if (btn && btn.parentElement) btn.parentElement.remove();
}

/* ── TAG INPUTS (skills / strengths) ────────────────────────── */
function initTagInputs() {
  ['skills-inp','strengths-inp'].forEach(function(inpId) {
    var inp = document.getElementById(inpId);
    if (!inp) return;
    inp.addEventListener('keydown', function(e) {
      if ((e.key === 'Enter' || e.key === ',') && this.value.trim()) {
        e.preventDefault();
        addTag(this.value.trim(), inpId === 'skills-inp' ? 'skills-tags' : 'strengths-tags', inpId === 'skills-inp' ? 'skill' : 'strength');
        this.value = '';
      }
    });
  });
}

function addTag(text, containerId, type) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var tag = document.createElement('span');
  tag.className = 'inp-tag';
  tag.innerHTML = text + '<button onclick="this.parentElement.remove();syncTags()" title="Remove">✕</button>';
  container.appendChild(tag);
  syncTags();
}

function syncTags() {
  var skillEls = document.querySelectorAll('#skills-tags .inp-tag');
  var strEls = document.querySelectorAll('#strengths-tags .inp-tag');
  STATE.data.profile.skills = Array.from(skillEls).map(function(t) { return t.textContent.replace('✕','').trim(); });
  STATE.data.profile.strengths = Array.from(strEls).map(function(t) { return t.textContent.replace('✕','').trim(); });
  INTEL.save(STATE.data);
}

/* ── COLLECT FORM DATA ───────────────────────────────────────── */
function collectProfile() {
  var cgpaEl = document.getElementById('inp-cgpa');
  var goalsEl = document.getElementById('inp-goals');
  var intEl = document.getElementById('inp-interests');
  var nameEl = document.getElementById('inp-name');
  if (cgpaEl) STATE.data.profile.cgpa = cgpaEl.value.trim();
  if (goalsEl) STATE.data.profile.goals = goalsEl.value.trim();
  if (intEl) STATE.data.profile.interests = intEl.value.trim();
  if (nameEl) STATE.data.profile.name = nameEl.value.trim();
  syncTags();
  INTEL.save(STATE.data);
}

/* ── VALIDATE BEFORE SUBMIT ──────────────────────────────────── */
function validateProfile() {
  var name = document.getElementById('inp-name');
  var goals = document.getElementById('inp-goals');
  var skills = STATE.data.profile.skills;
  var msgs = [];
  if (!name || !name.value.trim()) msgs.push('Your name');
  if (!goals || !goals.value.trim()) msgs.push('Career goals');
  if (!skills.length) msgs.push('At least one skill');
  if (msgs.length) {
    showToast('⚠️', 'Please fill: ' + msgs.join(', '));
    if (name && !name.value.trim()) { name.classList.add('inp-error'); name.focus(); }
    return false;
  }
  return true;
}

/* ── START ANALYSIS ──────────────────────────────────────────── */
function startAnalysis() {
  if (!validateProfile()) return;
  collectProfile();
  showView('view-analyzing');
  STATE.isAnalyzing = true;
  animateAnalyzing();
  setTimeout(function() {
    STATE.isAnalyzing = false;
    runAIAnalysis();
  }, 3200);
}

/* ── ANALYZING ANIMATION ─────────────────────────────────────── */
function animateAnalyzing() {
  var steps = [
    'Scanning your achievements...',
    'Mapping your skill profile...',
    'Comparing with industry trends...',
    'Identifying career opportunities...',
    'Calculating confidence scores...',
    'Building your Digital Twin...'
  ];
  var el = document.getElementById('analyze-status');
  var bar = document.getElementById('analyze-bar');
  var i = 0;
  var interval = setInterval(function() {
    if (el) el.textContent = steps[i] || steps[steps.length - 1];
    if (bar) bar.style.width = ((i + 1) / steps.length * 100) + '%';
    i++;
    if (i >= steps.length) clearInterval(interval);
  }, 500);
}

/* ── BUILD ANALYSIS PROMPT ───────────────────────────────────── */
function buildAnalysisPrompt() {
  var p = STATE.data.profile;
  var parts = ['You are an expert AI career analyst for the Digital Twin platform. Analyze this student profile and return a structured JSON response.'];
  parts.push('\nSTUDENT PROFILE:');
  if (p.name) parts.push('Name: ' + p.name);
  if (p.cgpa) parts.push('CGPA/Academic: ' + p.cgpa);
  if (p.skills.length) parts.push('Skills: ' + p.skills.join(', '));
  if (p.strengths.length) parts.push('Strengths: ' + p.strengths.join(', '));
  if (p.goals) parts.push('Career Goals: ' + p.goals);
  if (p.interests) parts.push('Interests: ' + p.interests);
  if (p.resumeText) parts.push('Resume: ' + p.resumeText);
  if (p.certs.length) parts.push('Certificates: ' + p.certs.join(', '));
  parts.push('\nReturn ONLY valid JSON (no markdown, no backticks) with this exact structure:');
  parts.push('{"name":"string","confidenceScore":number(60-97),"profileStrength":number(0-100),"strongAreas":["area1","area2","area3"],"weakAreas":["gap1","gap2"],"hiddenPotential":["potential1","potential2"],"careerPaths":[{"title":"string","match":number(0-100),"salary":"string","timeline":"string","reason":"string"},{"title":"string","match":number,"salary":"string","timeline":"string","reason":"string"},{"title":"string","match":number,"salary":"string","timeline":"string","reason":"string"}],"keyInsight":"2-3 sentence personalized insight","nextStep":"single most important action"}');
  return parts.join('\n');
}

/* ── BUILD ROADMAP PROMPT ────────────────────────────────────── */
function buildRoadmapPrompt(careerTitle) {
  var p = STATE.data.profile;
  var parts = ['You are a career roadmap architect for the Digital Twin platform. Create a detailed roadmap.'];
  parts.push('Student: ' + (p.name || 'Student'));
  parts.push('Target Career: ' + careerTitle);
  parts.push('Current Skills: ' + (p.skills.join(', ') || 'None listed'));
  parts.push('CGPA: ' + (p.cgpa || 'Not provided'));
  parts.push('Goals: ' + (p.goals || 'Not provided'));
  parts.push('\nReturn ONLY valid JSON (no markdown) with this structure:');
  parts.push('{"career":"string","totalMonths":number,"phases":[{"phase":number,"title":"string","duration":"string","skills":["skill1","skill2"],"resources":["resource1","resource2"],"milestone":"string","outcome":"string"}],"internships":[{"role":"string","platform":"string","tip":"string"}],"certifications":["cert1","cert2"],"salaryJourney":{"year1":"string","year3":"string","year5":"string"}}');
  return parts.join('\n');
}

/* ── RUN AI ANALYSIS ─────────────────────────────────────────── */
function runAIAnalysis() {
  
  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CFG.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: CFG.model,
      max_tokens: 1500,
      messages: [{ role: 'user', content: buildAnalysisPrompt() }]
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(d) {
    var raw = d.content && d.content[0] ? d.content[0].text : '';
    try {
      var clean = raw.replace(/```json/g,'').replace(/```/g,'').trim();
      var parsed = JSON.parse(clean);
      STATE.data.analysis = parsed;
    } catch(e) {
      STATE.data.analysis = getDemoAnalysis();
    }
    INTEL.save(STATE.data);
    renderDashboard(STATE.data.analysis);
    showView('view-dashboard');
  })
  .catch(function() {
    STATE.data.analysis = getDemoAnalysis();
    INTEL.save(STATE.data);
    renderDashboard(STATE.data.analysis);
    showView('view-dashboard');
  });
}

/* ── DEMO ANALYSIS DATA ──────────────────────────────────────── */
function getDemoAnalysis() {
  var p = STATE.data.profile;
  var name = p.name || 'Student';
  var skills = p.skills;
  var hasTech = skills.some(function(s) {
    return ['python','java','javascript','react','ml','ai','data','node','flutter','sql'].some(function(k) {
      return s.toLowerCase().includes(k);
    });
  });
  var hasDesign = skills.some(function(s) {
    return ['figma','design','ux','ui','adobe','sketch'].some(function(k) {
      return s.toLowerCase().includes(k);
    });
  });
  var cgpaNum = parseFloat(p.cgpa) || 7.5;
  var confScore = Math.min(97, Math.round(60 + (cgpaNum - 5) * 5 + skills.length * 2));
  var paths = [];
  if (hasTech) {
    paths = [
      { title: 'Software Engineer', match: 92, salary: '₹8–40 LPA', timeline: '6–12 months', reason: 'Your technical skills align strongly with product engineering roles.' },
      { title: 'AI/ML Engineer', match: 86, salary: '₹12–50 LPA', timeline: '8–14 months', reason: 'Strong foundation for AI with upskilling in deep learning.' },
      { title: 'Data Scientist', match: 78, salary: '₹8–35 LPA', timeline: '6–10 months', reason: 'Analytical skills and technical background are a solid fit.' }
    ];
  } else if (hasDesign) {
    paths = [
      { title: 'UI/UX Designer', match: 91, salary: '₹5–25 LPA', timeline: '4–8 months', reason: 'Creative skills and design tools are highly marketable.' },
      { title: 'Product Manager', match: 82, salary: '₹12–45 LPA', timeline: '1–2 years', reason: 'Design thinking combined with strategic mindset.' },
      { title: 'Brand Strategist', match: 74, salary: '₹6–20 LPA', timeline: '6–10 months', reason: 'Visual storytelling aligns with marketing & brand roles.' }
    ];
  } else {
    paths = [
      { title: 'Business Analyst', match: 85, salary: '₹6–22 LPA', timeline: '4–8 months', reason: 'Analytical thinking and communication are strong differentiators.' },
      { title: 'Product Manager', match: 79, salary: '₹12–45 LPA', timeline: '1–2 years', reason: 'Cross-functional problem-solving is your edge.' },
      { title: 'Management Consultant', match: 72, salary: '₹8–30 LPA', timeline: '1–2 years', reason: 'Strategic thinking and domain knowledge are valued here.' }
    ];
  }
  return {
    name: name,
    confidenceScore: confScore,
    profileStrength: Math.min(95, 45 + skills.length * 5 + (STATE.uploadedFiles.length * 8)),
    strongAreas: skills.slice(0,3).concat(['Problem Solving']).slice(0,3),
    weakAreas: ['Industry Certifications', 'Portfolio Projects'],
    hiddenPotential: ['Leadership', 'Cross-domain Innovation'],
    careerPaths: paths,
    keyInsight: 'Hey ' + name + ', your profile shows a strong foundation with real growth potential. Your combination of ' + (skills.slice(0,2).join(' and ') || 'diverse skills') + ' puts you ahead of 68% of students at your level. With focused upskilling over the next 6 months, you can realistically target roles paying ₹10–25 LPA.',
    nextStep: 'Build one end-to-end portfolio project that demonstrates your top skill in a real-world context.'
  };
}

/* ── RENDER DASHBOARD ────────────────────────────────────────── */
function renderDashboard(a) {
  if (!a) return;
  var el = function(id) { return document.getElementById(id); };

  /* Header */
  var greet = el('dash-name');
  if (greet) greet.textContent = 'Hey ' + (a.name || 'there') + ' 👋';

  /* Confidence score ring animation */
  var ring = el('conf-ring');
  var ringTxt = el('conf-score');
  if (ring && ringTxt) {
    var circ = 2 * Math.PI * 42;
    var offset = circ - (a.confidenceScore / 100 * circ);
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ;
    ringTxt.textContent = a.confidenceScore + '%';
    setTimeout(function() { ring.style.strokeDashoffset = offset; }, 300);
  }

  /* Profile strength bar */
  var psBar = el('ps-bar');
  var psTxt = el('ps-txt');
  if (psBar) setTimeout(function() { psBar.style.width = a.profileStrength + '%'; }, 400);
  if (psTxt) psTxt.textContent = a.profileStrength + '%';

  /* Strong areas */
  var saEl = el('strong-areas');
  if (saEl && a.strongAreas) {
    saEl.innerHTML = a.strongAreas.map(function(s) {
      return '<span class="area-chip strong">' + s + '</span>';
    }).join('');
  }

  /* Weak areas */
  var waEl = el('weak-areas');
  if (waEl && a.weakAreas) {
    waEl.innerHTML = a.weakAreas.map(function(s) {
      return '<span class="area-chip weak">' + s + '</span>';
    }).join('');
  }

  /* Hidden potential */
  var hpEl = el('hidden-potential');
  if (hpEl && a.hiddenPotential) {
    hpEl.innerHTML = a.hiddenPotential.map(function(s) {
      return '<span class="area-chip potential">' + s + '</span>';
    }).join('');
  }

  /* Key insight */
  var kiEl = el('key-insight');
  if (kiEl) kiEl.textContent = a.keyInsight || '';

  /* Next step */
  var nsEl = el('next-step');
  if (nsEl) nsEl.textContent = a.nextStep || '';

  /* Career path cards */
  var cpEl = el('career-paths');
  if (cpEl && a.careerPaths) {
    cpEl.innerHTML = a.careerPaths.map(function(cp, i) {
      var pcirc = 2 * Math.PI * 22;
      var poff = pcirc - (cp.match / 100 * pcirc);
      return '<div class="cp-card' + (i === 0 ? ' cp-top' : '') + '" onclick="generateRoadmap(\'' + escStr(cp.title) + '\')">'
        + (i === 0 ? '<div class="cp-best">Best Match</div>' : '')
        + '<div class="cp-left">'
        + '<svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="22" fill="none" stroke="rgba(0,0,0,.08)" stroke-width="4"/>'
        + '<circle cx="27" cy="27" r="22" fill="none" stroke="' + (i===0?'#a78bfa':'#60a5fa') + '" stroke-width="4" stroke-linecap="round"'
        + ' style="stroke-dasharray:' + pcirc + ';stroke-dashoffset:' + poff + ';transform:rotate(-90deg);transform-origin:50% 50%;transition:stroke-dashoffset 1s ease;"/>'
        + '<text x="27" y="32" text-anchor="middle" fill="#fff" font-size="11" font-weight="800">' + cp.match + '%</text></svg>'
        + '</div>'
        + '<div class="cp-right">'
        + '<div class="cp-title">' + cp.title + '</div>'
        + '<div class="cp-meta">' + cp.salary + ' &nbsp;·&nbsp; ' + cp.timeline + '</div>'
        + '<div class="cp-reason">' + cp.reason + '</div>'
        + '<button class="cp-btn">Generate Roadmap →</button>'
        + '</div></div>';
    }).join('');
  }
}

function escStr(s) {
  return (s || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/* ── GENERATE ROADMAP ────────────────────────────────────────── */
function generateRoadmap(careerTitle) {
    showToast('🚀', 'Building your roadmap for ' + careerTitle + '...');
    
    // Add 3D Loading State
    var rm = document.getElementById('roadmap-section');
    var targetDiv = document.getElementById('rm-content');
    if (targetDiv) {
        targetDiv.innerHTML = '<div style="width:100%;height:300px;display:flex;justify-content:center;align-items:center;flex-direction:column;"><spline-viewer url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"></spline-viewer><p style="margin-top:1rem;color:var(--blue);font-weight:600;animation:pulse 1.5s infinite;">Analyzing Data & Structuring Path...</p></div>';
    }
    if (rm) {
      rm.classList.add('open');
      setTimeout(function() { rm.scrollIntoView({ behavior: 'smooth' }); }, 200);
    }

    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_tokens: 2000,
        messages: [{ role: 'user', content: buildRoadmapPrompt(careerTitle) }]
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var raw = d.content && d.content[0] ? d.content[0].text : '';
      try {
        var clean = raw.replace(/```json/g,'').replace(/```/g,'').trim();
        var parsed = JSON.parse(clean);
        STATE.data.roadmap = parsed;
      } catch(e) {
        showToast('❌', 'AI returned malformed data. Try again.');
        return;
      }
      STATE.data.roadmap.career = careerTitle;
      INTEL.save(STATE.data);
      renderRoadmap(STATE.data.roadmap);
      
      // Add success 3D element in header
      var rmTitle = document.querySelector('#roadmap-section h2');
      if (rmTitle && !rmTitle.querySelector('spline-viewer')) {
         rmTitle.innerHTML += '<div style="height:100px;width:100px;position:absolute;top:-20px;right:0;"><spline-viewer url="https://prod.spline.design/qB9BwQ8V7a2s7hXb/scene.splinecode"></spline-viewer></div>';
         rmTitle.style.position = 'relative';
      }
      
    })
    .catch(function(e) {
      showToast('❌', 'Error connecting to AI. Please try again.');
      if(targetDiv) targetDiv.innerHTML = '<p style="color:var(--red);text-align:center;">Connection failed.</p>';
    });
  }

;
}

/* ── RENDER ROADMAP ──────────────────────────────────────────── */
function renderRoadmap(rm) {
  if (!rm) return;
  var el = document.getElementById('roadmap-career');
  if (el) el.textContent = rm.career || '';

  var timeline = document.getElementById('roadmap-timeline');
  if (!timeline || !rm.phases) return;

  timeline.innerHTML = rm.phases.map(function(ph) {
    var skills = ph.skills.map(function(s) { return '<span class="rm-skill">' + s + '</span>'; }).join('');
    var res = ph.resources.map(function(r) { return '<li>' + r + '</li>'; }).join('');
    return '<div class="rm-phase">'
      + '<div class="rm-phase-head">'
      + '<div class="rm-phase-num">' + ph.phase + '</div>'
      + '<div class="rm-phase-info">'
      + '<div class="rm-phase-title">' + ph.title + '</div>'
      + '<div class="rm-phase-dur">' + ph.duration + '</div>'
      + '</div></div>'
      + '<div class="rm-phase-body">'
      + '<div class="rm-section"><div class="rm-sec-lbl">Skills to Build</div><div class="rm-skills">' + skills + '</div></div>'
      + '<div class="rm-section"><div class="rm-sec-lbl">Resources</div><ul class="rm-res">' + res + '</ul></div>'
      + '<div class="rm-milestone"><span class="rm-ms-ic">🎯</span><span>' + ph.milestone + '</span></div>'
      + '<div class="rm-outcome"><span class="rm-oc-ic">✅</span><span>' + ph.outcome + '</span></div>'
      + '</div></div>';
  }).join('');

  /* Salary journey */
  if (rm.salaryJourney) {
    var sjEl = document.getElementById('salary-journey');
    if (sjEl) {
      sjEl.innerHTML = Object.keys(rm.salaryJourney).map(function(k, i) {
        var pcts = ['35%','65%','100%'];
        return '<div class="sj-item">'
          + '<div class="sj-label">' + k.replace('year','Year ') + '</div>'
          + '<div class="sj-bar-wrap"><div class="sj-bar" style="width:0%" data-w="' + pcts[i] + '"></div></div>'
          + '<div class="sj-val">' + rm.salaryJourney[k] + '</div>'
          + '</div>';
      }).join('');
      setTimeout(function() {
        document.querySelectorAll('.sj-bar').forEach(function(b) {
          b.style.width = b.getAttribute('data-w');
        });
      }, 400);
    }
  }

  /* Internship cards */
  if (rm.internships) {
    var intEl = document.getElementById('internship-cards');
    if (intEl) {
      intEl.innerHTML = rm.internships.map(function(in_) {
        return '<div class="int-card"><div class="int-role">' + in_.role + '</div>'
          + '<div class="int-platform">' + in_.platform + '</div>'
          + '<div class="int-tip">💡 ' + in_.tip + '</div></div>';
      }).join('');
    }
  }

  /* Certs */
  if (rm.certifications) {
    var certEl = document.getElementById('rm-certs');
    if (certEl) {
      certEl.innerHTML = rm.certifications.map(function(c) {
        return '<div class="rm-cert"><span class="rm-cert-ic">🏆</span>' + c + '</div>';
      }).join('');
    }
  }

  STATE.roadmapGenerated = true;
}

/* ── PDF EXPORT ──────────────────────────────────────────────── */
function exportPDF() {
  var btn = document.getElementById('export-btn');
  if (btn) { btn.textContent = 'Generating...'; btn.disabled = true; }
  var rm = STATE.data.roadmap;
  var an = STATE.data.analysis;
  var p = STATE.data.profile;
  var now = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
  var lines = [];
  lines.push('DIGITAL TWIN — CAREER ROADMAP REPORT');
  lines.push('Eco-Novators | digitaltwin.niat.tech');
  lines.push('Generated: ' + now);
  lines.push('===================================================');
  lines.push('');
  if (an) {
    lines.push('PROFILE ANALYSIS');
    lines.push('Name: ' + (p.name || 'Not provided'));
    lines.push('Confidence Score: ' + an.confidenceScore + '%');
    lines.push('Profile Strength: ' + an.profileStrength + '%');
    lines.push('Strong Areas: ' + (an.strongAreas || []).join(', '));
    lines.push('Areas to Improve: ' + (an.weakAreas || []).join(', '));
    lines.push('Hidden Potential: ' + (an.hiddenPotential || []).join(', '));
    lines.push('');
    lines.push('KEY INSIGHT:');
    lines.push(an.keyInsight || '');
    lines.push('');
    lines.push('NEXT STEP: ' + (an.nextStep || ''));
  }
  lines.push('');
  if (rm) {
    lines.push('===================================================');
    lines.push('CAREER ROADMAP: ' + (rm.career || ''));
    lines.push('Total Duration: ' + (rm.totalMonths || 12) + ' months');
    lines.push('');
    (rm.phases || []).forEach(function(ph) {
      lines.push('PHASE ' + ph.phase + ': ' + ph.title + ' (' + ph.duration + ')');
      lines.push('Skills: ' + ph.skills.join(', '));
      lines.push('Resources: ' + ph.resources.join(', '));
      lines.push('Milestone: ' + ph.milestone);
      lines.push('Outcome: ' + ph.outcome);
      lines.push('');
    });
    if (rm.salaryJourney) {
      lines.push('SALARY JOURNEY:');
      Object.keys(rm.salaryJourney).forEach(function(k) {
        lines.push(k.replace('year','Year ') + ': ' + rm.salaryJourney[k]);
      });
    }
    lines.push('');
    lines.push('RECOMMENDED CERTIFICATIONS:');
    (rm.certifications || []).forEach(function(c) { lines.push('• ' + c); });
  }
  lines.push('');
  lines.push('===================================================');
  lines.push('© 2026 Eco-Novators | kar98kbi@gmail.com | digitaltwin.niat.tech');

  var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'DigitalTwin_Roadmap_' + (p.name || 'Report').replace(/\s+/g,'_') + '.txt';
  a.click();
  showToast('✅', 'Report downloaded!');
  setTimeout(function() {
    if (btn) { btn.textContent = '⬇ Download Report'; btn.disabled = false; }
  }, 1500);
}

/* ── AI CHAT ─────────────────────────────────────────────────── */
function buildChatSystemPrompt() {
  var p = STATE.data.profile;
  var a = STATE.data.analysis;
  var parts = [
    'You are a smart career mentor AI for the Digital Twin platform by Eco-Novators.',
    'You have already analyzed this student\'s profile. Respond like a human mentor — warm, direct, and specific.',
    'NEVER be robotic. Use the student\'s name when natural. Give concrete advice, not generic tips.',
    'Keep responses under 250 words. End with a question OR an action step.',
    '',
    'STUDENT PROFILE:'
  ];
  if (p.name) parts.push('Name: ' + p.name);
  if (p.skills.length) parts.push('Skills: ' + p.skills.join(', '));
  if (p.goals) parts.push('Goals: ' + p.goals);
  if (a) {
    parts.push('Confidence Score: ' + a.confidenceScore + '%');
    parts.push('Best Career Match: ' + (a.careerPaths && a.careerPaths[0] ? a.careerPaths[0].title : 'TBD'));
    parts.push('Key Insight: ' + (a.keyInsight || ''));
  }
  if (STATE.data.roadmap) {
    parts.push('Roadmap generated for: ' + STATE.data.roadmap.career);
  }
  return parts.join('\n');
}

function sendChatMsg() {
  var inp = document.getElementById('chat-inp');
  if (!inp) return;
  var text = inp.value.trim();
  if (!text) return;
  inp.value = '';

  appendChatMsg(text, 'user');
  STATE.chatHistory.push({ role: 'user', content: text });
  STATE.data.chatHistory.push({ role: 'user', content: text, ts: new Date().toISOString() });

  showChatTyping();

  

  var msgs = STATE.chatHistory.slice(-12);
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_tokens: 600,
        system: buildChatSystemPrompt(),
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
    },
    body: JSON.stringify({
      model: CFG.model,
      max_tokens: 600,
      system: buildChatSystemPrompt(),
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
    var reply = getDemoChatReply(text);
    appendChatMsg(reply, 'bot');
    STATE.chatHistory.push({ role: 'assistant', content: reply });
    INTEL.save(STATE.data);
  });
}

function appendChatMsg(text, from) {
  var box = document.getElementById('chat-msgs');
  if (!box) return;
  var div = document.createElement('div');
  div.className = 'chat-msg ' + from;
  div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function showChatTyping() {
  var box = document.getElementById('chat-msgs');
  if (!box) return;
  var div = document.createElement('div');
  div.className = 'chat-msg bot chat-typing';
  div.id = 'typing-ind';
  div.innerHTML = '<span></span><span></span><span></span>';
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function removeChatTyping() {
  var el = document.getElementById('typing-ind');
  if (el) el.remove();
}

/* ── QUICK CHAT PROMPTS ──────────────────────────────────────── */
function sendQuick(text) {
  var inp = document.getElementById('chat-inp');
  if (inp) { inp.value = text; sendChatMsg(); }
}

/* ── RESTORE FROM LOCALSTORAGE ───────────────────────────────── */
function restoreSession() {
  var saved = INTEL.load();
  if (!saved || !saved.analysis) return;
  STATE.data = saved;
  STATE.chatHistory = saved.chatHistory
    ? saved.chatHistory.map(function(m) { return { role: m.role, content: m.content }; })
    : [];
  renderDashboard(saved.analysis);
  if (saved.roadmap) {
    renderRoadmap(saved.roadmap);
    var rm = document.getElementById('roadmap-section');
    if (rm) rm.classList.add('open');
  }
  if (saved.chatHistory && saved.chatHistory.length) {
    saved.chatHistory.slice(-6).forEach(function(m) {
      appendChatMsg(m.content, m.role === 'user' ? 'user' : 'bot');
    });
  }
  showView('view-dashboard');
  showToast('📂', 'Previous session restored!');
}

/* ── TOAST ───────────────────────────────────────────────────── */
var toastTimer;
function showToast(icon, msg) {
  clearTimeout(toastTimer);
  var ic = document.getElementById('t-icon');
  var tm = document.getElementById('t-msg');
  var t = document.getElementById('toast');
  if (ic) ic.textContent = icon;
  if (tm) tm.textContent = msg;
  if (t) t.classList.add('show');
  toastTimer = setTimeout(function() {
    if (t) t.classList.remove('show');
  }, 3500);
}

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
function initReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('revealed'); });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
}

/* ── INIT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  initDropZones();
  initTagInputs();
  initReveal();

  /* Restore existing session if available */
  var saved = INTEL.load();
  if (saved && saved.analysis) {
    var banner = document.getElementById('restore-banner');
    if (banner) banner.classList.add('show');
  }

  /* Pre-fill name if we have it */
  if (saved && saved.profile && saved.profile.name) {
    var nameInp = document.getElementById('inp-name');
    if (nameInp) nameInp.value = saved.profile.name;
  }

  /* Enter key in chat */
  var chatInp = document.getElementById('chat-inp');
  if (chatInp) chatInp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMsg(); }
  });

  /* Clear inp-error on typing */
  document.querySelectorAll('.inp-clear-err').forEach(function(el) {
    el.addEventListener('input', function() { this.classList.remove('inp-error'); });
  });
});


/* ── HELPERS called from HTML ────────────────────────────────── */
function dismissRestore() {
  var b = document.getElementById('restore-banner');
  if (b) b.classList.remove('show');
  localStorage.setItem('dt_dismiss_restore','1');
}

function updateChatSidebar() {
  var a = STATE.data.analysis;
  var p = STATE.data.profile;
  var nameEl = document.getElementById('cpc-name');
  var scoreEl = document.getElementById('cpc-score');
  var careerEl = document.getElementById('cpc-career');
  if (nameEl) nameEl.textContent = p.name || 'Not set';
  if (scoreEl) scoreEl.textContent = a ? a.confidenceScore + '%' : 'Pending';
  if (careerEl) careerEl.textContent = (a && a.careerPaths && a.careerPaths[0]) ? a.careerPaths[0].title : 'Pending analysis';
}

// Patch showView to update sidebar when entering chat
var _showViewOrig = showView;
showView = function(id) {
  _showViewOrig(id);
  if (id === 'view-chat') updateChatSidebar();
};

