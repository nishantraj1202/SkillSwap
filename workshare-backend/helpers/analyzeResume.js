/**
 * ─────────────────────────────────────────────
 *  WorkShare Backend — AI Resume Analyzer
 * ─────────────────────────────────────────────
 *  Sends the extracted resume text to OpenAI
 *  and returns a structured analysis:
 *    • score (0-100)
 *    • skills detected
 *    • strengths
 *    • weaknesses
 *    • suggestions for improvement
 */

const Groq = require("groq-sdk");

// Initialise the Groq client (reads GROQ_API_KEY from env)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Analyze resume text using Groq Llama 3.
 * @param {string} resumeText - Plain text extracted from the resume
 * @returns {Promise<Object>} - Structured analysis result
 */
const analyzeResume = async (resumeText) => {
  // Guard: don't send empty text to the API
  if (!resumeText || resumeText.length < 50) {
    throw new Error(
      "Resume text is too short or empty. Please upload a valid resume."
    );
  }

  const systemPrompt = `
You are an expert HR recruiter and resume analyzer.

Analyze the given resume carefully and provide a professional evaluation.

Your response MUST be in valid JSON format only (no extra text, no markdown, no code fences).

Return the following fields:

1. score (integer out of 100)
2. skills (array of detected technical and soft skills)
3. strengths (array of strong points in the resume)
4. weaknesses (array of missing or weak areas)
5. suggestions (array of actionable improvements)

Scoring Criteria:
- Skills relevance (30%)
- Projects and experience (25%)
- Education (15%)
- Resume structure and clarity (15%)
- Keywords and formatting (15%)

Guidelines:
- Be realistic in scoring (do not always give high scores)
- Identify actual skills from resume text
- Give meaningful and practical suggestions
- Keep responses concise and professional

Example Output:
{
  "score": 78,
  "skills": ["JavaScript", "React", "Node.js"],
  "strengths": ["Good project experience", "Strong frontend skills"],
  "weaknesses": ["Lack of backend experience", "No certifications"],
  "suggestions": ["Add backend projects", "Include certifications", "Improve formatting"]
}
  `.trim();

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: resumeText },
    ],
    response_format: { type: "json_object" }
  });

  // Extract the assistant's message
  const raw = response.choices[0].message.content.trim();

  // Parse the JSON response safely
  try {
    const analysis = JSON.parse(raw);

    // Validate expected shape
    return {
      score: Number(analysis.score) || 0,
      skills: Array.isArray(analysis.skills) ? analysis.skills : [],
      strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
      weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [],
    };
  } catch (parseError) {
    console.error("Failed to parse AI response:", raw);
    throw new Error("AI returned an invalid response. Please try again.");
  }
};

module.exports = analyzeResume;
