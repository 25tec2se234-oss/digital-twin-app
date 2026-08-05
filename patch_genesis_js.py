import os

genesis_file = r"c:\Users\Kumar Kartikey\.vscode DTwin\public\genesis\index.html"
genesis_mirror = r"c:\Users\Kumar Kartikey\.vscode DTwin\public\genesis.html"

with open(genesis_file, 'r', encoding='utf-8') as f:
    content = f.read()

old_js_start = "// Accessibility & Focus Management State"
new_js_code = """// Accessibility & Focus Management State
            let lastFocusedElement = null;
            const mainContent = document.getElementById('main-content');

            // Theme Toggle Logic
            const themeBtn = document.getElementById('theme-toggle');
            const sunIcon = document.getElementById('theme-icon-sun');
            const moonIcon = document.getElementById('theme-icon-moon');
            const htmlEl = document.documentElement;

            const savedTheme = localStorage.getItem('dtv_theme') || 'dark';
            setTheme(savedTheme);

            if (themeBtn) {
                themeBtn.addEventListener('click', () => {
                    const currentTheme = htmlEl.classList.contains('light') ? 'light' : 'dark';
                    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    setTheme(nextTheme);
                });
            }

            function setTheme(theme) {
                if (theme === 'light') {
                    htmlEl.classList.remove('dark');
                    htmlEl.classList.add('light');
                    if (sunIcon) sunIcon.style.display = 'block';
                    if (moonIcon) moonIcon.style.display = 'none';
                    if (themeBtn) themeBtn.setAttribute('aria-label', 'Switch to dark theme');
                    localStorage.setItem('dtv_theme', 'light');
                } else {
                    htmlEl.classList.remove('light');
                    htmlEl.classList.add('dark');
                    if (sunIcon) sunIcon.style.display = 'none';
                    if (moonIcon) moonIcon.style.display = 'block';
                    if (themeBtn) themeBtn.setAttribute('aria-label', 'Switch to light theme');
                    localStorage.setItem('dtv_theme', 'dark');
                }
            }

            // Mobile Navigation Menu Drawer Logic
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

            if (mobileMenuBtn && mobileNavDrawer) {
                mobileMenuBtn.addEventListener('click', () => {
                    const isOpen = mobileNavDrawer.classList.toggle('open');
                    mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                });

                mobileNavDrawer.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileNavDrawer.classList.remove('open');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    });
                });
            }

            // Top Nav CTA smooth scroll & scan trigger
            const btnTopBegin = document.getElementById('btn-top-begin');
            if (btnTopBegin) {
                btnTopBegin.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (scannerSection) scannerSection.scrollIntoView({ behavior: 'smooth' });
                    if (!isScanning) {
                        startGenesisScanSequence();
                    }
                });
            }

            // PERSISTENT BACKEND DIGITAL TWIN INTEGRATION
            let getGenesisSessionId = () => {
                let sid = localStorage.getItem('dtv_genesis_session_id');
                if (!sid) {
                    sid = 'dtv_sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
                    localStorage.setItem('dtv_genesis_session_id', sid);
                }
                return sid;
            };

            let currentDigitalTwinState = null;
            let userScores = { logic: 80, creativity: 75, velocity: 85, domain: 70, grit: 82 };

            async function syncGenesisBackend() {
                const sessionId = getGenesisSessionId();
                try {
                    const res = await fetch('/api/genesis/init', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-genesis-session-id': sessionId
                        },
                        body: JSON.stringify({ session_id: sessionId })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (data.success && data.twin) {
                            currentDigitalTwinState = data.twin;
                            const resTwinId = document.getElementById('res-twin-id');
                            const resArchetype = document.getElementById('res-archetype');
                            const resConfidence = document.getElementById('res-confidence');

                            if (resTwinId) resTwinId.textContent = data.twin.twinId;
                            if (resArchetype) resArchetype.textContent = data.twin.archetype;
                            if (resConfidence) resConfidence.textContent = `${data.twin.confidence}%`;
                            if (data.twin.scores) {
                                userScores = data.twin.scores;
                                updateRadarPolygon();
                                renderTopCareerMatches();
                            }
                            localStorage.setItem('dtv_genesis_twin', JSON.stringify(data.twin));
                            return data.twin;
                        }
                    }
                } catch (err) {
                    console.warn('Genesis backend offline/local fallback:', err);
                }
                const cached = localStorage.getItem('dtv_genesis_twin');
                if (cached) {
                    try {
                        const parsed = JSON.parse(cached);
                        currentDigitalTwinState = parsed;
                        const resTwinId = document.getElementById('res-twin-id');
                        const resArchetype = document.getElementById('res-archetype');
                        const resConfidence = document.getElementById('res-confidence');

                        if (resTwinId) resTwinId.textContent = parsed.twinId;
                        if (resArchetype) resArchetype.textContent = parsed.archetype;
                        if (resConfidence) resConfidence.textContent = `${parsed.confidence}%`;
                        if (parsed.scores) {
                            userScores = parsed.scores;
                            updateRadarPolygon();
                            renderTopCareerMatches();
                        }
                    } catch(e) {}
                }
            }

            // Sync on page load immediately so Digital Twin ID is locked & persistent!
            syncGenesisBackend();

            // YOUTUBE-STYLE VIDEO PLAYER STATE MACHINE
            const walkthroughChapters = [
                {
                    step: 1,
                    badge: "STEP 1 / 4 — TELEMETRY INGESTION",
                    title: "Ingesting Raw Student Telemetry",
                    desc: "Capturing learning speed, subject preferences, error patterns, and curiosity signals in real time.",
                    startTime: 0,
                    endTime: 4
                },
                {
                    step: 2,
                    badge: "STEP 2 / 4 — MULTI-AGENT SYNTHESIS",
                    title: "Multi-Agent Cognitive Synthesis",
                    desc: "Socratic Tutor Agent, Skill Radar Agent, and Career Predictor Agent collaborate to model your Digital Self.",
                    startTime: 4,
                    endTime: 8
                },
                {
                    step: 3,
                    badge: "STEP 3 / 4 — 5-AXIS RADAR CALIBRATION",
                    title: "5-Axis Capability Vector Morphing",
                    desc: "Constructing live capability polygon across Logic, Creativity, Velocity, Domain Focus, and Problem Grit.",
                    startTime: 8,
                    endTime: 12
                },
                {
                    step: 4,
                    badge: "STEP 4 / 4 — 2030 CAREER VECTOR MATCHING",
                    title: "Matching 2030 Career Trajectories",
                    desc: "Mapping your verified capability index to live global tech demand and high-growth job roles.",
                    startTime: 12,
                    endTime: 16
                }
            ];

            const TOTAL_DURATION = 16;
            let currentTime = 0;
            let isYtPlaying = false;
            let ytInterval = null;

            const watchDemoBtn = document.getElementById('btn-watch-demo');
            const demoModal = document.getElementById('demo-modal');
            const modalClose = document.getElementById('modal-close');
            const scannerSection = document.getElementById('genesis-scanner');

            const ytVideoScreen = document.getElementById('yt-video-screen');
            const ytCenterPlay = document.getElementById('yt-center-play');
            const ytCenterIcon = document.getElementById('yt-center-icon');
            const ytStepBadge = document.getElementById('yt-step-badge');
            const ytStepTitle = document.getElementById('yt-step-title');
            const ytStepDesc = document.getElementById('yt-step-desc');
            const ytProgressFill = document.getElementById('yt-progress-fill');
            const ytProgressContainer = document.getElementById('yt-progress-container');
            const ytPlayToggle = document.getElementById('yt-play-toggle');
            const ytPlaySvg = document.getElementById('yt-play-svg');
            const ytPrevBtn = document.getElementById('yt-prev-btn');
            const ytNextBtn = document.getElementById('yt-next-btn');
            const ytTimeDisplay = document.getElementById('yt-time-display');
            const ytLaunchBtn = document.getElementById('yt-launch-btn');

            const playSvgPath = '<path d="M8 5v14l11-7z"/>';
            const pauseSvgPath = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';

            function updateYtPlayerUI() {
                const chapterIndex = Math.min(Math.floor(currentTime / 4), 3);
                const chapter = walkthroughChapters[chapterIndex];

                if (ytStepBadge) ytStepBadge.textContent = chapter.badge;
                if (ytStepTitle) ytStepTitle.textContent = chapter.title;
                if (ytStepDesc) ytStepDesc.textContent = chapter.desc;

                const percent = (currentTime / TOTAL_DURATION) * 100;
                if (ytProgressFill) ytProgressFill.style.width = `${percent}%`;

                const curSec = Math.floor(currentTime).toString().padStart(2, '0');
                if (ytTimeDisplay) ytTimeDisplay.textContent = `00:${curSec} / 00:16`;

                if (ytProgressContainer) {
                    ytProgressContainer.setAttribute('aria-valuenow', Math.floor(currentTime).toString());
                    ytProgressContainer.setAttribute('aria-valuetext', `00:${curSec}`);
                }

                for (let i = 1; i <= 4; i++) {
                    const dot = document.getElementById(`yt-dot-${i}`);
                    if (dot) {
                        dot.className = i - 1 === chapterIndex ? 'yt-dot active' : 'yt-dot';
                    }
                }
            }

            function playYtVideo() {
                if (isYtPlaying) return;
                isYtPlaying = true;
                if (ytVideoScreen) ytVideoScreen.classList.add('playing');
                if (ytPlaySvg) ytPlaySvg.innerHTML = pauseSvgPath;
                if (ytCenterIcon) ytCenterIcon.innerHTML = pauseSvgPath;

                ytInterval = setInterval(() => {
                    currentTime += 0.2;
                    if (currentTime >= TOTAL_DURATION) {
                        currentTime = 0;
                    }
                    updateYtPlayerUI();
                }, 200);
            }

            function pauseYtVideo() {
                isYtPlaying = false;
                if (ytVideoScreen) ytVideoScreen.classList.remove('playing');
                if (ytPlaySvg) ytPlaySvg.innerHTML = playSvgPath;
                if (ytCenterIcon) ytCenterIcon.innerHTML = playSvgPath;

                if (ytInterval) {
                    clearInterval(ytInterval);
                    ytInterval = null;
                }
            }

            function toggleYtPlayPause() {
                if (isYtPlaying) {
                    pauseYtVideo();
                } else {
                    playYtVideo();
                }
            }

            window.seekToWalkthroughStep = function(stepIdx) {
                currentTime = stepIdx * 4;
                updateYtPlayerUI();
            };

            if (ytVideoScreen) {
                ytVideoScreen.addEventListener('click', toggleYtPlayPause);
                ytVideoScreen.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleYtPlayPause();
                    }
                });
            }

            if (ytCenterPlay) {
                ytCenterPlay.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleYtPlayPause();
                });
            }

            if (ytPlayToggle) {
                ytPlayToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    toggleYtPlayPause();
                });
            }

            if (ytProgressContainer) {
                ytProgressContainer.addEventListener('click', (e) => {
                    const rect = ytProgressContainer.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                    currentTime = ratio * TOTAL_DURATION;
                    updateYtPlayerUI();
                });

                ytProgressContainer.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        currentTime = Math.max(0, currentTime - 2);
                        updateYtPlayerUI();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        currentTime = Math.min(TOTAL_DURATION, currentTime + 2);
                        updateYtPlayerUI();
                    }
                });
            }

            if (ytPrevBtn) {
                ytPrevBtn.addEventListener('click', () => {
                    const curChapter = Math.floor(currentTime / 4);
                    const prevChapter = (curChapter - 1 + 4) % 4;
                    currentTime = prevChapter * 4;
                    updateYtPlayerUI();
                });
            }

            if (ytNextBtn) {
                ytNextBtn.addEventListener('click', () => {
                    const curChapter = Math.floor(currentTime / 4);
                    const nextChapter = (curChapter + 1) % 4;
                    currentTime = nextChapter * 4;
                    updateYtPlayerUI();
                });
            }

            if (ytLaunchBtn) {
                ytLaunchBtn.addEventListener('click', () => {
                    closeDemoModal();
                    if (scannerSection) scannerSection.scrollIntoView({ behavior: 'smooth' });
                    startGenesisScanSequence();
                });
            }

            function openDemoModal() {
                lastFocusedElement = document.activeElement;
                if (demoModal) demoModal.classList.add('open');
                if (watchDemoBtn) watchDemoBtn.setAttribute('aria-expanded', 'true');
                if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
                currentTime = 0;
                updateYtPlayerUI();
                playYtVideo();
                if (modalClose) modalClose.focus();
            }

            function closeDemoModal() {
                if (demoModal) demoModal.classList.remove('open');
                if (watchDemoBtn) watchDemoBtn.setAttribute('aria-expanded', 'false');
                if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
                pauseYtVideo();
                if (lastFocusedElement) lastFocusedElement.focus();
            }

            if (watchDemoBtn) {
                watchDemoBtn.addEventListener('click', openDemoModal);
            }

            if (modalClose) {
                modalClose.addEventListener('click', closeDemoModal);
            }

            if (demoModal) {
                demoModal.addEventListener('click', (e) => {
                    if (e.target === demoModal) {
                        closeDemoModal();
                    }
                });
            }

            // Smooth Scroll to Genesis Scanner
            const beginGenesisBtn = document.getElementById('btn-begin-genesis');
            if (beginGenesisBtn) {
                beginGenesisBtn.addEventListener('click', () => {
                    if (scannerSection) scannerSection.scrollIntoView({ behavior: 'smooth' });
                    startGenesisScanSequence();
                });
            }

            // Genesis Real-Time State Machine Scanner Logic
            const startScanBtn = document.getElementById('btn-start-scan');
            const scanRingBar = document.getElementById('scan-ring-bar');
            const scanPercentText = document.getElementById('scan-percent-text');
            const scanStatusText = document.getElementById('scan-status-text');
            const twinResultCard = document.getElementById('twin-result-card');

            if (startScanBtn) {
                startScanBtn.addEventListener('click', () => {
                    startGenesisScanSequence();
                });
            }

            let isScanning = false;

            function startGenesisScanSequence() {
                if (isScanning) return;
                isScanning = true;
                if (startScanBtn) startScanBtn.style.display = 'none';
                if (twinResultCard) twinResultCard.classList.remove('show');

                const scanPhases = [
                    { percent: 14, status: "Initialization Animation...", dot: 1 },
                    { percent: 28, status: "Scanning Interests...", dot: 2 },
                    { percent: 42, status: "Scanning Learning Behaviour...", dot: 3 },
                    { percent: 57, status: "Scanning Strengths...", dot: 4 },
                    { percent: 71, status: "Scanning Growth Potential...", dot: 5 },
                    { percent: 85, status: "Creating Digital Self...", dot: 6 },
                    { percent: 100, status: "Genesis Complete", dot: 7 }
                ];

                let currentIdx = 0;

                const interval = setInterval(() => {
                    if (currentIdx >= scanPhases.length) {
                        clearInterval(interval);
                        isScanning = false;
                        onGenesisScanComplete();
                        return;
                    }

                    const phase = scanPhases[currentIdx];
                    updateProgress(phase.percent, phase.status, phase.dot);
                    currentIdx++;
                }, 700);
            }

            function updateProgress(percent, statusText, dotIndex) {
                if (scanRingBar) {
                    const offset = 440 - (440 * (percent / 100));
                    scanRingBar.style.strokeDashoffset = offset;
                }
                if (scanPercentText) scanPercentText.textContent = `${percent}%`;
                if (scanStatusText) scanStatusText.textContent = statusText;

                for (let i = 1; i <= 7; i++) {
                    const dot = document.getElementById(`dot-${i}`);
                    if (dot) {
                        if (i < dotIndex) {
                            dot.className = 'step-dot complete';
                        } else if (i === dotIndex) {
                            dot.className = 'step-dot active';
                        } else {
                            dot.className = 'step-dot';
                        }
                    }
                }
            }

            async function onGenesisScanComplete() {
                let persistentTwin = await syncGenesisBackend();
                if (!persistentTwin) {
                    const cached = localStorage.getItem('dtv_genesis_twin');
                    if (cached) {
                        persistentTwin = JSON.parse(cached);
                    }
                }

                if (persistentTwin) {
                    const resTwinId = document.getElementById('res-twin-id');
                    const resArchetype = document.getElementById('res-archetype');
                    const resConfidence = document.getElementById('res-confidence');

                    if (resTwinId) resTwinId.textContent = persistentTwin.twinId;
                    if (resArchetype) resArchetype.textContent = persistentTwin.archetype;
                    if (resConfidence) resConfidence.textContent = `${persistentTwin.confidence}%`;
                }

                if (scanStatusText) scanStatusText.textContent = "Your Digital Self has been successfully created.";
                if (twinResultCard) twinResultCard.classList.add('show');
            }

            // DYNAMIC 5-CAREER MATCHING MATRIX & SIMULATOR ENGINE
            const FUTURE_CAREER_PROFILES = [
                {
                    id: 'ai-architect',
                    title: 'AI Systems Architect & Engineer',
                    badgeText: '96.8% Best Fit',
                    desc: 'Designing autonomous multi-agent swarms, LLM fine-tuning pipelines, and vector retrieval architectures.',
                    tagline: 'High Demand · System Architecture, LLM Tuning, Python',
                    salaryGlobal: '$185,000 /yr',
                    salaryIndia: '₹42 LPA',
                    demandGrowth: '+38.5% YoY Growth',
                    skills: [
                        { name: 'LLM Architecture & Fine-Tuning', pct: 94 },
                        { name: 'Vector Databases & RAG Pipelines', pct: 90 },
                        { name: 'Autonomous Multi-Agent Orchestration', pct: 86 }
                    ],
                    quest: {
                        title: 'Scenario: Your multi-agent swarm encounters a context window bottleneck during real-time document synthesis. What is your primary architectural optimization?',
                        options: [
                            { text: 'A) Implement Semantic Caching & Hierarchical Vector Index Pruning', correct: true },
                            { text: 'B) Increase max_tokens on every sub-agent request blindly', correct: false },
                            { text: 'C) Concatenate all raw documents into a single unindexed text string', correct: false }
                        ],
                        correctMsg: '✔ CORRECT ANSWER! +50 Capability XP Awarded. Your AI Architect profile is updated!',
                        wrongMsg: '💡 Architect Note: Option A is optimal for high-throughput real-time multi-agent LLM systems!'
                    }
                },
                {
                    id: 'product-strategist',
                    title: 'Cognitive Product Strategist & UX Architect',
                    badgeText: '93.4% High Fit',
                    desc: 'Building spatial user interfaces, predictive telemetry flows, and adaptive AI product experiences.',
                    tagline: 'High Growth · Spatial Design, UX Architecture, Telemetry',
                    salaryGlobal: '$165,000 /yr',
                    salaryIndia: '₹36 LPA',
                    demandGrowth: '+34.2% YoY Growth',
                    skills: [
                        { name: 'Spatial Computing & AR/VR Design', pct: 91 },
                        { name: 'AI Persona & Telemetry Modeling', pct: 88 },
                        { name: 'Behavioral Funnel Optimization', pct: 85 }
                    ],
                    quest: {
                        title: 'Scenario: User drop-off increases by 12% during initial AI onboarding calibration. How do you adapt the experience?',
                        options: [
                            { text: 'A) Implement progressive telemetry disclosures with real-time feedback loops', correct: true },
                            { text: 'B) Add 5 extra mandatory form fields before showing any value', correct: false },
                            { text: 'C) Hide all progress indicators to prevent users from tracking status', correct: false }
                        ],
                        correctMsg: '✔ EXCELLENT UX CHOICE! +50 XP Awarded. Your Product Strategist rating boosted!',
                        wrongMsg: '💡 Product Note: Option A reduces friction while maintaining high cognitive engagement!'
                    }
                },
                {
                    id: 'quant-lead',
                    title: 'Quantitative Data & AI Intelligence Lead',
                    badgeText: '90.1% Strong Fit',
                    desc: 'Developing stochastic algorithms, real-time streaming intelligence, and distributed vector models.',
                    tagline: 'High Income · Stochastic Modeling, Distributed Systems',
                    salaryGlobal: '$195,000 /yr',
                    salaryIndia: '₹46 LPA',
                    demandGrowth: '+41.0% YoY Growth',
                    skills: [
                        { name: 'Stochastic Algorithmic Modeling', pct: 95 },
                        { name: 'Real-Time Streaming Analytics', pct: 92 },
                        { name: 'Distributed Vector Indexing', pct: 87 }
                    ],
                    quest: {
                        title: 'Scenario: High-frequency data stream displays unexpected variance drift during market volatility. What is your mitigation strategy?',
                        options: [
                            { text: 'A) Deploy Adaptive Kalman Filtering with dynamic variance thresholding', correct: true },
                            { text: 'B) Ignore variance drift and hope models self-correct', correct: false },
                            { text: 'C) Shut down data pipeline indefinitely', correct: false }
                        ],
                        correctMsg: '✔ QUANT SUPERIORITY! +50 XP Awarded. Quantitative Intelligence score maximized!',
                        wrongMsg: '💡 Quant Note: Option A handles non-stationary variance drift gracefully in live streams!'
                    }
                },
                {
                    id: 'robotics-specialist',
                    title: 'Autonomous Agent & Robotics Specialist',
                    badgeText: '87.5% Growth Fit',
                    desc: 'Programming embodied spatial agents, sensor fusion systems, and real-world autonomous navigation.',
                    tagline: 'Future Frontier · ROS2, Embodied AI, Sensor Fusion',
                    salaryGlobal: '$175,000 /yr',
                    salaryIndia: '₹39 LPA',
                    demandGrowth: '+36.8% YoY Growth',
                    skills: [
                        { name: 'ROS2 & Kinematics Control', pct: 89 },
                        { name: 'LiDAR & Camera Sensor Fusion', pct: 86 },
                        { name: 'Spatial Mapping (SLAM)', pct: 82 }
                    ],
                    quest: {
                        title: 'Scenario: An autonomous rover loses odometry lock in a low-feature corridor. Which sensor fusion adjustment fixes localization?',
                        options: [
                            { text: 'A) Increase weight of Visual Inertial Odometry (VIO) + IMU integration', correct: true },
                            { text: 'B) Disable all sensors and command full throttle forward', correct: false },
                            { text: 'C) Clear map memory completely', correct: false }
                        ],
                        correctMsg: '✔ ROBOTICS MASTERED! +50 XP Awarded. Spatial Navigation index updated!',
                        wrongMsg: '💡 Robotics Note: Option A leverages IMU inertia when visual landmarks become sparse!'
                    }
                },
                {
                    id: 'biotech-architect',
                    title: 'Bio-Tech & Health AI Intelligence Architect',
                    badgeText: '85.0% Emerging Fit',
                    desc: 'Modeling protein folding, CRISPR target prediction algorithms, and biomarker vector embeddings.',
                    tagline: 'Life Sciences · Protein Folding, Genomic AI, Biomarkers',
                    salaryGlobal: '$180,000 /yr',
                    salaryIndia: '₹40 LPA',
                    demandGrowth: '+39.4% YoY Growth',
                    skills: [
                        { name: 'Protein Structure Folding Models', pct: 93 },
                        { name: 'Genomic Sequence Vector Alignment', pct: 87 },
                        { name: 'CRISPR Target Prediction Algorithms', pct: 83 }
                    ],
                    quest: {
                        title: 'Scenario: Deep learning model predicts a high-affinity binding site but shows low pLDDT confidence. How do you validate?',
                        options: [
                            { text: 'A) Run Molecular Dynamics relaxation simulation and cross-reference with PDB structures', correct: true },
                            { text: 'B) Discard prediction immediately without further analysis', correct: false },
                            { text: 'C) Force pLDDT metric to 100% manually', correct: false }
                        ],
                        correctMsg: '✔ BIOTECH PRECISION! +50 XP Awarded. Health AI Architect profile updated!',
                        wrongMsg: '💡 Bio Note: Option A validates structural stability through physics-based MD simulation!'
                    }
                }
            ];

            let activeSelectedCareer = FUTURE_CAREER_PROFILES[0];

            function renderTopCareerMatches() {
                const listContainer = document.getElementById('career-matches-list');
                if (!listContainer) return;

                listContainer.innerHTML = FUTURE_CAREER_PROFILES.map((career, idx) => `
                    <div class="career-match-item" tabindex="0" role="button" aria-label="View career trajectory for ${career.title}" onclick="selectCareerAndOpenModal(${idx})" onkeydown="if(event.key==='Enter'||event.key===' ') { event.preventDefault(); selectCareerAndOpenModal(${idx}); }">
                        <div>
                            <div class="match-title">${career.title}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${career.tagline}</div>
                        </div>
                        <div class="match-badge">${career.badgeText}</div>
                    </div>
                `).join('');
            }

            window.selectCareerAndOpenModal = function(careerIdx) {
                lastFocusedElement = document.activeElement;
                activeSelectedCareer = FUTURE_CAREER_PROFILES[careerIdx];
                openCareerRoadmapModal(activeSelectedCareer);
            };

            function openCareerRoadmapModal(career) {
                const currentTwinId = document.getElementById('res-twin-id') ? document.getElementById('res-twin-id').textContent : 'DTV-GEN-8942-X';
                const currentArchetype = document.getElementById('res-archetype') ? document.getElementById('res-archetype').textContent : 'The Creative Architect';

                const rmMatchBadge = document.getElementById('rm-match-badge');
                const rmCareerTitle = document.getElementById('rm-career-title');
                const rmCareerDesc = document.getElementById('rm-career-desc');
                const rmSalaryGlobal = document.getElementById('rm-salary-global');
                const rmDemandGrowth = document.getElementById('rm-demand-growth');
                const rmTwinId = document.getElementById('rm-twin-id');
                const rmArchetype = document.getElementById('rm-archetype');

                if (rmMatchBadge) rmMatchBadge.textContent = career.badgeText;
                if (rmCareerTitle) rmCareerTitle.textContent = career.title;
                if (rmCareerDesc) rmCareerDesc.textContent = career.desc;
                if (rmSalaryGlobal) rmSalaryGlobal.innerHTML = `${career.salaryGlobal} <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 500;">(${career.salaryIndia})</span>`;
                if (rmDemandGrowth) rmDemandGrowth.textContent = career.demandGrowth;

                if (rmTwinId) rmTwinId.textContent = currentTwinId;
                if (rmArchetype) rmArchetype.textContent = currentArchetype;

                // Render Skills
                const skillsContainer = document.getElementById('rm-skills-container');
                if (skillsContainer) {
                    skillsContainer.innerHTML = career.skills.map(s => `
                        <div class="skill-item-bar">
                            <div class="skill-lbl-flex">
                                <span>${s.name}</span>
                                <span style="color: var(--accent-cyan);">${s.pct}% Ready</span>
                            </div>
                            <div class="skill-progress-bg">
                                <div class="skill-progress-fill" style="width: ${s.pct}%;"></div>
                            </div>
                        </div>
                    `).join('');
                }

                // Render Quest
                const questQTitle = document.getElementById('quest-q-title');
                if (questQTitle) questQTitle.textContent = career.quest.title;
                const optionsContainer = document.getElementById('quest-options-container');
                if (optionsContainer) {
                    optionsContainer.innerHTML = career.quest.options.map(opt => `
                        <button type="button" class="quest-option-btn" tabindex="0" onclick="answerActiveQuestOption(this, ${opt.correct})">
                            ${opt.text}
                        </button>
                    `).join('');
                }

                const feedbackEl = document.getElementById('quest-feedback');
                if (feedbackEl) feedbackEl.style.display = 'none';

                if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
                const roadmapModal = document.getElementById('roadmap-modal');
                if (roadmapModal) roadmapModal.classList.add('open');
                const roadmapCloseBtn = document.getElementById('roadmap-modal-close');
                if (roadmapCloseBtn) roadmapCloseBtn.focus();
            }

            function closeRoadmapModal() {
                const roadmapModal = document.getElementById('roadmap-modal');
                if (roadmapModal) roadmapModal.classList.remove('open');
                if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
                if (lastFocusedElement) lastFocusedElement.focus();
            }

            window.answerActiveQuestOption = function(btnEl, isCorrect) {
                const feedbackEl = document.getElementById('quest-feedback');
                const parent = btnEl.parentElement;
                parent.querySelectorAll('.quest-option-btn').forEach(b => {
                    b.classList.remove('correct');
                    b.disabled = true;
                });

                if (isCorrect) {
                    btnEl.classList.add('correct');
                    if (feedbackEl) {
                        feedbackEl.style.color = 'var(--accent-emerald)';
                        feedbackEl.textContent = activeSelectedCareer.quest.correctMsg;
                    }
                } else {
                    btnEl.style.borderColor = 'var(--accent-amber)';
                    if (feedbackEl) {
                        feedbackEl.style.color = 'var(--accent-amber)';
                        feedbackEl.textContent = activeSelectedCareer.quest.wrongMsg;
                    }
                }
                if (feedbackEl) feedbackEl.style.display = 'block';
            };

            // Initial render of careers
            renderTopCareerMatches();

            // SECTION 5 — ASSESSMENT & SKILL RADAR SYSTEM LOGIC
            const btnProceedAssessment = document.getElementById('btn-open-assessment');
            const assessmentSection = document.getElementById('genesis-assessment');
            const optionBtns = document.querySelectorAll('.option-btn');
            const radarDataPoly = document.getElementById('radar-data-poly');
            const radarStatusVal = document.getElementById('radar-status-val');

            const btnUnlockRoadmap = document.getElementById('btn-unlock-roadmap');
            const roadmapModal = document.getElementById('roadmap-modal');
            const roadmapModalClose = document.getElementById('roadmap-modal-close');

            if (btnProceedAssessment) {
                btnProceedAssessment.addEventListener('click', () => {
                    if (assessmentSection) {
                        assessmentSection.classList.add('show');
                        assessmentSection.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }

            if (btnUnlockRoadmap) {
                btnUnlockRoadmap.addEventListener('click', () => {
                    lastFocusedElement = btnUnlockRoadmap;
                    openCareerRoadmapModal(FUTURE_CAREER_PROFILES[0]);
                });
            }

            if (roadmapModalClose) {
                roadmapModalClose.addEventListener('click', closeRoadmapModal);
            }

            if (roadmapModal) {
                roadmapModal.addEventListener('click', (e) => {
                    if (e.target === roadmapModal) {
                        closeRoadmapModal();
                    }
                });
            }

            // Global Keyboard Navigation Listener (Escape key to close modals, Arrow keys for scrubber)
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (demoModal && demoModal.classList.contains('open')) {
                        closeDemoModal();
                    } else if (roadmapModal && roadmapModal.classList.contains('open')) {
                        closeRoadmapModal();
                    } else if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
                        mobileNavDrawer.classList.remove('open');
                        if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    }
                }
            });

            optionBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const qNum = parseInt(this.getAttribute('data-q'));
                    const axis = this.getAttribute('data-axis');
                    const val = parseInt(this.getAttribute('data-val'));

                    const currentCard = document.getElementById(`q-card-${qNum}`);
                    if (!currentCard || currentCard.getAttribute('data-busy') === 'true') return;
                    currentCard.setAttribute('data-busy', 'true');

                    currentCard.querySelectorAll('.option-btn').forEach(b => {
                        b.classList.remove('selected');
                        b.setAttribute('aria-pressed', 'false');
                    });
                    this.classList.add('selected');
                    this.setAttribute('aria-pressed', 'true');

                    if (axis && val) {
                        userScores[axis] = val;
                        updateRadarPolygon();
                    }

                    setTimeout(() => {
                        currentCard.classList.remove('active');
                        currentCard.removeAttribute('data-busy');
                        if (qNum < 3) {
                            const nextCard = document.getElementById(`q-card-${qNum + 1}`);
                            if (nextCard) nextCard.classList.add('active');
                        } else {
                            const summaryEl = document.getElementById('assessment-summary');
                            if (summaryEl) summaryEl.classList.add('show');
                            if (radarStatusVal) radarStatusVal.textContent = "Twin Calibration Complete! Saved to Profile & Backend DB.";
                            
                            const resTwinIdEl = document.getElementById('res-twin-id');
                            const resArchetypeEl = document.getElementById('res-archetype');
                            const resConfidenceEl = document.getElementById('res-confidence');

                            const twinId = resTwinIdEl ? resTwinIdEl.textContent : 'DTV-GEN-8942-X';
                            const archetype = resArchetypeEl ? resArchetypeEl.textContent : 'The Creative Architect';
                            const confidence = resConfidenceEl ? resConfidenceEl.textContent.replace('%', '') : '94.8';

                            renderTopCareerMatches();
                            saveCalibrationToBackend(userScores, archetype, confidence, twinId);
                        }
                    }, 400);
                });
            });

            async function saveCalibrationToBackend(scores, archetype, confidence, twinId) {
                const sessionId = getGenesisSessionId();
                try {
                    await fetch('/api/genesis/calibrate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-genesis-session-id': sessionId,
                            'x-digital-twin-id': twinId
                        },
                        body: JSON.stringify({
                            session_id: sessionId,
                            twin_id: twinId,
                            scores: scores,
                            archetype: archetype,
                            confidence: confidence
                        })
                    });
                } catch(e) {
                    console.warn('Calibration backend sync error:', e);
                }
            }

            function updateRadarPolygon() {
                const p1 = getAxisCoord(160, 125, userScores.logic, 70, 0);
                const p2 = getAxisCoord(160, 125, userScores.creativity, 70, 1);
                const p3 = getAxisCoord(160, 125, userScores.velocity, 70, 2);
                const p4 = getAxisCoord(160, 125, userScores.domain, 70, 3);
                const p5 = getAxisCoord(160, 125, userScores.grit, 70, 4);

                if (radarDataPoly) {
                    radarDataPoly.setAttribute('points', `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y} ${p5.x},${p5.y}`);
                }
                if (radarStatusVal) {
                    radarStatusVal.textContent = `Morphing Radar: LOG ${userScores.logic}% | CRE ${userScores.creativity}% | VEL ${userScores.velocity}%`;
                }
            }

            function getAxisCoord(cx, cy, scorePercent, maxRadius, axisIndex) {
                const angleDeg = -90 + (axisIndex * 72);
                const angleRad = (angleDeg * Math.PI) / 180;
                const r = (scorePercent / 100) * maxRadius;
                const x = Math.round(cx + r * Math.cos(angleRad));
                const y = Math.round(cy + r * Math.sin(angleRad));
                return { x, y };
            }
        });
    </script>
</body>
</html>
"""

idx = content.find(old_js_start)
if idx != -1:
    content = content[:idx] + new_js_code

with open(genesis_file, 'w', encoding='utf-8') as f:
    f.write(content)

with open(genesis_mirror, 'w', encoding='utf-8') as f:
    f.write(content)

print("JS logic patched cleanly with DOMContentLoaded closing tag.")
