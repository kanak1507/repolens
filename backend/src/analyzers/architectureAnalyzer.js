function analyzeArchitecture(repository) {
  const insights = [];

  const folders = repository.folders.map((folder) =>
    folder.toLowerCase()
  );

  if (folders.some((folder) => folder.includes("controllers"))) {
    insights.push("The project uses a controller layer for handling requests.");
  }

  if (folders.some((folder) => folder.includes("services"))) {
    insights.push("The project uses a service layer for business logic.");
  }

  if (folders.some((folder) => folder.includes("routes"))) {
    insights.push("The project has a dedicated routing layer.");
  }

  if (folders.some((folder) => folder.includes("utils"))) {
    insights.push("The project contains utility/helper functions.");
  }

  if (folders.some((folder) => folder.includes("tests"))) {
    insights.push("The project contains automated tests.");
  }

  if (repository.dependencies.express) {
    insights.push("Express is used as the backend web framework.");
  }

  return insights;
}

module.exports = { analyzeArchitecture };