const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  try {
    const transcript = req.body.transcript;

    if (!transcript || transcript.trim() === "") {
      return res.status(400).json({
        error: "Transcript is required",
      });
    }

    const prompt = `
You are an expert psychology intern assistant analyzing DT Fellow supervisor feedback.

You must evaluate the Fellow using the following rules:

IMPORTANT RULES:
- Distinguish between task execution and systems building.
- A Fellow who only executes assigned tasks should NOT score above 6.
- Score 7 or above ONLY if there is evidence of:
  - identifying problems independently
  - systems building
  - creating tools, SOPs, workflows, trackers
  - expanding scope without instruction

Critical scoring boundary:
- Score 6 = reliable executor
- Score 7 = identifies problems beyond assigned tasks

You must identify:
1. Extracted Evidence
2. Rubric Score (1-10)
3. KPI Mapping
4. Gap Analysis
5. Suggested Follow-up Questions

Return ONLY valid JSON.

Use this exact JSON structure:

{
  "score": {
    "value": 0,
    "label": "",
    "justification": ""
  },
  "evidence": [
    {
      "type": "",
      "description": ""
    }
  ],
  "kpiMapping": [
    {
      "kpi": "",
      "evidence": ""
    }
  ],
  "gaps": [
    {
      "type": "",
      "description": ""
    }
  ],
  "followUpQuestions": [
    {
      "question": ""
    }
  ]
}

Transcript:
${transcript}
`;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.2",
        prompt,
        stream: false,
      }
    );

    const rawOutput = response.data.response;

    let parsed;

    try {
      parsed = JSON.parse(rawOutput);
    } catch (parseError) {
      console.log("JSON Parse Error:", parseError);

      return res.status(500).json({
        error: "Invalid JSON returned from model",
        raw: rawOutput,
      });
    }

    res.json(parsed);

  } catch (error) {
    console.log("Server Error:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});