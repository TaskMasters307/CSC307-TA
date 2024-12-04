import express from 'express'
import cors from 'cors'


import userServices from './models/user-services.js'

import "./auth.js"
import { authenticateUser, loginUser, registerUser } from './auth.js';
import  dotenv from "dotenv"
dotenv.config()
const app = express()
const port = process.env.PORT || 8001

app.use(cors())
app.use(express.json())

console.log(`process.env.SECRET_TOKEN`, process.env.TOKEN_SECRET)
console.log(`process.env.MONGODB_URI`, process.env.MONGODB_URI)

app.get('/', (req, res) => {
    res.send(`Hello World! ${process.env.MONGODB_URI}`)
})

//  FIRST FETCH
app.get('/users', async (req, res) => {
    const name = req.query['username']
    const job = req.query['password']
    try {
        const result = await userServices.getUsers(name, job)
        console.log('app.get-result== ', result)
    } catch (error) {
        console.log(error)
        res.status(500).send('An error ocurred in the server.')
    }
})

app.get('/findaccount', async (req, res) => {
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

app.get('/findusername', async (req, res) => {
    const username = req.query['username']
    try {
        const result = await userServices.findUserByName(username)
        //console.log('backend result is === ', result)
        if (result) {
            res.status(200).send({ exits: true, message: 'account exist' })
        } else {
            res.status(201).send({ exits: false, message: 'account NOT exist' })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('users/findusername has error')
    }
})
app.get('/users/:id', async (req, res) => {
    const id = req.params['id']
    const result = await userServices.findUserById(id)
    if (result === undefined || result === null)
        res.status(404).send('Resource not found.')
    else {
        res.send({ users_list: result })
    }
})

app.get('/tasks/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const tasks = await taskServices.getTasksByUser(userId);
        res.status(200).send(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Error fetching tasks');
    }
});

//   ADD USER
app.post('/signup', registerUser, async (req, res, next) => {
    const savedUser = req.body
   // console.log(`/signup `, savedUser)
    userServices.addUser(savedUser);
    if (savedUser) res.status(201).send(savedUser)
    
    else res.status(500).end()
})
// LOGIN
app.post('/login', loginUser, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await userServices.findOneAccount(username, password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.status(200).json({
            userId: user._id, // MongoDB `_id`
            username: user.username,
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});




app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Replace this with your actual user authentication logic
        const user = await userServices.findOneAccount(username, password);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Include `userId` in the response
        res.status(200).json({
            userId: user._id, // MongoDB `_id` or equivalent unique user identifier
            username: user.username,
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});




//-------------delete-----------------
app.delete('/users/:id', async (req, res) => {
    const id = req.params['id'] //or req.params.id
    try {
        const deleting = await userServices.deleteUser(id)

        if (deleting) {
            res.status(204).send()
        } else {
            res.status(404).send('404 no user found to delete')
        }
    } catch {
        res.status(404).send('no user found to delete')
    }
})
//--------------------------------------------

app.listen(process.env.PORT || port, () => {
    console.log('REST API is listening.')
})
