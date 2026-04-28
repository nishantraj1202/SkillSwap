const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates a personalized project plan based on user preferences.
 */
exports.generateProject = async (req, res) => {
  const { domain, level, goal, techStack, mentorSupport } = req.body;

  if (!domain || !level || !goal) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: domain, level, or goal.",
    });
  }

  try {
    const prompt = `
      You are an expert software architect, mentor, and career advisor.
      Generate a personalized real-world project based on these preferences:
      - Domain: ${domain}
      - Difficulty Level: ${level}
      - Goal: ${goal}
      - Mentor Support: ${mentorSupport ? "Yes" : "No"}
      - Preferred Tech Stack: ${techStack ? techStack.join(", ") : "Not specified"}

      Return a JSON object with the following structure:
      {
        "title": "Realistic name",
        "problem": "Explain real-world problem",
        "importance": "Explain career growth value",
        "techStack": ["frontend", "backend", "database", etc],
        "features": ["feature 1", "feature 2", etc (5-8 items)],
        "roadmap": ["Step 1", "Step 2", etc],
        "timeline": "Estimated based on level",
        "resumeValue": "One-liner for resume",
        "recruiterInsight": "Why recruiters will like it"
      }

      Keep it practical, industry-relevant, and avoid generic projects like "Todo App".
      IMPORTANT: Return ONLY valid JSON.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const projectPlan = JSON.parse(chatCompletion.choices[0].message.content);

    res.status(200).json({
      success: true,
      data: projectPlan,
    });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate project plan.",
    });
  }
};

/**
 * Reviews a student project based on GitHub link or description.
 */
exports.reviewProject = async (req, res) => {
  const { githubUrl, description } = req.body;

  if (!githubUrl && !description) {
    return res.status(400).json({
      success: false,
      message: "Please provide a GitHub URL or a project description.",
    });
  }

  try {
    const prompt = `
      You are a senior software engineer reviewing a student project.
      Project Details: ${githubUrl ? "GitHub URL: " + githubUrl : "Description: " + description}

      Analyze the project based on:
      - Code Quality
      - Architecture
      - Real-world relevance
      - Scalability
      - Resume impact

      Return a JSON object with the following structure:
      {
        "score": 0-100,
        "strengths": ["strength 1", "strength 2", etc],
        "weaknesses": ["weakness 1", "weakness 2", etc],
        "improvements": ["improvement 1", "improvement 2", etc],
        "resumeFeedback": "How to present it better",
        "readiness": "Beginner" | "Ready" | "Strong Candidate"
      }

      Keep feedback practical and constructive.
      IMPORTANT: Return ONLY valid JSON.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const review = JSON.parse(chatCompletion.choices[0].message.content);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze project.",
    });
  }
};
