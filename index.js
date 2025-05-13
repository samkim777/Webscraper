const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getSuggestions } = require("./chatbot");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
    const suggestions = await getSuggestions(prompt);
    res.json({ suggestions });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to generate suggestions." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
