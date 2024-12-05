import express from 'express'
import cors from 'cors'
import userServices from './models/user-services.js'
import "./auth.js"
import { authenticateUser, loginUser, registerUser } from './auth.js';
import dotenv from "dotenv"
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express()
const port = process.env.PORT || 8001

app.use(cors())
app.use(express.json())

console.log(`process.env.SECRET_TOKEN`, process.env.TOKEN_SECRET)
console.log(`process.env.MONGODB_URI`, process.env.MONGODB_URI)

// Public routes (no authentication needed)
app.get('/', (req, res) => {
    res.send(`Hello World! ${process.env.MONGODB_URI}`)
})

app.post('/signup', registerUser, async (req, res) => {
    const savedUser = req.body
    try {
        await userServices.addUser(savedUser);
        const token = await generateAccessToken(savedUser.username);
        res.status(201).json({ 
            message: "Registration successful",
            token: token,
            user: {
                username: savedUser.username
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
})

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

app.post('/login', loginUser, async (req, res) => {
    // loginUser middleware handles the response
    // No need for additional logic here
})

// Protected routes (require authentication)
app.get('/users', authenticateUser, async (req, res) => {
    const name = req.query['username']
    const job = req.query['password']
    try {
        const result = await userServices.getUsers(name, job)
        res.json({ users_list: result })
    } catch (error) {
        console.log(error)
        res.status(500).send('An error occurred in the server.')
    }
})

app.get('/findaccount', authenticateUser, async (req, res) => {
    const username = req.query.username
    const password = req.query.password
    console.log(req.query)
    try {
        const result = await userServices.findOneAccount(username, password)
        if (result === null) {
            throw new Error('Could not find account')
        } else {
            res.status(201).send({ LoginStatus: true })
        }
    } catch (error) {
        console.log(error)
        res.status(404).send({ LoginStatus: false })
    }
})

app.get('/findusername', authenticateUser, async (req, res) => {
    const username = req.query['username']
    try {
        const result = await userServices.findUserByName(username)
        if (result) {
            res.status(200).send({ exists: true, message: 'account exist' })
        } else {
            res.status(201).send({ exists: false, message: 'account NOT exist' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('users/findusername has error')
    }
})

app.get('/users/:id', authenticateUser, async (req, res) => {
    const id = req.params['id']
    try {
        const result = await userServices.findUserById(id)
        if (!result) {
            res.status(404).send('Resource not found.')
        } else {
            res.send({ users_list: result })
        }
    } catch (error) {
        res.status(500).send('Error retrieving user')
    }
})

app.delete('/users/:id', authenticateUser, async (req, res) => {
    const id = req.params['id']
    try {
        const deleting = await userServices.deleteUser(id)
        if (deleting) {
            res.status(204).send()
        } else {
            res.status(404).send('404 no user found to delete')
        }
    } catch (error) {
        res.status(404).send('no user found to delete')
    }
})

app.listen(process.env.PORT || port, () => {
    console.log('REST API is listening.')
})