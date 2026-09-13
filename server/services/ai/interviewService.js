const { generateContent, parseAIResponse } = require('./geminiClient');

const generateInterviewQuestions = async ({ role, skills, type, count = 10 }) => {
  const prompt = `
You are a technical interviewer at a top tech company. Generate ${count} interview questions for a "${role}" position.

CANDIDATE SKILLS: ${skills.join(', ')}
INTERVIEW TYPE: ${type} (technical/hr/aptitude)

Return ONLY valid JSON (no markdown):
{
  "questions": [
    {
      "question": "<question text>",
      "category": "<DSA|OOP|DBMS|OS|CN|Web Development|Projects|HR|Aptitude>",
      "difficulty": "<easy|medium|hard>",
      "expectedKeyPoints": ["<key point1>", "<key point2>"]
    }
  ]
}`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

const evaluateAnswer = async ({ question, answer, role, category }) => {
  const prompt = `
You are a strict but fair technical interviewer evaluating a candidate's answer.

ROLE: ${role}
CATEGORY: ${category}
QUESTION: ${question}
CANDIDATE'S ANSWER: ${answer}

Evaluate the answer and return ONLY valid JSON (no markdown):
{
  "score": <0-10>,
  "feedback": "<detailed feedback on the answer>",
  "correctPoints": ["<what was correct1>", "<what was correct2>"],
  "missingPoints": ["<what was missing1>", "<what was missing2>"],
  "improvedAnswer": "<a brief ideal answer outline>",
  "verdict": "<excellent|good|average|poor>"
}`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

const generateInterviewFeedback = async ({ role, answers, scores }) => {
  const prompt = `
You are a career coach reviewing a completed mock interview for a "${role}" position.

INTERVIEW SCORES:
- Relevance: ${scores.relevance}/10
- Technical Accuracy: ${scores.technicalAccuracy}/10
- Communication: ${scores.communication}/10
- Completeness: ${scores.completeness}/10
- Overall: ${scores.overall}/10

Q&A SUMMARY:
${answers.map((a, i) => `Q${i + 1}: ${a.question}\nA: ${a.answer}\nScore: ${a.score}/10`).join('\n\n')}

Provide final interview feedback as ONLY valid JSON (no markdown):
{
  "strengths": ["<strength1>", "<strength2>", "<strength3>"],
  "weaknesses": ["<weakness1>", "<weakness2>"],
  "improvements": ["<improvement suggestion1>", "<improvement suggestion2>", "<improvement suggestion3>"],
  "summary": "<3-4 sentence overall assessment>",
  "readinessLevel": "<not ready|needs more preparation|almost ready|ready>"
}`;

  const text = await generateContent(prompt);
  return parseAIResponse(text);
};

module.exports = { generateInterviewQuestions, evaluateAnswer, generateInterviewFeedback };
