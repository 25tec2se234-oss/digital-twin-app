const text = `
1. Technology & IT (150)
Backend Developer (Java) Graphics Programmer
Backend Developer (Python) Shader Artist
Backend Developer (Go) Technical Game Designer
Mobile App Developer (iOS) GIS Developer
Cross-Platform App Developer (React Native) Bioinformatics Software Engineer
Systems Programmer Payments Systems Engineer
AI Research Scientist AI Product Manager
VP of Engineering Chief Technology Officer
`;

const lines = text.trim().split('\n');
const careers = [];
lines.forEach(line => {
    line = line.trim();
    if (/^\d+\./.test(line)) return; // Skip categories for now
    
    // Attempt to split columns
    // We look for a lowercase letter (or closing parenthesis), a space, and an uppercase letter.
    // However, some titles have spaces followed by uppercase (e.g. "Backend Developer").
    // But columns usually have a single space separating them in this OCR text.
    // Actually, wait! "Backend Developer" matches [a-z] \s [A-Z].
    // So regex won't work well without a dictionary or knowing valid prefixes.
    
    console.log("Original: " + line);
});
