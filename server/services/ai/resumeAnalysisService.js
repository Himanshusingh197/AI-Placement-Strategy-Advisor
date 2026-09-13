const { generateContent, parseAIResponse } = require('./geminiClient');

const analyzeResume = async ({ resumeText, skills, targetRole, experienceLevel }) => {
  const prompt = `
You are an expert technical recruiter and career advisor. Analyze the following resume for a student targeting the role of "${targetRole}" with experience level "${experienceLevel}".

RESUME TEXT:
${resumeText}

STUDENT'S SELF-REPORTED SKILLS:
${skills.join(', ')}

Provide a comprehensive resume analysis. Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{
  "score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "skillGaps": ["<missing skill1>", "<missing skill2>", "<missing skill3>"],
  "extractedSkills": ["<skill found in resume1>", "<skill2>"],
  "recommendations": [
    "<specific actionable recommendation1>",
    "<specific actionable recommendation2>",
    "<specific actionable recommendation3>"
  ],
  "experienceLevel": "<fresher|beginner|intermediate|experienced>",
  "keyHighlights": ["<highlight1>", "<highlight2>"],
  "resumeQuality": {
    "formatting": <0-10>,
    "content": <0-10>,
    "relevance": <0-10>,
    "impact": <0-10>
  }
}`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

module.exports = { analyzeResume };
