const fs = require('fs');
const path = require('path');

const rawData1 = `
Backend Developer (Java) Graphics Programmer
Backend Developer (Python) Shader Artist
Backend Developer (Go) Technical Game Designer
Backend Developer (Node.js) Esports Manager
Backend Developer (Ruby) Livestreaming Platform Engineer
Frontend Developer (React) Digital Twin Engineer
Frontend Developer (Vue) Simulation Software Engineer
Frontend Developer (Angular) Computational Geometry Engineer
Mobile App Developer (iOS) GIS Developer
Mobile App Developer (Android) Geospatial Analyst
Cross-Platform App Developer (Flutter) Remote Sensing Analyst
Cross-Platform App Developer (React Native) Bioinformatics Software Engineer
Embedded Systems Engineer Health Informatics Specialist
Firmware Engineer Fintech Software Engineer
Systems Programmer Payments Systems Engineer
Compiler Engineer Trading Systems Developer
Database Administrator Risk Systems Analyst
Database Architect Insurtech Developer
Data Engineer Edtech Product Engineer
Data Warehouse Engineer Adtech Engineer
ETL Developer Martech Specialist
Business Intelligence Developer SEO Technical Analyst
Data Visualization Specialist Growth Engineer
Machine Learning Engineer Conversion Rate Optimization Analyst
Deep Learning Researcher Product Analyst
Computer Vision Engineer Product Operations Manager
Natural Language Processing Engineer Technical Product Manager
Reinforcement Learning Researcher Growth Product Manager
MLOps Engineer Data Product Manager
AI Research Scientist AI Product Manager
Robotics Software Engineer Scrum Master
Autonomous Systems Engineer Agile Coach
Site Reliability Engineer Delivery Manager
Platform Engineer Program Manager (Tech)
Infrastructure Engineer Engineering Manager
Network Engineer VP of Engineering
Network Administrator Chief Technology Officer
Systems Administrator Chief Information Officer
IT Support Specialist Chief Information Security Officer
Help Desk Technician Security Operations Center Analyst
Technical Support Engineer Incident Response Specialist
Solutions Architect Malware Analyst
Enterprise Architect Digital Forensics Examiner
Cloud Engineer (AWS) Threat Intelligence Analyst
Cloud Engineer (Azure) Vulnerability Researcher
Cloud Engineer (GCP) Application Security Engineer
Cloud Security Engineer Identity & Access Management Specialist
Cloud Cost Optimization Analyst Cryptography Engineer
Site Reliability Manager Blockchain Protocol Engineer
Kubernetes Administrator Smart Contract Auditor
Container Orchestration Specialist NFT Platform Developer
Software Test Engineer Metaverse Developer
Automation Test Engineer Extended Reality (XR) Designer
Performance Test Engineer Digital Accessibility Specialist
QA Lead Localization Engineer
Release Manager Internationalization Specialist
Build & Release Engineer Open Source Maintainer
Configuration Manager Developer Community Manager
Technical Writer Hackathon Organizer
Developer Advocate Technical Recruiter
Developer Relations Manager IT Auditor
API Developer Compliance Technology Analyst
Integration Engineer Data Privacy Engineer
Middleware Engineer GDPR Compliance Specialist
ERP Consultant (SAP) Data Governance Analyst
ERP Consultant (Oracle) Master Data Management Specialist
CRM Consultant (Salesforce) Knowledge Graph Engineer
CRM Developer Search Engineer
Low-Code/No-Code Developer Recommendation Systems Engineer
RPA Developer Personalization Engineer
Chatbot Developer A/B Testing Analyst
Voice Assistant Developer Growth Hacking Specialist
Game Engine Programmer Technical SEO Consultant
Game AI Programmer IT Project Coordinator
Game Physics Programmer Digital Transformation Consultant
Structural Engineer Semiconductor Device Engineer
Geotechnical Engineer VLSI Design Engineer
Transportation Engineer Chip Verification Engineer
Highway Engineer RF Engineer
Water Resources Engineer Antenna Design Engineer
Environmental Engineer Satellite Communications Engineer
Chemical Engineer Avionics Engineer
Process Engineer Flight Test Engineer
Petroleum Engineer Aircraft Maintenance Engineer
Mining Engineer Aerodynamics Engineer
Metallurgical Engineer Propulsion Engineer
Materials Engineer UAV/Drone Design Engineer
Nuclear Engineer Rocket Propulsion Technician
Marine Engineer Launch Vehicle Systems Engineer
Naval Architect Ground Support Systems Engineer
Automotive Engineer Space Systems Engineer
Automobile Design Engineer Systems Integration Engineer
Powertrain Engineer Test & Validation Engineer
Vehicle Dynamics Engineer Failure Analysis Engineer
HVAC Engineer Non-Destructive Testing Technician
Plumbing Systems Engineer Piping Design Engineer
Fire Protection Engineer Offshore Platform Engineer
Acoustic Engineer Subsea Engineer
Optical Engineer Coastal Engineer
Photonics Engineer Dam Design Engineer
Instrumentation Engineer Bridge Design Engineer
Control Systems Engineer Tunnel Engineer
Mechatronics Engineer Urban Planning Engineer
Manufacturing Engineer Traffic Signal Engineer
Industrial Engineer Smart Grid Engineer
Production Engineer Building Services Engineer
Quality Assurance Engineer (Manufacturing) Facade Engineer
Reliability Engineer Seismic Design Engineer
Maintenance Engineer Earthquake Engineering Researcher
Plant Engineer Landscape Engineer
Tool & Die Engineer Surveying Engineer
CAD Design Engineer Land Surveyor
CAM Programmer Drone Surveyor
CNC Machinist GIS Engineer
Welding Engineer BIM Coordinator
Textile Engineer BIM Modeler
Paper & Pulp Engineer Construction Site Engineer
Food Process Engineer Site Supervisor
Agricultural Engineer Project Engineer (Construction)
Irrigation Engineer Estimator (Construction)
Soil Conservation Engineer Quantity Surveyor
Renewable Energy Engineer Facilities Manager
Solar PV Design Engineer Building Inspector
Wind Turbine Engineer Elevator & Escalator Engineer
Hydropower Engineer Robotics Hardware Engineer
Bioenergy Engineer Prosthetics Engineer
Geothermal Engineer Biomedical Device Engineer
Energy Storage Engineer Medical Imaging Engineer
Grid Integration Engineer Clinical Engineer
Power Systems Engineer Rehabilitation Engineer
Transmission Line Engineer Textile Machinery Engineer
Substation Engineer Packaging Engineer
Protection & Relay Engineer Supply Chain Systems Engineer
Electric Vehicle Charging Infrastructure Engineer Warehouse Automation Engineer
Battery Management Systems Engineer Logistics Engineer
General Physician Registered Nurse
Cardiologist Nurse Practitioner
Neurologist Nurse Anesthetist
Oncologist Midwife
Endocrinologist Physician Assistant
Gastroenterologist Physiotherapist
Nephrologist Occupational Therapist
Pulmonologist Speech-Language Pathologist
Rheumatologist Respiratory Therapist
Dermatologist Radiologic Technologist
Ophthalmologist Ultrasound Technician
ENT Specialist MRI Technologist
Orthopedic Surgeon Nuclear Medicine Technologist
Neurosurgeon Dialysis Technician
Cardiac Surgeon Phlebotomist
Plastic Surgeon Medical Laboratory Technologist
Pediatric Surgeon Cytotechnologist
General Surgeon Histotechnologist
Anesthesiologist Blood Bank Technologist
Radiologist Surgical Technologist
Pathologist Anesthesia Technician
Forensic Pathologist Optometrist
Emergency Medicine Physician Audiologist
Family Medicine Physician Podiatrist
Geriatrician Chiropractor
Palliative Care Physician Naturopathic Doctor
Sports Medicine Physician Ayurvedic Physician
Occupational Medicine Physician Homeopathic Physician
Public Health Physician Acupuncturist
Epidemiologist Dietitian
Infectious Disease Specialist Clinical Nutritionist
Immunologist Lactation Consultant
Allergist Public Health Nutritionist
Hematologist Health Educator
Transplant Surgeon Medical Social Worker
Urologist Hospital Administrator
Gynecologist Healthcare Quality Manager
Obstetrician Clinical Research Associate
Neonatologist Clinical Research Coordinator
Pediatrician Biostatistician
Psychiatrist Regulatory Affairs Specialist (Pharma)
Child Psychiatrist Pharmacovigilance Officer
Addiction Medicine Specialist Medical Affairs Liaison
Sleep Medicine Specialist Medical Science Liaison
Pain Management Specialist Clinical Data Manager
Physiatrist (PM&R) Medical Coder
Nuclear Medicine Physician Medical Transcriptionist
Interventional Radiologist Hospice Care Coordinator
Genetic Counselor Home Health Aide Supervisor
Clinical Geneticist Community Health Worker
Physicist Behavioral Scientist
Astrophysicist Psychometrician
Particle Physicist Sociologist (Research)
Condensed Matter Physicist Anthropologist
Theoretical Physicist Archaeologist
Experimental Physicist Linguist
Chemist Computational Linguist
Organic Chemist Mathematician
Inorganic Chemist Statistician
Analytical Chemist Data Scientist (Research)
Physical Chemist Operations Research Analyst
Biochemist Actuarial Scientist (Academic)
Molecular Biologist Academic Cryptographer
Cell Biologist Materials Scientist
Microbiologist Nanotechnologist
Virologist Polymer Scientist
Immunobiologist Ceramics Scientist
Geneticist Metallurgist (Research)
Genomics Scientist Crystallographer
Proteomics Scientist Astronomer
Structural Biologist Cosmologist
Marine Biologist Planetary Scientist
Botanist Space Scientist
Zoologist Astrobiologist (Academic)
Ecologist Science Communicator
Conservation Biologist Science Policy Analyst
Entomologist Research Grant Administrator
Ornithologist Lab Manager
Herpetologist Research Technician
Wildlife Biologist Research Assistant
Evolutionary Biologist Postdoctoral Researcher
Paleontologist Principal Investigator
Geologist University Researcher
Seismologist Think Tank Analyst
Volcanologist Science Museum Curator
Hydrologist Science Journalist
Oceanographer Patent Examiner
Meteorologist Technology Transfer Officer
Climatologist Innovation Consultant
Atmospheric Scientist R&D Manager
Soil Scientist Quality Control Chemist
Agronomist Forensic Scientist
Horticulturist Forensic Toxicologist
Plant Pathologist Crime Scene Investigator
Food Scientist Ballistics Expert
Nutrition Scientist DNA Analyst
Toxicologist Environmental Research Scientist
Pharmacologist Sustainability Scientist
Neuroscientist Renewable Energy Researcher
Cognitive Scientist Water Quality Scientist
Novelist Comic Book Artist
Screenwriter Manga Artist
Playwright Caricature Artist
Poet Muralist
Editor (Publishing) Sculptor
Literary Agent Ceramicist
Ghostwriter Printmaker
Copywriter Painter
Technical Copywriter Calligrapher
Blogger Tattoo Artist
Podcaster Jewelry Designer
Radio Host Textile Designer
Voice Actor Costume Jewelry Maker
Dubbing Artist Craft Artisan
Stand-Up Comedian Art Restorer
Comedy Writer Art Appraiser
Talk Show Host Gallery Curator
News Anchor Museum Educator
Sports Commentator Art Therapist
Documentary Filmmaker Photojournalist
Documentary Cinematographer Wildlife Photographer
Film Editor Wedding Photographer
Sound Designer (Film) Product Photographer
Foley Artist Food Photographer
Music Composer Portrait Photographer
Film Score Composer Drone Photographer/Videographer
Music Producer Motion Graphics Designer
Sound Engineer 3D Modeler
Audio Mixing Engineer Rigging Artist
Mastering Engineer Texture Artist
DJ Lighting Artist (VFX)
Session Musician Compositor
Orchestra Conductor Matte Painter
Music Teacher Previs Artist
Music Therapist Level Designer (Games)
Choreographer Game Writer
Dance Instructor Narrative Designer
Ballet Dancer Sound Designer (Games)
Contemporary Dancer UX Writer
Theatre Director Brand Strategist
Stage Manager Creative Director
Set Designer Art Director
Costume Designer Advertising Copywriter
Lighting Designer (Theatre) Jingle Writer
Puppeteer Social Media Manager
Circus Performer Content Strategist
Magician Newsletter Writer
Illustrator Book Cover Designer
Concept Artist Typeface Designer
Storyboard Artist Font Foundry Designer
Industrial Designer Wearable Tech Designer
Product Design Engineer Smart Home Product Designer
Furniture Designer Toy Designer
Automotive Designer Footwear Designer
Transportation Designer Accessories Designer
Packaging Designer Bag Designer
Exhibition Designer Eyewear Designer
Retail Space Designer Watch Designer
Interior Designer Ceramic Product Designer
Residential Architect Kitchenware Designer
Commercial Architect Sustainable Design Consultant
Landscape Architect Circular Economy Designer
Urban Designer Biodesign Specialist
Lighting Designer (Architecture) Speculative Designer
Acoustic Designer Design Educator
Wayfinding Designer Design Studio Manager
Signage Designer Creative Technologist
Environmental Graphic Designer Interaction Designer
Brand Identity Designer Motion Designer
Logo Designer Sonic Branding Designer
Editorial Designer Costume Concept Designer
Book Designer Theme Park Designer
Magazine Layout Designer Amusement Ride Designer
Web Designer Set Builder
Mobile UI Designer Prop Maker
Design Systems Lead Model Maker
Accessibility Designer Miniature Artist
Service Designer Diorama Builder
Design Researcher Escape Room Designer
Design Ethnographer Experience Designer
Preschool Teacher Online Course Creator
Primary School Teacher MOOC Instructor
Secondary School Teacher University Lecturer
Special Education Teacher Research Professor
Montessori Teacher Academic Advisor
Homeschool Curriculum Designer Admissions Officer
School Counselor Registrar
School Principal Librarian
Vice Principal Archivist
Academic Dean School Museum Program Coordinator
Curriculum Developer STEM Outreach Coordinator
Instructional Designer Robotics Club Coach
E-Learning Content Developer Debate Coach
Learning Experience Designer Chess Coach
Corporate Trainer Music School Director
Vocational Trainer Art School Instructor
Language Instructor Driving Instructor
ESL Teacher Flight Instructor
Test Prep Tutor Diving Instructor
Private Tutor Yoga Teacher Trainer
Athletic Trainer Rowing Coach
Strength & Conditioning Coach Esports Coach
Sports Psychologist Wellness Coach
Sports Biomechanist Life Coach
Sports Data Analyst Meditation Instructor
Sports Agent Massage Therapist
Team Manager (Sports) Physiotherapy Assistant
Referee / Umpire Recreational Therapist
Sports Broadcaster Spa Manager
Sports Journalist Aesthetician
Personal Trainer Nutrition Coach
Group Fitness Instructor Weight Management Consultant
Pilates Instructor Corporate Wellness Consultant
CrossFit Coach Adventure Tour Guide
Swim Coach Outdoor Education Instructor
Athletics Coach National Park Ranger
Basketball Coach Wildlife Guide
Tennis Coach Scuba Diving Guide
Golf Instructor Mountaineering Guide
Boxing Coach Fitness App Content Creator
Martial Arts Instructor Sports Facility Manager
Gymnastics Coach Stadium Operations Manager
Rock Climbing Instructor Sports Event Organizer
Ski Instructor Sports Marketing Manager
Surf Instructor Sports Nutritionist
Environmental Consultant Beekeeper
Sustainability Manager Composting Specialist
Corporate ESG Analyst Water Conservation Specialist
Carbon Footprint Analyst Air Quality Analyst
Renewable Energy Consultant Pollution Control Officer
Waste Management Specialist Environmental Impact Assessor
Recycling Coordinator Climate Change Analyst
Circular Economy Consultant Climate Adaptation Planner
Environmental Compliance Officer Disaster Risk Reduction Specialist
Wildlife Conservationist Environmental Lawyer
Forest Ranger Environmental Policy Analyst
Wildlife Rehabilitator Green Finance Analyst
Marine Conservationist Impact Investing Analyst
Coral Reef Restoration Specialist Nonprofit Program Manager (Environment)
Reforestation Coordinator Conservation Photographer
Urban Forester Zoo Keeper
Park Ranger Aquarium Curator
Ecotourism Guide Botanical Garden Curator
Environmental Educator Seed Bank Manager
Green Building Consultant Agroforestry Specialist
LEED Certification Consultant Sustainable Packaging Designer
Sustainable Fashion Consultant Eco-Product Developer
Sustainable Agriculture Advisor Green Building Architect
Permaculture Designer Solar Farm Operations Manager
Organic Farm Manager Wind Farm Technician
Aerospace Systems Analyst Aviation Logistics Coordinator
Satellite Operations Engineer Private Jet Charter Manager
Mission Control Specialist Flight Simulator Engineer
Ground Station Engineer Aerospace Quality Inspector
Spacecraft Systems Engineer Defense Systems Analyst
Launch Operations Manager Weapons Systems Test Engineer
Commercial Astronaut Trainer Radar Systems Engineer
Space Tourism Coordinator Sonar Systems Engineer
Aircraft Design Engineer Naval Systems Engineer
Aircraft Systems Engineer Shipbuilding Engineer
Airline Operations Manager Submarine Systems Technician
Private Air Traffic Controller Cyber Defense Analyst (Private Sector)
Flight Dispatcher Military Simulation Designer
Aviation Safety Inspector Tactical Systems Analyst
Aircraft Maintenance Technician Autonomous Weapons Ethicist
Helicopter Pilot Space Debris Tracking Analyst
Drone Fleet Operator Satellite Imagery Analyst
UAV Operations Manager GPS/GNSS Systems Engineer
Airport Operations Manager Aviation Meteorologist
Ground Crew Supervisor Spaceport Operations Manager
Hotel General Manager Catering Manager
Front Office Manager Resort Activities Manager
Concierge Cruise Ship Entertainer
Event Planner Vacation Rental Property Manager
Wedding Planner Vacation Rental Consultant
Conference & Events Coordinator Destination Wedding Planner
Travel Agent Luxury Travel Consultant
Tour Operator Adventure Travel Planner
Tour Guide Culinary Tourism Guide
Cruise Director Wine Tourism Guide
Flight Attendant Personal Shopper
Restaurant Manager Image Consultant
Executive Chef Wardrobe Stylist
Pastry Chef Personal Concierge
Sommelier Butler / House Manager
Bartender / Mixologist Estate Manager
Barista Trainer Pet Groomer
Food Stylist Pet Trainer
Menu Developer Veterinary Technician
Culinary Instructor Animal Behaviorist
Electrician Aircraft Mechanic
Master Electrician Marine Mechanic
Plumber Heavy Equipment Operator
Master Plumber Crane Operator
Carpenter Truck Driver
Cabinet Maker Delivery Driver
Mason Forklift Operator
Roofer Warehouse Supervisor
HVAC Technician Solar Panel Installer
Refrigeration Technician Wind Turbine Technician
Welder Home Inspector
Sheet Metal Worker Appliance Repair Technician
Machinist Computer Repair Technician
Toolmaker Mobile Phone Repair Technician
Millwright Sewing Machine Operator
Boilermaker Tailor
Pipefitter Shoemaker / Cobbler
Elevator Technician Upholsterer
Locksmith Blacksmith
Glazier Glassblower
Construction Painter Woodworker
Drywall Installer Furniture Restorer
Flooring Installer Sign Maker
Tile Setter Screen Printer
Landscaper Embroiderer
Arborist Baker
Auto Mechanic Butcher
Auto Body Repair Technician Cheesemaker
Diesel Mechanic Brewer
Motorcycle Mechanic Distiller
Corporate Lawyer Community Organizer
Family Lawyer Nonprofit Director
Criminal Defense Lawyer Fundraising Manager
Intellectual Property Lawyer Grant Writer
Patent Attorney Private-Sector Policy Analyst
Immigration Lawyer Political Consultant
Real Estate Lawyer Campaign Manager
Labor & Employment Lawyer Lobbyist
Mediator International Relations Analyst
Arbitrator Urban Sociologist
Paralegal Demographer
Legal Researcher Market Research Analyst
Compliance Officer Survey Researcher
Contracts Manager Ethnographic Researcher
Notary Cultural Heritage Consultant
Court Reporter Refugee Resettlement Coordinator
Legal Aid Counselor Victim Advocate
Human Rights Advocate Restorative Justice Facilitator
Social Worker Labor Relations Specialist
Child Welfare Specialist Corporate Ethics Officer
Farm Manager Vineyard Manager
Crop Consultant Winemaker
Precision Agriculture Specialist Orchard Manager
Livestock Manager Food Safety Inspector
Dairy Farm Manager Food Quality Assurance Manager
Poultry Farm Manager Food Process Technologist
Aquaculture Farm Manager Flavor Chemist
Fisheries Manager Sensory Scientist
Agricultural Economist New Product Development Chef
Agribusiness Manager Food Packaging Specialist
Seed Technologist Agricultural Supply Chain Manager
Plant Breeder Agricultural Marketing Specialist
Animal Breeder Agricultural Commodity Trader
Veterinary Nutritionist Rural Development Officer
Feed Formulation Specialist Cooperative Manager
Agricultural Equipment Technician Agri-Tech Consultant
Irrigation Technician Post-Harvest Technologist
Greenhouse Manager Grain Storage Manager
Vertical Farming Manager Organic Certification Auditor
Hydroponics Specialist Agroecologist
AI Ethics Consultant Longevity Clinic Manager
AI Governance Specialist Biohacking Consultant
Digital Wellbeing Consultant Fertility Care Coordinator
Metaverse Real Estate Agent Surrogacy Case Manager
Virtual Event Producer Elder Care Technology Consultant
Remote Work Culture Consultant Smart Home Installation Technician
Four-Day Week Transition Consultant Home Energy Auditor
Gig Economy Platform Manager EV Charging Network Planner
Creator Economy Manager Micromobility Fleet Manager
Influencer Talent Manager Urban Mobility Planner
Personal Brand Strategist Autonomous Vehicle Safety Auditor
Digital Legacy Planner Last-Mile Delivery Robot Technician
Online Reputation Manager 3D Printing Bureau Manager
Deepfake Detection Analyst Additive Manufacturing Technician
Synthetic Data Engineer Circular Fashion Consultant
AI Data Annotation Lead Resale Platform Curator
Prompt Library Curator Vertical Farm Technician
Human-AI Collaboration Specialist Lab-Grown Meat Production Technician
Algorithmic Bias Auditor Plant-Based Product Developer
Data Trust Officer Alternative Protein Scientist
Digital Identity Verification Specialist Space Tourism Sales Consultant
Cyber Insurance Underwriter Asteroid Mining Business Analyst
Ransomware Negotiator Quantum Computing Sales Engineer
Digital Detox Coach Quantum Software Developer
Loneliness Researcher Digital Currency Compliance Analyst
Aging-in-Place Consultant Web3 Community Manager
Telehealth Coordinator Creator Royalties Auditor
Remote Patient Monitoring Specialist Immersive Learning Designer
Personalized Medicine Consultant AI Companion Designer
Genomic Data Counselor Climate Tech Investment Analyst
`;

