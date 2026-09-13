const { generateContent, parseAIResponse } = require('./geminiClient');

const generateRoadmap = async ({ targetRole, currentSkills, missingSkills, experienceLevel }) => {
  const prompt = `
You are a senior software engineering mentor. Create a detailed, personalized learning roadmap for a student who wants to become a "${targetRole}".

STUDENT INFO:
- Experience Level: ${experienceLevel}
- Current Skills: ${currentSkills.join(', ')}
- Skills to Learn: ${missingSkills.join(', ')}

Create a 5-phase learning roadmap. Return ONLY valid JSON (no markdown) with this exact structure:
{
  "phases": [
    {
      "phaseNumber": 1,
      "phaseName": "Foundation",
      "description": "<what this phase covers>",
      "duration": "<e.g. 4 weeks>",
      "items": [
        {
          "topic": "<Topic Name>",
          "description": "<what to learn>",
          "priority": "<low|medium|high|critical>",
          "estimatedTime": "<e.g. 1 week>",
          "resources": [
            { "title": "<Resource Name>", "url": "<actual URL>", "type": "<video|article|course|documentation>" }
          ]
        }
      ]
    },
    {
      "phaseNumber": 2,
      "phaseName": "Core Skills",
      "description": "...",
      "duration": "...",
      "items": [...]
    },
    {
      "phaseNumber": 3,
      "phaseName": "Advanced Topics",
      "description": "...",
      "duration": "...",
      "items": [...]
    },
    {
      "phaseNumber": 4,
      "phaseName": "Projects & Portfolio",
      "description": "...",
      "duration": "...",
      "items": [...]
    },
    {
      "phaseNumber": 5,
      "phaseName": "Interview Preparation",
      "description": "...",
      "duration": "...",
      "items": [...]
    }
  ],
  "totalDuration": "<total estimated time>",
  "summary": "<2-3 sentence roadmap summary>"
}

Use REAL resource URLs from platforms like MDN, freeCodeCamp, GeeksforGeeks, LeetCode, Coursera, or official documentation.`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

module.exports = { generateRoadmap };
