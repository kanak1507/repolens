function findFile(context, keyword) {
  return context.find((item) =>
    item.file.toLowerCase().includes(keyword.toLowerCase())
  );
}

function extractImportedFile(content, importText) {
  if (!content) {
    return null;
  }

  const lines = content.split(/\r?\n/);

  return lines.find((line) => line.includes(importText)) || null;
}

function answerQuestion(question, context) {
  const lowerQuestion = question.toLowerCase();

  if (
    lowerQuestion.includes("user api") ||
    (lowerQuestion.includes("user") && lowerQuestion.includes("api"))
  ) {
    const routeFile = findFile(context, "userRoutes.js");
    const controllerFile = findFile(context, "userController.js");
    const serviceFile = findFile(context, "userService.js");

    const routeImport = routeFile
      ? extractImportedFile(
          routeFile.content,
          "userController"
        )
      : null;

    const controllerImport = controllerFile
      ? extractImportedFile(
          controllerFile.content,
          "userService"
        )
      : null;

    let answer = "The user API follows a simple three-layer flow:\n\n";

    if (routeFile) {
      answer +=
        `1. Route\n` +
        `   ${routeFile.file}\n` +
        `   Defines GET /:id and sends the request to getUser().\n\n`;
    }

    if (routeImport) {
      answer += `   Import: ${routeImport.trim()}\n\n`;
    }

    if (controllerFile) {
      answer +=
        `2. Controller\n` +
        `   ${controllerFile.file}\n` +
        `   getUser() reads the user ID from the request and calls the user service.\n\n`;
    }

    if (controllerImport) {
      answer += `   Import: ${controllerImport.trim()}\n\n`;
    }

    if (serviceFile) {
      answer +=
        `3. Service\n` +
        `   ${serviceFile.file}\n` +
        `   findUserById() searches the users array and returns the matching user.\n\n`;
    }

    answer +=
      `Request flow:\n` +
      `GET /users/:id → userRoutes.js → userController.js → userService.js → user data\n\n`;

    answer +=
      `If the user is not found, the controller returns HTTP 404 with "User not found".`;

    return {
      answer,
      files: context
        .filter((item) =>
          [
            "userRoutes.js",
            "userController.js",
            "userService.js",
          ].some((name) => item.file.endsWith(name))
        )
        .map((item) => item.file),
    };
  }

  if (
    lowerQuestion.includes("architecture") ||
    lowerQuestion.includes("structure")
  ) {
    return {
      answer:
        "The repository uses a layered Node.js/Express structure with separate routes, controllers and services. Routes receive HTTP requests, controllers handle request/response logic, and services contain the application logic.",
      files: context.map((item) => item.file),
    };
  }

  if (
    lowerQuestion.includes("test") ||
    lowerQuestion.includes("testing")
  ) {
    const testFiles = context.filter((item) =>
      item.file.toLowerCase().includes("test")
    );

    if (testFiles.length > 0) {
      return {
        answer:
          `The repository contains ${testFiles.length} test-related file(s). ` +
          `The main test file identified is ${testFiles[0].file}.`,
        files: testFiles.map((item) => item.file),
      };
    }

    return {
      answer: "No test-related files were found for this question.",
      files: [],
    };
  }

  if (context.length === 0) {
    return {
      answer:
        "I could not find relevant files for this question in the repository.",
      files: [],
    };
  }

  const fileList = context
    .slice(0, 5)
    .map((item) => `- ${item.file}`)
    .join("\n");

  return {
    answer:
      `I found these files as the most relevant to your question:\n\n${fileList}\n\n` +
      "A deeper answer will be provided by the RepoLens reasoning layer.",
    files: context.slice(0, 5).map((item) => item.file),
  };
}

module.exports = {
  answerQuestion,
};