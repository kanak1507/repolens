const express = require("express");
const path = require("path");

const { scanRepository } = require("../analyzers/repositoryScanner");

const router = express.Router();

router.get("/scan", (req, res) => {
  const repoPath = path.join(__dirname, "../../../demo-repo");

  const result = scanRepository(repoPath);

  res.json(result);
});

module.exports = router;