const express = require("express");
const path = require("path");

const { findRelevantFiles } = require("../qna/fileFinder");
const { buildContext } = require("../qna/contextBuilder");
const { answerQuestion } = require("../qna/questionEngine");

const router = express.Router();

router.post("/ask", (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        error: "Question is required",
      });
    }

    const repoPath = path.join(__dirname, "../../../demo-repo");

    const relevantFiles = findRelevantFiles(
      repoPath,
      question
    );

    const context = buildContext(
      repoPath,
      relevantFiles
    );

    const result = answerQuestion(
      question,
      context
    );

    res.json({
      question,
      answer: result.answer,
      files: result.files,
    });
  } catch (error) {
    console.error("Q&A error:", error);

    res.status(500).json({
      error: "Failed to answer question",
    });
  }
});

module.exports = router;