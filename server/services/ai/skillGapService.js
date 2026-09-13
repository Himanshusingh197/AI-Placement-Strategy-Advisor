const { generateContent, parseAIResponse } = require('./geminiClient');

const analyzeSkillGap = async ({ currentSkills, targetRole, experienceLevel }) => {
  const prompt = `
You are a senior software engineering hiring manager. Perform a detailed skill gap analysis for a student who wants to become a "${targetRole}" with current experience level: "${experienceLevel}".

CURRENT SKILLS:
${currentSkills.join(', ')}

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "requiredSkills": ["<skill1>", "<skill2>"],
  "missingSkills": ["<missing1>", "<missing2>"],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "currentLevel": "<none|beginner|intermediate|advanced|expert>",
      "requiredLevel": "<beginner|intermediate|advanced|expert>",
      "gap": "<none|low|medium|high>",
      "priority": "<low|medium|high|critical>"
    }
  ],
  "overallGapScore": <0-100, higher means bigger gap>,
  "recommendations": ["<recommendation1>", "<recommendation2>"],
  "estimatedTimeToReady": "<e.g. 3-6 months>",
  "topPrioritySkills": ["<skill1>", "<skill2>", "<skill3>"]
}`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

module.exports = { analyzeSkillGap };
