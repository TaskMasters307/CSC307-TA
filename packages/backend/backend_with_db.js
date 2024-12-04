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

//   ADD USER
app.post('/signup', registerUser, async (req, res, next) => {
    const savedUser = req.body
   // console.log(`/signup `, savedUser)
    userServices.addUser(savedUser);
    if (savedUser) res.status(201).send(savedUser)
    
    else res.status(500).end()
})
// LOGIN
app.post('/login',loginUser, async (req, res, next) => {
    const savedUser = req.body
    const username = req.body.username;
    const password = req.body.password;
    //res.send("sending from login/ ")
    //console.log(savedUser);
   
})

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

//user schema
//Create a new task for a user
app.post('/tasks', authenticateUser, async (req, res) => {
    const userId = req.user._id;
    const task = req.body;
    try {
        const savedUser = await userServices.createTask(userId, task);
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// Get all tasks for a user
app.get('/tasks', authenticateUser, async (req, res) => {
    const userId = req.user._id;
    try {
        const userWithTasks = await userServices.getUserTasks(userId);
        res.json(userWithTasks.tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

// Update a task
app.put('/tasks/:taskId', authenticateUser, async (req, res) => {
    const taskId = req.params.taskId;
    const updatedTask = req.body;
    try {
        const savedTask = await userServices.updateTask(taskId, updatedTask);
        res.json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/tasks/:taskId', authenticateUser, async (req, res) => {
    const taskId = req.params.taskId;
    try {
        await userServices.deleteTask(taskId);
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Update user statistics
app.put('/users/:userId/statistics', authenticateUser, async (req, res) => {
    const userId = req.params.userId;
    const statistics = req.body;
    try {
        const updatedUser = await userServices.updateUserStatistics(userId, statistics);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user statistics' });
    }
});

// Get user statistics
app.get('/users/:username/statistics', async (req, res) => {
    const username = req.params.username;
    try {
      const statistics = await userServices.getUserStatistics(username);
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve user statistics' });
    }
  });

app.listen(process.env.PORT || port, () => {
    console.log('REST API is listening.')
})
