import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "./user.js";
import "dotenv/config";

mongoose.set("debug", true);

mongoose
  .connect(
    "mongodb+srv://csc-307-ta:csc307ta@csc-307-ta.j0i3u.mongodb.net/user_list?retryWrites=true&w=majority&appName=CSC-307-TA",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .catch((error) =>
    console.log("Cannot connect to MongoDB\nError message:\n", error)
  );

// Generate JWT token
function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.TOKEN_SECRET, // Use a secret key stored in your .env file
    { expiresIn: "1d" } // Token valid for 1 day
  );
}

// Register a new user with hashed password
async function registerUser(username, password) {
  const existingUser = await findUserByName(username);
  if (existingUser) {
    throw new Error("Username already taken");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new userModel({ username, password: hashedPassword });
  await newUser.save();
  return generateAccessToken(newUser); // Return JWT token
}

// Log in an existing user by verifying password
async function loginUser(username, password) {
  const user = await findUserByName(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid username or password");
  }
  return generateAccessToken(user); // Return JWT token
}

// Get users based on username and/or password
function getUsers(username, password) {
  let promise;
  if (!username && !password) {
    promise = userModel.find();
  } else if (username && !password) {
    promise = findUserByName(username);
  } else if (!username && password) {
    promise = findUserByJob(password);
  } else if (username && password) {
    promise = findUserNameAndJob(username, password);
  }
  return promise;
}

// Find one user by username and password (for internal use)
async function findOneAccount(username, password) {
  if (!username || !password) {
    return null;
  }
  const user = await userModel.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
}

// Find a user by username
function findUserByName(username) {
  return userModel.findOne({ username });
}

// Find a user by job
function findUserByJob(job) {
  return userModel.find({ job });
}

// Find a user by ID
function findUserById(id) {
  return userModel.findById(id);
}

// Add a new user with hashed password
async function addUser(user) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);
  user.password = hashedPassword; // Replace plain password with hashed one
  const userToAdd = new userModel(user);
  return userToAdd.save();
}

// Find a user by username and job
function findUserNameAndJob(name, job) {
  return userModel.findOne({ name, job });
}

// Delete a user by ID
function deleteUser(id) {
  return userModel.findByIdAndDelete(id);
}

export default {
  addUser,
  getUsers,
  findUserById,
  findUserByName,
  findUserByJob,
  deleteUser,
  findOneAccount,
  registerUser,
  loginUser,
};
