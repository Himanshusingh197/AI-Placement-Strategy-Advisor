const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGeminiClient = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

// Current recommended model (as of Sep 2026)
const MODEL = 'gemini-3.6-flash';

const generateContent = async (prompt) => {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel(
      { model: MODEL },
      { apiVersion: 'v1beta' }
    );
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error(`AI service error: ${error.message}`);
  }
};

// Parse JSON safely from AI response
const parseAIResponse = (text) => {
  try {
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse AI response as JSON:', text.substring(0, 200));
    throw new Error('AI returned an invalid response format. Please try again.');
  }
};

module.exports = { generateContent, parseAIResponse };