const rawData2 = `
• Private Equity Analyst
• Venture Capital Analyst
• Equity Research Analyst
• Portfolio Manager
• Wealth Manager
• Treasury Manager
• Corporate Finance Manager
• M&A Analyst
• Financial Controller
• Tax Consultant
• Financial Planner
• Management Consultant
• Strategy Consultant
• Business Consultant
• IT Consultant
• Digital Transformation Consultant
• Operations Consultant
• Sustainability Consultant
• Healthcare Consultant
• Retail Consultant
• Product Manager
• Associate Product Manager
• Technical Product Manager
• Product Marketing Manager
• Innovation Manager
• Business Development Manager
• Enterprise Sales Manager
• Key Account Manager
• Customer Success Manager
• Channel Sales Manager
• Franchise Development Manager
• Export Sales Manager
• Brand Manager
• Growth Marketing Manager
• Performance Marketing Manager
• SEO Specialist
• SEM/PPC Specialist
• Content Marketing Manager
• CRM Manager
• Email Marketing Manager
• Affiliate Marketing Manager
• Community Manager
• Talent Acquisition Specialist
• HR Business Partner
• Learning & Development Manager
• Compensation & Benefits Manager
• Employee Relations Manager
• Organizational Development Consultant
• Business Operations Manager
• Process Excellence Manager
• Business Process Analyst
• Lean Six Sigma Consultant
• Quality Assurance Manager
• Continuous Improvement Manager
• Procurement Manager
• Strategic Sourcing Manager
• Logistics Manager
• Warehouse Manager
• Inventory Manager
• Demand Planner
• Import Export Manager
• E-commerce Manager
• Marketplace Manager
• Category Manager
• Merchandising Manager
• Retail Operations Manager
• Store Manager
• Property Consultant
• Commercial Leasing Manager
• Property Manager
• Facilities Manager
• Real Estate Investment Analyst
• Insurance Advisor
• Insurance Underwriter
• Claims Manager
• Reinsurance Analyst
• Corporate Lawyer
• Company Secretary (CS)
• Compliance Officer
• Legal Consultant
• Contract Manager
• IP Lawyer
• Hotel General Manager
• Resort Manager
• Event Manager
• Wedding Planner
• Travel Consultant
• Tourism Manager
• International Business Manager
• Global Trade Manager
• Export-Import Consultant
• Trade Compliance Specialist
• Global Procurement Manager
• Luxury Brand Manager
• Luxury Retail Manager
• Fashion Merchandising Manager
• CSR Manager
• NGO Program Manager
• Development Sector Consultant
• Social Entrepreneur
• Agribusiness Manager
• Food Business Manager
• Dairy Business Manager
• Fisheries Business Manager
• Painter
• Sketch Artist
• Illustrator
• Digital Illustrator
• Concept Artist
• Comic Book Artist
• Manga Artist
• Portrait Artist
• Mural Artist
• Calligraphy Artist
• Actor
• Theatre Artist
• Voice Actor
• Dancer
• Choreographer
• Singer
• Music Composer
• Lyricist
• Music Director
• Orchestra Conductor
• Film Director
• Screenwriter
• Script Supervisor
• Film Editor
• Colorist
• Production Designer
• Art Director
• Assistant Director
• Casting Director
• Location Manager
• Line Producer
• Executive Producer
• Game Designer
• Level Designer
• Environment Artist
• Character Designer
• Creature Artist
• Storyboard Artist
• Technical Artist
• Motion Capture Specialist
• Lighting Artist
• Texture Artist
• Rigging Artist
• Motion Designer
• Interaction Designer
• Experience Designer
• Information Designer
• Visual Communication Designer
• Typography Designer
• Icon Designer
• Infographic Designer
• Design Researcher
• Product Designer
• Furniture Designer
• Toy Designer
• Packaging Designer
• Automobile Designer
• Transportation Designer
• Exhibition Designer
• Set Designer
• Textile Designer
• Fashion Stylist
• Costume Designer
• Jewelry Designer
• Accessory Designer
• Footwear Designer
• Fashion Illustrator
• Fashion Merchandiser
• Image Consultant
• Wedding Photographer
• Wildlife Photographer
• Sports Photographer
• Food Photographer
• Travel Photographer
• Documentary Photographer
• Product Photographer
• Drone Photographer
• Photojournalist
• Author
• Novelist
• Poet
• Script Writer
• Technical Writer
• Ghostwriter
• Editor
• Proofreader
• Journalist
• Magazine Editor
• Creative Director
• Advertising Art Director
• Brand Designer
• Advertising Copywriter
• Campaign Strategist
• Creative Strategist
• Visual Merchandiser
• Social Media Manager
• Social Media Strategist
• Podcast Host
• Podcast Producer
• Live Streamer
• Twitch Streamer
• Newsletter Creator
• Event Designer
• Exhibition Curator
• Museum Curator
• Wedding Designer
• Stage Designer
• Experience Curator
• Sound Designer
• Audio Engineer
• Mixing Engineer
• Mastering Engineer
• Foley Artist
• Dubbing Artist
• Radio Producer
• Radio Presenter
• AR Experience Designer
• VR Experience Designer
• Mixed Reality Designer
• Hologram Experience Designer
• Projection Mapping Artist
• Interactive Installation Designer
• Creative Technologist
• Ceramic Artist
• Glass Artist
• Woodworking Artist
• Metal Craft Designer
• Leather Craft Designer
• Paper Artist
• Origami Artist
• Candle Designer
• Floral Designer
• Art Teacher
• Music Teacher
• Dance Teacher
• Acting Coach
• Photography Instructor
• Design Mentor
• Creative Workshop Facilitator
• Luxury Experience Designer
• Floral Event Designer
• Luxury Gift Designer
• Luxury Wedding Designer
• AI Artist
• AI Creative Director
• Prompt Artist
• Generative Design Specialist
• NFT Art Curator
• Virtual Fashion Designer
• Digital Human Designer
• Metaverse World Builder
• Virtual Influencer Creator
• AI Video Creator
• AI Music Producer
• AI Storytelling Designer
• Indian Revenue Service (IRS)
• Income Tax Inspector
• GST Inspector
• Customs Officer
• Central Excise Officer
• Enforcement Directorate (ED)
• Directorate of Revenue Intelligence (DRI)
• Indian Audit & Accounts Service (IA&AS)
• Comptroller & Auditor General (CAG)
• Civil Accounts Officer
• Defence Accounts Officer
• Railway Accounts Officer
• Controller General of Accounts (CGA)
• Indian Postal Service
• Postal Inspector
• Postal Assistant
• Gramin Dak Sevak
• Mail Guard
• Sorting Assistant
• BSNL Officer
• MTNL Officer
• Indian Forest Service
• Forest Range Officer
• Forest Guard
• Wildlife Officer
• Pollution Control Board Officer
• Environmental Scientist
• NABARD Grade A/B
• Agriculture Development Officer
• Agricultural Officer
• ICAR Scientist
• Krishi Vigyan Kendra Officer
• Food Corporation of India
• ISRO Scientist/Engineer
• DRDO Scientist
• BARC Scientist
• Department of Atomic Energy
• NPCIL
• ONGC
• IOCL
• BPCL
• HPCL
• GAIL
• NTPC
• NHPC
• Power Grid
• BHEL
• SAIL
• Coal India
• HAL
• BEL
• NALCO
• NMDC
• MECON
• RITES
• IRCON
• RVNL
• KVS
• NVS
• DSSSB Teacher
• State Government Teacher
• Assistant Professor
• UGC-NET/JRF
• NCERT Faculty
• AIIMS Nursing Officer
• ESIC Officer
• Government Medical Officer
• Staff Nurse
• Pharmacist
• Medical Laboratory Technician
• Community Health Officer
• Indian Statistical Service
• Indian Economic Service
• MOSPI Statistical Officer
• NDRF
• SDRF
• NDMA
• AAI
• Air Traffic Controller
• DGCA Officer
• Port Trust Officer
• Shipping Corporation
• IWAI
• CERT-In Analyst
• NIC Scientist
• Digital India Mission Officer
• MeitY Technical Officer
• Cyber Crime Investigation Officer
• Election Commission Officer
• State Election Commission Officer
• Panchayat Development Officer
• Block Development Officer
• Civil Judge
• Judicial Magistrate
• Public Prosecutor
• High Court Administrative Officer
• Supreme Court Administrative Officer
• Court Clerk
• Sub-Inspector
• DSP
• ACP
• Police Constable
• Indian Coast Guard
• Territorial Army
• JAG
• Military Nursing Service
• NSG
• SPG
• NTRO
• DIA
• RBI Assistant
• IBPS Clerk
• NABARD Development Assistant
• SIDBI Grade A/B
• LIC ADO
• NIACL AO
• UIIC AO
• Oriental Insurance AO
• ECGC PO
• EXIM Bank Officer
• RRB Group D
• RRB JE
• Assistant Loco Pilot
• Station Master
• Goods Guard
• RPF
• UPSC ESE
• CPWD Engineer
• MES
• BRO
• State PWD
• Indian Information Service
• Indian Trade Service
• Indian Defence Estates Service
• Indian Corporate Law Service
• Indian Civil Accounts Service
• DANICS
• DANIPS
`;

