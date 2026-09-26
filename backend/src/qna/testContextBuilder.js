const path = require("path");

const { findRelevantFiles } = require("./fileFinder");
const { buildContext } = require("./contextBuilder");

const repoPath = path.join(__dirname, "../../../demo-repo");

const question = "How does the user API work?";

const relevantFiles = findRelevantFiles(repoPath, question);

const context = buildContext(repoPath, relevantFiles);

console.log(JSON.stringify(context, null, 2));