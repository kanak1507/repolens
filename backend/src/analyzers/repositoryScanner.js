const fs = require("fs");
const path = require("path");

const languageMap = {
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".py": "Python",
  ".java": "Java",
  ".cpp": "C++",
  ".c": "C",
  ".html": "HTML",
  ".css": "CSS",
  ".json": "JSON",
  ".md": "Markdown",
};

const ignoredDirectories = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "coverage",
]);

function readPackageJson(repoPath) {
  const packagePath = path.join(repoPath, "package.json");

  if (!fs.existsSync(packagePath)) {
    return {
      dependencies: {},
      devDependencies: {},
    };
  }

  const packageData = JSON.parse(
    fs.readFileSync(packagePath, "utf-8")
  );

  return {
    dependencies: packageData.dependencies || {},
    devDependencies: packageData.devDependencies || {},
  };
}

function readReadme(repoPath) {
  const readmePath = path.join(repoPath, "README.md");

  if (!fs.existsSync(readmePath)) {
    return null;
  }

  return fs.readFileSync(readmePath, "utf-8");
}

function scanRepository(repoPath) {
  const files = [];
  const folders = [];
  const languages = {};

  function scanDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      if (ignoredDirectories.has(item)) {
        continue;
      }

      const fullPath = path.join(currentPath, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        folders.push(path.relative(repoPath, fullPath));
        scanDirectory(fullPath);
      } else {
        const relativePath = path.relative(repoPath, fullPath);

        files.push(relativePath);

        const extension = path.extname(item).toLowerCase();
        const language = languageMap[extension];

        if (language) {
          languages[language] =
            (languages[language] || 0) + 1;
        }
      }
    }
  }

  scanDirectory(repoPath);

  const packageInfo = readPackageJson(repoPath);
  const readme = readReadme(repoPath);

  return {
    projectName: path.basename(repoPath),
    fileCount: files.length,
    files,
    folders,
    languages,
    dependencies: packageInfo.dependencies,
    devDependencies: packageInfo.devDependencies,
    readme,
  };
}

module.exports = {
  scanRepository,
};