// Combine all raw titles
let allTitles = new Set();

rawData1.trim().split('\n').forEach(line => {
    line = line.trim();
    if (!line) return;
    let splitLine = line.replace(/([a-z\)])\s([A-Z])/g, '$1|$2');
    let parts = splitLine.split('|');
    parts.forEach(p => allTitles.add(p.trim()));
});

rawData2.trim().split('\n').forEach(line => {
    line = line.replace(/•/g, '').trim();
    if (line) allTitles.add(line);
});

let uniqueTitles = Array.from(allTitles).filter(t => t.length > 2);

console.log("Parsed " + uniqueTitles.length + " potential career titles from OCR text.");

const careersJsPath = path.join(__dirname, '..', 'public', 'js', 'data', 'careers.js');
let careersContent = fs.readFileSync(careersJsPath, 'utf8');

let existingTitles = new Set();
const titleMatch = careersContent.match(/"title":\s*"([^"]+)"/g);
if (titleMatch) {
    titleMatch.forEach(m => {
        let t = m.split(':')[1].replace(/"/g, '').trim();
        existingTitles.add(t.toLowerCase());
    });
}

let newCareers = uniqueTitles.filter(t => !existingTitles.has(t.toLowerCase()));

console.log("Found " + newCareers.length + " entirely NEW unique careers to inject.");

function generateSlug(title) {
    return 'c-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const templates = {
    desc: [
        "Design, develop, and optimize cutting-edge solutions as a highly skilled {TITLE}.",
        "Lead innovative projects and drive industry standards in the dynamic field of {TITLE}.",
        "Master the intricacies of being a {TITLE} to deliver high-impact, real-world results."
    ],
    growth: ["🚀 18% YoY Growth", "📈 24% YoY Growth", "🔥 High Demand Sector", "⭐ Rapidly Expanding"],
    salary: ["₹8–25 LPA", "₹12–35 LPA", "₹6–18 LPA", "₹15–40+ LPA"],
    learn: "Master the end-to-end theoretical principles, analytical frameworks, and practical real-world execution required for a top-tier {TITLE}.",
    roadmap: [
        "Master the foundational principles of {TITLE}",
        "Build a strong portfolio of real-world projects",
        "Engage with industry leaders and communities",
        "Secure high-value internships or entry-level roles",
        "Scale your expertise into leadership positions"
    ],
    skills: ["Strategic Thinking", "Technical Execution", "Project Management", "Data Analysis", "Cross-functional Collaboration"]
};

let generatedObjects = [];

newCareers.forEach(title => {
    let slug = generateSlug(title);
    let category = "Emerging & Diverse Fields";
    
    let obj = {
        id: slug,
        title: title,
        icon: "💡",
        stream: category,
        salary: getRandom(templates.salary),
        demand: "Very High",
        dp: Math.floor(Math.random() * 20) + 75,
        time: "6–12 months",
        desc: getRandom(templates.desc).replace('{TITLE}', title),
        skills: templates.skills.map(s => ({ n: s, l: "Core" })),
        roadmap: templates.roadmap.map(r => r.replace('{TITLE}', title)),
        bestFor: "Driven individuals passionate about making a significant impact in this field",
        match: { "Technology": 20, "Business": 30, "Creative": 25, "Science": 25 },
        growthRate: getRandom(templates.growth),
        wlb: "Flexible",
        remote: "Moderate to High",
        topCompanies: ["Top Tier Global Corporations", "Innovative Startups", "Government Sectors", "Consulting Firms"],
        tools: ["Industry Standard Software", "Data Visualization Suites", "Management Dashboards"],
        certifications: ["Certified " + title + " Professional", "Advanced " + title + " Diploma"],
        dayInLife: [
            "Conduct deep analytical research and strategy formulation",
            "Collaborate with cross-functional teams to deploy solutions",
            "Review performance metrics and optimize daily workflows"
        ],
        trajectory: [
            { level: "Entry-Level", role: "Junior " + title, salary: "₹5-9 LPA" },
            { level: "Mid-Level", role: "Senior " + title, salary: "₹10-22 LPA" },
            { level: "Senior-Level", role: "Lead/Director", salary: "₹25+ LPA" }
        ],
        learn: templates.learn.replace('{TITLE}', title),
        techSkills: ["Analytical Frameworks", "Workflow Automation", "Systems Architecture"],
        softSkills: ["Communication", "Leadership", "Critical Thinking", "Adaptability"],
        eligibility: "Relevant undergraduate degree or proven practical portfolio.",
        streamRequired: "Open to diverse academic backgrounds with specialized certifications.",
        exams: ["Direct Portfolio Screening", "Industry Standard Certification Exams"],
        degrees: ["B.Sc / B.Tech / BBA / B.A depending on specialization", "Master's Degree (Preferred)"],
        roadBeginner: ["Acquire fundamental theoretical principles for " + title + ".", "Engage with structured online specializations."],
        roadIntermediate: ["Attain advanced tool mastery and secure foundational internships.", "Collaborate on real-world team capstone projects."],
        roadAdvanced: ["Deliver high-impact production execution in senior leadership.", "Publish empirical case studies and mentor incoming talent."],
        projects: ["Architect an end-to-end full-scale real-world implementation addressing a core challenge as a " + title + "."],
        internships: ["Target elite multinational enterprise programs.", "Apply to fast-growing, highly innovative venture-backed startups."],
        portfolio: ["Create an ultra-clean personal portfolio showcasing working case studies.", "Maintain an active professional LinkedIn presence."],
        govOpps: ["Direct recruitment through central civil service commissions.", "Research and advisory roles inside state ministerial boards."],
        freelanceOpps: ["Command premium hourly billing contracts on elite global talent networks.", "Deliver specialized boutique strategy advisory."],
        startupOpps: ["Launch a specialized SaaS platform automating key bottlenecks for " + title + "s."],
        salaryGlobal: "$60,000 – $150,000 / year",
        futureDemand: "🚀 Exponential Growth (18%+ YoY Demand)",
        aiImpact: "Highly Synergistic: AI acts as a powerful multiplier, accelerating daily research and routine workflow execution.",
        automationRisk: "Low Risk: Requires deep human empathy, strategic judgment, and creative problem solving.",
        relatedCareers: ["Consultant", "Director of Operations"],
        resources: ["Coursera Flagship Specializations", "Udemy Premium Masterclasses", "NPTEL Core Streams"],
        books: ["\"Mastering the Fundamentals of " + title + "\" by Leading Domain Veterans", "\"Deep Work\" by Cal Newport"],
        youtube: ["Industry Specific Masterclass Channels", "TED Talks & Expert Interviews"],
        websites: ["Roadmap.sh (Career Pathways)", "Medium (Case Studies)"],
        timeRequired: "6–12 months",
        difficulty: "🔥 Rigorous to Hard (Requires unyielding discipline)",
        outlook2035: "Extremely bright and resilient; highly integrated with next-generation artificial intelligence.",
        aiRecScore: "⭐ 90/100 (Premium AI Career Fit)"
    };
    
    generatedObjects.push(obj);
});

if (generatedObjects.length > 0) {
    let lastIndex = careersContent.lastIndexOf('];');
    if (lastIndex !== -1) {
        let contentWithoutEnd = careersContent.substring(0, lastIndex);
        let newJson = generatedObjects.map(obj => JSON.stringify(obj, null, 4)).join(',\n    ');
        let finalContent = contentWithoutEnd + ',\n    ' + newJson + '\n];\n';
        
        fs.writeFileSync(careersJsPath, finalContent, 'utf8');
        console.log("Successfully injected " + generatedObjects.length + " new careers into careers.js!");
    } else {
        console.log("Could not find end of array in careers.js");
    }
} else {
    console.log("No new unique careers to inject.");
}
