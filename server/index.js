require("dotenv").config();
const express = require("express");
// const cors = require("cors");
const path = require("path");
const authRouter = require("./routes/auth");
const app = express();

app.use(express.static(path.join(__dirname, "../auth-app/dist")));
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../auth-app/dist/index.html"));
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
