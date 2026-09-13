const { generateContent, parseAIResponse } = require('./geminiClient');

const recommendProjects = async ({ targetRole, skillGaps, currentSkills, experienceLevel }) => {
  const prompt = `
You are a senior developer mentoring a student who wants to become a "${targetRole}".

SKILL GAPS: ${skillGaps.join(', ')}
CURRENT SKILLS: ${currentSkills.join(', ')}
EXPERIENCE LEVEL: ${experienceLevel}

Recommend 6 practical portfolio projects. Return ONLY valid JSON (no markdown):
{
  "projects": [
    {
      "title": "<Project Name>",
      "description": "<2-3 sentence project description>",
      "difficulty": "<beginner|intermediate|advanced>",
      "technologies": ["<tech1>", "<tech2>", "<tech3>"],
      "skillsLearned": ["<skill1>", "<skill2>"],
      "expectedOutcome": "<what the student gains from this project>",
      "suggestedFeatures": ["<feature1>", "<feature2>", "<feature3>"],
      "estimatedTime": "<e.g. 1-2 weeks>",
      "githubTopics": ["<topic1>", "<topic2>"]
    }
  ]
}`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

const recommendCertifications = async ({ targetRole, skillGaps, experienceLevel }) => {
  const prompt = `
Recommend relevant certifications and learning resources for a student targeting the role of "${targetRole}".

SKILL GAPS: ${skillGaps.join(', ')}
EXPERIENCE LEVEL: ${experienceLevel}

Return ONLY valid JSON (no markdown):
{
  "certifications": [
    {
      "name": "<Certification Name>",
      "provider": "<e.g. Google, AWS, Meta, Microsoft>",
      "platform": "<Coursera|edX|Udemy|official site>",
      "url": "<actual URL>",
      "difficulty": "<beginner|intermediate|advanced>",
      "duration": "<e.g. 6 months>",
      "relevance": "<why this is relevant>",
      "free": <true|false>
    }
  ],
  "courses": [
    {
      "title": "<Course Name>",
      "platform": "<platform name>",
      "url": "<actual URL>",
      "duration": "<course duration>",
      "free": <true|false>,
      "relevance": "<why this course>"
    }
  ],
  "practiceResources": [
    {
      "name": "<Resource Name>",
      "url": "<actual URL>",
      "type": "<practice platform|documentation|tutorial>",
      "description": "<brief description>"
    }
  ]
}

Use REAL certification URLs from real providers.`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

module.exports = { recommendProjects, recommendCertifications };
