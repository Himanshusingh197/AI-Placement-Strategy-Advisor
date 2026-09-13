const { generateContent, parseAIResponse } = require('./geminiClient');

const recommendCareers = async ({ skills, cgpa, interests, desiredRole, experienceLevel, resumeSummary }) => {
  const prompt = `
You are an AI career advisor for college students. Based on the student profile below, recommend the top 5 most suitable career paths.

STUDENT PROFILE:
- Skills: ${skills.join(', ')}
- CGPA: ${cgpa || 'Not provided'}
- Interests: ${interests.join(', ')}
- Desired Role: ${desiredRole || 'Not specified'}
- Experience Level: ${experienceLevel}
- Resume Summary: ${resumeSummary || 'Not available'}

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "careerPaths": [
    {
      "role": "<Job Title>",
      "matchPercentage": <0-100>,
      "description": "<2 sentence description of this role>",
      "requiredSkills": ["<skill1>", "<skill2>", "<skill3>"],
      "currentStrengths": ["<matching strength1>", "<strength2>"],
      "missingSkills": ["<missing1>", "<missing2>"],
      "averageSalary": "<e.g. ₹6-12 LPA>",
      "growthProspect": "<High|Medium|Low>",
      "recommendedPath": ["<step1>", "<step2>", "<step3>"]
    }
  ],
  "topRecommendation": "<role name>",
  "summary": "<Overall career guidance in 2-3 sentences>"
}`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

module.exports = { recommendCareers };
