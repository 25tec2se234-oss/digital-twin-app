const fs = require('fs');
const path = require('path');

const careersJsPath = path.join(__dirname, '..', 'public', 'js', 'data', 'careers.js');
let raw = fs.readFileSync(careersJsPath, 'utf8');

// Strip var CAREERS = and trailing ;
let jsonStr = raw.replace(/^var\s+CAREERS\s*=\s*/, '').replace(/;\s*$/, '');
let careers = JSON.parse(jsonStr);

let counts = {};

careers.forEach(c => {
    let t = c.title.toLowerCase();
    
    // Categorization Logic
    if (t.includes('doctor') || t.includes('physician') || t.includes('surgeon') || t.includes('nurse') || t.includes('therapist') || t.includes('medical') || t.includes('health') || t.includes('clinic') || t.includes('cardiologist') || t.includes('neurologist') || t.includes('oncologist') || t.includes('pathologist')) {
        c.stream = 'Healthcare & Medicine';
        c.icon = '⚕️';
    } 
    else if (t.includes('developer') || t.includes('programmer') || t.includes('software') || t.includes('ai') || t.includes('machine learning') || t.includes('data') || t.includes('cloud') || t.includes('network') || t.includes('cyber') || t.includes('web') || t.includes('app ') || t.includes('tech') || t.includes('it ')) {
        // Prevent generic "technician" from being pure IT
        if (t.includes('technician') && !t.includes('it')) {
            c.stream = 'Engineering & Hardware';
            c.icon = '⚙️';
        } else {
            c.stream = 'Technology & IT';
            c.icon = '💻';
        }
    }
    else if (t.includes('engineer') || t.includes('architect') || t.includes('robotics') || t.includes('mechanic') || t.includes('manufacturing') || t.includes('hardware')) {
        c.stream = 'Engineering & Hardware';
        c.icon = '⚙️';
    }
    else if (t.includes('design') || t.includes('artist') || t.includes('writer') || t.includes('creator') || t.includes('editor') || t.includes('director') || t.includes('photographer') || t.includes('animator') || t.includes('art') || t.includes('music') || t.includes('actor') || t.includes('choreographer') || t.includes('stylist')) {
        c.stream = 'Creative & Design';
        c.icon = '🎨';
    }
    else if (t.includes('manager') || t.includes('consultant') || t.includes('analyst') || t.includes('marketing') || t.includes('sales') || t.includes('hr') || t.includes('business') || t.includes('executive') || t.includes('finance') || t.includes('account') || t.includes('audit') || t.includes('strategy') || t.includes('founder') || t.includes('entrepreneur')) {
        c.stream = 'Business & Management';
        c.icon = '💼';
    }
    else if (t.includes('officer') || t.includes('inspector') || t.includes('army') || t.includes('police') || t.includes('government') || t.includes('civil') || t.includes('services') || t.includes('defense') || t.includes('lawyer') || t.includes('judge') || t.includes('court') || t.includes('legal') || t.includes('tax')) {
        c.stream = 'Government, Law & Defense';
        c.icon = '🏛️';
    }
    else if (t.includes('scientist') || t.includes('researcher') || t.includes('biologist') || t.includes('chemist') || t.includes('physicist') || t.includes('astronomer') || t.includes('geologist') || t.includes('academic') || t.includes('professor')) {
        c.stream = 'Science & Research';
        c.icon = '🔬';
    }
    else if (t.includes('teacher') || t.includes('tutor') || t.includes('instructor') || t.includes('educator') || t.includes('coach') || t.includes('trainer')) {
        c.stream = 'Education & Coaching';
        c.icon = '📚';
    }
    else {
        // If it was already set correctly, leave it. Otherwise fallback
        if (!c.stream || c.stream === 'Emerging & Diverse Fields') {
            c.stream = 'Emerging & Diverse Fields';
            c.icon = '💡';
        }
    }
    
    counts[c.stream] = (counts[c.stream] || 0) + 1;
});

console.log("Categorization results:");
console.log(counts);

let finalOut = "var CAREERS = " + JSON.stringify(careers, null, 4) + ";\n";
fs.writeFileSync(careersJsPath, finalOut, 'utf8');
console.log("Updated careers.js");
