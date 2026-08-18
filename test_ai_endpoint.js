require('dotenv').config();
const aiService = require('./src/services/aiService');

async function testGeneration() {
    console.log('Testing AI procedural generation directly via aiService...');
    const worldId = 'quantum-realm';
    const level = 2;
    const exploredTitles = ['Quantum Basics', 'Superposition'];
    
    let avoidStr = `\nCRITICAL: The user has already learned about the following topics:\n[${exploredTitles.join(', ')}]\nDo NOT generate any topic that is similar to these. Generate something completely NEW and UNIQUE.`;

    const systemPrompt = `You are the central AI intelligence of the Digital Twin Futureverse.
Generate a single new procedural deep dive node for the world sector: "${worldId}". The user is currently at Phase ${level}.${avoidStr}
The response MUST be a valid JSON object matching this schema exactly:
{
  "title": "A short, professional sci-fi/tech topic title (max 6 words)",
  "desc": "A brief 1-sentence description.",
  "content": "HTML string containing <h3>, <p>, and possibly <div class='bg-indigo-500/10 p-4 rounded-xl'> blocks. Focus on advanced, futuristic concepts related to the world.",
  "readTime": 4,
  "challenge": {
    "type": "mcq",
    "question": "A situational question based on the content.",
    "options": [
      { "id": "A", "text": "Wrong option 1", "correct": false },
      { "id": "B", "text": "Correct option", "correct": true },
      { "id": "C", "text": "Wrong option 2", "correct": false },
      { "id": "D", "text": "Wrong option 3", "correct": false }
    ],
    "why": "Explanation of why the correct option is right."
  }
}
Do NOT wrap the JSON in Markdown (like \`\`\`json). Return ONLY raw JSON.`;

    try {
        console.log('Sending message to AI...');
        const result = await aiService.sendMessages({
            system: systemPrompt,
            messages: [{ role: 'user', content: `Generate a node for ${worldId}.` }],
            max_tokens: 1500
        });

        if (result.error) {
            console.error('AI Service Error:', result.error);
            return;
        }

        let aiText = result.data.content[0].text;
        console.log('--- RAW AI OUTPUT ---');
        console.log(aiText);
        console.log('---------------------');
        
        let generatedNode;
        aiText = aiText.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        try {
            generatedNode = JSON.parse(aiText);
            console.log('Successfully used standard JSON.parse!');
        } catch (parseErr) {
            const firstBrace = aiText.indexOf('{');
            const lastBrace = aiText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                generatedNode = JSON.parse(aiText.substring(firstBrace, lastBrace + 1));
                console.log('Successfully used substring parser fallback!');
            } else {
                throw new Error("No JSON boundaries found");
            }
        }
        console.log('Successfully parsed JSON Node Title:', generatedNode.title);
        console.log('Test Passed!');
    } catch (e) {
        console.error('Test Failed:', e.message);
    }
}
testGeneration();
