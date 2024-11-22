import express from "express";
import cors from "cors";
import 'dotenv/config';
import { authenticateUser, registerUser, loginUser } from "./models/auth.js";
import userServices from "./models/user-services.js";

// Access the secret key
const TOKEN_SECRET = process.env.TOKEN_SECRET;

if (!TOKEN_SECRET) {
  console.error("Missing TOKEN_SECRET in environment variables.");
  process.exit(1); // Exit if no token is found
}
const app = express();
const port = 8001;

app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.send(`Hello World! ${process.env.MONGODB_URI}`);
});

// User Registration (Sign-Up)
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await userServices.registerUser(username, password);
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await userServices.loginUser(username, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Protected: Get all users
app.get("/users", authenticateUser, async (req, res) => {
  try {
    const name = req.query["username"];
    const job = req.query["password"];
    const result = await userServices.getUsers(name, job);
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred in the server.");
  }
});

// Protected: Find a user by ID
app.get("/users/:id", authenticateUser, async (req, res) => {
  const id = req.params["id"];
  try {
    const result = await userServices.findUserById(id);
    if (!result) {
      res.status(404).send("Resource not found.");
    } else {
      res.status(200).send({ users_list: result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred.");
  }
});

// Protected: Add a new user
app.post("/adduser", authenticateUser, async (req, res) => {
  const user = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword; // Replace plain password with hashed password
    const savedUser = await userServices.addUser(user);
    if (savedUser) {
      res.status(201).send(savedUser);
    } else {
      res.status(500).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while adding the user.");
  }
});

// Protected: Delete a user by ID
app.delete("/users/:id", authenticateUser, async (req, res) => {
  const id = req.params["id"];
  try {
    const deleting = await userServices.deleteUser(id);
    if (deleting) {
      res.status(204).send();
    } else {
      res.status(404).send("No user found to delete.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while deleting the user.");
  }
});

// Protected: Check if a username exists
app.get("/findusername", authenticateUser, async (req, res) => {
  const username = req.query["username"];
  try {
    const result = await userServices.findUserByName(username);
    if (result) {
      res.status(200).send({ exists: true, message: "Account exists." });
    } else {
      res.status(404).send({ exists: false, message: "Account does not exist." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while checking the username.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
