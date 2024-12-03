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
        res.status(400).send('Bad request: Invalid input data.')
    } else if (userServices.findOneAccount(username)) {
        res.status(409).send('Username already taken')
    } else {
        bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(pwd, salt))
            .then((hashedPassword) => {
                generateAccessToken(username).then((token) => {
                    console.log('Token:', token)

                    req.body.password = hashedPassword
                    console.log(`req.body.password`, req.body.password)
                    //res.status(201).send({ token: token });
                    next()
                })
            })
    }
}

function generateAccessToken(username) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username: username },
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' },
            (error, token) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(token)
                }
            }
        )
    })
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
    const username = req.body.username;
    const password = req.body.password;

    try {
        // Find user by username
        const findOne = await userServices.findUserByName(username);

        if (!findOne) {
            // User not found
            return res.status(404).json({ error: 'Invalid username or password' });
        }

        console.log('MongoDB found account:', findOne);

        // Compare hashed password
        const matchedPassword = await bcrypt.compare(password, findOne.password);

        if (matchedPassword) {
            console.log('Password matched');
            
            // Return user details and a token
            const token = await generateAccessToken(username);
            res.status(200).json({
                username: findOne.username,
                _id: findOne._id,
                token: token,
            });
        } else {
            console.log('Password did not match');
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
