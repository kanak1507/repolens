const path = require("path");

const { findRelevantFiles } = require("./fileFinder");

const repoPath = path.join(__dirname, "../../../demo-repo");

const question = "How does the user API work?";

const results = findRelevantFiles(repoPath, question);

console.log(results);