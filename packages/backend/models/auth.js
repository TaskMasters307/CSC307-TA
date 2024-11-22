import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userServices from "./user-services.js";

const TOKEN_SECRET = process.env.TOKEN_SECRET || "your_secret_key";
import dotenv from "dotenv";
dotenv.config();

// Generate JWT Token
function generateAccessToken(username) {
  return jwt.sign({ username }, TOKEN_SECRET, { expiresIn: "1d" });
}

// Middleware to Authenticate User
export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token.");
    }
    req.user = user;
    next();
  });
}

// User Registration
export async function registerUser(req, res) {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).send("Invalid input.");
    }

    const existingUser = await userServices.findUserByName(username);
    if (existingUser) {
      return res.status(409).send("Username already taken.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = { username, password: hashedPassword };

    const savedUser = await userServices.addUser(newUser);
    const token = generateAccessToken(username);
    res.status(201).send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred during registration.");
  }
}

// User Login
export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await userServices.findUserByName(username);
    if (!user) {
      return res.status(401).send("Invalid username or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid username or password.");
    }

    const token = generateAccessToken(username);
    res.status(200).send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred during login.");
  }
}
