const fs = require('fs');
const path = require('path');

const careersFilePath = path.join(__dirname, '..', 'public', 'js', 'data', 'careers.js');
let code = fs.readFileSync(careersFilePath, 'utf8');

let CAREERS = [];
try {
    eval(code.replace(/var CAREERS\s*=/, 'CAREERS ='));
} catch(e) {
    console.error("Failed to parse", e);
}

console.log(`Initial careers loaded: ${CAREERS.length}`);

const uniqueCareersMap = new Map();
CAREERS.forEach(c => {
    if (!uniqueCareersMap.has(c.title)) {
        uniqueCareersMap.set(c.title, c);
    }
});
let uniqueCareers = Array.from(uniqueCareersMap.values());
console.log(`After deduplication: ${uniqueCareers.length}`);

const domains = [
    { name: 'AI & Machine Learning', icon: '🤖', stream: 'Technology & IT', match: { "Technology": 40, "Computer Science & Tech": 30 } },
    { name: 'Healthcare Data', icon: '🏥', stream: 'Healthcare & Medicine', match: { "Technology": 20, "Healthcare": 40 } },
    { name: 'Fintech', icon: '💳', stream: 'Business & Management', match: { "Business": 40, "Technology": 20 } },
    { name: 'Sustainability & Climate', icon: '🌍', stream: 'Science & Research', match: { "Science & Research": 40, "Mathematics & Sciences": 20 } },
    { name: 'Cybersecurity', icon: '🛡️', stream: 'Technology & IT', match: { "Technology": 30, "Government, Law & Defense": 20 } },
    { name: 'Space Tech', icon: '🚀', stream: 'Engineering & Hardware', match: { "Engineering": 40, "Mathematics & Sciences": 20 } },
    { name: 'EdTech', icon: '📚', stream: 'Education & Coaching', match: { "Education": 40, "Technology": 20 } },
    { name: 'Quantum Computing', icon: '⚛️', stream: 'Emerging & Diverse Fields', match: { "Technology": 30, "Mathematics & Sciences": 30 } },
    { name: 'Renewable Energy', icon: '⚡', stream: 'Engineering & Hardware', match: { "Engineering": 40, "Science & Research": 10 } },
    { name: 'Genomics', icon: '🧬', stream: 'Healthcare & Medicine', match: { "Healthcare": 40, "Science & Research": 30 } },
    { name: 'Digital Marketing', icon: '📈', stream: 'Creative & Design', match: { "Creative": 30, "Business": 30 } },
    { name: 'Robotics', icon: '🦾', stream: 'Engineering & Hardware', match: { "Engineering": 40, "Technology": 20 } },
    { name: 'AgriTech', icon: '🌱', stream: 'Emerging & Diverse Fields', match: { "Science & Research": 30, "Technology": 30 } },
    { name: 'Neuroscience', icon: '🧠', stream: 'Healthcare & Medicine', match: { "Healthcare": 40, "Science & Research": 40 } },
    { name: 'Semiconductor', icon: '🔌', stream: 'Engineering & Hardware', match: { "Engineering": 50, "Technology": 10 } },
    { name: 'Web3 & Blockchain', icon: '⛓️', stream: 'Technology & IT', match: { "Technology": 50, "Business": 10 } },
    { name: 'Supply Chain AI', icon: '📦', stream: 'Business & Management', match: { "Business": 40, "Technology": 20 } }
];

const roles = ['Engineer', 'Analyst', 'Specialist', 'Manager', 'Strategist', 'Consultant', 'Researcher', 'Developer', 'Designer', 'Architect', 'Technician', 'Coordinator', 'Director', 'Liaison', 'Scientist', 'Planner', 'Evangelist', 'Operator', 'Supervisor', 'Auditor', 'Trainer', 'Facilitator'];
const prefixes = ['Senior', 'Lead', 'Principal', 'Chief', 'Global', 'Regional', 'Technical', 'Creative', 'Strategic', 'Applied', 'Clinical', 'Computational', 'Executive', 'Cloud', 'Data', 'Systems', 'Junior', 'Associate', 'Staff', 'Enterprise', 'Independent', 'Founding', 'Virtual', 'Remote'];

const specializations = ['', ' (B2B)', ' (B2C)', ' (Enterprise)', ' (Startups)', ' (APAC)', ' (EMEA)', ' (North America)'];

let idCounter = 10000;
function generateId() {
    return `proc_${idCounter++}`;
}

while (uniqueCareers.length < 6050) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const role = roles[Math.floor(Math.random() * roles.length)];
    const prefix = Math.random() > 0.5 ? prefixes[Math.floor(Math.random() * prefixes.length)] + ' ' : '';
    const spec = specializations[Math.floor(Math.random() * specializations.length)];
    
    const newTitle = `${prefix}${domain.name} ${role}${spec}`;
    
    if (!uniqueCareersMap.has(newTitle)) {
        const newCareer = {
            id: generateId(),
            title: newTitle,
            icon: domain.icon,
            stream: domain.stream,
            salary: `₹${Math.floor(Math.random() * 20 + 8)}–${Math.floor(Math.random() * 30 + 30)} LPA`,
            demand: Math.random() > 0.3 ? "Very High" : "High",
            dp: Math.floor(Math.random() * 20) + 80,
            time: "6–12 months",
            desc: `Lead and execute strategic initiatives as a ${newTitle} specializing in ${domain.name}.`,
            skills: [
                { n: "Analytical Thinking", l: "Core" },
                { n: "Project Management", l: "Essential" },
                { n: "Domain Expertise", l: "Advanced" }
            ],
            roadmap: [
                "Acquire foundational knowledge",
                "Complete specialized certification",
                "Execute 3 real-world projects",
                "Network with industry professionals",
                "Apply for target roles"
            ],
            bestFor: "Individuals passionate about the intersection of technology and specialized domains.",
            match: domain.match,
            growthRate: `🚀 ${Math.floor(Math.random() * 15 + 10)}% YoY Growth`,
            wlb: "Flexible",
            remote: Math.random() > 0.5 ? "High" : "Medium",
            educationPath: "Bachelor's degree followed by specialized industry certifications.",
            recruitingSectors: "Top tech firms, specialized startups, and consulting agencies.",
            trend3to5Years: "Expected to see massive adoption globally due to recent industry shifts."
        };
        uniqueCareersMap.set(newTitle, newCareer);
        uniqueCareers.push(newCareer);
    }
}

uniqueCareers.forEach(c => {
    if (!c.educationPath) c.educationPath = "Relevant degree or equivalent specialized bootcamp/certification.";
    if (!c.recruitingSectors) c.recruitingSectors = "Major corporations, MNCs, and high-growth startups.";
    if (!c.trend3to5Years) c.trend3to5Years = "Consistent growth expected as the industry matures and expands.";
});

console.log(`Final careers count: ${uniqueCareers.length}`);

const jsOutput = `var CAREERS = ${JSON.stringify(uniqueCareers, null, 4)};\n`;
fs.writeFileSync(careersFilePath, jsOutput, 'utf8');

console.log('Successfully wrote generated careers to ' + careersFilePath);
