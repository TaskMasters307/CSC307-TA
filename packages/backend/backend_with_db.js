import express from 'express'
import cors from 'cors'
import taskServices from './models/task-services.js';
import userServices from './models/user-services.js'
import User from './models/user.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Task from './models/task.js';

import './auth.js'
import { authenticateUser, loginUser, registerUser } from './auth.js'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
const port = 8001

app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    console.log('Incoming Request:', req.method, req.url, req.body);
    next();
});

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

// Get Tasks for a User
app.get('/tasks', async (req, res) => {
    const { userId } = req.query;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid User ID' });
    }

    try {
        const tasks = await Task.find({ userId });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

//   ADD USER
app.post('/tasks', async (req, res) => {
    const { title, date, priority, isCompleted, userId } = req.body;
    console.log('Incoming Task:', req.body); // Log incoming task

    try {
        const newTask = new Task({ title, date, priority, isCompleted, userId });
        const savedTask = await newTask.save();
        console.log('Saved Task:', savedTask); // Log saved task
        res.status(201).json(savedTask);
    } catch (error) {
        console.error('Error adding task:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            // If no user is found
            return res.status(404).json({ error: 'Account not found.' });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // If password does not match
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        // If login is successful
        res.status(200).json({
            username: user.username,
            _id: user._id, // Return user ID
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// Add Task
app.post('/tasks', async (req, res) => {
    const savedTask = req.body
    try {
        const newTask = await taskServices.addTask(savedTask);
        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'An error occurred while adding the task.' });
    }
});

// Update Task Completion Status
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid Task ID' });
    }

    try {
        const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
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

app.delete('/tasks/:id', async (req, res) => {
    const id = req.params['id'];
    try {
        await taskServices.deleteTask(id);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: error.message });
    }
});
//--------------------------------------------

app.listen(process.env.PORT || port, () => {
    console.log('REST API is listening.')
})
