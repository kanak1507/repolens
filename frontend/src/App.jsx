import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [repository, setRepository] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/repository/scan")
      .then((response) => response.json())
      .then((data) => {
        setRepository(data);
      })
      .catch((error) => {
        console.error("Error fetching repository:", error);
        setError("Could not connect to RepoLens backend.");
      });
  }, []);

  async function askQuestion() {
    if (!question.trim()) {
      return;
    }

    setAsking(true);
    setAnswer(null);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/qna/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to ask question");
      }

      setAnswer(data);
    } catch (error) {
      console.error("Q&A error:", error);
      setError("Could not get an answer from RepoLens.");
    } finally {
      setAsking(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion();
    }
  }

  if (!repository) {
    return (
      <div className="loading">
        <h1>RepoLens</h1>
        <p>Analyzing repository...</p>

        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>RepoLens</h1>
        <p>
          Understand your codebase before you change it.
        </p>
      </header>

      {/* Q&A */}
      <section className="qna panel">
        <div className="qna-header">
          <div>
            <h2>Ask RepoLens</h2>
            <p>
              Ask questions about the codebase.
            </p>
          </div>
        </div>

        <div className="question-box">
          <textarea
            value={question}
            onChange={(event) =>
              setQuestion(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Example: How does the user API work?"
            rows="3"
          />

          <button
            onClick={askQuestion}
            disabled={asking || !question.trim()}
          >
            {asking ? "Analyzing..." : "Ask RepoLens"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {answer && (
          <div className="answer">
            <h3>RepoLens Answer</h3>

            <div className="answer-text">
              {answer.answer.split("\n").map((line, index) => (
                <p key={index}>
                  {line || "\u00A0"}
                </p>
              ))}
            </div>

            {answer.files && answer.files.length > 0 && (
              <div className="answer-files">
                <h4>Referenced Files</h4>

                {answer.files.map((file) => (
                  <div className="file-reference" key={file}>
                    📄 {file}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Project overview */}
      <section className="overview">
        <div className="card">
          <h3>Project</h3>
          <p>{repository.projectName}</p>
        </div>

        <div className="card">
          <h3>Files</h3>
          <p>{repository.fileCount}</p>
        </div>

        <div className="card">
          <h3>Folders</h3>
          <p>{repository.folders.length}</p>
        </div>
      </section>

      {/* Repository information */}
      <section className="grid">
        <div className="panel">
          <h2>Languages</h2>

          {Object.entries(repository.languages).map(
            ([language, count]) => (
              <p key={language}>
                <strong>{language}</strong> — {count} files
              </p>
            )
          )}
        </div>

        <div className="panel">
          <h2>Dependencies</h2>

          {Object.entries(repository.dependencies).map(
            ([name, version]) => (
              <p key={name}>
                <strong>{name}</strong> — {version}
              </p>
            )
          )}
        </div>

        <div className="panel">
          <h2>Dev Dependencies</h2>

          {Object.entries(repository.devDependencies).map(
            ([name, version]) => (
              <p key={name}>
                <strong>{name}</strong> — {version}
              </p>
            )
          )}
        </div>

        <div className="panel">
          <h2>Repository Structure</h2>

          <h4>Folders</h4>

          {repository.folders.map((folder) => (
            <p key={folder}>📁 {folder}</p>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section className="panel architecture">
        <h2>Architecture Insights</h2>

        {repository.architecture.map((insight) => (
          <p key={insight}>💡 {insight}</p>
        ))}
      </section>

      {/* Files */}
      <section className="panel">
        <h2>Files</h2>

        {repository.files.map((file) => (
          <p key={file}>📄 {file}</p>
        ))}
      </section>

      {/* README */}
      <section className="panel readme">
        <h2>README</h2>
        <pre>{repository.readme}</pre>
      </section>
    </div>
  );
}

export default App;