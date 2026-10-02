
        /* ============================================================
           DIGITAL TWIN PLATFORM — DATA LAYER
           i18n (12 langs), Career Paths (8 domains), College Data
           All ES5 — no template literals, no arrow functions
           ============================================================ */

        /* ── CONFIG ─────────────────────────────────────────────────── */
        var DT_CFG = {
            apiKey: '',
            model: 'claude-sonnet-4-20250514',
            version: '2.0',
            siteUrl: 'https://digitaltwin.niat.tech/'
        };

        /* ── i18n TRANSLATIONS (12 languages) ──────────────────────── */
        var I18N = {
            en: {
                appName: 'Digital Twin',
                tagline: 'AI-powered career navigator for India',
                selectLanguage: 'Choose Your Language',
                continueBtn: 'Continue',
                getStarted: 'Get Started',
                whatAreYourInterests: 'What are your interests?',
                interestSubtitle: 'Select all that apply — your roadmap will be built around these',
                analyzeMyFuture: 'Analyze My Future',
                analyzerTitlePrefix: 'Preparing Your',
                analyzerTitleAccent: 'Career Blueprint',
                analyzerStatusInit: 'Collecting your profile details…',
                analyzerAgentGuidance: 'Career Guidance Engine',
                analyzerAgentSkills: 'Skill Assessment Engine',
                analyzerAgentOpportunities: 'Opportunity Mapping Engine',
                analyzerAgentProgress: 'Progress Planning Engine',
                analyzing: 'Analyzing your Digital Twin...',
                analyzingSteps: ['Reading your interests...', 'Mapping career paths...', 'Calculating skill gaps...', 'Personalizing your roadmap...', 'Building your Digital Twin...'],
                dashboard: 'Dashboard',
                roadmap: 'Roadmap',
                colleges: 'Colleges',
                skills: 'Skills',
                habits: 'Habits',
                chat: 'AI Mentor',
                resume: 'Resume',
                settings: 'Settings',
                heatmap: 'Skill Map',
                opportunities: 'Opportunities',
                welcome: 'Welcome back',
                yourLevel: 'Level',
                xpPoints: 'XP Points',
                streak: 'Day Streak',
                badges: 'Badges',
                todayGoals: "Today's Goals",
                completedGoals: 'Completed',
                careerMatch: 'Career Match',
                profileStrength: 'Profile Strength',
                weeklyProgress: 'Weekly Progress',
                addHabit: 'Add Habit',
                markDone: 'Mark Done',
                buildResume: 'Build Resume',
                downloadResume: 'Download',
                downloadRoadmap: 'Download Roadmap PDF',
                askMentor: 'Ask your AI mentor...',
                send: 'Send',
                speak: 'Speak',
                lightMode: 'Light Mode',
                darkMode: 'Dark Mode',
                language: 'Language',
                saveProfile: 'Save Profile',
                internships: 'Internships',
                dailyRoutine: 'Daily Routine',
                trainingPlan: 'Training Plan',
                dietPlan: 'Diet Plan',
                personalityType: 'Personality Type',
                compareWithPeers: 'Compare with Peers',
                yourRank: 'Your Rank',
                topSkills: 'Top Skills',
                skillsToLearn: 'Skills to Learn',
                timelineMonths: 'months',
                phase: 'Phase',
                milestone: 'Milestone',
                salary: 'Expected Salary',
                whyThisCollege: 'Why This College?',
                placementRate: 'Placement Rate',
                avgPackage: 'Avg Package',
                facilities: 'Facilities',
                applyNow: 'Apply Now',
                viewRoadmap: 'View Roadmap',
                notifications: 'Notifications',
                markAllRead: 'Mark All Read',
                noNotifications: 'All caught up!',
                habitStreak: 'Current Streak',
                addNewHabit: 'Add New Habit',
                habitCategory: 'Category',
                habitName: 'Habit Name',
                habitTime: 'Reminder Time',
                saveHabit: 'Save Habit',
                resumeName: 'Full Name',
                resumeEmail: 'Email',
                resumePhone: 'Phone',
                resumeSkills: 'Skills',
                resumeSummary: 'Professional Summary',
                resumeExperience: 'Experience',
                resumeEducation: 'Education',
                generateResume: 'Generate Resume',
                peerRank: 'Your rank among peers',
                abovePeers: 'Above',
                belowPeers: 'Below',
                voiceListening: 'Listening...',
                voiceNotSupported: 'Voice not supported in this browser',
                xpEarned: 'XP Earned!',
                badgeEarned: 'New Badge Unlocked!',
                levelUp: 'Level Up!',
                onboardingName: 'What is your name?',
                onboardingAge: 'Your age / class',
                onboardingGoal: 'Your dream / goal',
                academicInterest: 'Are you interested in academics?',
                yes: 'Yes',
                no: 'No',
                somewhat: 'Somewhat'
            },
            hi: {
                appName: 'डिजिटल ट्विन',
                tagline: 'भारत के लिए AI करियर मार्गदर्शक',
                selectLanguage: 'अपनी भाषा चुनें',
                continueBtn: 'आगे बढ़ें',
                getStarted: 'शुरू करें',
                whatAreYourInterests: 'आपकी रुचियाँ क्या हैं?',
                interestSubtitle: 'सभी लागू विकल्प चुनें — आपका रोडमैप इनके आधार पर बनेगा',
                analyzeMyFuture: 'मेरे भविष्य का विश्लेषण करें',
                analyzerTitlePrefix: 'आपका',
                analyzerTitleAccent: 'करियर ब्लूप्रिंट तैयार हो रहा है',
                analyzerStatusInit: 'आपकी प्रोफ़ाइल जानकारी एकत्र की जा रही है…',
                analyzerAgentGuidance: 'करियर गाइडेंस इंजन',
                analyzerAgentSkills: 'स्किल असेसमेंट इंजन',
                analyzerAgentOpportunities: 'ऑपर्च्युनिटी मैपिंग इंजन',
                analyzerAgentProgress: 'प्रोग्रेस प्लानिंग इंजन',
                analyzing: 'आपका डिजिटल ट्विन बना रहे हैं...',
                analyzingSteps: ['रुचियाँ पढ़ रहे हैं...', 'करियर पथ मैप कर रहे हैं...', 'कौशल अंतर गणना कर रहे हैं...', 'रोडमैप व्यक्तिगत कर रहे हैं...', 'डिजिटल ट्विन बना रहे हैं...'],
                dashboard: 'डैशबोर्ड',
                roadmap: 'रोडमैप',
                colleges: 'कॉलेज',
                skills: 'कौशल',
                habits: 'आदतें',
                chat: 'AI मेंटर',
                resume: 'रेज़ुमे',
                settings: 'सेटिंग्स',
                heatmap: 'कौशल मानचित्र',
                opportunities: 'अवसर',
                welcome: 'वापस स्वागत है',
                yourLevel: 'स्तर',
                xpPoints: 'XP अंक',
                streak: 'दिन की लकीर',
                badges: 'बैज',
                todayGoals: 'आज के लक्ष्य',
                completedGoals: 'पूरे हुए',
                careerMatch: 'करियर मिलान',
                profileStrength: 'प्रोफ़ाइल मजबूती',
                weeklyProgress: 'साप्ताहिक प्रगति',
                addHabit: 'आदत जोड़ें',
                markDone: 'पूरा करें',
                buildResume: 'रेज़ुमे बनाएं',
                downloadResume: 'डाउनलोड',
                downloadRoadmap: 'रोडमैप PDF डाउनलोड करें',
                askMentor: 'अपने AI मेंटर से पूछें...',
                send: 'भेजें',
                speak: 'बोलें',
                lightMode: 'लाइट मोड',
                darkMode: 'डार्क मोड',
                language: 'भाषा',
                saveProfile: 'प्रोफ़ाइल सहेजें',
                internships: 'इंटर्नशिप',
                dailyRoutine: 'दैनिक दिनचर्या',
                trainingPlan: 'प्रशिक्षण योजना',
                dietPlan: 'आहार योजना',
                personalityType: 'व्यक्तित्व प्रकार',
                compareWithPeers: 'साथियों से तुलना',
                yourRank: 'आपकी रैंक',
                topSkills: 'शीर्ष कौशल',
                skillsToLearn: 'सीखने योग्य कौशल',
                timelineMonths: 'महीने',
                phase: 'चरण',
                milestone: 'मील का पत्थर',
                salary: 'अपेक्षित वेतन',
                whyThisCollege: 'यह कॉलेज क्यों?',
                placementRate: 'प्लेसमेंट दर',
                avgPackage: 'औसत पैकेज',
                facilities: 'सुविधाएं',
                applyNow: 'अभी आवेदन करें',
                viewRoadmap: 'रोडमैप देखें',
                notifications: 'सूचनाएं',
                markAllRead: 'सभी पढ़ा हुआ करें',
                noNotifications: 'सब ठीक है!',
                habitStreak: 'वर्तमान लकीर',
                addNewHabit: 'नई आदत जोड़ें',
                habitCategory: 'श्रेणी',
                habitName: 'आदत का नाम',
                habitTime: 'याद दिलाने का समय',
                saveHabit: 'आदत सहेजें',
                resumeName: 'पूरा नाम',
                resumeEmail: 'ईमेल',
                resumePhone: 'फोन',
                resumeSkills: 'कौशल',
                resumeSummary: 'पेशेवर सारांश',
                resumeExperience: 'अनुभव',
                resumeEducation: 'शिक्षा',
                generateResume: 'रेज़ुमे बनाएं',
                peerRank: 'साथियों में आपकी रैंक',
                abovePeers: 'से ऊपर',
                belowPeers: 'से नीचे',
                voiceListening: 'सुन रहे हैं...',
                voiceNotSupported: 'इस ब्राउज़र में वॉइस समर्थित नहीं',
                xpEarned: 'XP मिला!',
                badgeEarned: 'नया बैज मिला!',
                levelUp: 'लेवल अप!',
                onboardingName: 'आपका नाम क्या है?',
                onboardingAge: 'आपकी उम्र / कक्षा',
                onboardingGoal: 'आपका सपना / लक्ष्य',
                academicInterest: 'क्या आप पढ़ाई में रुचि रखते हैं?',
                yes: 'हाँ',
                no: 'नहीं',
                somewhat: 'थोड़ा'
            },
            bn: {
                appName: 'ডিজিটাল টুইন',
                tagline: 'ভারতের জন্য AI ক্যারিয়ার নেভিগেটর',
                selectLanguage: 'আপনার ভাষা বেছে নিন',
                continueBtn: 'চালিয়ে যান',
                getStarted: 'শুরু করুন',
                whatAreYourInterests: 'আপনার আগ্রহ কী?',
                interestSubtitle: 'প্রযোজ্য সব বিকল্প চয়ন করুন',
                analyzeMyFuture: 'আমার ভবিষ্যৎ বিশ্লেষণ করুন',
                analyzing: 'আপনার ডিজিটাল টুইন তৈরি হচ্ছে...',
                dashboard: 'ড্যাশবোর্ড',
                roadmap: 'রোডম্যাপ',
                colleges: 'কলেজ',
                skills: 'দক্ষতা',
                habits: 'অভ্যাস',
                chat: 'AI মেন্টর',
                resume: 'রেজুমে',
                settings: 'সেটিংস',
                welcome: 'স্বাগতম',
                send: 'পাঠান',
                speak: 'বলুন',
                yes: 'হ্যাঁ',
                no: 'না',
                somewhat: 'কিছুটা',
                heatmap: 'দক্ষতা মানচিত্র',
                opportunities: 'সুযোগ',
                addHabit: 'অভ্যাস যোগ করুন',
                buildResume: 'রেজুমে তৈরি',
                yourLevel: 'স্তর',
                xpPoints: 'XP পয়েন্ট',
                streak: 'দিনের স্ট্রিক',
                badges: 'ব্যাজ',
                language: 'ভাষা',
                notifications: 'বিজ্ঞপ্তি',
                salary: 'প্রত্যাশিত বেতন',
                internships: 'ইন্টার্নশিপ',
                onboardingName: 'আপনার নাম কী?',
                onboardingGoal: 'আপনার স্বপ্ন/লক্ষ্য',
                academicInterest: 'আপনি কি পড়াশোনায় আগ্রহী?'
            },
            ta: {
                appName: 'டிஜிட்டல் ட்வின்',
                tagline: 'இந்தியாவிற்கான AI தொழில் வழிகாட்டி',
                selectLanguage: 'உங்கள் மொழியை தேர்ந்தெடுக்கவும்',
                continueBtn: 'தொடரவும்',
                getStarted: 'தொடங்குங்கள்',
                whatAreYourInterests: 'உங்கள் ஆர்வங்கள் என்ன?',
                interestSubtitle: 'பொருந்தும் அனைத்தையும் தேர்ந்தெடுக்கவும்',
                analyzeMyFuture: 'என் எதிர்காலத்தை பகுப்பாய்வு செய்க',
                analyzing: 'உங்கள் டிஜிட்டல் ட்வின் உருவாக்கப்படுகிறது...',
                dashboard: 'டாஷ்போர்டு',
                roadmap: 'ரோட்மேப்',
                colleges: 'கல்லூரிகள்',
                skills: 'திறன்கள்',
                habits: 'பழக்கங்கள்',
                chat: 'AI வழிகாட்டி',
                resume: 'ரெஸ்யூமே',
                settings: 'அமைப்புகள்',
                welcome: 'வணக்கம்',
                send: 'அனுப்பு',
                speak: 'பேசு',
                yes: 'ஆம்',
                no: 'இல்லை',
                somewhat: 'ஓரளவு',
                heatmap: 'திறன் வரைபடம்',
                opportunities: 'வாய்ப்புகள்',
                yourLevel: 'நிலை',
                xpPoints: 'XP புள்ளிகள்',
                streak: 'நாள் தொடர்',
                badges: 'பேட்ஜ்கள்',
                language: 'மொழி',
                notifications: 'அறிவிப்புகள்',
                salary: 'எதிர்பார்க்கப்படும் சம்பளம்',
                internships: 'இன்டர்ன்ஷிப்',
                onboardingName: 'உங்கள் பெயர் என்ன?',
                onboardingGoal: 'உங்கள் கனவு/இலக்கு',
                academicInterest: 'நீங்கள் படிப்பில் ஆர்வமா?'
            },
            te: {
                appName: 'డిజిటల్ ట్విన్',
                tagline: 'భారత్ కోసం AI కెరీర్ నావిగేటర్',
                selectLanguage: 'మీ భాషను ఎంచుకోండి',
                continueBtn: 'కొనసాగించు',
                getStarted: 'ప్రారంభించు',
                whatAreYourInterests: 'మీ ఆసక్తులు ఏమిటి?',
                analyzeMyFuture: 'నా భవిష్యత్తును విశ్లేషించు',
                analyzing: 'మీ డిజిటల్ ట్విన్ నిర్మించబడుతోంది...',
                dashboard: 'డాష్‌బోర్డ్',
                roadmap: 'రోడ్‌మ్యాప్',
                colleges: 'కళాశాలలు',
                skills: 'నైపుణ్యాలు',
                habits: 'అలవాట్లు',
                chat: 'AI మెంటర్',
                resume: 'రెజ్యూమె',
                settings: 'సెట్టింగ్‌లు',
                welcome: 'స్వాగతం',
                send: 'పంపు',
                speak: 'మాట్లాడు',
                yes: 'అవును',
                no: 'కాదు',
                somewhat: 'కొంచెం',
                heatmap: 'నైపుణ్య మ్యాప్',
                opportunities: 'అవకాశాలు',
                yourLevel: 'స్థాయి',
                xpPoints: 'XP పాయింట్లు',
                streak: 'రోజు స్ట్రీక్',
                badges: 'బ్యాడ్జ్‌లు',
                language: 'భాష',
                notifications: 'నోటిఫికేషన్లు',
                salary: 'ఆశించిన జీతం',
                internships: 'ఇంటర్న్‌షిప్‌లు',
                onboardingName: 'మీ పేరు ఏమిటి?',
                onboardingGoal: 'మీ కల/లక్ష్యం',
                academicInterest: 'మీరు చదువులో ఆసక్తి ఉందా?'
            },
            mr: {
                appName: 'डिजिटल ट्विन',
                tagline: 'भारतासाठी AI करिअर नेव्हिगेटर',
                selectLanguage: 'तुमची भाषा निवडा',
                continueBtn: 'पुढे जा',
                getStarted: 'सुरू करा',
                whatAreYourInterests: 'तुमच्या आवडी काय आहेत?',
                analyzeMyFuture: 'माझ्या भविष्याचे विश्लेषण करा',
                analyzing: 'तुमचा डिजिटल ट्विन तयार होत आहे...',
                dashboard: 'डॅशबोर्ड',
                roadmap: 'रोडमॅप',
                colleges: 'महाविद्यालये',
                skills: 'कौशल्ये',
                habits: 'सवयी',
                chat: 'AI मार्गदर्शक',
                resume: 'रेझुमे',
                settings: 'सेटिंग्ज',
                welcome: 'पुन्हा स्वागत',
                send: 'पाठवा',
                speak: 'बोला',
                yes: 'होय',
                no: 'नाही',
                somewhat: 'थोडे',
                heatmap: 'कौशल्य नकाशा',
                opportunities: 'संधी',
                yourLevel: 'पातळी',
                xpPoints: 'XP गुण',
                streak: 'दिवस स्ट्रीक',
                badges: 'बॅजेस',
                language: 'भाषा',
                notifications: 'सूचना',
                salary: 'अपेक्षित पगार',
                internships: 'इंटर्नशिप',
                onboardingName: 'तुमचे नाव काय आहे?',
                onboardingGoal: 'तुमचे स्वप्न/ध्येय',
                academicInterest: 'तुम्हाला अभ्यासात रस आहे का?'
            },
            gu: {
                appName: 'ડિજિટલ ટ્વિન',
                tagline: 'ભારત માટે AI કારકિર્દી નેવિગેટર',
                selectLanguage: 'તમારી ભાષા પસંદ કરો',
                continueBtn: 'આગળ વધો',
                getStarted: 'શરૂ કરો',
                whatAreYourInterests: 'તમારી રુચિઓ શું છે?',
                analyzeMyFuture: 'મારા ભવિષ્યનું વિશ્લેષણ કરો',
                analyzing: 'તમારો ડિજિટલ ટ્વિન બની રહ્યો છે...',
                dashboard: 'ડૅશબોર્ડ',
                roadmap: 'રોડમૅપ',
                colleges: 'કૉલેજો',
                skills: 'કૌશલ્ય',
                habits: 'ટેવો',
                chat: 'AI માર્ગદર્શક',
                resume: 'રેઝ્યૂમે',
                settings: 'સેટિંગ્સ',
                welcome: 'ફરી સ્વાગત',
                send: 'મોકલો',
                speak: 'બોલો',
                yes: 'હા',
                no: 'ના',
                somewhat: 'થોડું',
                heatmap: 'કૌશલ્ય નકશો',
                opportunities: 'તકો',
                yourLevel: 'સ્તર',
                xpPoints: 'XP પૉઇન્ટ',
                streak: 'દિવસ સ્ટ્રીક',
                badges: 'બૅઝ',
                language: 'ભાષા',
                notifications: 'સૂચનાઓ',
                salary: 'અપેક્ષિત પગાર',
                internships: 'ઇન્ટર્નશિપ',
                onboardingName: 'તમારું નામ શું છે?',
                onboardingGoal: 'તમારું સ્વપ્ન/ધ્યેય',
                academicInterest: 'શું તમને ભણવામાં રસ છે?'
            },
            kn: {
                appName: 'ಡಿಜಿಟಲ್ ಟ್ವಿನ್',
                tagline: 'ಭಾರತಕ್ಕಾಗಿ AI ವೃತ್ತಿ ನೇವಿಗೇಟರ್',
                selectLanguage: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ',
                continueBtn: 'ಮುಂದುವರಿಸಿ',
                getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
                whatAreYourInterests: 'ನಿಮ್ಮ ಆಸಕ್ತಿಗಳೇನು?',
                analyzeMyFuture: 'ನನ್ನ ಭವಿಷ್ಯವನ್ನು ವಿಶ್ಲೇಷಿಸಿ',
                analyzing: 'ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಟ್ವಿನ್ ನಿರ್ಮಾಣವಾಗುತ್ತಿದೆ...',
                dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
                roadmap: 'ರೋಡ್‌ಮ್ಯಾಪ್',
                colleges: 'ಕಾಲೇಜುಗಳು',
                skills: 'ಕೌಶಲ್ಯಗಳು',
                habits: 'ಅಭ್ಯಾಸಗಳು',
                chat: 'AI ಮಾರ್ಗದರ್ಶಕ',
                resume: 'ರೆಸ್ಯೂಮೆ',
                settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
                welcome: 'ಸ್ವಾಗತ',
                send: 'ಕಳುಹಿಸಿ',
                speak: 'ಮಾತನಾಡಿ',
                yes: 'ಹೌದು',
                no: 'ಇಲ್ಲ',
                somewhat: 'ಸ್ವಲ್ಪ',
                heatmap: 'ಕೌಶಲ ನಕ್ಷೆ',
                opportunities: 'ಅವಕಾಶಗಳು',
                yourLevel: 'ಹಂತ',
                xpPoints: 'XP ಅಂಕಗಳು',
                streak: 'ದಿನ ಸ್ಟ್ರೀಕ್',
                badges: 'ಬ್ಯಾಡ್ಜ್‌ಗಳು',
                language: 'ಭಾಷೆ',
                notifications: 'ಅಧಿಸೂಚನೆಗಳು',
                salary: 'ನಿರೀಕ್ಷಿತ ವೇತನ',
                internships: 'ಇಂಟರ್ನ್‌ಶಿಪ್',
                onboardingName: 'ನಿಮ್ಮ ಹೆಸರೇನು?',
                onboardingGoal: 'ನಿಮ್ಮ ಕನಸು/ಗುರಿ',
                academicInterest: 'ನೀವು ಓದುವಲ್ಲಿ ಆಸಕ್ತರಾ?'
            },
            ml: {
                appName: 'ഡിജിറ്റൽ ട്വിൻ',
                tagline: 'ഇന്ത്യക്കായുള്ള AI കരിയർ നേവിഗേറ്റർ',
                selectLanguage: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കൂ',
                continueBtn: 'തുടരുക',
                getStarted: 'ആരംഭിക്കുക',
                whatAreYourInterests: 'നിങ്ങളുടെ താൽപ്പര്യങ്ങൾ എന്തൊക്കെ?',
                analyzeMyFuture: 'എന്റെ ഭാവി വിശകലനം ചെയ്യൂ',
                analyzing: 'നിങ്ങളുടെ ഡിജിറ്റൽ ട്വിൻ നിർമ്മിക്കുന്നു...',
                dashboard: 'ഡാഷ്‌ബോർഡ്',
                roadmap: 'റോഡ്‌മാപ്പ്',
                colleges: 'കോളേജുകൾ',
                skills: 'കഴിവുകൾ',
                habits: 'ശീലങ്ങൾ',
                chat: 'AI മാർഗദർശി',
                resume: 'റെസ്യൂമെ',
                settings: 'ക്രമീകരണങ്ങൾ',
                welcome: 'സ്വാഗതം',
                send: 'അയയ്ക്കുക',
                speak: 'സംസാരിക്കുക',
                yes: 'അതെ',
                no: 'ഇല്ല',
                somewhat: 'ഒരു പരിധി വരെ',
                heatmap: 'കഴിവ് ഭൂപടം',
                opportunities: 'അവസരങ്ങൾ',
                yourLevel: 'തലം',
                xpPoints: 'XP പോയിന്റ്',
                streak: 'ദിവസ് സ്ട്രീക്',
                badges: 'ബാഡ്ജുകൾ',
                language: 'ഭാഷ',
                notifications: 'അറിയിപ്പുകൾ',
                salary: 'പ്രതീക്ഷിത ശമ്പളം',
                internships: 'ഇന്റേൺഷിപ്പ്',
                onboardingName: 'നിങ്ങളുടെ പേര് എന്ത്?',
                onboardingGoal: 'നിങ്ങളുടെ സ്വപ്നം/ലക്ഷ്യം',
                academicInterest: 'നിങ്ങൾക്ക് പഠനത്തിൽ താൽപ്പര്യമുണ്ടോ?'
            },
            pa: {
                appName: 'ਡਿਜੀਟਲ ਟਵਿਨ',
                tagline: 'ਭਾਰਤ ਲਈ AI ਕਰੀਅਰ ਨੈਵੀਗੇਟਰ',
                selectLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
                continueBtn: 'ਅੱਗੇ ਵਧੋ',
                getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
                whatAreYourInterests: 'ਤੁਹਾਡੀਆਂ ਦਿਲਚਸਪੀਆਂ ਕੀ ਹਨ?',
                analyzeMyFuture: 'ਮੇਰੇ ਭਵਿੱਖ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ',
                analyzing: 'ਤੁਹਾਡਾ ਡਿਜੀਟਲ ਟਵਿਨ ਬਣ ਰਿਹਾ ਹੈ...',
                dashboard: 'ਡੈਸ਼ਬੋਰਡ',
                roadmap: 'ਰੋਡਮੈਪ',
                colleges: 'ਕਾਲਜ',
                skills: 'ਹੁਨਰ',
                habits: 'ਆਦਤਾਂ',
                chat: 'AI ਮਾਰਗਦਰਸ਼ਕ',
                resume: 'ਰੈਜ਼ਿਊਮੇ',
                settings: 'ਸੈਟਿੰਗਾਂ',
                welcome: 'ਜੀ ਆਇਆਂ',
                send: 'ਭੇਜੋ',
                speak: 'ਬੋਲੋ',
                yes: 'ਹਾਂ',
                no: 'ਨਹੀਂ',
                somewhat: 'ਥੋੜਾ',
                heatmap: 'ਹੁਨਰ ਨਕਸ਼ਾ',
                opportunities: 'ਮੌਕੇ',
                yourLevel: 'ਪੱਧਰ',
                xpPoints: 'XP ਅੰਕ',
                streak: 'ਦਿਨ ਸਟ੍ਰੀਕ',
                badges: 'ਬੈਜ',
                language: 'ਭਾਸ਼ਾ',
                notifications: 'ਸੂਚਨਾਵਾਂ',
                salary: 'ਅਨੁਮਾਨਿਤ ਤਨਖਾਹ',
                internships: 'ਇੰਟਰਨਸ਼ਿਪ',
                onboardingName: 'ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?',
                onboardingGoal: 'ਤੁਹਾਡਾ ਸੁਪਨਾ/ਟੀਚਾ',
                academicInterest: 'ਕੀ ਤੁਸੀਂ ਪੜ੍ਹਾਈ ਵਿੱਚ ਰੁਚੀ ਰੱਖਦੇ ਹੋ?'
            },
            ur: {
                appName: 'ڈیجیٹل ٹوئن',
                tagline: 'ہندوستان کے لیے AI کیریئر رہنما',
                selectLanguage: 'اپنی زبان منتخب کریں',
                continueBtn: 'آگے بڑھیں',
                getStarted: 'شروع کریں',
                whatAreYourInterests: 'آپ کی دلچسپیاں کیا ہیں؟',
                analyzeMyFuture: 'میرے مستقبل کا تجزیہ کریں',
                analyzing: 'آپ کا ڈیجیٹل ٹوئن بن رہا ہے...',
                dashboard: 'ڈیش بورڈ',
                roadmap: 'روڈ میپ',
                colleges: 'کالج',
                skills: 'مہارتیں',
                habits: 'عادات',
                chat: 'AI رہنما',
                resume: 'ریزیومے',
                settings: 'ترتیبات',
                welcome: 'واپس خوش آمدید',
                send: 'بھیجیں',
                speak: 'بولیں',
                yes: 'ہاں',
                no: 'نہیں',
                somewhat: 'کچھ حد تک',
                heatmap: 'مہارت کا نقشہ',
                opportunities: 'مواقع',
                yourLevel: 'سطح',
                xpPoints: 'XP پوائنٹس',
                streak: 'دن کی لکیر',
                badges: 'بیجز',
                language: 'زبان',
                notifications: 'اطلاعات',
                salary: 'متوقع تنخواہ',
                internships: 'انٹرنشپ',
                onboardingName: 'آپ کا نام کیا ہے؟',
                onboardingGoal: 'آپ کا خواب/مقصد',
                academicInterest: 'کیا آپ تعلیم میں دلچسپی رکھتے ہیں؟'
            },
            or: {
                appName: 'ଡ଼ିଜ଼ିଟାଲ ଟ୍ୱିନ',
                tagline: 'ଭାରତ ପାଇଁ AI କ୍ୟାରିୟର ଗାଇଡ',
                selectLanguage: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
                continueBtn: 'ଆଗକୁ ଯାଆନ୍ତୁ',
                getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ',
                whatAreYourInterests: 'ଆପଣଙ୍କ ଆଗ୍ରହ କ\'ଣ?',
                analyzeMyFuture: 'ମୋ ଭବିଷ୍ୟତ ବିଶ୍ଳେଷଣ କରନ୍ତୁ',
                analyzing: 'ଆପଣଙ୍କ ଡ଼ିଜ଼ିଟାଲ ଟ୍ୱିନ ତିଆରି ହେଉଛି...',
                dashboard: 'ଡ଼ାଶବୋର୍ଡ',
                roadmap: 'ରୋଡ଼ମ୍ୟାପ',
                colleges: 'ମହାବିଦ୍ୟାଳୟ',
                skills: 'ଦକ୍ଷତା',
                habits: 'ଅଭ୍ୟାସ',
                chat: 'AI ପଥ ପ୍ରଦର୍ଶକ',
                resume: 'ରେଜ୍ୟୁମେ',
                settings: 'ସେଟିଂ',
                welcome: 'ସ୍ୱାଗତ',
                send: 'ପଠାନ୍ତୁ',
                speak: 'କଥା କୁହନ୍ତୁ',
                yes: 'ହଁ',
                no: 'ନା',
                somewhat: 'କିଛିଟା',
                heatmap: 'ଦକ୍ଷତା ମ୍ୟାପ',
                opportunities: 'ସୁଯୋଗ',
                yourLevel: 'ସ୍ତର',
                xpPoints: 'XP ପଏଣ୍ଟ',
                streak: 'ଦିନ ସ୍ଟ୍ରିକ',
                badges: 'ବ୍ୟାଜ',
                language: 'ଭାଷା',
                notifications: 'ବିଜ୍ଞପ୍ତି',
                salary: 'ଆଶାୟୀ ବେତନ',
                internships: 'ଇଣ୍ଟର୍ନଶିପ',
                onboardingName: 'ଆପଣଙ୍କ ନାମ କ\'ଣ?',
                onboardingGoal: 'ଆପଣଙ୍କ ସ୍ୱପ୍ନ/ଲକ୍ଷ୍ୟ',
                academicInterest: 'ଆପଣ ପଢ଼ାଶୁଣାରେ ଆଗ୍ରହୀ?'
            }
        };

        /* ── CAREER DOMAINS DATA ────────────────────────────────────── */
        var CAREER_DOMAINS = {
            tech: {
                id: 'tech',
                icon: '💻',
                label: 'Technology & Software',
                color: '#4f8ef7',
                academicPath: true,
                description: 'Build software, AI systems, and digital products',
                topRoles: ['Software Engineer', 'AI/ML Engineer', 'Data Scientist', 'Product Manager', 'Cybersecurity Analyst'],
                salaryRange: '₹6–50 LPA',
                demandLevel: 'Very High',
                requiredSkills: ['Python', 'Data Structures', 'Algorithms', 'SQL', 'System Design', 'Problem Solving'],
                softSkills: ['Critical Thinking', 'Communication', 'Team Collaboration', 'Adaptability'],
                dailyHabits: ['1 hr coding practice', '30 min tech reading', '1 LeetCode problem', 'GitHub commit'],
                phases: [{
                        title: 'Foundation',
                        months: '1–3',
                        desc: 'Core programming, DSA basics, 2 mini projects'
                    },
                    {
                        title: 'Specialisation',
                        months: '4–8',
                        desc: 'Choose SWE/AI/Data track, build portfolio'
                    },
                    {
                        title: 'Industry Ready',
                        months: '9–12',
                        desc: 'Internship, system design, job applications'
                    }
                ],
                internships: ['Internshala (Software Dev)', 'LinkedIn (Tech Intern)', 'AngelList (Startup SWE)', 'NASSCOM Internships'],
                certifications: ['Google IT Automation', 'AWS Cloud Practitioner', 'Meta Frontend Cert', 'IBM Data Science'],
                personality: 'Analytical Innovator'
            },
            sports: {
                id: 'sports',
                icon: '🏆',
                label: 'Sports & Athletics',
                color: '#f59e0b',
                academicPath: false,
                description: 'Compete at national/international level, build a sports career',
                topRoles: ['Professional Cricketer', 'Olympic Athlete', 'Football Player', 'Sports Coach', 'Sports Analyst', 'Fitness Trainer'],
                salaryRange: '₹3–5 Crore (elite)',
                demandLevel: 'High (selective)',
                requiredSkills: ['Physical Fitness', 'Sport-specific Technique', 'Mental Resilience', 'Team Dynamics', 'Tactical Thinking'],
                softSkills: ['Discipline', 'Resilience', 'Leadership', 'Focus', 'Recovery Mindset'],
                dailyHabits: ['5:30 AM wake-up', '2 hr sport training', '30 min strength/conditioning', 'Recovery + nutrition', '1 hr mental training / visualization'],
                phases: [{
                        title: 'Physical Foundation',
                        months: '1–6',
                        desc: 'Base fitness, sport fundamentals, local competitions'
                    },
                    {
                        title: 'District/State Level',
                        months: '7–18',
                        desc: 'State championships, SAI selection, professional coaching'
                    },
                    {
                        title: 'National/Elite',
                        months: '19–36',
                        desc: 'National camp, international exposure, sponsorship'
                    }
                ],
                internships: ['SAI Training Centres', 'Sports Authority of India Programs', 'BCCI Academy (Cricket)', 'AIFF Football Academy'],
                certifications: ['NIS Coaching Certificate', 'SAI Level-1 Certificate', 'Fitness Trainer Cert (NSCA)', 'Sports Psychology Diploma'],
                trainingPlan: {
                    morning: '5:30 AM — Wake up + hydration + 20 min yoga/stretch',
                    am: '7:00 AM — Primary sport training (2–3 hrs with coach)',
                    afternoon: '12:00 PM — Rest + nutrition + video analysis',
                    pm: '4:00 PM — Strength & conditioning (1 hr)',
                    evening: '6:00 PM — Recovery: ice bath / foam rolling',
                    night: '9:00 PM — Sleep by 10:00 PM (8–9 hrs mandatory)'
                },
                dietPlan: {
                    breakfast: 'Oats + milk + banana + eggs (protein focus)',
                    snack1: 'Fruits + nuts + protein shake',
                    lunch: 'Rice + daal + 2 veggies + curd + chicken/paneer',
                    snack2: 'Peanut butter sandwich + fruit juice',
                    dinner: 'Roti + chicken/fish + salad',
                    hydration: '4–5 litres water daily',
                    avoid: 'Junk food, carbonated drinks, late meals'
                },
                personality: 'Disciplined Champion'
            },
            business: {
                id: 'business',
                icon: '📈',
                label: 'Business & Entrepreneurship',
                color: '#10b981',
                academicPath: false,
                description: 'Build companies, lead teams, create products people love',
                topRoles: ['Entrepreneur', 'Product Manager', 'Business Analyst', 'Marketing Director', 'Management Consultant', 'VC Analyst'],
                salaryRange: '₹5–40 LPA (employed) | Unlimited (startup)',
                demandLevel: 'High',
                requiredSkills: ['Strategic Thinking', 'Financial Literacy', 'Marketing', 'Sales', 'Leadership', 'Data Analysis', 'Communication'],
                softSkills: ['Risk Tolerance', 'Networking', 'Persuasion', 'Emotional Intelligence', 'Execution Speed'],
                dailyHabits: ['Read 30 pages daily', 'Network with 1 new person', 'Track business metrics', 'Idea journal (3 ideas/day)', 'Financial news 15 min'],
                phases: [{
                        title: 'Learn the Game',
                        months: '1–4',
                        desc: 'Business fundamentals, first side project, online courses'
                    },
                    {
                        title: 'Build & Validate',
                        months: '5–12',
                        desc: 'Launch MVP, find first customers, learn from failure'
                    },
                    {
                        title: 'Scale or Specialise',
                        months: '13–24',
                        desc: 'Raise funding or join high-growth company, build track record'
                    }
                ],
                internships: ['Y Combinator Scout', 'Startup ecosystem (AngelList)', 'Goldman Sachs Intern Program', 'BCG/McKinsey Summer Analyst'],
                certifications: ['Google Digital Marketing', 'CFA Level 1 (Finance track)', 'PMP Certification', 'IIM Executive Programs'],
                personality: 'Strategic Builder'
            },
            arts: {
                id: 'arts',
                icon: '🎨',
                label: 'Arts, Music & Creative',
                color: '#ec4899',
                academicPath: false,
                description: 'Create art, music, film, design that moves people',
                topRoles: ['Film Director', 'Musician', 'Graphic Designer', 'UX Designer', 'Content Creator', 'Animator', 'Writer'],
                salaryRange: '₹2–30 LPA (employed) | Unlimited (creator economy)',
                demandLevel: 'Growing Fast',
                requiredSkills: ['Creative Vision', 'Technical Tool Mastery', 'Storytelling', 'Portfolio Building', 'Industry Networking'],
                softSkills: ['Imagination', 'Persistence', 'Feedback Receptivity', 'Self-promotion', 'Consistency'],
                dailyHabits: ['1 hr of creative practice', 'Consume top 1% work in your niche', 'Create + post content', 'Study successful creators', 'Experiment with new styles'],
                phases: [{
                        title: 'Master the Craft',
                        months: '1–6',
                        desc: 'Tool mastery, style development, first portfolio pieces'
                    },
                    {
                        title: 'Build Audience',
                        months: '7–18',
                        desc: 'Online presence, freelance clients, collabs, competitions'
                    },
                    {
                        title: 'Monetise + Scale',
                        months: '19–36',
                        desc: 'Brand deals, agency clients, courses, licensing'
                    }
                ],
                internships: ['Ogilvy Design Internship', 'Bollywood/OTT assistant roles', 'Gaming companies (Nazara)', 'Advertising agencies (JWT/FCB)'],
                certifications: ['Google UX Design Certificate', 'Adobe Certified Professional', 'NSD (National School of Drama)', 'FTII Diploma'],
                personality: 'Creative Visionary'
            },
            gaming: {
                id: 'gaming',
                icon: '🎮',
                label: 'Gaming & Esports',
                color: '#0ea5e9',
                academicPath: false,
                description: 'Build a career in esports, game content, and game development ecosystem',
                topRoles: ['Esports Athlete', 'Game Developer', 'Game Designer', 'Gaming Content Creator', 'Esports Analyst'],
                salaryRange: '₹3–60 LPA (and prize winnings)',
                demandLevel: 'Fast Growing',
                requiredSkills: ['Game Sense', 'Reaction Time', 'Team Communication', 'Streaming Basics', 'Consistency'],
                softSkills: ['Discipline', 'Calm Under Pressure', 'Strategic Thinking', 'Audience Building', 'Adaptability'],
                dailyHabits: ['2 hr ranked practice', '1 hr VOD review', '30 min aim/reflex drills', '1 content post/day', 'Fitness + wrist care'],
                phases: [{
                        title: 'Foundation',
                        months: '1–3',
                        desc: 'Select game title, improve core mechanics, establish daily practice routine'
                    },
                    {
                        title: 'Competitive Build',
                        months: '4–8',
                        desc: 'Join tournaments/scrims, build team role identity, improve match consistency'
                    },
                    {
                        title: 'Career Scale',
                        months: '9–15',
                        desc: 'Apply for esports org tryouts, build creator profile, monetize through sponsorships'
                    }
                ],
                internships: ['NODWIN Gaming Internship', 'Skyesports Programs', 'Nazara Esports Roles', 'Team/Org Community Manager Internships'],
                certifications: ['Unity Essentials', 'Unreal Fundamentals', 'YouTube Creator Academy', 'Esports Event Management Certificate'],
                personality: 'Tactical Competitor'
            },
            healthcare: {
                id: 'healthcare',
                icon: '🏥',
                label: 'Healthcare & Medicine',
                color: '#ef4444',
                academicPath: true,
                description: 'Save lives, improve health, lead medical innovation',
                topRoles: ['Doctor (MBBS/MD)', 'Surgeon', 'Clinical Researcher', 'Healthcare Administrator', 'Pharmacist', 'Physiotherapist'],
                salaryRange: '₹8–80 LPA',
                demandLevel: 'Always High',
                requiredSkills: ['Biology/Chemistry', 'Clinical Knowledge', 'Empathy', 'Attention to Detail', 'Decision Making', 'Research Skills'],
                softSkills: ['Empathy', 'Composure Under Pressure', 'Communication', 'Ethics', 'Lifelong Learning'],
                dailyHabits: ['Study 6 hrs/day (NEET prep)', 'Biology revision', 'MCQ practice (200/day)', 'Physical fitness 45 min', 'Read medical journals'],
                phases: [{
                        title: 'NEET Preparation',
                        months: '1–12',
                        desc: 'Class 11-12 Biology, Chemistry, Physics, NEET coaching'
                    },
                    {
                        title: 'MBBS',
                        months: '13–78',
                        desc: '5.5 year degree + 1 year internship (mandatory)'
                    },
                    {
                        title: 'Specialisation',
                        months: '79+',
                        desc: 'PG (NEET-PG), MD/MS specialisation, super-speciality'
                    }
                ],
                internships: ['AIIMS Internship', 'Government Hospital Rotations', 'Apollo/Fortis Clinical Exposure', 'NGO Health Camps'],
                certifications: ['USMLE (USA route)', 'PLAB (UK route)', 'DNB Diploma', 'Fellowship Programs (FIAMS)'],
                personality: 'Compassionate Healer'
            },
            finance: {
                id: 'finance',
                icon: '💰',
                label: 'Finance & Commerce',
                color: '#8b5cf6',
                academicPath: true,
                description: 'Master money, drive investment, build financial empires',
                topRoles: ['Chartered Accountant', 'Investment Banker', 'Financial Analyst', 'CFO', 'Equity Researcher', 'FinTech Founder'],
                salaryRange: '₹5–80 LPA',
                demandLevel: 'High',
                requiredSkills: ['Accounting', 'Financial Modelling', 'Excel/Python', 'Risk Analysis', 'Regulatory Knowledge', 'Quantitative Skills'],
                softSkills: ['Analytical Thinking', 'Attention to Detail', 'Client Management', 'Ethical Judgment', 'Pressure Handling'],
                dailyHabits: ['Financial news (ET, Bloomberg)', 'Tally/accounting practice', 'Stock market tracking', 'CA study 5 hrs', 'Excel modelling practice'],
                phases: [{
                        title: 'Foundation',
                        months: '1–6',
                        desc: 'CA Foundation / B.Com, accounting basics, Excel mastery'
                    },
                    {
                        title: 'Certification',
                        months: '7–36',
                        desc: 'CA Intermediate/Final, CFA Level 1, internship'
                    },
                    {
                        title: 'Career Launch',
                        months: '37+',
                        desc: 'Big 4 placement, IB role, or financial startup'
                    }
                ],
                internships: ['Big 4 (Deloitte/EY/KPMG/PWC)', 'Morgan Stanley Summer Analyst', 'NSE/BSE Internship', 'ICAI Articleship'],
                certifications: ['CA (ICAI)', 'CFA (CFA Institute)', 'CPA (for USA route)', 'FRM (Risk Management)'],
                personality: 'Precise Strategist'
            },
            law: {
                id: 'law',
                icon: '⚖️',
                label: 'Law & Justice',
                color: '#0ea5e9',
                academicPath: true,
                description: 'Defend rights, shape policy, ensure justice prevails',
                topRoles: ['Advocate', 'Corporate Lawyer', 'Judge', 'Legal Consultant', 'Public Prosecutor', 'Human Rights Lawyer'],
                salaryRange: '₹4–50 LPA',
                demandLevel: 'Stable',
                requiredSkills: ['Legal Research', 'Drafting', 'Argumentation', 'IPC/CPC/Constitutional Law', 'Litigation Skills'],
                softSkills: ['Persuasion', 'Analytical Writing', 'Composure', 'Ethics', 'Memory', 'Public Speaking'],
                dailyHabits: ['Read 1 case law per day', 'Legal current affairs', 'Moot court practice', 'Legal drafting practice', 'Read Hindu/LiveLaw'],
                phases: [{
                        title: 'LLB Preparation',
                        months: '1–6',
                        desc: 'CLAT/AILET prep for NLU admission, 5-year BA LLB'
                    },
                    {
                        title: 'LLB + Internships',
                        months: '7–60',
                        desc: '5-year degree, 4+ court internships, moot courts'
                    },
                    {
                        title: 'Practice',
                        months: '61+',
                        desc: 'Bar enrollment, chamber/firm start, specialisation'
                    }
                ],
                internships: ['Supreme Court Chamber Internship', 'High Court Internship', 'Law Firm (AZB / Cyril Amarchand)', 'NGO Legal Aid'],
                certifications: ['Bar Council of India Enrollment', 'LLM Specialisation', 'Diploma in Cyber Law', 'Harvard Online Law Courses'],
                personality: 'Principled Advocate'
            },
            civil: {
                id: 'civil',
                icon: '🏛️',
                label: 'Civil Services & Government',
                color: '#f97316',
                academicPath: true,
                description: 'Lead the nation, shape policy, serve 1.4 billion people',
                topRoles: ['IAS Officer', 'IPS Officer', 'IFS Officer', 'State PSC Officer', 'Defense Services (NDA/CDS)'],
                salaryRange: '₹56,100–2,50,000/month + perks',
                demandLevel: 'Highly Selective',
                requiredSkills: ['General Studies', 'Current Affairs', 'Essay Writing', 'Optional Subject Mastery', 'Interview Skills'],
                softSkills: ['Leadership', 'Integrity', 'Decision-making', 'Empathy for Citizens', 'Stress Management'],
                dailyHabits: ['8 hrs UPSC study', 'The Hindu newspaper cover-to-cover', 'Revision of yesterday\'s notes', 'Answer writing practice', 'Yojana/Kurukshetra reading'],
                phases: [{
                        title: 'Foundation',
                        months: '1–6',
                        desc: 'NCERT mastery, basic GS, optional subject selection'
                    },
                    {
                        title: 'Prelims Prep',
                        months: '7–18',
                        desc: 'Full GS syllabus, 5000+ MCQs, test series'
                    },
                    {
                        title: 'Mains + Interview',
                        months: '19–30',
                        desc: 'Answer writing, essay, interview prep, posting'
                    }
                ],
                internships: ['District Magistrate Shadowing', 'Ministry Internship (PMO/Ministries)', 'LBSNAA Programs', 'State Government Internships'],
                certifications: ['IAS/IPS/IFS by clearing UPSC', 'State PSC Exams', 'NDA Examination', 'CDS Examination'],
                personality: 'Visionary Leader'
            }
        };

        /* ── INTEREST OPTIONS (for onboarding) ─────────────────────── */
        var INTEREST_OPTIONS = [{
                id: 'tech',
                icon: '💻',
                label: 'Technology',
                domain: 'tech'
            },
            {
                id: 'sports',
                icon: '⚽',
                label: 'Sports',
                domain: 'sports'
            },
            {
                id: 'business',
                icon: '🚀',
                label: 'Business',
                domain: 'business'
            },
            {
                id: 'arts',
                icon: '🎨',
                label: 'Arts & Music',
                domain: 'arts'
            },
            {
                id: 'healthcare',
                icon: '🏥',
                label: 'Medicine',
                domain: 'healthcare'
            },
            {
                id: 'finance',
                icon: '💰',
                label: 'Finance',
                domain: 'finance'
            },
            {
                id: 'law',
                icon: '⚖️',
                label: 'Law',
                domain: 'law'
            },
            {
                id: 'civil',
                icon: '🏛️',
                label: 'Civil Services',
                domain: 'civil'
            },
            {
                id: 'design',
                icon: '🎯',
                label: 'Design & UX',
                domain: 'arts'
            },
            {
                id: 'gaming',
                icon: '🎮',
                label: 'Gaming & Esports',
                domain: 'gaming'
            },
            {
                id: 'content',
                icon: '📱',
                label: 'Content Creation',
                domain: 'arts'
            },
            {
                id: 'science',
                icon: '🔬',
                label: 'Science & Research',
                domain: 'healthcare'
            }
        ];

        /* ── COLLEGE DATABASE (India-specific, realistic) ───────────── */
        var COLLEGE_DB = {
            tech: [{
                    name: 'IIT Bombay',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    placementRate: '98%',
                    avgPackage: '₹25 LPA',
                    topPackage: '₹2.4 Cr',
                    ranking: '#1 India (NIRF)',
                    why: 'Best tech infrastructure, strongest alumni network, highest-paying placements in India',
                    facilities: 'World-class labs, research centers, international collaborations, 550+ acre campus',
                    growthOpp: 'Research papers, IIT Bombay startup ecosystem, Google/Microsoft direct hire',
                    admissionRoute: 'JEE Advanced (Top 100 rank recommended)',
                    courses: 'B.Tech CSE, Electrical, Mechanical, Chemical'
                },
                {
                    name: 'IIT Delhi',
                    city: 'New Delhi',
                    state: 'Delhi',
                    placementRate: '97%',
                    avgPackage: '₹22 LPA',
                    topPackage: '₹2.1 Cr',
                    ranking: '#2 India (NIRF)',
                    why: 'Capital advantage, proximity to tech MNCs, strong industry linkages',
                    facilities: 'Research parks, incubation center, excellent faculty-student ratio',
                    growthOpp: 'DRDO collaborations, top VC-funded startups, policy connections',
                    admissionRoute: 'JEE Advanced (Top 200 rank)',
                    courses: 'B.Tech CSE, ECE, Mech, Civil'
                },
                {
                    name: 'BITS Pilani',
                    city: 'Pilani',
                    state: 'Rajasthan',
                    placementRate: '93%',
                    avgPackage: '₹18 LPA',
                    topPackage: '₹1.5 Cr',
                    ranking: '#10 India (NIRF)',
                    why: 'Best practice school + work integration (BITS WILP), top startup founders',
                    facilities: 'Industry partnerships, flexible curriculum, Dubai & Goa campuses',
                    growthOpp: 'Practice School (6 months real industry), strong alumni in Silicon Valley',
                    admissionRoute: 'BITSAT Exam',
                    courses: 'CSE, ECE, Mech, Economics + Tech dual degree'
                },
                {
                    name: 'NIT Trichy',
                    city: 'Tiruchirappalli',
                    state: 'Tamil Nadu',
                    placementRate: '92%',
                    avgPackage: '₹12 LPA',
                    topPackage: '₹80 LPA',
                    ranking: '#9 India (NIRF)',
                    why: 'Best NIT in India, excellent placement record, strong industry connections in South India',
                    facilities: 'Smart campus, research labs, placement cell with 400+ companies',
                    growthOpp: 'ISRO collaborations, TCS/Infosys/Wipro major recruiter, R&D projects',
                    admissionRoute: 'JEE Main (95+ percentile)',
                    courses: 'CSE, ECE, Mech, Civil, Chemical'
                }
            ],
            sports: [{
                    name: 'SAI National Centre of Excellence',
                    city: 'Multiple cities',
                    state: 'PAN India',
                    placementRate: 'N/A',
                    avgPackage: 'Scholarship + Stipend',
                    topPackage: 'Olympic funding',
                    ranking: '#1 Sports Institute India',
                    why: 'Government-funded elite training, direct pathway to national teams, world-class coaches',
                    facilities: 'International-standard facilities, sports science labs, physiotherapy, nutrition experts',
                    growthOpp: 'Direct national team selection, CWG/Asian Games/Olympics pathway',
                    admissionRoute: 'National-level performance + trial',
                    courses: 'All Olympic and non-Olympic sports'
                },
                {
                    name: 'LNIPE (Lakshmibai National Institute)',
                    city: 'Gwalior',
                    state: 'Madhya Pradesh',
                    placementRate: '88%',
                    avgPackage: '₹5 LPA',
                    topPackage: '₹15 LPA',
                    ranking: '#1 Sports Education Institute',
                    why: 'Pioneer in sports education, produces India\'s top coaches and PE teachers',
                    facilities: 'Olympic-size pool, athletics track, gymnastics hall, sports hostel',
                    growthOpp: 'NIS coaching, SAI coaching posts, school/college PE faculty',
                    admissionRoute: 'Physical efficiency test + academic scores',
                    courses: 'B.P.Ed, M.P.Ed, Sports Science, Sports Management'
                },
                {
                    name: 'Inspire Institute of Sport',
                    city: 'Bellary',
                    state: 'Karnataka',
                    placementRate: 'N/A',
                    avgPackage: 'Scholarship',
                    topPackage: 'CWG/Olympics',
                    ranking: 'Top Private Sports Institute',
                    why: 'JSW Sports funded, world-class facilities comparable to international standards',
                    facilities: 'Olympic lifting, boxing, wrestling, athletics — all world-class',
                    growthOpp: 'JSW Sports association, international exposure, elite coaching staff',
                    admissionRoute: 'State/national level performance + trial',
                    courses: 'Athletics, Wrestling, Boxing, Judo, Weightlifting'
                }
            ],
            business: [{
                    name: 'IIM Ahmedabad',
                    city: 'Ahmedabad',
                    state: 'Gujarat',
                    placementRate: '100%',
                    avgPackage: '₹35 LPA',
                    topPackage: '₹1.4 Cr',
                    ranking: '#1 Management Institute (QS)',
                    why: 'Most prestigious MBA in India, top consulting/banking placements, legendary alumni',
                    facilities: 'Case-study methodology, incubation center (CIIE), global partner schools',
                    growthOpp: 'BCG/McKinsey/Bain direct placement, Top VC firms, founding your startup',
                    admissionRoute: 'CAT Exam (99+ percentile) + Work Experience',
                    courses: 'PGP (MBA equivalent), PGPX, FPM'
                },
                {
                    name: 'IIM Bangalore',
                    city: 'Bengaluru',
                    state: 'Karnataka',
                    placementRate: '100%',
                    avgPackage: '₹33 LPA',
                    topPackage: '₹1.1 Cr',
                    ranking: '#2 Management Institute',
                    why: 'Silicon Valley of India location, strongest tech+business bridge, startup ecosystem',
                    facilities: 'NSRCEL startup lab, Forbes Top 50 global ranking, 2400+ alumni in Fortune 500',
                    growthOpp: 'Flipkart/Amazon/Google strategy roles, entrepreneurship ecosystem advantage',
                    admissionRoute: 'CAT (99 percentile) + Work Experience',
                    courses: 'PGP, PGPBA, EPGP (Executive)'
                },
                {
                    name: 'SP Jain Institute',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    placementRate: '96%',
                    avgPackage: '₹22 LPA',
                    topPackage: '₹65 LPA',
                    ranking: 'Top 5 India, FT Global Ranked',
                    why: 'Global campuses (Mumbai/Dubai/Singapore/Sydney), strong international exposure',
                    facilities: 'International curriculum, exchange programs, global case competitions',
                    growthOpp: 'International posting, FMCG/consulting/banking top recruiters',
                    admissionRoute: 'GMAT/CAT + Interview',
                    courses: 'Global MBA, MGB (Global Business)'
                }
            ],
            arts: [{
                    name: 'National School of Drama',
                    city: 'New Delhi',
                    state: 'Delhi',
                    placementRate: '95%',
                    avgPackage: 'Variable',
                    topPackage: 'Bollywood/OTT',
                    ranking: '#1 Performing Arts Institute',
                    why: 'Nation\'s premier theatre school, launches careers in film/TV/OTT, legendary alumni (Om Puri, Naseeruddin Shah)',
                    facilities: 'Multiple theatres, design labs, costume/set workshops',
                    growthOpp: 'Direct Bollywood/streaming platform access, International festival invitations',
                    admissionRoute: 'Audition + Interview',
                    courses: '3-year Theatre Arts Diploma'
                },
                {
                    name: 'FTII (Film & TV Institute of India)',
                    city: 'Pune',
                    state: 'Maharashtra',
                    placementRate: '92%',
                    avgPackage: '₹8 LPA',
                    topPackage: 'Unlimited',
                    ranking: '#1 Film School India',
                    why: 'Produced Naseeruddin Shah, A.R. Rahman trained students here; OTT golden era is perfect timing',
                    facilities: 'Production studios, editing suites, screening theatres, archive library',
                    growthOpp: 'Cannes, BAFTA, Hollywood pathway. OTT boom (Netflix/Prime) = massive demand',
                    admissionRoute: 'Written test + Interview',
                    courses: 'Direction, Cinematography, Sound, Editing, Acting'
                },
                {
                    name: 'NID (National Institute of Design)',
                    city: 'Ahmedabad',
                    state: 'Gujarat',
                    placementRate: '95%',
                    avgPackage: '₹15 LPA',
                    topPackage: '₹60 LPA',
                    ranking: '#1 Design Institute India',
                    why: 'Design powerhouse producing product designers, UX leaders, creative directors for global brands',
                    facilities: 'Fab labs, design studios, material library, international visiting faculty',
                    growthOpp: 'Apple/Google/Samsung design teams, own design studio, international fellowships',
                    admissionRoute: 'NID DAT (Design Aptitude Test)',
                    courses: 'Industrial, Communication, Textile, Digital Game, UX Design'
                }
            ],
            gaming: [{
                    name: 'Backstage Pass Institute of Gaming & Technology',
                    city: 'Hyderabad',
                    state: 'Telangana',
                    placementRate: '88%',
                    avgPackage: '₹8 LPA',
                    topPackage: '₹30 LPA',
                    ranking: 'Top Game-Tech Institute',
                    why: 'Focused gaming-tech curriculum with production exposure and esports ecosystem connect',
                    facilities: 'Game dev labs, esports arena setup, mentorship from industry professionals',
                    growthOpp: 'Portfolio-ready game projects, tournament exposure, studio collaboration opportunities',
                    admissionRoute: 'Institute entrance + interview/portfolio',
                    courses: 'Game Development, Game Art, Esports Management, Game QA'
                },
                {
                    name: 'Arena Animation (Game Design Track)',
                    city: 'Multiple cities',
                    state: 'PAN India',
                    placementRate: '84%',
                    avgPackage: '₹6 LPA',
                    topPackage: '₹20 LPA',
                    ranking: 'Top Skill-based Gaming Program',
                    why: 'Strong practical game art and design pipeline with wide city presence',
                    facilities: 'Production labs, project mentorship, career placement support',
                    growthOpp: 'Indie game studios, mobile gaming companies, freelancing + content creation',
                    admissionRoute: 'Direct admission + aptitude screening',
                    courses: 'Game Art, UI for Games, 3D Animation, Design for Interactive Media'
                },
                {
                    name: 'NODWIN Gaming Academy Programs',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    placementRate: 'N/A',
                    avgPackage: 'Stipend / Prize Pools',
                    topPackage: 'Org Contract + Sponsorship',
                    ranking: 'Leading Esports Ecosystem Program',
                    why: 'Direct exposure to India esports operations, tournaments, and professional team structures',
                    facilities: 'Tournament operations, casting/media training, team ecosystem networking',
                    growthOpp: 'Esports org roles, shoutcasting, analyst desk, event management pathway',
                    admissionRoute: 'Program application + performance assessment',
                    courses: 'Esports Operations, Broadcast, Team Management, Competitive Development'
                }
            ],
            healthcare: [{
                    name: 'AIIMS New Delhi',
                    city: 'New Delhi',
                    state: 'Delhi',
                    placementRate: '100%',
                    avgPackage: '₹12 LPA',
                    topPackage: '₹2 Cr (USA)',
                    ranking: '#1 Medical College India',
                    why: 'Most prestigious medical school, produces India\'s top doctors, research institute of national importance',
                    facilities: 'World-class hospital, research labs, superspeciality departments',
                    growthOpp: 'USMLE USA pathway, WHO/UN health organizations, private hospital top salary',
                    admissionRoute: 'NEET UG (Top 50 rank required)',
                    courses: 'MBBS, B.Sc Nursing, BSc Allied Health Sciences'
                },
                {
                    name: 'CMC Vellore',
                    city: 'Vellore',
                    state: 'Tamil Nadu',
                    placementRate: '100%',
                    avgPackage: '₹10 LPA',
                    topPackage: '₹1.8 Cr (abroad)',
                    ranking: '#2 Medical College India',
                    why: 'Asia\'s best teaching hospital, exemplary clinical training, strong missionary ethics',
                    facilities: '2800-bed hospital, 50+ specialities, satellite centers across India',
                    growthOpp: 'US/UK specialist training, excellent research output, humanitarian medicine',
                    admissionRoute: 'NEET UG + CMC entrance test',
                    courses: 'MBBS, Nursing, Allied Health, Dental'
                }
            ],
            finance: [{
                    name: 'SRCC (Shri Ram College of Commerce)',
                    city: 'New Delhi',
                    state: 'Delhi',
                    placementRate: '94%',
                    avgPackage: '₹12 LPA',
                    topPackage: '₹55 LPA',
                    ranking: '#1 Commerce College DU',
                    why: 'Delhi University\'s crown jewel for commerce, top CA and banking recruiters visit every year',
                    facilities: 'Bloomberg terminal lab, finance society events, guest lectures from top bankers',
                    growthOpp: 'CA articleship at Big 4, Goldman/JPMorgan/HSBC preferred campus',
                    admissionRoute: 'CUET Exam (97%+ required)',
                    courses: 'B.Com (Hons), B.A. Economics'
                },
                {
                    name: 'Narsee Monjee (NMIMS)',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    placementRate: '96%',
                    avgPackage: '₹18 LPA',
                    topPackage: '₹75 LPA',
                    ranking: '#4 MBA India (Finance)',
                    why: 'Mumbai advantage = direct access to BSE/NSE, Dalal Street placements, BFSI sector domination',
                    facilities: 'Bloomberg lab, equity research club, CFA prep, live trading simulations',
                    growthOpp: 'BFSI sector = Kotak/HDFC/ICICI/Axis direct placement, Investment banking boutiques',
                    admissionRoute: 'NMAT Exam',
                    courses: 'MBA Finance, BBA Finance, B.Com'
                }
            ],
            law: [{
                    name: 'NLSIU Bangalore (NLS)',
                    city: 'Bengaluru',
                    state: 'Karnataka',
                    placementRate: '98%',
                    avgPackage: '₹18 LPA',
                    topPackage: '₹75 LPA',
                    ranking: '#1 Law School India (NIRF)',
                    why: 'India\'s Harvard Law equivalent, top tier for corporate/SC practice, alumni in top global law firms',
                    facilities: 'Moot court rooms, legal aid clinic, library with 75,000+ volumes',
                    growthOpp: 'UK/USA LLM scholarships, Magic Circle law firms, Supreme Court of India clerking',
                    admissionRoute: 'CLAT (Top 100 rank)',
                    courses: 'BA LLB (5-year integrated)'
                },
                {
                    name: 'NALSAR Hyderabad',
                    city: 'Hyderabad',
                    state: 'Telangana',
                    placementRate: '96%',
                    avgPackage: '₹15 LPA',
                    topPackage: '₹60 LPA',
                    ranking: '#2 Law School India',
                    why: 'Excellent corporate law placement, strong ADR (arbitration) specialisation, tech-law emerging area',
                    facilities: 'International moot court participation, legal research labs, corporate law center',
                    growthOpp: 'AZB, Cyril Amarchand, Trilegal direct placement, international arbitration chambers',
                    admissionRoute: 'CLAT (Top 300 rank)',
                    courses: 'BA LLB (5-year)'
                }
            ],
            civil: [{
                    name: 'LBSNAA (Mussoorie)',
                    city: 'Mussoorie',
                    state: 'Uttarakhand',
                    placementRate: '100%',
                    avgPackage: 'Government salary + perks',
                    topPackage: 'IAS/IPS posting',
                    ranking: 'IAS Training Academy',
                    why: 'Where IAS officers are trained after UPSC selection — the final destination for civil servants',
                    facilities: 'Leadership training, district exposure, international attachments, policy immersion',
                    growthOpp: 'District Collector → Commissioner → Secretary → Cabinet Secretary pathway',
                    admissionRoute: 'Clear UPSC CSE Exam',
                    courses: 'Foundation Course, Service-specific training'
                },
                {
                    name: 'Drishti IAS Academy / Vajiram Ravi',
                    city: 'New Delhi',
                    state: 'Delhi',
                    placementRate: '25% (UPSC avg)',
                    avgPackage: 'Government Scale',
                    topPackage: 'IAS',
                    ranking: 'Top UPSC Coaching',
                    why: 'Proven UPSC methodology, AIR toppers trained here, best GS + optional subject coverage',
                    facilities: 'Test series, answer writing practice, current affairs daily, mock interviews',
                    growthOpp: 'Faster UPSC cracking, structured preparation roadmap',
                    admissionRoute: 'Enrollment (after 12th or graduation)',
                    courses: 'UPSC CSE Full Course (2 years)'
                }
            ]
        };

        /* ── GAMIFICATION DATA ──────────────────────────────────────── */
        var GAMIFICATION = {
            levelThresholds: [0, 100, 250, 500, 900, 1400, 2100, 3000, 4200, 5800, 8000],
            levelNames: ['Newcomer', 'Explorer', 'Seeker', 'Learner', 'Builder', 'Achiever', 'Expert', 'Master', 'Visionary', 'Legend', 'Digital Twin'],
            levelIcons: ['🌱', '🔍', '🎯', '📚', '🏗️', '🏆', '⭐', '💫', '🚀', '🌟', '🤖'],
            badges: [{
                    id: 'first_login',
                    icon: '👋',
                    name: 'First Step',
                    desc: 'Started your Digital Twin journey',
                    xpReward: 50
                },
                {
                    id: 'profile_done',
                    icon: '✅',
                    name: 'Identity Built',
                    desc: 'Completed your full profile',
                    xpReward: 100
                },
                {
                    id: 'first_habit',
                    icon: '📅',
                    name: 'Habit Starter',
                    desc: 'Added your first habit',
                    xpReward: 75
                },
                {
                    id: 'streak_7',
                    icon: '🔥',
                    name: 'Week Warrior',
                    desc: '7-day habit streak',
                    xpReward: 200
                },
                {
                    id: 'streak_30',
                    icon: '💪',
                    name: 'Monthly Champion',
                    desc: '30-day habit streak',
                    xpReward: 500
                },
                {
                    id: 'resume_done',
                    icon: '📄',
                    name: 'Resume Ready',
                    desc: 'Built your first resume',
                    xpReward: 150
                },
                {
                    id: 'roadmap_view',
                    icon: '🗺️',
                    name: 'Navigator',
                    desc: 'Viewed your career roadmap',
                    xpReward: 100
                },
                {
                    id: 'chat_10',
                    icon: '💬',
                    name: 'Curious Mind',
                    desc: '10 conversations with AI mentor',
                    xpReward: 200
                },
                {
                    id: 'skill_5',
                    icon: '⚡',
                    name: 'Skill Collector',
                    desc: 'Added 5 skills to your profile',
                    xpReward: 150
                },
                {
                    id: 'college_view',
                    icon: '🏫',
                    name: 'Dreamer',
                    desc: 'Explored college recommendations',
                    xpReward: 100
                }
            ]
        };

        /* ── HABIT CATEGORIES ───────────────────────────────────────── */
        var HABIT_CATEGORIES = [{
                id: 'study',
                icon: '📚',
                label: 'Study',
                color: '#4f8ef7'
            },
            {
                id: 'fitness',
                icon: '💪',
                label: 'Fitness',
                color: '#10b981'
            },
            {
                id: 'skill',
                icon: '⚡',
                label: 'Skill',
                color: '#f59e0b'
            },
            {
                id: 'health',
                icon: '🥗',
                label: 'Health',
                color: '#ef4444'
            },
            {
                id: 'mindset',
                icon: '🧠',
                label: 'Mindset',
                color: '#8b5cf6'
            },
            {
                id: 'career',
                icon: '🚀',
                label: 'Career',
                color: '#ec4899'
            }
        ];

        /* ── NOTIFICATION TEMPLATES ─────────────────────────────────── */
        var NOTIFICATION_TEMPLATES = [{
                type: 'habit',
                icon: '🔔',
                msg: 'Time for your daily habit check-in! Keep the streak alive.'
            },
            {
                type: 'tip',
                icon: '💡',
                msg: 'Tip: Students who practice 1 hour daily outperform 80% of peers in 6 months.'
            },
            {
                type: 'goal',
                icon: '🎯',
                msg: 'You\'re 3 days away from completing your weekly goal. Push through!'
            },
            {
                type: 'market',
                icon: '📈',
                msg: 'Market insight: AI/ML roles grew 45% YoY. Perfect time to upskill.'
            },
            {
                type: 'badge',
                icon: '🏆',
                msg: 'You\'re close to earning the "Week Warrior" badge. 2 more habit days!'
            }
        ];


        /* ========== LOGIC ========== */
        /* ============================================================
           DIGITAL TWIN PLATFORM — LOGIC LAYER
           State, Analyzer, Dashboard, Features, Chat
           All ES5 — var only, no template literals
           ============================================================ */

        /* ── STATE ──────────────────────────────────────────────────── */
        var DT_STATE = {
            lang: 'en',
            theme: 'light',
            view: 'onboarding',
            profile: null,
            xp: 0,
            level: 1,
            badges: [],
            habits: [],
            habitLog: {},
            chatHistory: [],
            notifications: [],
            chatCount: 0,
            onboarding: {
                step: 0
            }
        };

        /* ── PERSISTENCE ────────────────────────────────────────────── */
        function dtSave() {
            try {
                localStorage.setItem('dt_v2_state', JSON.stringify(DT_STATE));
            } catch (e) {}
        }

        function dtLoad() {
            try {
                var raw = localStorage.getItem('dt_v2_state');
                if (raw) {
                    var saved = JSON.parse(raw);
                    Object.keys(saved).forEach(function(k) {
                        DT_STATE[k] = saved[k];
                    });
                }
            } catch (e) {}
        }

        /* ── i18n HELPER ─────────────────────────────────────────────── */
        function t(key) {
            var lang = DT_STATE.lang || 'en';
            var d = I18N[lang] || I18N.en;
            return d[key] || (I18N.en[key] || key);
        }

        function applyI18n() {
            document.querySelectorAll('[data-i18n]').forEach(function(el) {
                var key = el.getAttribute('data-i18n');
                if (key) el.textContent = t(key);
            });
            document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
                var key = el.getAttribute('data-i18n-ph');
                if (key) el.placeholder = t(key);
            });
            /* Update lang selector */
            var langSel = document.getElementById('lang-select');
            if (langSel) langSel.value = DT_STATE.lang;
            /* Document dir for RTL (Urdu) */
            document.body.dir = (DT_STATE.lang === 'ur') ? 'rtl' : 'ltr';
        }

        function setLang(lang) {
            DT_STATE.lang = lang;
            applyI18n();
            updateInterestPreview();
            renderSettings();
            dtSave();
        }

        /* ── THEME ───────────────────────────────────────────────────── */
        function setTheme(theme) {
            DT_STATE.theme = theme;
            document.body.setAttribute('data-theme', theme);
            var btn = document.getElementById('theme-toggle');
            if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
            var settingsBtn = document.getElementById('theme-toggle-settings');
            if (settingsBtn) settingsBtn.textContent = theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark';
            dtSave();
        }

        function toggleTheme() {
            setTheme(DT_STATE.theme === 'dark' ? 'light' : 'dark');
        }

        /* ── VIEW ROUTER ─────────────────────────────────────────────── */
        function showView(id) {
            document.querySelectorAll('.view').forEach(function(v) {
                v.classList.remove('active');
            });
            var target = document.getElementById('view-' + id);
            if (target) target.classList.add('active');
            DT_STATE.view = id;
            /* Update sidebar active state */
            document.querySelectorAll('.nav-item').forEach(function(n) {
                n.classList.toggle('active', n.getAttribute('data-view') === id);
            });
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        /* ── GAMIFICATION ENGINE ────────────────────────────────────── */
        function addXP(amount, reason) {
            DT_STATE.xp += amount;
            dtSave();
            updateXPBar();
            checkLevelUp();
            if (reason) showToast('⚡', '+' + amount + ' XP — ' + reason, 'xp');
        }

        function getLevelFromXP(xp) {
            var thresholds = GAMIFICATION.levelThresholds;
            var level = 1;
            for (var i = thresholds.length - 1; i >= 0; i--) {
                if (xp >= thresholds[i]) {
                    level = i + 1;
                    break;
                }
            }
            return Math.min(level, thresholds.length);
        }

        function checkLevelUp() {
            var newLevel = getLevelFromXP(DT_STATE.xp);
            if (newLevel > DT_STATE.level) {
                DT_STATE.level = newLevel;
                dtSave();
                showToast('🎉', t('levelUp') + ' Level ' + newLevel + ' — ' + GAMIFICATION.levelNames[newLevel - 1], 'level');
                updateXPBar();
            }
        }

        function updateXPBar() {
            var level = DT_STATE.level;
            var thresholds = GAMIFICATION.levelThresholds;
            var currentLevelXP = thresholds[level - 1] || 0;
            var nextLevelXP = thresholds[level] || thresholds[thresholds.length - 1];
            var progress = Math.round(((DT_STATE.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
            progress = Math.max(0, Math.min(100, progress));

            var xpEl = document.getElementById('xp-value');
            var levelEl = document.getElementById('level-value');
            var barEl = document.getElementById('xp-bar');
            var levelNameEl = document.getElementById('level-name');
            if (xpEl) xpEl.textContent = DT_STATE.xp;
            if (levelEl) levelEl.textContent = DT_STATE.level;
            if (barEl) barEl.style.width = progress + '%';
            if (levelNameEl) levelNameEl.textContent = GAMIFICATION.levelNames[DT_STATE.level - 1] || '';
        }

        function awardBadge(badgeId) {
            if (DT_STATE.badges.indexOf(badgeId) !== -1) return;
            var badge = GAMIFICATION.badges.find(function(b) {
                return b.id === badgeId;
            });
            if (!badge) return;
            DT_STATE.badges.push(badgeId);
            addXP(badge.xpReward, 'Badge: ' + badge.name);
            dtSave();
            showToast(badge.icon, t('badgeEarned') + ' — ' + badge.name, 'badge');
            renderBadges();
        }

        function renderBadges() {
            var container = document.getElementById('badges-grid');
            if (!container) return;
            container.innerHTML = GAMIFICATION.badges.map(function(b) {
                var earned = DT_STATE.badges.indexOf(b.id) !== -1;
                return '<div class="badge-item' + (earned ? ' earned' : ' locked') + '" title="' + b.desc + '">' +
                    '<div class="badge-icon">' + (earned ? b.icon : '🔒') + '</div>' +
                    '<div class="badge-name">' + b.name + '</div>' +
                    '<div class="badge-xp">+' + b.xpReward + ' XP</div>' +
                    '</div>';
            }).join('');
        }

        /* ── ANALYZER ENGINE ────────────────────────────────────────── */
        function detectPrimaryDomain(interests) {
            if (!interests || !interests.length) return 'tech';
            var score = {
                tech: 0,
                gaming: 0,
                sports: 0,
                business: 0,
                arts: 0,
                healthcare: 0,
                finance: 0,
                law: 0,
                civil: 0
            };
            var weights = {
                tech: {
                    tech: 4,
                    gaming: 1
                },
                sports: {
                    sports: 4,
                    gaming: 1
                },
                business: {
                    business: 4,
                    finance: 1
                },
                arts: {
                    arts: 4
                },
                healthcare: {
                    healthcare: 4
                },
                finance: {
                    finance: 4,
                    business: 1
                },
                law: {
                    law: 4,
                    civil: 1
                },
                civil: {
                    civil: 4,
                    law: 1
                },
                design: {
                    arts: 3,
                    tech: 1
                },
                gaming: {
                    gaming: 5,
                    sports: 2,
                    tech: 1
                },
                content: {
                    arts: 4,
                    business: 1
                },
                science: {
                    healthcare: 3,
                    tech: 2
                }
            };

            interests.forEach(function(id) {
                var map = weights[id] || {};
                Object.keys(map).forEach(function(d) {
                    score[d] = (score[d] || 0) + map[d];
                });

                var opt = INTEREST_OPTIONS.find(function(o) {
                    return o.id === id;
                });
                if (opt && opt.domain) {
                    score[opt.domain] = (score[opt.domain] || 0) + 1;
                }
            });

            var tieOrder = ['gaming', 'sports', 'business', 'arts', 'tech', 'healthcare', 'finance', 'law', 'civil'];
            var best = 'tech';
            var bestCount = -1;
            tieOrder.forEach(function(d) {
                if ((score[d] || 0) > bestCount) {
                    bestCount = score[d] || 0;
                    best = d;
                }
            });
            return best;
        }

        function getTopRoleFromInterests(domain, interests, domainData) {
            var roleByInterest = {
                gaming: {
                    gaming: 'Esports Athlete',
                    tech: 'Game Developer'
                },
                design: {
                    arts: 'UI/UX Designer',
                    tech: 'Product Designer'
                },
                content: {
                    arts: 'Content Creator',
                    business: 'Digital Brand Strategist'
                },
                science: {
                    healthcare: 'Clinical Researcher',
                    tech: 'Data Scientist'
                },
                sports: {
                    sports: 'Professional Athlete'
                },
                business: {
                    business: 'Entrepreneur'
                },
                finance: {
                    finance: 'Financial Analyst'
                },
                law: {
                    law: 'Corporate Lawyer'
                },
                civil: {
                    civil: 'IAS Officer'
                }
            };

            var picked = '';
            (interests || []).forEach(function(id) {
                if (picked) return;
                if (roleByInterest[id] && roleByInterest[id][domain]) {
                    picked = roleByInterest[id][domain];
                }
            });

            return picked || (domainData.topRoles && domainData.topRoles[0] ? domainData.topRoles[0] : 'Career Professional');
        }

        function computeAnalysis(profile) {
            var domain = detectPrimaryDomain(profile.interests);

            /* ── NON-ACADEMIC PATH: remap academic domains to practical alternatives ── */
            if (profile.academicInterest === 'no') {
                /* Map: if selected domain requires heavy academics, switch to non-academic equivalent */
                var nonAcMap = {
                    tech: 'tech',
                    /* coding/dev is fine without formal degree */
                    gaming: 'gaming',
                    sports: 'sports',
                    /* sports needs NO academic path */
                    business: 'business',
                    arts: 'arts',
                    healthcare: 'business',
                    /* can't do medicine without degree — suggest business/entrepreneurship */
                    finance: 'business',
                    /* CA/CFA needs academics — suggest entrepreneurship */
                    law: 'business',
                    /* LLB needs degree — suggest business */
                    civil: 'business' /* UPSC needs degree — suggest business */
                };
                domain = nonAcMap[domain] || domain;
            }

            /* ── Set domainData AFTER any domain remapping ── */
            var domainData = CAREER_DOMAINS[domain] || CAREER_DOMAINS.business;
            var isAcademic = (profile.academicInterest !== 'no') && domainData.academicPath;

            /* Compute profile score honestly */
            var skillCount = (profile.skills || []).length;
            var hasGoal = (profile.goal || '').length > 10;
            var hasName = (profile.name || '').length > 1;
            var interestCount = (profile.interests || []).length;
            var rawScore = Math.round(
                (hasName ? 15 : 0) +
                Math.min(skillCount * 8, 35) +
                (hasGoal ? 20 : 0) +
                Math.min(interestCount * 5, 20) +
                ((profile.academicInterest !== undefined) ? 10 : 0)
            );
            var profileScore = Math.max(20, Math.min(90, rawScore));

            var careerMatch = Math.round(60 + (interestCount * 4) + (skillCount * 3));
            careerMatch = Math.max(55, Math.min(96, careerMatch));

            var topRole = getTopRoleFromInterests(domain, profile.interests, domainData);

            return {
                domain: domain,
                domainData: domainData,
                isAcademic: isAcademic,
                profileScore: profileScore,
                careerMatch: careerMatch,
                topRole: topRole,
                personality: domainData.personality,
                salaryRange: domainData.salaryRange,
                requiredSkills: domainData.requiredSkills,
                softSkills: domainData.softSkills,
                dailyHabits: domainData.dailyHabits,
                phases: domainData.phases,
                colleges: COLLEGE_DB[domain] || COLLEGE_DB.tech,
                internships: domainData.internships,
                certifications: domainData.certifications,
                trainingPlan: domainData.trainingPlan || null,
                dietPlan: domainData.dietPlan || null
            };
        }

        /* ── DASHBOARD RENDERER ─────────────────────────────────────── */
        function renderDashboard() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) return;
            var p = DT_STATE.profile;
            var a = p.analysis;
            var name = p.name || 'Explorer';

            /* Welcome */
            var wEl = document.getElementById('dash-welcome');
            if (wEl) wEl.textContent = t('welcome') + ', ' + name + '!';

            /* Domain badge */
            var domEl = document.getElementById('dash-domain');
            if (domEl) domEl.textContent = a.domainData.icon + ' ' + a.domainData.label;

            /* Stats cards */
            setById('stat-career-match', a.careerMatch + '%');
            setById('stat-profile-strength', a.profileScore + '%');
            setById('stat-top-role', a.topRole);
            setById('stat-personality', a.personality);

            /* SaaS Metrics from Backend */
            var be = a.backendEngine;
            if (be && be.primaryCareer) {
                var topRec = be.primaryCareer;
                setById('stat-salary', topRec.salaryBand || 'Data currently unavailable');
                setById('stat-growth', topRec.confidenceLevel ? topRec.confidenceLevel + ' Confidence' : 'Data currently unavailable');
                
                var techContainer = document.getElementById('tech-stack-needed');
                if (techContainer && topRec.importantRequirements) {
                    techContainer.innerHTML = topRec.importantRequirements.map(function(t) {
                        return '<span class="skill-chip sc-blue">' + t + '</span>';
                    }).join('');
                }
                
                var certsContainer = document.getElementById('certs-needed');
                if (certsContainer && topRec.missingSkills) {
                    certsContainer.innerHTML = topRec.missingSkills.map(function(c) {
                        return '<div style="margin-bottom:4px">🎯 ' + c + '</div>';
                    }).join('');
                }
            }
            
            // Render new AI Features
            renderExplainableCareerMatch();
            renderGoalAnalysis();
            renderAlternativeCareers();
            renderActionPlan();
            renderConfidenceIndicator();
            renderCompatibilityMatrix();

            /* XP / level */
            updateXPBar();

            /* Streak */
            var streak = computeStreak();
            setById('streak-count', streak);

            /* Progress bars */
            setTimeout(function() {
                var cmBar = document.getElementById('career-match-bar');
                var psBar = document.getElementById('profile-strength-bar');
                if (cmBar) cmBar.style.width = a.careerMatch + '%';
                if (psBar) psBar.style.width = a.profileScore + '%';
            }, 300);

            /* Skills to learn */
            renderSkillsNeeded(a.requiredSkills);

            /* Today's goals */
            renderTodayGoals();

            /* Radar Chart */
            renderRadarChart();

            /* AI Scenarios */
            renderScenarios();
        }

        function renderScenarios() {
            var container = document.getElementById('ai-scenarios-container');
            var list = document.getElementById('scenarios-list');
            if (!container || !list) return;

            var engine = DT_STATE.profile.analysis.backendEngine;
            if (!engine || !engine.scenarios || engine.scenarios.length === 0) {
                container.style.display = 'none';
                return;
            }

            container.style.display = 'grid';
            list.innerHTML = engine.scenarios.map(function(sc) {
                return '<div style="padding: 1rem; border: 1px solid var(--bdr); border-radius: 8px; background: rgba(255,255,255,0.02);">' +
                    '<h4 style="margin:0 0 0.5rem 0; color: var(--orange); font-size: 1.1rem;">' + sc.title + '</h4>' +
                    '<div style="font-weight: 500; color: #e2e8f0; margin-bottom: 0.25rem;">' + sc.condition + '</div>' +
                    '<div style="font-weight: 500; color: var(--pink); margin-bottom: 0.5rem;">' + sc.but + '</div>' +
                    '<div style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">' + sc.then + '</div>' +
                '</div>';
            }).join('');
        }

        function setById(id, val) {
            var el = document.getElementById(id);
            if (el) el.textContent = val;
        }

        function renderSkillsNeeded(skills) {
            var container = document.getElementById('skills-needed');
            if (!container || !skills) return;
            container.innerHTML = skills.slice(0, 5).map(function(s) {
                return '<span class="skill-chip sc-blue">' + s + '</span>';
            }).join('');
        }

        function renderTodayGoals() {
            var container = document.getElementById('today-goals');
            if (!container) return;
            var todayHabits = DT_STATE.habits.slice(0, 4);
            if (!todayHabits.length) {
                container.innerHTML = '<div class="empty-state">Add habits to track your daily goals! 🎯</div>';
                return;
            }
            var today = new Date().toDateString();
            container.innerHTML = todayHabits.map(function(h) {
                var done = DT_STATE.habitLog[today] && DT_STATE.habitLog[today].indexOf(h.id) !== -1;
                return '<div class="goal-item' + (done ? ' done' : '') + '" onclick="toggleHabitDone(\'' + h.id + '\')">' +
                    '<div class="goal-check">' + (done ? '✅' : '⬜') + '</div>' +
                    '<div class="goal-text">' + h.name + '</div>' +
                    '<div class="goal-cat">' + h.icon + '</div>' +
                    '</div>';
            }).join('');
        }

        let radarChartInstance = null;
        function renderRadarChart() {
            var canvas = document.getElementById('skill-radar-chart');
            if (!canvas) return;
            
            var a = DT_STATE.profile.analysis;
            var be = a.backendEngine;
            if (!be || !be.primaryCareer) return;
            
            var topRec = be.primaryCareer;
            var userSkills = DT_STATE.profile.skills || [];
            
            // Collect all required skills (core + optional)
            var allRequiredSkills = [...topRec.relevantExistingSkills, ...topRec.missingSkills];
            // Take up to 6 key skills for the radar chart to keep it clean
            var radarLabels = allRequiredSkills.slice(0, 6);
            
            var userScores = [];
            var requiredScores = [];
            
            radarLabels.forEach(function(skill) {
                requiredScores.push(100); // The role requires 100% of this skill
                // If user has the skill, they get a high score, otherwise low score
                var hasSkill = topRec.relevantExistingSkills.includes(skill);
                userScores.push(hasSkill ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 20); 
            });

            if (radarChartInstance) {
                radarChartInstance.destroy();
            }

            radarChartInstance = new Chart(canvas, {
                type: 'radar',
                data: {
                    labels: radarLabels,
                    datasets: [{
                        label: 'Your Current Skills',
                        data: userScores,
                        backgroundColor: 'rgba(249, 115, 22, 0.4)', // Orange
                        borderColor: '#f97316',
                        pointBackgroundColor: '#f97316',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#f97316'
                    }, {
                        label: 'Required for Role',
                        data: requiredScores,
                        backgroundColor: 'rgba(55, 65, 81, 0.4)', // Grey
                        borderColor: '#4b5563',
                        pointBackgroundColor: '#4b5563',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#4b5563'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: '#9ca3af', font: { size: 11 } },
                            ticks: { display: false, min: 0, max: 100 }
                        }
                    },
                    plugins: {
                        legend: { labels: { color: '#e5e7eb' } }
                    }
                }
            });
        }
        
        function downloadReport() {
            const element = document.getElementById('view-dashboard');
            
            // Temporarily hide actions that shouldn't be in the PDF
            const actions = element.querySelector('.dash-actions');
            if(actions) actions.style.display = 'none';
            
            const opt = {
                margin:       10,
                filename:     'Career_Intelligence_Report.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2, useCORS: true, logging: false },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            showToast('⏳', 'Generating Premium PDF Report...');

            html2pdf().set(opt).from(element).save().then(() => {
                if(actions) actions.style.display = 'flex';
                showToast('✅', 'Report Downloaded Successfully!');
            }).catch(err => {
                console.error(err);
                if(actions) actions.style.display = 'flex';
                showToast('❌', 'Failed to generate PDF.');
            });
        }

        function getWeeklyHabitData() {
            var data = [0, 0, 0, 0, 0, 0, 0];
            var today = new Date();
            var dow = today.getDay();
            var monday = new Date(today);
            monday.setDate(today.getDate() - ((dow === 0 ? 7 : dow) - 1));
            for (var i = 0; i < 7; i++) {
                var d = new Date(monday);
                d.setDate(monday.getDate() + i);
                var key = d.toDateString();
                if (DT_STATE.habitLog[key]) {
                    data[i] = DT_STATE.habitLog[key].length;
                }
            }
            return data;
        }

        /* ── ROADMAP RENDERER ───────────────────────────────────────── */
        function renderRoadmap() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) return;
            var a = DT_STATE.profile.analysis;
            var domainData = a.domainData;

            var titleEl = document.getElementById('roadmap-title');
            if (titleEl) titleEl.textContent = domainData.icon + ' ' + domainData.label + ' Roadmap';

            var timelineEl = document.getElementById('roadmap-timeline');
            if (!timelineEl || !a.phases) return;

            timelineEl.innerHTML = a.phases.map(function(ph, i) {
                return '<div class="rm-phase" style="animation-delay:' + (i * 0.15) + 's">' +
                    '<div class="rm-phase-num">' + t('phase') + ' ' + (i + 1) + '</div>' +
                    '<div class="rm-phase-content">' +
                    '<div class="rm-phase-title">' + ph.title + '</div>' +
                    '<div class="rm-phase-time">' + ph.months + ' ' + t('timelineMonths') + '</div>' +
                    '<div class="rm-phase-desc">' + ph.desc + '</div>' +
                    '</div></div>';
            }).join('');

            /* Skills section */
            var skillsEl = document.getElementById('roadmap-skills');
            if (skillsEl) {
                skillsEl.innerHTML = '<div class="skills-section">' +
                    '<h4>' + t('skillsToLearn') + '</h4>' +
                    '<div class="skills-wrap">' + (a.requiredSkills || []).map(function(s) {
                        return '<span class="skill-chip blue">' + s + '</span>';
                    }).join('') + '</div>' +
                    '<h4 style="margin-top:1rem;">' + (I18N[DT_STATE.lang] && I18N[DT_STATE.lang].softSkills ? I18N[DT_STATE.lang].softSkills : 'Soft Skills') + '</h4>' +
                    '<div class="skills-wrap">' + (a.softSkills || []).map(function(s) {
                        return '<span class="skill-chip purple">' + s + '</span>';
                    }).join('') + '</div></div>';
            }

            /* Salary */
            var salaryEl = document.getElementById('roadmap-salary');
            if (salaryEl) salaryEl.textContent = a.salaryRange || '';

            /* Sport-specific sections */
            var trainingEl = document.getElementById('training-plan-section');
            var dietEl = document.getElementById('diet-plan-section');
            if (a.domain === 'sports') {
                if (trainingEl && a.trainingPlan) {
                    trainingEl.style.display = 'block';
                    trainingEl.innerHTML = '<h3 class="section-title">🏋️ ' + t('trainingPlan') + '</h3><div class="training-grid">' +
                        Object.keys(a.trainingPlan).map(function(slot) {
                            return '<div class="training-item"><div class="training-slot">' + slot.charAt(0).toUpperCase() + slot.slice(1) + '</div>' +
                                '<div class="training-act">' + a.trainingPlan[slot] + '</div></div>';
                        }).join('') + '</div>';
                }
                if (dietEl && a.dietPlan) {
                    dietEl.style.display = 'block';
                    dietEl.innerHTML = '<h3 class="section-title">🥗 ' + t('dietPlan') + '</h3><div class="diet-grid">' +
                        Object.keys(a.dietPlan).map(function(meal) {
                            return '<div class="diet-item"><div class="diet-meal">' + meal.charAt(0).toUpperCase() + meal.slice(1) + '</div>' +
                                '<div class="diet-desc">' + a.dietPlan[meal] + '</div></div>';
                        }).join('') + '</div>';
                }
            } else {
                if (trainingEl) trainingEl.style.display = 'none';
                if (dietEl) dietEl.style.display = 'none';
            }

            /* Internships */
            var intEl = document.getElementById('roadmap-internships');
            if (intEl) {
                intEl.innerHTML = (a.internships || []).map(function(intern) {
                    return '<div class="intern-chip">' + intern + '</div>';
                }).join('');
            }

            /* Certs */
            var certEl = document.getElementById('roadmap-certs');
            if (certEl) {
                certEl.innerHTML = (a.certifications || []).map(function(c) {
                    return '<div class="cert-chip">🏆 ' + c + '</div>';
                }).join('');
            }

            awardBadge('roadmap_view');
            addXP(25, 'Viewed roadmap');
        }

        function downloadRoadmapPdf() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) {
                showToast('⚠️', 'Generate your profile roadmap first');
                return;
            }

            if (!window.jspdf || !window.jspdf.jsPDF) {
                showToast('⚠️', 'PDF library could not load. Please check internet and try again.');
                return;
            }

            var a = DT_STATE.profile.analysis;
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4'
            });

            var pageW = doc.internal.pageSize.getWidth();
            var pageH = doc.internal.pageSize.getHeight();
            var margin = 42;
            var y = 48;

            var drawFooter = function() {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(100, 116, 139);
                doc.text('Generated by Digital Twin | Eco-Novators', margin, pageH - 22);
            };

            var nextPage = function() {
                drawFooter();
                doc.addPage();
                y = 44;
            };

            var ensureSpace = function(h) {
                if (y + h <= pageH - 56) return;
                nextPage();
            };

            doc.setFillColor(17, 24, 39);
            doc.roundedRect(margin, y, pageW - (margin * 2), 106, 10, 10, 'F');
            doc.setFillColor(29, 78, 216);
            doc.roundedRect(margin, y + 74, pageW - (margin * 2), 32, 0, 0, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(22);
            doc.text((a.domainData.icon || '🗺️') + ' ' + a.domainData.label + ' Roadmap', margin + 14, y + 34);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10.5);
            doc.text('Prepared for: ' + (DT_STATE.profile.name || 'Student'), margin + 14, y + 56);
            doc.text('Expected Salary: ' + (a.salaryRange || 'N/A'), margin + 14, y + 94);
            y += 126;

            var drawSection = function(title, lines) {
                if (!lines || !lines.length) return;
                ensureSpace(44);

                doc.setFillColor(232, 240, 255);
                doc.setDrawColor(189, 215, 255);
                doc.roundedRect(margin, y, pageW - (margin * 2), 24, 6, 6, 'FD');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.setTextColor(15, 76, 129);
                doc.text(title, margin + 10, y + 16);
                y += 34;

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10.4);
                doc.setTextColor(30, 41, 59);

                lines.forEach(function(line) {
                    var wrapped = doc.splitTextToSize('• ' + line, pageW - (margin * 2));
                    ensureSpace((wrapped.length * 14) + 3);
                    doc.text(wrapped, margin, y);
                    y += (wrapped.length * 14) + 3;
                });

                y += 8;
            };

            var phaseLines = (a.phases || []).map(function(ph, i) {
                return 'Phase ' + (i + 1) + ' (' + ph.months + '): ' + ph.title + ' — ' + ph.desc;
            });

            drawSection('Roadmap Phases', phaseLines);
            drawSection('Core Skills', a.requiredSkills || []);
            drawSection('Soft Skills', a.softSkills || []);
            drawSection('Internships & Programs', a.internships || []);
            drawSection('Certifications', a.certifications || []);

            if (a.trainingPlan && a.domain === 'sports') {
                drawSection('Training Plan', Object.keys(a.trainingPlan).map(function(k) {
                    return k.charAt(0).toUpperCase() + k.slice(1) + ': ' + a.trainingPlan[k];
                }));
            }

            drawFooter();
            doc.save('Roadmap_' + (a.domain || 'career') + '.pdf');
            showToast('📘', 'Roadmap PDF downloaded successfully!');
        }

        /* ── COLLEGE RENDERER ───────────────────────────────────────── */
        function renderColleges() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) return;
            var a = DT_STATE.profile.analysis;
            var colleges = a.colleges || [];

            var container = document.getElementById('colleges-grid');
            if (!container) return;

            container.innerHTML = colleges.map(function(c, i) {
                // Determine if this is an AI-generated institution (has type, location) or old static COLLEGE_DB format
                var isAI = c.type !== undefined;
                var rankLbl = isAI ? c.type : (c.ranking || '');
                var loc = isAI ? c.location : ((c.city || '') + ', ' + (c.state || ''));
                var whyTxt = isAI ? c.whyRecommended : c.why;
                var statsHtml = isAI ? '' : (
                    '<div class="college-stats">' +
                    '<div class="college-stat"><div class="cs-val">' + (c.placementRate || 'N/A') + '</div><div class="cs-lbl">' + t('placementRate') + '</div></div>' +
                    '<div class="college-stat"><div class="cs-val">' + (c.avgPackage || 'N/A') + '</div><div class="cs-lbl">' + t('avgPackage') + '</div></div>' +
                    '<div class="college-stat"><div class="cs-val">' + (c.topPackage || 'N/A') + '</div><div class="cs-lbl">Top Package</div></div>' +
                    '</div>'
                );
                var growthHtml = isAI ? '' : '<div class="college-opp"><div class="opp-title">🚀 Growth Opportunities</div><div class="opp-body">' + (c.growthOpp || '') + '</div></div>';
                var coursesHtml = isAI ? '' : '<span class="courses-tag">' + (c.courses || '') + '</span>';
                
                return '<div class="college-card" style="animation-delay:' + (i * 0.1) + 's">' +
                    '<div class="college-top">' +
                    '<div class="college-rank">#' + (i + 1) + ' Pick</div>' +
                    '<div class="college-name">' + c.name + '</div>' +
                    '<div class="college-loc">📍 ' + loc + '</div>' +
                    '<div class="college-rank-badge">' + rankLbl + '</div>' +
                    '</div>' +
                    statsHtml +
                    '<div class="college-why"><div class="why-title">💡 ' + t('whyThisCollege') + '</div><div class="why-body">' + whyTxt + '</div></div>' +
                    growthHtml +
                    '<div class="college-admission"><div class="adm-title">📝 Admission Route</div><div class="adm-body">' + (c.admissionRoute || 'N/A') + '</div></div>' +
                    '<div class="college-footer">' + coursesHtml + '</div></div>';
            }).join('');

            awardBadge('college_view');
        }

        /* ── SKILL HEATMAP ──────────────────────────────────────────── */
        function renderSkillHeatmap() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) return;
            var a = DT_STATE.profile.analysis;
            var userSkills = DT_STATE.profile.skills || [];
            var allSkills = (a.requiredSkills || []).concat(a.softSkills || []);

            var container = document.getElementById('heatmap-grid');
            if (!container) return;

            container.innerHTML = allSkills.map(function(skill) {
                var hasIt = userSkills.some(function(us) {
                    return us.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(us.toLowerCase());
                });
                var level = hasIt ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 2);
                var labels = ['None', 'Basic', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
                var colors = ['#1f2937', '#374151', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'];
                return '<div class="heatmap-cell" style="background:' + colors[level] + '" title="' + skill + ': ' + labels[level] + '">' +
                    '<div class="hm-skill">' + skill + '</div>' +
                    '<div class="hm-level">' + labels[level] + '</div>' +
                    '</div>';
            }).join('');
        }

        /* ── OPPORTUNITIES (INTERNSHIPS) ────────────────────────────── */
        function getOpportunityApplyLink(internText, domain) {
            var text = (internText || '').toLowerCase();
            if (text.indexOf('internshala') !== -1) return 'https://internshala.com/';
            if (text.indexOf('linkedin') !== -1) return 'https://www.linkedin.com/jobs/';
            if (text.indexOf('angellist') !== -1 || text.indexOf('wellfound') !== -1) return 'https://wellfound.com/jobs';
            if (text.indexOf('nasscom') !== -1) return 'https://nasscom.in/';
            if (text.indexOf('esport') !== -1 || text.indexOf('nodwin') !== -1 || text.indexOf('skyesport') !== -1) return 'https://www.nodwingaming.com/';
            if (text.indexOf('sports authority of india') !== -1 || text.indexOf('sai') !== -1) return 'https://sportsauthorityofindia.nic.in/';
            if (text.indexOf('bcci') !== -1) return 'https://www.bcci.tv/';
            if (text.indexOf('aiff') !== -1) return 'https://www.the-aiff.com/';
            if (text.indexOf('y combinator') !== -1) return 'https://www.ycombinator.com/jobs';
            if (text.indexOf('goldman') !== -1) return 'https://www.goldmansachs.com/careers/students/';
            if (text.indexOf('bcg') !== -1) return 'https://careers.bcg.com/global/en/students';
            if (text.indexOf('mckinsey') !== -1) return 'https://www.mckinsey.com/careers/students';
            if (text.indexOf('ogilvy') !== -1) return 'https://www.ogilvy.com/careers';
            if (text.indexOf('nazara') !== -1) return 'https://nazaratechnologies.com/careers/';
            if (text.indexOf('apollo') !== -1) return 'https://www.apollohospitals.com/careers/';
            if (text.indexOf('fortis') !== -1) return 'https://www.fortishealthcare.com/careers';
            if (text.indexOf('aiims') !== -1) return 'https://www.aiims.edu/';
            if (text.indexOf('morgan stanley') !== -1) return 'https://www.morganstanley.com/careers/students-graduates';
            if (text.indexOf('nse') !== -1 || text.indexOf('bse') !== -1) return 'https://www.nseindia.com/resources/exchange-communication-careers';
            if (text.indexOf('icai') !== -1 || text.indexOf('big 4') !== -1) return 'https://www.icai.org/';
            if (text.indexOf('supreme court') !== -1) return 'https://www.sci.gov.in/';
            if (text.indexOf('high court') !== -1) return 'https://doj.gov.in/high-courts-of-india/';
            if (text.indexOf('azb') !== -1 || text.indexOf('cyril') !== -1) return 'https://www.azbpartners.com/careers/';
            if (text.indexOf('lbsnaa') !== -1) return 'https://www.lbsnaa.gov.in/';
            if (text.indexOf('ministry') !== -1 || text.indexOf('district') !== -1 || text.indexOf('state government') !== -1) return 'https://www.india.gov.in/my-government/government-jobs';

            var fallbackByDomain = {
                tech: 'https://www.linkedin.com/jobs/',
                gaming: 'https://www.nodwingaming.com/',
                sports: 'https://sportsauthorityofindia.nic.in/',
                business: 'https://www.linkedin.com/jobs/',
                arts: 'https://www.linkedin.com/jobs/',
                healthcare: 'https://www.nhp.gov.in/',
                finance: 'https://www.linkedin.com/jobs/',
                law: 'https://www.barcouncilofindia.org/',
                civil: 'https://upsc.gov.in/'
            };

            return fallbackByDomain[domain] || 'https://www.linkedin.com/jobs/';
        }

        function renderOpportunities() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) return;
            var a = DT_STATE.profile.analysis;
            var container = document.getElementById('opportunities-list');
            if (!container) return;

            var opps = (a.internships || []).map(function(intern, i) {
                return {
                    title: intern.split('(')[0].trim(),
                    org: intern.split('(')[1] ? intern.split('(')[1].replace(')', '') : 'India',
                    type: ['Internship', 'Program', 'Placement'][i % 3],
                    duration: ['2 months', '3 months', '6 months', '1 year'][i % 4],
                    stipend: ['₹15,000/mo', '₹20,000/mo', '₹25,000/mo', 'Unpaid + Certificate'][i % 4],
                    applyUrl: getOpportunityApplyLink(intern, a.domain)
                };
            });

            container.innerHTML = opps.map(function(op, i) {
                return '<div class="opp-card">' +
                    '<div class="opp-header"><div class="opp-title">' + op.title + '</div>' +
                    '<span class="opp-type">' + op.type + '</span></div>' +
                    '<div class="opp-org">🏢 ' + op.org + '</div>' +
                    '<div class="opp-meta">' +
                    '<span>⏱ ' + op.duration + '</span>' +
                    '<span>💵 ' + op.stipend + '</span>' +
                    '</div>' +
                    '<div class="opp-card-actions">' +
                    '<a class="opp-btn" href="' + op.applyUrl + '" onclick="showToast(\'🌐\',\'Redirecting to official application page...\')">' + t('applyNow') + ' →</a>' +
                    '</div>' +
                    '</div>';
            }).join('');
        }

        /* ── HABIT TRACKER ──────────────────────────────────────────── */
        function renderHabits() {
            var container = document.getElementById('habits-list');
            if (!container) return;
            var today = new Date().toDateString();
            var todayLog = DT_STATE.habitLog[today] || [];

            if (!DT_STATE.habits.length) {
                container.innerHTML = '<div class="empty-state">No habits yet. Add your first one! 💪</div>';
            } else {
                container.innerHTML = DT_STATE.habits.map(function(h) {
                    var done = todayLog.indexOf(h.id) !== -1;
                    var streak = computeHabitStreak(h.id);
                    return '<div class="habit-card' + (done ? ' done' : '') + '">' +
                        '<div class="habit-left">' +
                        '<div class="habit-icon" style="background:' + h.color + '">' + h.icon + '</div>' +
                        '<div class="habit-info">' +
                        '<div class="habit-name">' + h.name + '</div>' +
                        '<div class="habit-meta"><span>🔥 ' + streak + ' days</span><span style="margin-left:.5rem">' + h.time + '</span></div>' +
                        '</div></div>' +
                        '<div class="habit-right">' +
                        '<button class="habit-done-btn' + (done ? ' done' : '') + '" onclick="toggleHabitDone(\'' + h.id + '\')">' +
                        (done ? '✅ Done' : t('markDone')) + '</button>' +
                        '<button class="habit-del" onclick="deleteHabit(\'' + h.id + '\')">🗑</button>' +
                        '</div></div>';
                }).join('');
            }

            /* Streak display */
            setById('total-streak', computeStreak());
            renderTodayGoals();
        }

        function toggleHabitDone(habitId) {
            var today = new Date().toDateString();
            if (!DT_STATE.habitLog[today]) DT_STATE.habitLog[today] = [];
            var log = DT_STATE.habitLog[today];
            var idx = log.indexOf(habitId);
            if (idx === -1) {
                log.push(habitId);
                addXP(20, 'Habit completed');
                var streak = computeStreak();
                if (streak === 7) awardBadge('streak_7');
                if (streak === 30) awardBadge('streak_30');
            } else {
                log.splice(idx, 1);
            }
            dtSave();
            renderHabits();
            renderTodayGoals();
        }

        function computeHabitStreak(habitId) {
            var streak = 0;
            var d = new Date();
            for (var i = 0; i < 365; i++) {
                var key = d.toDateString();
                if (DT_STATE.habitLog[key] && DT_STATE.habitLog[key].indexOf(habitId) !== -1) {
                    streak++;
                    d.setDate(d.getDate() - 1);
                } else {
                    break;
                }
            }
            return streak;
        }

        function computeStreak() {
            if (!DT_STATE.habits.length) return 0;
            var streak = 0;
            var d = new Date();
            for (var i = 0; i < 365; i++) {
                var key = d.toDateString();
                if (DT_STATE.habitLog[key] && DT_STATE.habitLog[key].length > 0) {
                    streak++;
                    d.setDate(d.getDate() - 1);
                } else {
                    break;
                }
            }
            return streak;
        }

        function addHabit() {
            var name = document.getElementById('habit-name-inp');
            var catEl = document.getElementById('habit-cat-inp');
            var timeEl = document.getElementById('habit-time-inp');
            if (!name || !name.value.trim()) {
                showToast('⚠️', 'Please enter a habit name');
                return;
            }
            var catId = catEl ? catEl.value : 'study';
            var cat = HABIT_CATEGORIES.find(function(c) {
                return c.id === catId;
            }) || HABIT_CATEGORIES[0];
            var habit = {
                id: 'h_' + Date.now(),
                name: name.value.trim(),
                category: catId,
                icon: cat.icon,
                color: cat.color,
                time: timeEl ? timeEl.value : '09:00'
            };
            DT_STATE.habits.push(habit);
            dtSave();
            name.value = '';
            renderHabits();
            awardBadge('first_habit');
            addXP(30, 'Added habit');
            closeModal('habit-modal');
            showToast('✅', 'Habit added! Stay consistent 💪');
        }

        function deleteHabit(habitId) {
            DT_STATE.habits = DT_STATE.habits.filter(function(h) {
                return h.id !== habitId;
            });
            dtSave();
            renderHabits();
        }

        /* ── RESUME BUILDER ─────────────────────────────────────────── */
        function generateResume() {
            var get = function(id) {
                var el = document.getElementById(id);
                return el ? el.value.trim() : '';
            };
            var name = get('res-name');
            var email = get('res-email');
            var phone = get('res-phone');
            var summary = get('res-summary');
            var skills = get('res-skills');
            var experience = get('res-experience');
            var education = get('res-education');

            if (!name) {
                showToast('⚠️', 'Please enter your name');
                return;
            }

            var output = document.getElementById('resume-output');
            if (!output) return;

            output.innerHTML = '<div class="resume-doc">' +
                '<div class="res-header">' +
                '<div class="res-name">' + name + '</div>' +
                '<div class="res-contact">' +
                (email ? '<span>✉ ' + email + '</span>' : '') +
                (phone ? '<span>📞 ' + phone + '</span>' : '') +
                '</div></div>' +
                (summary ? '<div class="res-section"><div class="res-sec-title">Professional Summary</div><div class="res-sec-body">' + summary + '</div></div>' : '') +
                (skills ? '<div class="res-section"><div class="res-sec-title">Skills</div><div class="res-skills-wrap">' + skills.split(',').map(function(s) {
                    return '<span class="res-skill-chip">' + s.trim() + '</span>';
                }).join('') + '</div></div>' : '') +
                (experience ? '<div class="res-section"><div class="res-sec-title">Experience</div><div class="res-sec-body">' + experience.replace(/\n/g, '<br>') + '</div></div>' : '') +
                (education ? '<div class="res-section"><div class="res-sec-title">Education</div><div class="res-sec-body">' + education.replace(/\n/g, '<br>') + '</div></div>' : '') +
                '<div class="res-footer">Powered by Digital Twin — digitaltwin.niat.tech</div>' +
                '</div>';

            output.style.display = 'block';
            awardBadge('resume_done');
            addXP(75, 'Built resume');
            showToast('✅', 'Resume generated! Click Download to get a styled PDF.');
        }

        function downloadResume() {
            var getVal = function(id) {
                var el = document.getElementById(id);
                return el ? el.value.trim() : '';
            };
            var name = getVal('res-name');
            var email = getVal('res-email');
            var phone = getVal('res-phone');
            var summary = getVal('res-summary');
            var skills = getVal('res-skills');
            var experience = getVal('res-experience');
            var education = getVal('res-education');

            if (!name) {
                showToast('⚠️', 'Please enter your name');
                return;
            }

            if (!window.jspdf || !window.jspdf.jsPDF) {
                showToast('⚠️', 'PDF library could not load. Please check internet and try again.');
                return;
            }

            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4'
            });

            var pageW = doc.internal.pageSize.getWidth();
            var pageH = doc.internal.pageSize.getHeight();
            var margin = 46;
            var y = 48;
            var lineHeight = 14;
            var footerText = 'Generated by Digital Twin | Eco-Novators';

            var renderFooter = function() {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(100, 116, 139);
                doc.text(footerText, margin, pageH - 24);
            };

            var startNewPage = function() {
                renderFooter();
                doc.addPage();
                y = 52;
            };

            doc.setFillColor(15, 76, 129);
            doc.roundedRect(margin, y, pageW - (margin * 2), 94, 10, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(24);
            doc.text(name, margin + 16, y + 34);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10.5);
            var contactLine = [email, phone].filter(function(v) {
                return !!v;
            }).join('  |  ');
            if (contactLine) {
                doc.text(contactLine, margin + 16, y + 58);
            }

            doc.setFontSize(9);
            doc.setTextColor(219, 234, 254);
            doc.text('Digital Twin Resume Profile', margin + 16, y + 78);
            y += 120;

            var ensureSpace = function(heightNeeded) {
                if (y + heightNeeded <= pageH - 58) return;
                startNewPage();
            };

            var drawSectionHeader = function(title, continuation) {
                doc.setFillColor(234, 243, 255);
                doc.setDrawColor(196, 219, 245);
                doc.roundedRect(margin, y, pageW - (margin * 2), 24, 6, 6, 'FD');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11.5);
                doc.setTextColor(11, 92, 173);
                doc.text(continuation ? (title + ' (cont.)') : title, margin + 12, y + 16);
                y += 34;
            };

            var drawSection = function(title, body) {
                if (!body) return;
                ensureSpace(72);
                drawSectionHeader(title, false);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10.5);
                doc.setTextColor(31, 41, 55);
                var cleanBody = body.replace(/\r/g, '\n');
                var wrapped = doc.splitTextToSize(cleanBody, pageW - (margin * 2));

                while (wrapped.length) {
                    var availablePx = pageH - 58 - y;
                    var maxLines = Math.floor(availablePx / lineHeight);
                    if (maxLines <= 0) {
                        startNewPage();
                        drawSectionHeader(title, true);
                        continue;
                    }

                    var chunk = wrapped.splice(0, maxLines);
                    doc.text(chunk, margin, y);
                    y += chunk.length * lineHeight;

                    if (wrapped.length) {
                        y += 8;
                        startNewPage();
                        drawSectionHeader(title, true);
                    } else {
                        y += 10;
                    }
                }
            };

            drawSection('Professional Summary', summary);

            if (skills) {
                var skillLine = skills.split(',').map(function(s) {
                    return s.trim();
                }).filter(function(s) {
                    return !!s;
                }).join('  •  ');
                drawSection('Skills', skillLine);
            }

            drawSection('Experience / Projects', experience);
            drawSection('Education', education);

            renderFooter();

            var safeName = name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
            doc.save('Resume_' + safeName + '.pdf');
            showToast('📄', 'Resume PDF downloaded successfully!');
        }

        /* ── PEER COMPARISON ────────────────────────────────────────── */
        function renderPeerComparison() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) return;
            var a = DT_STATE.profile.analysis;
            var score = a.profileScore;

            /* Simulate peer distribution */
            var rank = Math.round(100 - score * 0.8);
            var abovePct = 100 - rank;

            setById('peer-rank', rank + 'th percentile');
            setById('peer-above', abovePct + '% ' + t('belowPeers'));
            setById('peer-score', score + '%');

            /* Bar chart of comparison */
            var container = document.getElementById('peer-chart');
            if (!container) return;
            var categories = ['Skills', 'Profile Completeness', 'Habit Consistency', 'Goal Clarity'];
            var myScores = [score, Math.min(90, score + 5), computeStreak() * 5, (DT_STATE.profile.goal ? 80 : 40)];
            var avgScores = [55, 60, 40, 55];
            var legend = '<div class="peer-legend">' +
                '<span><span class="peer-legend-dot mine"></span>You</span>' +
                '<span><span class="peer-legend-dot avg"></span>Peer Avg</span>' +
                '</div>';
            container.innerHTML = legend + categories.map(function(cat, i) {
                var myVal = Math.min(Math.round(myScores[i]), 100);
                var avgVal = Math.round(avgScores[i]);
                return '<div class="peer-row">' +
                    '<div class="peer-cat">' + cat + '</div>' +
                    '<div class="peer-bars">' +
                    '<div class="peer-bar-wrap">' +
                    '<div class="peer-bar-track"><div class="peer-bar mine" style="width:' + myVal + '%"></div></div>' +
                    '<span class="peer-bar-lbl">You: ' + myVal + '%</span>' +
                    '</div>' +
                    '<div class="peer-bar-wrap">' +
                    '<div class="peer-bar-track"><div class="peer-bar avg" style="width:' + avgVal + '%"></div></div>' +
                    '<span class="peer-bar-lbl">Avg: ' + avgVal + '%</span>' +
                    '</div>' +
                    '</div></div>';
            }).join('');
        }

        /* ── PERSONALITY ANALYSIS ───────────────────────────────────── */
        function renderPersonality() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) return;
            var a = DT_STATE.profile.analysis;
            var container = document.getElementById('personality-result');
            if (!container) return;

            var traits = {
                tech: ['Analytical', 'Detail-oriented', 'Problem Solver', 'Systematic', 'Curious'],
                gaming: ['Tactical', 'Fast Decision-maker', 'Composed', 'Competitive', 'Adaptive'],
                sports: ['Disciplined', 'Resilient', 'Competitive', 'Team Player', 'Goal-focused'],
                business: ['Strategic', 'Risk-taker', 'Networker', 'Persuasive', 'Ambitious'],
                arts: ['Creative', 'Expressive', 'Intuitive', 'Sensitive', 'Visionary'],
                healthcare: ['Empathetic', 'Detail-focused', 'Patient', 'Service-oriented', 'Precise'],
                finance: ['Analytical', 'Risk-aware', 'Methodical', 'Data-driven', 'Disciplined'],
                law: ['Logical', 'Articulate', 'Principled', 'Tenacious', 'Detail-oriented'],
                civil: ['Leadership', 'Integrity', 'Public Service', 'Empathy', 'Strategic']
            };

            var domainTraits = traits[a.domain] || traits.tech;
            container.innerHTML = '<div class="personality-card">' +
                '<div class="personality-type">' + a.personality + '</div>' +
                '<div class="personality-traits">' + domainTraits.map(function(tr) {
                    return '<span class="trait-chip">' + tr + '</span>';
                }).join('') + '</div>' +
                '<div class="personality-desc">Based on your interests and goals, you have the mindset of a <strong>' + a.personality + '</strong>. This personality type excels in ' + a.domainData.label + ' and thrives when given autonomy and clear goals.</div>' +
                '</div>';
        }

        /* ── AI CHAT ─────────────────────────────────────────────────── */
        function buildSystemPrompt() {
            if (!DT_STATE.profile) return 'You are Digital Twin, an AI career mentor for Indian students. Be helpful, honest and encouraging.';
            var p = DT_STATE.profile;
            var a = p.analysis;
            return 'You are Digital Twin, an AI career mentor for Indian students. You are warm, direct, and encouraging.' +
                '\nStudent: ' + (p.name || 'Student') +
                '\nDomain: ' + (a ? a.domainData.label : 'Unknown') +
                '\nTop Role: ' + (a ? a.topRole : 'TBD') +
                '\nProfile Score: ' + (a ? a.profileScore + '%' : 'TBD') +
                '\nSkills: ' + (p.skills || []).join(', ') +
                '\nGoal: ' + (p.goal || 'Not set') +
                '\nLanguage preference: ' + DT_STATE.lang +
                '\nRules: Keep responses under 200 words. Be specific to their field. Always end with 1 action step. No generic advice. If off-topic, gently redirect to career guidance.';
        }

        function sendChatMsg() {
            var inp = document.getElementById('chat-input');
            if (!inp) return;
            var text = inp.value.trim();
            if (!text) return;
            inp.value = '';
            appendMsg(text, 'user');
            DT_STATE.chatHistory.push({
                role: 'user',
                content: text
            });
            DT_STATE.chatCount++;
            if (DT_STATE.chatCount >= 10) awardBadge('chat_10');
            showTypingIndicator();

            if (!DT_CFG.apiKey) {
                setTimeout(function() {
                    removeTypingIndicator();
                    var reply = getDemoMentorReply(text);
                    appendMsg(reply, 'bot');
                    DT_STATE.chatHistory.push({
                        role: 'assistant',
                        content: reply
                    });
                    dtSave();
                }, 800 + Math.random() * 700);
                return;
            }

            fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': DT_CFG.apiKey,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true'
                    },
                    body: JSON.stringify({
                        model: DT_CFG.model,
                        max_tokens: 600,
                        system: buildSystemPrompt(),
                        messages: DT_STATE.chatHistory.slice(-10)
                    })
                })
                .then(function(r) {
                    return r.json();
                })
                .then(function(d) {
                    removeTypingIndicator();
                    var reply = d.content && d.content[0] ? d.content[0].text : 'Could not get response. Try again.';
                    appendMsg(reply, 'bot');
                    DT_STATE.chatHistory.push({
                        role: 'assistant',
                        content: reply
                    });
                    dtSave();
                })
                .catch(function() {
                    removeTypingIndicator();
                    var reply = getDemoMentorReply(text);
                    appendMsg(reply, 'bot');
                    dtSave();
                });
        }

        function appendMsg(text, from) {
            var box = document.getElementById('chat-messages');
            if (!box) return;
            var div = document.createElement('div');
            div.className = 'chat-msg ' + from;
            div.innerHTML = text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
        }

        function showTypingIndicator() {
            var box = document.getElementById('chat-messages');
            if (!box) return;
            var div = document.createElement('div');
            div.className = 'chat-msg bot typing-indicator';
            div.id = 'typing-ind';
            div.innerHTML = '<span></span><span></span><span></span>';
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
        }

        function removeTypingIndicator() {
            var el = document.getElementById('typing-ind');
            if (el) el.remove();
        }

        function getDemoMentorReply(text) {
            var t2 = text.toLowerCase();
            var p = DT_STATE.profile;
            var a = p ? p.analysis : null;
            var name = p ? (p.name || 'friend') : 'friend';
            var domain = a ? a.domain : 'tech';
            var topRole = a ? a.topRole : 'your target role';
            var fieldLabel = a ? a.domainData.label : 'your field';

            /* ── SPORTS-SPECIFIC REPLIES ── */
            if (domain === 'sports') {
                if (t2.includes('roadmap') || t2.includes('plan') || t2.includes('start') || t2.includes('begin')) {
                    return 'Your sports roadmap is clear, ' + name + '! Here\'s the direct path:\n\n**Phase 1 (Months 1–6):** Physical foundation — base fitness, sport fundamentals, local competitions. Train 4–5 hrs/day.\n**Phase 2 (Months 7–18):** State/district level — get a qualified coach, enter state championships, apply to SAI National Centre.\n**Phase 3 (Months 19–36):** National/elite — national camp, trials, international exposure, sponsorship.\n\n🔑 Key: Consistency > intensity. Daily training beats occasional hard sessions every time.\n\n✅ Your action today: Set your 5:30 AM wake-up habit right now in the Habits tab.';
                }
                if (t2.includes('diet') || t2.includes('food') || t2.includes('eat') || t2.includes('nutrition')) {
                    return 'Nutrition is 40% of your athletic performance, ' + name + '. Here\'s your sports diet framework:\n\n🌅 **Breakfast:** Oats + milk + banana + 3 eggs (protein focus)\n🍎 **Mid-morning:** Fruits + nuts + protein shake\n🍽 **Lunch:** Rice + daal + 2 vegetables + curd + chicken/paneer\n⚡ **Pre-training:** Banana + peanut butter 45 min before\n🥗 **Dinner:** Roti + fish/chicken + salad\n\n💧 Hydration: 4–5 litres water daily. Non-negotiable.\n🚫 Avoid: Junk food, carbonated drinks, late-night meals.\n\n✅ Track your diet daily — nutrition log is a habit top athletes swear by.';
                }
                if (t2.includes('training') || t2.includes('practice') || t2.includes('workout') || t2.includes('exercise')) {
                    return 'Elite athletes train with precision, ' + name + '. Here\'s your training structure:\n\n🌅 **5:30 AM** — Wake up + hydration + 20 min yoga/stretch\n🏃 **7:00 AM** — Primary sport training with coach (2–3 hrs)\n😴 **12:00 PM** — Rest + nutrition + video analysis of your performance\n💪 **4:00 PM** — Strength & conditioning (1 hr focused)\n❄️ **6:00 PM** — Recovery: ice bath or foam rolling\n🌙 **9:00 PM** — Sleep by 10 PM (8–9 hrs is non-negotiable)\n\n✅ Add this routine to your Habits section. Track every day.';
                }
                if (t2.includes('college') || t2.includes('institution') || t2.includes('academy')) {
                    return 'For sports, ' + name + ', traditional colleges are secondary. Your priority institutions are:\n\n🏆 **SAI National Centre of Excellence** — Top choice, government-funded, direct pathway to national teams\n🎓 **LNIPE Gwalior** — Best for sports education, coaching, and physical education degrees\n⭐ **Inspire Institute of Sport (JSW)** — World-class private facility in Bellary\n\nCheck the **Colleges tab** for full details on each — placement rates, facilities, and how to get in.\n\n✅ Contact your state Sports Authority first — they fund talented athletes to reach these institutes.';
                }
                if (t2.includes('salary') || t2.includes('earn') || t2.includes('money') || t2.includes('income')) {
                    return 'Sports earnings in India have multiple streams, ' + name + ':\n\n💰 **Government job (railway/army):** ₹3–8 LPA + lifetime security\n🏏 **BCCI contracts (cricket):** Grade A = ₹7 Cr/year\n🎯 **Olympic medal:** ₹50L–₹6 Cr prize + state rewards\n📱 **Brand endorsements (after fame):** ₹50L–₹20 Cr+/year\n🏫 **Coaching after career:** ₹4–15 LPA\n\nHonest truth: first 5 years are about building reputation, not money. Government sports quota jobs give stability while you build your career.\n\n✅ Focus on performance — the money follows excellence, not the other way.';
                }
                if (t2.includes('motivat') || t2.includes('give up') || t2.includes('hard') || t2.includes('difficult') || t2.includes('discourag')) {
                    return 'Neeraj Chopra trained daily for 6 years before winning Olympic gold. P.V. Sindhu moved cities at age 8 for coaching. Every elite athlete you admire had moments exactly like this.\n\nThe difference between them and those who quit? They treated the hard days as part of the training — not a signal to stop.\n\n' + name + ', your body adapts to what you consistently demand from it. Mental resilience is a skill, just like technique.\n\n✅ Open the Habits tab right now. Mark one thing done today. That\'s the whole task.';
                }
                if (t2.includes('select') || t2.includes('trial') || t2.includes('national') || t2.includes('team')) {
                    return 'Getting selected for national teams requires a systematic approach, ' + name + ':\n\n📋 **Step 1:** Dominate at district level first. National selectors notice district champions.\n🏆 **Step 2:** State championship podium. This gets you into the visibility pool.\n📞 **Step 3:** Apply to SAI coaching centres — they track performers.\n💪 **Step 4:** Have a coach who has national-level connections. Coaching network matters.\n📹 **Step 5:** Record your best performances — selectors increasingly review video.\n\n✅ Focus on winning your next local/district competition. National selection is built one win at a time.';
                }
                return 'Great question about your sports journey, ' + name + '! As a future ' + topRole + ', every day of disciplined training compounds.\n\nYour roadmap, diet plan, and training schedule are all in the **Roadmap** tab. Your target institutions are in the **Colleges** tab.\n\nThe single most important thing: consistency over intensity. The athletes who make it aren\'t always the most talented — they\'re the most consistent.\n\n✅ What\'s your specific sport? Tell me and I\'ll give you more targeted advice.';
            }

            /* ── GAMING-SPECIFIC REPLIES ── */
            if (domain === 'gaming') {
                if (t2.includes('roadmap') || t2.includes('plan') || t2.includes('start')) {
                    return 'Gaming/esports roadmap for you, ' + name + ':\n\n**Phase 1:** Mechanics + consistency (aim, movement, game sense)\n**Phase 2:** Competitive exposure (scrims, local/online tournaments, VOD review)\n**Phase 3:** Career scale (org tryouts, creator branding, sponsorship opportunities)\n\nUse your **Roadmap** tab for exact phases and skills.\n\n✅ Action now: set one daily habit for ranked practice and one for VOD analysis.';
                }
                if (t2.includes('college') || t2.includes('institute') || t2.includes('academy')) {
                    return 'For gaming careers, your best path is skill + portfolio + tournament exposure.\n\nI\'ve listed relevant programs and institutes in the **Colleges** tab, including game-tech and esports ecosystem options.\n\n✅ Shortlist top 3 and start building one game/esports project portfolio this month.';
                }
                if (t2.includes('salary') || t2.includes('income') || t2.includes('earn')) {
                    return 'Gaming career income has multiple streams:\n\n1. Esports contracts + prize pools\n2. Streaming/content revenue\n3. Sponsorships/brand deals\n4. Game dev/design jobs in studios\n\nYour roadmap salary band is in the **Roadmap** tab and improves quickly with consistent performance + audience growth.\n\n✅ Focus on both skill progression and personal brand from day one.';
                }
                return 'Great direction, ' + name + '! Since your profile is in gaming/esports, your best growth formula is: practice quality + tournament exposure + content consistency.\n\nI can help you with role-specific prep (pro player, game dev, creator, analyst).\n\n✅ Tell me your target role and game title; I\'ll give a 30-day focused plan.';
            }

            /* ── GENERIC DOMAIN REPLIES ── */
            if (t2.includes('roadmap') || t2.includes('plan') || t2.includes('start')) {
                return 'For ' + topRole + ', ' + name + ', your roadmap has clear phases:\n\n**Phase 1:** Build the foundation — core skills, 1 real project, understand the domain deeply.\n**Phase 2:** Go deep — specialise, build a portfolio that shows impact, not just completion.\n**Phase 3:** Industry exposure — internships, networking, job applications with strong resume.\n\n📍 Your full phase breakdown with specific timelines is in the **Roadmap** tab.\n\n✅ Right now: Identify the ONE skill you\'ll work on for the next 30 days. Set a daily 30-min habit for it.';
            }
            if (t2.includes('motivat') || t2.includes('sad') || t2.includes('discourag') || t2.includes('give up')) {
                return 'Every successful person in ' + fieldLabel + ' went through exactly this phase, ' + name + '. The difference is they kept showing up on the days it felt impossible.\n\nYou\'re not behind. You\'re exactly where you\'re supposed to be given where you started.\n\nProgress in ' + fieldLabel + ' is non-linear — it feels flat for months, then suddenly jumps. You\'re in the flat phase. The jump is coming.\n\n✅ One thing right now: Open your Habits section and mark one thing done today. Small wins compound.';
            }
            if (t2.includes('college') || t2.includes('admiss') || t2.includes('entrance') || t2.includes('university')) {
                return 'For ' + fieldLabel + ', I\'ve curated the best colleges specifically for your goals in the **Colleges** tab, ' + name + '.\n\nEach entry includes: WHY it\'s the best fit for you, placement rates, average packages, and the exact admission route.\n\n✅ Go to Colleges tab now → shortlist your top 3 → start working backward from their admission requirements.';
            }
            if (t2.includes('salary') || t2.includes('earn') || t2.includes('package') || t2.includes('money') || t2.includes('lpa')) {
                return 'Salary for **' + topRole + '**: **' + (a ? a.salaryRange : '₹5–30 LPA') + '**\n\nHonest breakdown:\n• Entry level (0–2 yrs): lower range\n• Mid-level (3–5 yrs): middle range\n• Senior/specialist (5+ yrs): upper range\n\nThe top 20% earners in any field have ONE thing in common: **demonstrable work that shows impact**. Not just degrees or certifications — actual work with measurable results.\n\n✅ Your goal: Build one project this month that shows real impact. That one thing will do more for your salary than any certificate.';
            }
            if (t2.includes('skill') || t2.includes('learn') || t2.includes('how to') || t2.includes('gap')) {
                return 'Your priority skills for ' + topRole + ' are: **' + (a ? (a.requiredSkills || []).slice(0, 3).join(', ') : 'core domain skills') + '**\n\nThe most effective learning approach: **30 minutes of deliberate daily practice > 3 hours of passive watching**.\n\nFree resources for each skill are listed in your **Roadmap** tab with specific platforms and courses.\n\n✅ Pick ONE skill from the list. Set a 30-min daily habit in the Habits tab. Review progress weekly.';
            }
            if (t2.includes('intern') || t2.includes('job') || t2.includes('apply') || t2.includes('placement')) {
                return 'For internships in ' + fieldLabel + ', ' + name + ':\n\n1. **Internshala** — Highest volume for India, apply to 8–10/day\n2. **LinkedIn Jobs** — Filter by "Internship" + "Entry Level" + your city\n3. **AngelList/Wellfound** — Startup roles, faster response\n4. **Direct company pages** — Less competition than job boards\n\nYour specific opportunities are curated in the **Opportunities** tab based on your profile.\n\n✅ Before applying: Your resume must show impact. Not "worked on X" — but "built X that achieved Y result." Update it in the Resume tab.';
            }
            return 'Good question, ' + name + '! Based on your profile in ' + fieldLabel + ', here\'s the most direct advice I can give:\n\nFocus on depth in one area rather than spreading across many. The professionals who succeed fastest are those who become genuinely excellent at one specific skill before branching out.\n\nYour complete roadmap, skills list, college recommendations, and opportunities are all available in the respective tabs.\n\n✅ What\'s the most pressing challenge in your career journey right now? Ask me specifically and I\'ll give you a direct answer.';
        }

        /* ── VOICE INPUT ────────────────────────────────────────────── */
        var voiceRec = null;
        var voiceActive = false;

        function toggleVoice() {
            var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR) {
                showToast('⚠️', t('voiceNotSupported'));
                return;
            }
            if (voiceActive) {
                if (voiceRec) voiceRec.stop();
                voiceActive = false;
                var btn = document.getElementById('voice-btn');
                if (btn) btn.classList.remove('listening');
                return;
            }
            voiceRec = new SR();
            voiceRec.continuous = false;
            voiceRec.interimResults = false;
            voiceRec.lang = DT_STATE.lang === 'hi' ? 'hi-IN' : (DT_STATE.lang === 'ta' ? 'ta-IN' : 'en-IN');
            voiceRec.onresult = function(e) {
                var transcript = e.results[0][0].transcript;
                var inp = document.getElementById('chat-input');
                if (inp) {
                    inp.value = transcript;
                    sendChatMsg();
                }
                voiceActive = false;
                var btn = document.getElementById('voice-btn');
                if (btn) btn.classList.remove('listening');
            };
            voiceRec.onerror = function() {
                voiceActive = false;
                var btn = document.getElementById('voice-btn');
                if (btn) btn.classList.remove('listening');
                showToast('⚠️', 'Voice capture failed. Try again.');
            };
            voiceRec.onend = function() {
                voiceActive = false;
                var btn = document.getElementById('voice-btn');
                if (btn) btn.classList.remove('listening');
            };
            voiceRec.start();
            voiceActive = true;
            var btn = document.getElementById('voice-btn');
            if (btn) btn.classList.add('listening');
            showToast('🎤', t('voiceListening'));
        }

        /* ── NOTIFICATIONS ──────────────────────────────────────────── */
        function initNotifications() {
            if (!DT_STATE.notifications.length) {
                DT_STATE.notifications = NOTIFICATION_TEMPLATES.slice(0, 3).map(function(n, i) {
                    return {
                        id: 'n_' + i,
                        icon: n.icon,
                        msg: n.msg,
                        read: false,
                        ts: new Date().toISOString()
                    };
                });
                dtSave();
            }
        }

        function renderNotifications() {
            var container = document.getElementById('notif-list');
            if (!container) return;
            var unread = DT_STATE.notifications.filter(function(n) {
                return !n.read;
            });
            if (!DT_STATE.notifications.length) {
                container.innerHTML = '<div class="empty-state">✅ ' + t('noNotifications') + '</div>';
                return;
            }
            container.innerHTML = DT_STATE.notifications.map(function(n) {
                return '<div class="notif-item' + (n.read ? ' read' : '') + '" onclick="markNotifRead(\'' + n.id + '\')">' +
                    '<div class="notif-icon">' + n.icon + '</div>' +
                    '<div class="notif-body"><div class="notif-msg">' + n.msg + '</div>' +
                    '<div class="notif-time">' + new Date(n.ts).toLocaleDateString() + '</div></div>' +
                    '</div>';
            }).join('');

            var badge = document.getElementById('notif-badge');
            if (badge) {
                badge.style.display = unread.length ? 'flex' : 'none';
                badge.textContent = unread.length;
            }
        }

        function markNotifRead(id) {
            var n = DT_STATE.notifications.find(function(n) {
                return n.id === id;
            });
            if (n) {
                n.read = true;
                dtSave();
                renderNotifications();
            }
        }

        function markAllNotifRead() {
            DT_STATE.notifications.forEach(function(n) {
                n.read = true;
            });
            dtSave();
            renderNotifications();
        }

        /* ── MODAL SYSTEM ────────────────────────────────────────────── */
        function openModal(id) {
            var ov = document.getElementById('modal-overlay');
            var mod = document.getElementById('modal-' + id);
            if (ov) ov.classList.add('open');
            document.querySelectorAll('.modal').forEach(function(m) {
                m.classList.remove('open');
            });
            if (mod) mod.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(id) {
            var ov = document.getElementById('modal-overlay');
            if (ov) ov.classList.remove('open');
            document.querySelectorAll('.modal').forEach(function(m) {
                m.classList.remove('open');
            });
            document.body.style.overflow = '';
        }

        /* ── TOAST ───────────────────────────────────────────────────── */
        var toastQueue = [];
        var toastRunning = false;

        function showToast(icon, msg, type) {
            toastQueue.push({
                icon: icon,
                msg: msg,
                type: type || 'default'
            });
            if (!toastRunning) processToast();
        }

        function processToast() {
            if (!toastQueue.length) {
                toastRunning = false;
                return;
            }
            toastRunning = true;
            var item = toastQueue.shift();
            var t2 = document.getElementById('toast');
            var ic = document.getElementById('toast-icon');
            var msg = document.getElementById('toast-msg');
            if (!t2) {
                toastRunning = false;
                return;
            }
            if (ic) ic.textContent = item.icon;
            if (msg) msg.textContent = item.msg;
            t2.className = 'toast show toast-' + item.type;
            setTimeout(function() {
                t2.classList.remove('show');
                setTimeout(processToast, 300);
            }, 3000);
        }

        /* ── ONBOARDING ──────────────────────────────────────────────── */
        var selectedInterests = [];

        function updateInterestPreview() {
            var preview = document.getElementById('interest-preview');
            if (!preview) return;

            if (!selectedInterests.length) {
                preview.style.display = 'none';
                preview.textContent = '';
                return;
            }

            var domain = detectPrimaryDomain(selectedInterests);
            var domainData = CAREER_DOMAINS[domain] || CAREER_DOMAINS.tech;
            var role = getTopRoleFromInterests(domain, selectedInterests, domainData);
            var primaryLbl = DT_STATE.lang === 'hi' ? 'मुख्य मैच' : 'Primary Match';
            var roleLbl = DT_STATE.lang === 'hi' ? 'संभावित रोल' : 'Likely Role';

            preview.style.display = 'block';
            preview.innerHTML = '<strong>' + primaryLbl + ':</strong> ' + domainData.icon + ' ' + domainData.label +
                '<br><strong>' + roleLbl + ':</strong> ' + role;
        }

        function toggleInterest(id) {
            var idx = selectedInterests.indexOf(id);
            if (idx === -1) {
                selectedInterests.push(id);
            } else {
                selectedInterests.splice(idx, 1);
            }
            /* Update UI */
            document.querySelectorAll('.int-card').forEach(function(card) {
                var cardId = card.getAttribute('data-id');
                card.classList.toggle('selected', selectedInterests.indexOf(cardId) !== -1);
            });
            /* Enable/disable next button */
            var btn = document.getElementById('start-analyze-btn');
            if (btn) btn.disabled = selectedInterests.length === 0;
            updateInterestPreview();
        }

        async function startAnalysis() {
            var name = (document.getElementById('ob-name') || {}).value || '';
            var age = (document.getElementById('ob-age') || {}).value || '';
            var goal = (document.getElementById('ob-goal') || {}).value || '';
            var academic = document.querySelector('input[name="academic"]:checked');
            var academicVal = academic ? academic.value : 'somewhat';
            var skills = [];
            document.querySelectorAll('#ob-skills-tags .skill-tag').forEach(function(t) {
                skills.push(t.textContent.replace('×', '').trim());
            });

            if (selectedInterests.length === 0) {
                showToast('⚠️', 'Please select at least one interest');
                return;
            }

            /* Show analyzing screen */
            showView('analyzing');

            var statusEl = document.getElementById('analyzing-status');
            var barEl = document.getElementById('analyzing-bar');
            
            if (statusEl) statusEl.textContent = 'Connecting to Career Intelligence Engine...';
            if (barEl) barEl.style.width = '30%';

            try {
                // Build profile payload
                const profilePayload = {
                    name: name,
                    age: age,
                    goal: goal,
                    academicInterest: academicVal,
                    interests: selectedInterests,
                    skills: skills
                };

                const response = await fetch('/api/v1/analyzer/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(profilePayload)
                });

                if (barEl) barEl.style.width = '70%';
                if (statusEl) statusEl.textContent = 'Processing scenarios...';

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Analysis failed');
                }

                if (barEl) barEl.style.width = '100%';
                if (statusEl) statusEl.textContent = 'Complete!';

                setTimeout(function() {
                    DT_STATE.profile = profilePayload;
                    
                    // Generate local analysis for backward compatibility (charts, badges, roadmap structure)
                    // and merge with the new engine data
                    var localAnalysis = computeAnalysis(DT_STATE.profile);
                    
                    // MERGE NEW AI ENGINE RESULT WITH LOCAL ANALYSIS
                    if (result.primaryCareer) {
                        localAnalysis.topRole = result.primaryCareer.name;
                        localAnalysis.domain = result.primaryCareer.domain.toLowerCase();
                        localAnalysis.careerMatch = result.primaryCareer.matchPercentage || 50;
                        localAnalysis.requiredSkills = result.primaryCareer.missingSkills || [];
                        
                        if (result.actionPlan90Days) {
                            localAnalysis.phases = [
                                {
                                    title: result.actionPlan90Days.days1to30.focus,
                                    months: 'Month 1',
                                    desc: (result.actionPlan90Days.days1to30.tasks || []).join(', ')
                                },
                                {
                                    title: result.actionPlan90Days.days31to60.focus,
                                    months: 'Month 2',
                                    desc: (result.actionPlan90Days.days31to60.tasks || []).join(', ')
                                },
                                {
                                    title: result.actionPlan90Days.days61to90.focus,
                                    months: 'Month 3',
                                    desc: (result.actionPlan90Days.days61to90.tasks || []).join(', ')
                                }
                            ];
                        }
                        
                        if (result.institutions && result.institutions.length > 0) {
                            localAnalysis.colleges = result.institutions;
                        }
                    }
                    
                    // Attach backend results for new UI components
                    localAnalysis.backendEngine = result;
                    DT_STATE.profile.analysis = localAnalysis;
                    dtSave();
                    
                    awardBadge('first_login');
                    awardBadge('profile_done');
                    addXP(100, 'Profile created');
                    
                    renderAllViews();
                    showView('dashboard');
                    showMainNav();
                }, 500);
            } catch (err) {
                console.error(err);
                showToast('❌', err.message || 'Error occurred during analysis.');
                showView('onboarding');
            }
        }

        function showMainNav() {
            var nav = document.getElementById('main-nav');
            if (nav) nav.style.display = 'flex';
            var sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.style.display = 'flex';
        }

        function renderAllViews() {
            renderDashboard();
            renderBadges();
            renderNotifications();
        }

        /* ── SKILLS ONBOARDING INPUT ────────────────────────────────── */
        function addSkillTag() {
            var inp = document.getElementById('ob-skill-inp');
            if (!inp || !inp.value.trim()) return;
            var container = document.getElementById('ob-skills-tags');
            if (!container) return;
            var tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.innerHTML = inp.value.trim() + ' <button onclick="this.parentElement.remove()" style="background:none;border:none;cursor:pointer;color:inherit;font-size:.8rem;">×</button>';
            container.appendChild(tag);
            inp.value = '';
            if (DT_STATE.profile) {
                var count = container.querySelectorAll('.skill-tag').length;
                if (count >= 5) awardBadge('skill_5');
            }
        }

        /* ── CASE STUDIES ───────────────────────────────────────────── */
        function renderCaseStudies() {
            if (!DT_STATE.profile || !DT_STATE.profile.analysis) return;
            var domain = DT_STATE.profile.analysis.domain;
            var cases = {
                tech: [{
                        person: 'Sundar Pichai',
                        company: 'Google CEO',
                        path: 'IIT KGP → Wharton → Google Product → CEO',
                        lesson: 'Depth in one domain + strong communication = unmatched leadership.'
                    },
                    {
                        person: 'Kunal Shah',
                        company: 'CRED Founder',
                        path: 'Self-taught → Freecharge → CRED (₹6,000 Cr valuation)',
                        lesson: 'You don\'t need IIT to build unicorns. Execution beats pedigree.'
                    }
                ],
                gaming: [{
                        person: 'Naman "Mortal" Mathur',
                        company: 'S8UL Esports',
                        path: 'Competitive mobile gaming → national tournaments → pro org + creator ecosystem',
                        lesson: 'Consistent gameplay plus community building can turn esports into a long-term career.'
                    },
                    {
                        person: 'Animesh "Thug" Agarwal',
                        company: '8Bit / S8UL',
                        path: 'Player → Team owner → gaming ecosystem entrepreneur',
                        lesson: 'Gaming careers are not only about playing; operations, management, and media are huge growth paths.'
                    }
                ],
                sports: [{
                        person: 'Neeraj Chopra',
                        company: 'Olympic Gold (Javelin)',
                        path: 'Village boy → Army → SAI training → Olympic Gold',
                        lesson: '6 years of daily focused training transformed raw talent into gold.'
                    },
                    {
                        person: 'P.V. Sindhu',
                        company: 'Olympic Silver, World Champion',
                        path: 'Hyderabad → Gopichand Academy → World tour dominance',
                        lesson: 'Sacrificing comfort (moved city at age 8 for coaching) paid off for decades.'
                    }
                ],
                business: [{
                        person: 'Ritesh Agarwal',
                        company: 'OYO Founder',
                        path: 'Dropped out → Thiel Fellowship → OYO (₹70,000 Cr)',
                        lesson: 'Started at 19, no degree needed. The business was the education.'
                    },
                    {
                        person: 'Deepinder Goyal',
                        company: 'Zomato CEO',
                        path: 'IIT Delhi → Bain Consulting → Zomato (from food menu website)',
                        lesson: 'Solved a small problem he faced every day. That\'s how unicorns begin.'
                    }
                ],
                arts: [{
                        person: 'A.R. Rahman',
                        company: 'Oscar-winning Composer',
                        path: 'Chennai → Self-taught music → Roja → Oscar',
                        lesson: 'Obsessive craft + faith in your unique voice = global recognition.'
                    },
                    {
                        person: 'Priyanka Chopra',
                        company: 'Global Actor + Producer',
                        path: 'Miss India → Bollywood → Hollywood + Production company',
                        lesson: 'Reinvention and global ambition can take any career beyond its original ceiling.'
                    }
                ],
                healthcare: [{
                        person: 'Devi Shetty',
                        company: 'Narayana Health Founder',
                        path: 'Karnataka → UK training → \'Walmart of cardiac surgery\'',
                        lesson: 'Disrupted healthcare pricing so poor Indians could afford heart surgery.'
                    },
                    {
                        person: 'K. Sivan',
                        company: 'ISRO Chairman',
                        path: 'Tamil farmer\'s son → IIT → ISRO Chandrayaan lead',
                        lesson: 'CGPA means nothing compared to the depth of your curiosity and consistency.'
                    }
                ],
                finance: [{
                        person: 'Radhakishan Damani',
                        company: 'DMart Founder, ₹2 Lakh Cr',
                        path: 'Dropout → Stock market → DMart retail revolution',
                        lesson: 'Deep understanding of cash flow and frugality built a retail empire.'
                    },
                    {
                        person: 'Uday Kotak',
                        company: 'Kotak Mahindra Bank',
                        path: 'Gujarati family → MBA → Built India\'s best private bank',
                        lesson: 'Integrity + patience + deep financial knowledge = lasting wealth creation.'
                    }
                ],
                law: [{
                        person: 'Harish Salve',
                        company: 'Solicitor General, Kulbhushan Jadhav case',
                        path: 'NLS → Supreme Court bar → ICJ (won India\'s biggest international case)',
                        lesson: 'Legal excellence transcends national boundaries — one case can define a career.'
                    },
                    {
                        person: 'Vrinda Grover',
                        company: 'Human Rights Lawyer',
                        path: 'Delhi Law → Supreme Court → LGBTQ rights, Nirbhaya justice',
                        lesson: 'Law isn\'t just a career — it can be your instrument for social change.'
                    }
                ],
                civil: [{
                        person: 'Kiran Bedi',
                        company: 'First IPS Officer (woman)',
                        path: 'Delhi → UPSC → Prison reform → Tihar revolution → LG Puducherry',
                        lesson: 'Civil services is the most powerful tool for institutional change in India.'
                    },
                    {
                        person: 'Tukaram Mundhe',
                        company: 'IAS, viral district officer',
                        path: 'Ordinary background → UPSC → Changed Nagpur/Navi Mumbai development',
                        lesson: 'One honest IAS officer in the right place changes millions of lives.'
                    }
                ]
            };

            var container = document.getElementById('case-studies-grid');
            if (!container) return;
            var domainCases = cases[domain] || cases.tech;
            container.innerHTML = domainCases.map(function(cs) {
                return '<div class="case-card">' +
                    '<div class="case-person">' + cs.person + '</div>' +
                    '<div class="case-company">' + cs.company + '</div>' +
                    '<div class="case-path">🛤️ ' + cs.path + '</div>' +
                    '<div class="case-lesson">💡 ' + cs.lesson + '</div>' +
                    '</div>';
            }).join('');
        }

        /* ── SETTINGS ────────────────────────────────────────────────── */
        function renderSettings() {
            var langSel = document.getElementById('settings-lang-sel');
            if (langSel) langSel.value = DT_STATE.lang;

            var themeBtn = document.getElementById('theme-toggle-settings');
            if (themeBtn) themeBtn.textContent = DT_STATE.theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark';

            var profileEl = document.getElementById('settings-profile-name');
            if (profileEl && DT_STATE.profile) profileEl.textContent = DT_STATE.profile.name || 'Not set';

            var domainEl = document.getElementById('settings-domain');
            if (domainEl && DT_STATE.profile && DT_STATE.profile.analysis) {
                domainEl.textContent = DT_STATE.profile.analysis.domainData.label;
            }
        }

        function resetProfile() {
            if (confirm('Reset your profile? This will clear all your progress.')) {
                try {
                    localStorage.removeItem('dt_v2_state');
                } catch (e) {}
                window.location.reload();
            }
        }

        /* ── INIT ────────────────────────────────────────────────────── */
        document.addEventListener('DOMContentLoaded', function() {
            dtLoad();
            setTheme(DT_STATE.theme);
            applyI18n();
            initNotifications();

            /* Theme toggle */
            var themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

            /* Chat enter key */
            var chatInp = document.getElementById('chat-input');
            if (chatInp) {
                chatInp.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMsg();
                    }
                });
            }

            /* Skill onboarding enter key */
            var skillInp = document.getElementById('ob-skill-inp');
            if (skillInp) {
                skillInp.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        addSkillTag();
                    }
                });
            }

            /* Modal overlay close */
            var modOv = document.getElementById('modal-overlay');
            if (modOv) modOv.addEventListener('click', function(e) {
                if (e.target === this) closeModal();
            });

            /* Nav items */
            document.querySelectorAll('.nav-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    var viewId = this.getAttribute('data-view');
                    if (viewId) {
                        showView(viewId);
                        if (viewId === 'roadmap') renderRoadmap();
                        if (viewId === 'colleges') renderColleges();
                        if (viewId === 'heatmap') renderSkillHeatmap();
                        if (viewId === 'opportunities') renderOpportunities();
                        if (viewId === 'personality') renderPersonality();
                        if (viewId === 'peers') renderPeerComparison();
                        if (viewId === 'cases') renderCaseStudies();
                        if (viewId === 'settings') renderSettings();
                        if (viewId === 'notifications') renderNotifications();
                        if (viewId === 'habits') renderHabits();
                    }
                });
            });

            if (DT_STATE.profile && DT_STATE.profile.analysis) {
                if (!DT_STATE.profile.analysis.backendEngine) {
                    console.log("Legacy profile detected. Upgrading to new AI engine...");
                    showView('analyzing');
                    startAnalysis();
                } else {
                    renderAllViews();
                    showView('dashboard');
                    showMainNav();
                }
            } else {
                showView('onboarding');
                renderInterestGrid();
                renderHabitCatGrid();

                showMainNav();
            }

            /* Add XP bar animation delay */
            setTimeout(updateXPBar, 500);
        });


        /* ========== HELPERS ========== */
        /* ── HELPERS called from HTML onclick attributes ─────────────── */

        function renderInterestGrid() {
            var grid = document.getElementById('interest-grid');
            if (!grid) return;
            grid.innerHTML = INTEREST_OPTIONS.map(function(opt) {
                var isSelected = selectedInterests.indexOf(opt.id) !== -1;
                return '<div class="int-card' + (isSelected ? ' selected' : '') + '" data-id="' + opt.id + '" onclick="toggleInterest(\'' + opt.id + '\')">' +
                    '<div class="ic-icon">' + opt.icon + '</div>' +
                    '<div class="ic-label">' + opt.label + '</div>' +
                    '</div>';
            }).join('');

            var btn = document.getElementById('start-analyze-btn');
            if (btn) btn.disabled = selectedInterests.length === 0;
            updateInterestPreview();
        }

        function renderHabitCatGrid() {
            var grid = document.getElementById('habit-cat-grid');
            if (!grid) return;
            grid.innerHTML = HABIT_CATEGORIES.map(function(c) {
                return '<button class="cat-opt" onclick="selectHabitCat(\'' + c.id + '\',this)">' +
                    c.icon + ' ' + c.label + '</button>';
            }).join('');
            /* Select first by default */
            var first = grid.querySelector('.cat-opt');
            if (first) first.classList.add('selected');
        }

        function selectHabitCat(id, el) {
            document.querySelectorAll('.cat-opt').forEach(function(c) {
                c.classList.remove('selected');
            });
            el.classList.add('selected');
            var inp = document.getElementById('habit-cat-inp');
            if (inp) inp.value = id;
        }

        function quickChat(text) {
            var inp = document.getElementById('chat-input');
            if (inp) {
                inp.value = text;
                sendChatMsg();
            }
        }

        /* ── Build language selector options ─────────────────────────── */
        function buildLangSelector() {
            var sel = document.getElementById('lang-select');
            if (!sel) return;
            var langs = [
                ['en', 'English'],
                ['hi', 'हिंदी'],
                ['bn', 'বাংলা'],
                ['ta', 'தமிழ்'],
                ['te', 'తెలుగు'],
                ['mr', 'मराठी'],
                ['gu', 'ગુજરાતી'],
                ['kn', 'ಕನ್ನಡ'],
                ['ml', 'മലയാളം'],
                ['pa', 'ਪੰਜਾਬੀ'],
                ['ur', 'اردو'],
                ['or', 'ଓଡ଼ିଆ']
            ];
            sel.innerHTML = langs.map(function(l) {
                return '<option value="' + l[0] + '"' + (l[0] === DT_STATE.lang ? ' selected' : '') + '>' +
                    l[1] + '</option>';
            }).join('');
            sel.addEventListener('change', function() {
                setLang(this.value);
            });
        }

        /* ── Settings lang selector ──────────────────────────────────── */
        function initSettingsLang() {
            var sel = document.getElementById('settings-lang-sel');
            if (!sel) return;
            sel.value = DT_STATE.lang;
            sel.addEventListener('change', function() {
                setLang(this.value);
            });
        }

        /* ── Patch updateXPBar to sync dashboard secondary elements ─── */
        var _origUpdateXPBar = updateXPBar;
        updateXPBar = function() {
            _origUpdateXPBar();
            var l2 = document.getElementById('level-value2');
            var x2 = document.getElementById('xp-value2');
            var ln2 = document.getElementById('level-name2');
            if (l2) l2.textContent = DT_STATE.level;
            if (x2) x2.textContent = DT_STATE.xp;
            if (ln2) ln2.textContent = GAMIFICATION.levelNames[DT_STATE.level - 1] || '';
            /* Animate XP ring */
            var ring = document.getElementById('xp-ring');
            var ringLbl = document.getElementById('xp-ring-lbl');
            if (ring) {
                var thresholds = GAMIFICATION.levelThresholds;
                var lvl = DT_STATE.level;
                var cur = thresholds[lvl - 1] || 0;
                var nxt = thresholds[lvl] || thresholds[thresholds.length - 1];
                var pct = Math.max(0, Math.min(1, (DT_STATE.xp - cur) / (nxt - cur)));
                var circ = 163.4;
                ring.style.strokeDashoffset = circ - pct * circ;
            }
            if (ringLbl) ringLbl.textContent = DT_STATE.level;
        };

        /* ── DOMContentLoaded additional setup ──────────────────────── */
        document.addEventListener('DOMContentLoaded', function() {
            buildLangSelector();
            initSettingsLang();
        });
    

        /* ── NEW AI FEATURES ── */
        function renderExplainableCareerMatch() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.primaryCareer || !be.primaryCareer.explainableMatch) return;
            var container = document.getElementById('ai-explainable-match');
            if (!container) return;
            
            var match = be.primaryCareer.explainableMatch;
            container.innerHTML = '<div style="margin-top:0.8rem; line-height: 1.5; font-size: 0.9rem; color: #e2e8f0;">' +
                '<p>' + match.summary + '</p>' +
                '<div style="margin-top:0.8rem;">' +
                    '<strong style="color: var(--blue);">Why this fits you:</strong> ' + match.whyItFits +
                '</div>' +
                '<div style="margin-top:0.8rem;">' +
                    '<strong style="color: var(--orange);">Challenges to overcome:</strong> ' + match.challenges +
                '</div>' +
            '</div>';
        }

        function renderGoalAnalysis() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.goalAnalysis) return;
            var container = document.getElementById('ai-goal-analysis');
            if (!container) return;
            
            var ga = be.goalAnalysis;
            container.innerHTML = '<div style="margin-top: 0.8rem; font-size: 0.9rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 8px;">' +
                '<div style="margin-bottom: 0.5rem;"><strong style="color: #fff;">Feasibility:</strong> <span style="color: ' + (ga.feasibility === 'High' ? 'var(--blue)' : 'var(--orange)') + ';">' + ga.feasibility + '</span></div>' +
                '<div style="margin-bottom: 0.8rem; color: #cbd5e1;">' + ga.gapAnalysis + '</div>' +
                '<div style="font-size: 0.85rem; color: #94a3b8;">' +
                '<strong>Timeline:</strong> ' + ga.estimatedTimeline + '<br>' +
                '<strong>Pivot Options:</strong> ' + (ga.pivotOptions ? ga.pivotOptions.join(', ') : 'None') + 
                '</div></div>';
        }

        function renderAlternativeCareers() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.alternativeCareers) return;
            var container = document.getElementById('ai-alternative-careers');
            if (!container) return;
            
            if (be.alternativeCareers.length === 0) {
                container.innerHTML = '<div style="font-size:0.9rem; color:var(--mu);">No alternative careers matched.</div>';
                return;
            }

            container.innerHTML = be.alternativeCareers.map(ac => 
                '<div style="padding: 0.8rem; border-left: 3px solid var(--blue); background: rgba(255,255,255,0.03); margin-top: 0.5rem;">' +
                '<strong style="color: #e2e8f0;">' + ac.name + '</strong> <span style="font-size: 0.8rem; color: var(--mu);">(' + ac.type + ' - ' + ac.matchPercentage + '%)</span>' +
                '<div style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.3rem;">' + ac.reasonForRecommendation + '</div>' +
                '</div>'
            ).join('');
        }

        function renderActionPlan() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.actionPlan90Days) return;
            var container = document.getElementById('ai-action-plan');
            if (!container) return;
            
            var ap = be.actionPlan90Days;
            var buildPlan = function(title, data) {
                if (!data) return '';
                return '<div style="margin-bottom: 0.8rem;">' +
                    '<div style="font-weight: 600; color: var(--orange);">' + title + ': ' + data.focus + '</div>' +
                    '<ul style="margin: 0.2rem 0 0 0; padding-left: 1.2rem; font-size: 0.85rem; color: #cbd5e1;">' +
                    (data.tasks || []).map(t => '<li>' + t + '</li>').join('') +
                    '</ul></div>';
            };

            container.innerHTML = '<div style="padding: 1rem; border: 1px solid var(--bdr); border-radius: 8px; background: rgba(255,255,255,0.02); margin-top: 1rem;">' +
                '<h4 style="margin:0 0 0.8rem 0; color: #fff; font-size: 1.1rem;">Personalized 90-Day Action Plan</h4>' +
                buildPlan('Days 1-30', ap.days1to30) +
                buildPlan('Days 31-60', ap.days31to60) +
                buildPlan('Days 61-90', ap.days61to90) +
            '</div>';
        }

        function renderConfidenceIndicator() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.confidence || !be.dataQuality) return;
            var container = document.getElementById('ai-confidence');
            if (!container) return;
            
            container.innerHTML = '<div style="display: flex; gap: 1rem; font-size: 0.85rem; padding: 0.8rem; border-radius: 8px; background: rgba(255,255,255,0.05); margin-top: 1rem;">' +
                '<div><strong style="color:var(--mu)">Data Quality:</strong> <span style="color:var(--wh)">' + be.dataQuality.quality + '</span></div>' +
                '<div><strong style="color:var(--mu)">AI Confidence:</strong> <span style="color:var(--orange)">' + be.confidence.level + '</span></div>' +
                '<div style="flex:1; color:#94a3b8; text-align:right;">' + be.confidence.reason + '</div>' +
            '</div>';
        }

        function renderCompatibilityMatrix() {
            var be = DT_STATE.profile.analysis.backendEngine;
            if (!be || !be.careerCompatibility) return;
            var container = document.getElementById('ai-compatibility-matrix');
            if (!container) return;
            
            if (be.careerCompatibility.length === 0) {
                container.innerHTML = '';
                return;
            }

            var rows = be.careerCompatibility.map(c => 
                '<tr>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: #e2e8f0;">' + c.careerName + '</td>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: ' + (c.goalFit === 'High' ? 'var(--blue)' : 'var(--mu)') + ';">' + c.goalFit + '</td>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr);">' + c.skillFit + '</td>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr);">' + c.interestFit + '</td>' +
                '<td style="padding: 0.5rem; border-bottom: 1px solid var(--bdr);">' + c.overallCompatibility + '</td>' +
                '</tr>'
            ).join('');

            container.innerHTML = '<div style="margin-top: 1.5rem; overflow-x: auto;">' +
                '<h4 style="margin:0 0 0.5rem 0; color: #fff; font-size: 1.1rem;">Career Compatibility Matrix</h4>' +
                '<table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 0.85rem;">' +
                '<thead><tr>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Career</th>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Goal Fit</th>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Skill Fit</th>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Interest Fit</th>' +
                '<th style="padding: 0.5rem; border-bottom: 1px solid var(--bdr); color: var(--mu);">Overall</th>' +
                '</tr></thead>' +
                '<tbody>' + rows + '</tbody>' +
                '</table></div>';
        }
