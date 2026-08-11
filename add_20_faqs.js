const fs = require('fs');
const path = require('path');

const blogsPath = path.join(__dirname, 'src', 'data', 'blogs.json');
let blogs = JSON.parse(fs.readFileSync(blogsPath, 'utf8'));

const targetIndex = blogs.findIndex(b => b.slug === "how-to-use-ai-for-college-placements-and-interviews-2026");

if (targetIndex !== -1) {
    let blog = blogs[targetIndex];
    
    // We already have 3 FAQs. Let's provide 17 more to reach 20.
    const newFaqs = [
        {
            "question": "Which AI tools are best for checking ATS compatibility?",
            "answer": "Tools like Jobscan, ResumeWorded, and Teal are specifically built to check your resume against a job description. ChatGPT can also do this if you provide it with the right prompt."
        },
        {
            "question": "Is it cheating to use ChatGPT for cover letters?",
            "answer": "It is not cheating to use AI for structure and grammar, but submitting a 100% AI-generated cover letter without personalizing it is a bad idea. Recruiters can easily spot generic AI text. Always edit it to reflect your true voice."
        },
        {
            "question": "Can AI help me find hidden job opportunities?",
            "answer": "Yes, tools like Perplexity AI or ChatGPT with web access can scrape recent news articles to find companies that recently secured funding or announced expansions, indicating they will likely be hiring soon."
        },
        {
            "question": "How do I practice behavioral interviews with AI?",
            "answer": "You can use ChatGPT's Voice Mode or Google Gemini's voice features. Tell the AI to act as a strict hiring manager, ask you behavioral questions one by one, and grade your responses using the STAR format."
        },
        {
            "question": "Will companies use AI to interview me?",
            "answer": "Yes, in 2026, many companies use AI video interview platforms (like HireVue or Pymetrics) for the first round. These systems analyze your facial expressions, tone of voice, and keyword usage."
        },
        {
            "question": "How can I avoid sounding like a robot when using AI?",
            "answer": "Give the AI strict constraints in your prompt. Tell it: 'Use an enthusiastic but professional tone. Do not use words like delve, testament, or pivotal. Write at an 8th-grade reading level.'"
        },
        {
            "question": "What is the STAR method and can AI teach it to me?",
            "answer": "STAR stands for Situation, Task, Action, Result. It's the standard way to answer behavioral questions. You can ask AI to take your raw experience and rewrite it into a perfect STAR format bullet point."
        },
        {
            "question": "Can AI help me negotiate my salary?",
            "answer": "Absolutely. You can use AI to roleplay salary negotiation conversations. You can also ask AI to aggregate average salary data for your specific role, location, and experience level to give you a baseline."
        },
        {
            "question": "Are there AI tools for coding interview prep?",
            "answer": "Yes, AI coding assistants like GitHub Copilot, Cursor, and Codeium are great. You can also paste a LeetCode problem into ChatGPT and ask it to explain the optimal approach and time complexity before you write the code."
        },
        {
            "question": "Can I use AI to send automated cold emails?",
            "answer": "While technically possible, mass-sending automated AI emails often leads to being marked as spam. It is much more effective to use AI to draft highly personalized, targeted emails to a few key decision-makers."
        },
        {
            "question": "How do I use AI to research a company before an interview?",
            "answer": "Use Perplexity AI to search for the company's recent earnings calls, major challenges, new product launches, and biggest competitors. This gives you deep insights that you can bring up during the interview."
        },
        {
            "question": "Will recruiters penalize me for AI-generated resume bullet points?",
            "answer": "Recruiters penalize vagueness and lies. If an AI helps you write a highly specific, metrics-driven bullet point about a project you actually did, recruiters will love it. If the bullet point is fluffy and fake, you will be rejected."
        },
        {
            "question": "Can AI help me build a portfolio website?",
            "answer": "Yes! Tools like v0 by Vercel, Bolt.new, or Gamma can generate a fully functional, beautiful portfolio website in minutes just from a text description."
        },
        {
            "question": "How do I optimize my LinkedIn profile with AI?",
            "answer": "Copy your current LinkedIn headline and summary into an AI. Ask it to rewrite them to be more engaging, SEO-optimized for recruiters, and focused on your target job title."
        },
        {
            "question": "Is it safe to upload my resume to free AI tools?",
            "answer": "Be cautious with personal data. Remove your home address, phone number, and personal email before uploading your resume to free, public AI models, as they may use your data for training."
        },
        {
            "question": "What should I do if an AI mock interviewer gives me bad advice?",
            "answer": "AI can hallucinate. Always cross-reference technical advice with official documentation or trusted human mentors. Use AI for practice and structure, not as an absolute source of truth."
        },
        {
            "question": "Can AI help me decide which job offer to accept?",
            "answer": "Yes, you can input the details of multiple job offers (salary, benefits, commute time, company size, growth potential) into an AI and ask it to create a weighted comparison matrix to help you decide."
        }
    ];

    // Ensure blog.faq exists
    if (!blog.faq) {
        blog.faq = [];
    }

    // Add new FAQs if they aren't already there
    newFaqs.forEach(newFaq => {
        if (!blog.faq.some(f => f.question === newFaq.question)) {
            blog.faq.push(newFaq);
        }
    });

    fs.writeFileSync(blogsPath, JSON.stringify(blogs, null, 2));
    console.log("Successfully added 17 new FAQs. Total FAQs now: " + blog.faq.length);
} else {
    console.log("Blog not found.");
}
