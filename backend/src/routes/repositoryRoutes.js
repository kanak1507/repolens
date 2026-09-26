const express = require("express");
const path = require("path");

const { scanRepository } = require("../analyzers/repositoryScanner");
const { analyzeArchitecture } = require("../analyzers/architectureAnalyzer");

const router = express.Router();

router.get("/scan", (req, res) => {
  const repoPath = path.join(__dirname, "../../../demo-repo");

  const result = scanRepository(repoPath);

  const architecture = analyzeArchitecture(result);

  res.json({
    ...result,
    architecture,
  });
});

module.exports = router;