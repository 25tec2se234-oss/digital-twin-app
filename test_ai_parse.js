const assert = require('assert');

function parseAI(aiText) {
    const match = aiText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON object found');
    return JSON.parse(match[0]);
}

const mockResponse1 = \Here is your JSON response:
\\\json
{
  "title": "Quantum Routing",
  "desc": "Testing"
}
\\\\;

const mockResponse2 = \{
  "title": "Quantum Routing",
  "desc": "Testing"
}\;

const mockResponse3 = \Sure!
{
  "title": "Quantum Routing",
  "desc": "Testing"
}
Hope this helps!\;

try {
    const res1 = parseAI(mockResponse1);
    const res2 = parseAI(mockResponse2);
    const res3 = parseAI(mockResponse3);
    
    if (res1.title === 'Quantum Routing' && res2.title === 'Quantum Routing' && res3.title === 'Quantum Routing') {
        console.log('SUCCESS: All variations parsed correctly.');
    } else {
        console.log('FAILED: Titles do not match.');
    }
} catch (e) {
    console.log('FAILED: ', e);
}
