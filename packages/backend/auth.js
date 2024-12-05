import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userServices from './models/user-services.js'
import dotenv from 'dotenv'
dotenv.config()

const creds = []

export function registerUser(req, res, next) {
    const username = req.body.username // from form
    const pwd = req.body.password

    if (!username || !pwd) {
        res.status(400).send("Bad request: Invalid input data.");
    } else if (creds.find((c) => c.username === username)) {
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
                    creds.push({ username, hashedPassword });
                    next();
                });
            });
    }
}

export function generateAccessToken(username) {
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
    const authHeader = req.headers['authorization']
    //Getting the 2nd part of the auth header (the token)
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        console.log('No token received')
        res.status(401).end()
    } else {
        console.log('verifying...')
        jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
            if (decoded) {
                next()
            } else {
                console.log('JWT error:', error)
                res.status(401).end()
            }
        })
    }
}

export async function loginUser(req, res, next) {
    const LoginUser = req.body;
    const username = req.body.username;
    console.log("LoginUser", LoginUser);
    
    try {
        const findOne = creds.find((c) => c.username === username);
        
        if(!findOne) {
            res.status(404).send(`User not found ${loginUser}`);
        }
        else {
            console.log("User found in creds")
            
            const matchedPassword = await bcrypt.compare(req.body.password, findOne.hashedPassword)
            if(matchedPassword) {
                console.log("password matched")
                // Generate token here
                const token = await generateAccessToken(username);
                // Send token in response
                res.status(200).json({
                    message: "Login successful",
                    token: token
                });
            }
            else {
                console.log("password not matched")
                res.status(401).json({
                    message: "Invalid credentials"
                });
            }
        }
    }
    catch(error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: `Login error: ${error.message}`
        });
    }
}