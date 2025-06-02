require("dotenv").config();
const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path =  require("path")
const authRouter = express.Router();

const userFile = path.join(__dirname, ".." , "user.json");
const SECRET_KEY = process.env.SECRET_KEY;

function readUsers() {
  const data = fs.readFileSync(userFile);
  return JSON.parse(data);
}

function writeUsers(user) {
  fs.writeFileSync(userFile, JSON.stringify(user, null, 2));
}

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required!" });
  }

  const users = readUsers();
  const userExist = users.find((user) => user.username === username);
  if (userExist) {
    return res.status(400).json({ message: "User already exist" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hashedPassword };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json({ message: "User registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user." });
  }
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "username and password required!" });
  }

  const users = readUsers();
  const userFind = users.find((user) => user.username === username);

  if (!userFind) {
    return res.status(400).json({ message: "Invalid username or password." });
  }

  try {
    const isMatch = await bcrypt.compare(password, userFind.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username and password" });
    }

    // generate jwt token

    const token = jwt.sign(
      {
        id: userFind.id,
        username: userFind.username,

      },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({ token, username: userFind.username });
  } catch (error) {
    res.status(500).json({ message: "Error logging in." });
  }
});
module.exports = authRouter;
