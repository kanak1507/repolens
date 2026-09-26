const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json());

app.use("/users", userRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Demo API running on http://localhost:${PORT}`);
});