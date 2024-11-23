//backend/backend_with_db.js
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import userServices from './models/user-services.js'

const app = express()
const port = 8001

const allowedOrigins = [
    'http://localhost:3000',
    'https://taskarena-hxd7fcczhcdgfnch.westus3-01.azurewebsites.net',
]

app.use(
    cors({
        origin: allowedOrigins, // Allow these origins
        methods: ['GET', 'POST', 'DELETE', 'PUT'], // Allowed HTTP methods
    })
)

app.use(express.json())

//  FIRST FETCH
app.get('/users', async (req, res) => {
    const { username, password } = req.query
    try {
        const result = await userServices.getUsers(username, password)
        console.log('Users retrieved: ', result)
        res.json(result)
    } catch (error) {
        console.log('Error getting users: ', error)
        res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving users.',
        })
    }
})

app.get('/findaccount', async (req, res) => {
    const username = req.query.username
    const password = req.query.password
    console.log('Finding account for: ', username)
    try {
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required.',
            })
        }
        const result = await userServices.findOneAccount(username, password)
        if (!result) {
            return res.status(404).json({
                LoginStatus: false,
                message: 'Invalid username or password',
            })
        } else {
            res.status(201).send({ LoginStatus: true })
        }
    } catch (error) {
        console.log('Login error: ', error)
        res.status(500).json({
            LoginStatus: false,
            message: 'An error occurred during login',
        })
    }
})

app.get('/findusername', async (req, res) => {
    const username = req.query['username']
    try {
        const result = await userServices.findUserByName(username)
        console.log('backend result is === ', result)
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
    try {
        const result = await userServices.findUserById(id)
        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }
        res.json({ users_list: result })
    } catch (error) {
        console.error('Error finding user by ID:', error)
        res.status(500).json({
            success: false,
            message: 'Error retrieving user',
        })
    }
})

//   ADD USER
app.post('/adduser', async (req, res) => {
    const user = req.body
    try {
        // Basic validation
        if (!user.username || !user.password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required',
            })
        }

        // Check if username already exists
        const existingUser = await userServices.findUserByName(user.username)
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists',
            })
        }

        const savedUser = await userServices.addUser(user)
        res.status(201).json(savedUser)
    } catch (error) {
        console.error('Error adding user:', error)
        res.status(500).json({
            success: false,
            message: 'Error creating user',
        })
    }
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

//get user stats
app.get('/user/:username/stats', async (req, res) => {
    const { username } = req.params
    try {
        const stats = await userServices.getUserStats(username)
        if (!stats) {
            res.status(404).json({ error: 'User not found' })
            return
        }
        res.json(stats)
    } catch (error) {
        console.error('Error fetching user stats:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

//update user stats
app.put('/user/:username/stats', async (req, res) => {
    const { username } = req.params
    const statsUpdate = req.body
    try {
        const updatedUser = await userServices.updateUserStats(username, statsUpdate)
        if (!updatedUser) {
            res.status(404).json({ error: 'User not found' })
            return
        }
        res.json(updatedUser.stats)
    } catch (error) {
        console.error('Error updating user stats:', error)
        res.status(500).json({ error: 'Server error' })
    }
})

//get user tasks
app.get('/user/:username/tasks', async (req, res) => {
    try {
        const tasks = await userServices.getUserTasks(req.params.username)
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' })
    }

})

// Add task
app.post('/user/:username/tasks', async (req, res) => {
    try {
        const newTask = await userServices.addUserTask(
            req.params.username,
            req.body
        )
        res.status(201).json(newTask)
    } catch (error) {
        res.status(500).json({ error: 'Failed to add task' })
    }
})

// Update task
app.put('/user/:username/tasks/:taskId', async (req, res) => {
    try {
        const updatedTask = await userServices.updateUserTask(
            req.params.username,
            req.params.taskId,
            req.body
        )
        res.json(updatedTask)
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' })
    }
})

//--------------------------------------------
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`)
    console.log(`Request body: ${JSON.stringify(req.body)}`)
    console.log(`Request query: ${JSON.stringify(req.query)}`)
    next()
})

app.listen(process.env.PORT || port, () => {
    console.log('REST API is listening.')
})
