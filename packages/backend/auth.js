import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userServices from './models/user-services.js'
import  dotenv from "dotenv"
dotenv.config()


const creds = [];

export async function registerUser(req, res, next) {
  const username = req.body.username; // from form
  const pwd = req.body.password;

  if (!username || !pwd) {
    return res.status(400).send("Bad request: Invalid input data.");
  }

  try {
    const existingUser = await userServices.findUserByName(username);
    if (existingUser) {
      return res.status(409).send("Username already taken");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pwd, salt);

    req.body.password = hashedPassword; // Attach the hashed password for saving
    const newUser = await userServices.addUser(req.body); // Save the user to the database

    if (newUser) {
      const token = await generateAccessToken(username); // Optional: Generate a token
      console.log("Token:", token);

      // Send the user ID and token to the client
      return res.status(201).json({
        userId: newUser._id,
        message: "User registered successfully",
        token, // Optional
      });
    } else {
      res.status(500).send("Failed to create user.");
    }
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).send("Internal server error.");
  }
}



function generateAccessToken(username) {

  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
}

export function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token received");
    res.status(401).end();
  } else {
    console.log("verifying...")
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (error, decoded) => {
        if (decoded) {
          next();
        } else {
          console.log("JWT error:", error);
          res.status(401).end();
        }
      }
    );
  }
}


export async function loginUser(req, res, next) {
  const LoginUser = req.body;
  const username = req.body.username;
  console.log("LoginUser", LoginUser);
  try {
    const findOne =  await userServices.findUserByName(username);
    //console.log(findOne.password);
    if(!findOne) {
      res.status(404).send(`Mongo database not found ${loginUser}`);
    }
    else {
      console.log("mongo found account")

      const matchedPassword = await bcrypt.compare(req.body.password, findOne.password)
      if(matchedPassword) {
        console.log("password matched")
        res.status(201).send("password matched")
      }
      else {
        console.log("password not matched")
        res.ok = true
        res.message = "password not matched"
        console.log(res.message)
        res.body = "aslkdalskd"
        res.status(401).send()
      }

    }
  }

  catch(error) {
    res.send(`mongo findUerByName() error: ${error}`);
  }
 
}

export async function loginUser2(req, res, next) {
  const { username, password } = req.body;
  console.log("Received login request:", req.body);

  try {
      const findOne = await userServices.findUserByName(username);
      if (!findOne) {
          console.log("User not found:", username);
          return res.status(404).json({ error: "User not found" });
      }

      console.log("User found:", findOne);

      const matchedPassword = await bcrypt.compare(password, findOne.password);
      if (!matchedPassword) {
          console.log("Invalid password for user:", username);
          return res.status(401).json({ error: "Invalid password" });
      }

      console.log("Password matched for user:", username);
      req.user = findOne;
      next();
  } catch (error) {
      console.error("Error in loginUser middleware:", error);
      res.status(500).json({ error: "Internal server error" });
  }
}
