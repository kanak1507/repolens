const express = require("express");
const cors = require("cors");

const repositoryRoutes = require("./routes/repositoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "RepoLens backend is running",
  });
});

app.use("/api/repository", repositoryRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`RepoLens backend running on http://localhost:${PORT}`);
});