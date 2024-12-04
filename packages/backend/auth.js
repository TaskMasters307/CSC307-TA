import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userServices from './models/user-services.js'
import  dotenv from "dotenv"
dotenv.config()

export function registerUser(req, res, next) {
  const username = req.body.username; // from form
  const pwd = req.body.password  

  if (!username || !pwd) {
    res.status(400).send("Bad request: Invalid input data.");
  } else if (userServices.findOneAccount(username)) {
    res.status(409).send("Username already taken");
  } else {
    bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(pwd, salt))
      .then((hashedPassword) => {
        generateAccessToken(username).then((token) => {
          console.log("Token:", token);

          req.body.password = hashedPassword;
          console.log(`req.body.password`, req.body.password)
          //res.status(201).send({ token: token });
            next();

        });
      });
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
        if (error) {
          console.log("JWT error:", error);
          res.status(401).send("Unauthorized");
        } else {
          req.user = { _id: decoded.userId };
          next();
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
        const token = await generateAccessToken(username);
        res.status(200).send({ token: token});
      }
      else {
        console.log("password not matched")
        res.status(401).json({ error: 'Invalid username or password' });
      }

    }
  }

  catch(error) {
    res.send(`mongo findUerByName() error: ${error}`);
  }
    
   
    
    

  

 /* if (!retrievedUser) {
    // invalid username
    res.status(401).send("Unauthorized");
  }  else {
    bcrypt
      .compare(pwd, retrievedUser.hashedPassword)
      .then((matched) => {
        if (matched) {
          generateAccessToken(username).then((token) => {
            res.status(200).send({ token: token });
          });
        } else {
          // invalid password
          res.status(401).send("Unauthorized");
        }
      })
      .catch(() => {
        res.status(401).send("Unauthorized");
      });
  } */
}