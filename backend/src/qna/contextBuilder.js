const fs = require("fs");
const path = require("path");

function buildContext(repoPath, relevantFiles) {
  return relevantFiles.map((item) => {
    const fullPath = path.join(repoPath, item.file);
    const content = fs.readFileSync(fullPath, "utf-8");

    return {
      file: item.file,
      score: item.score,
      content,
    };
  });
}

module.exports = {
  buildContext,
};