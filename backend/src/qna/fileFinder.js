const fs = require("fs");
const path = require("path");

const ignoredDirectories = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
]);

function findRelevantFiles(repoPath, question) {
  const keywords = question
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^\w-]/g, ""))
    .filter((word) => word.length > 2);

  const relevantFiles = [];

  function scanDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      if (ignoredDirectories.has(item)) {
        continue;
      }

      const fullPath = path.join(currentPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        const relativePath = path.relative(repoPath, fullPath);

        const score = keywords.reduce((total, keyword) => {
          return total + (
            relativePath.toLowerCase().includes(keyword) ? 1 : 0
          );
        }, 0);

        if (score > 0) {
          relevantFiles.push({
            file: relativePath,
            score,
          });
        }
      }
    }
  }

  scanDirectory(repoPath);

  return relevantFiles.sort((a, b) => b.score - a.score);
}

module.exports = {
  findRelevantFiles,
};