import express from 'express'
import cors from 'cors'
import taskServices from './models/task-services.js'
import userServices from './models/user-services.js'
import taskRoutes from './routes/taskRouter.js'
import "./auth.js"
import { authenticateUser, loginUser2, registerUser } from './auth.js';
import  dotenv from "dotenv"
import mongoose from 'mongoose';
import userRoutes from './routes/userRouter.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 8001

app.use(cors())
app.use(express.json())
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

mongoose
    .connect(
        'mongodb+srv://csc-307-ta:csc307ta@csc-307-ta.j0i3u.mongodb.net/hashPassword?retryWrites=true&w=majority&appName=CSC-307-TA',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .catch((error) =>
        console.log('cant connect to mongodb\nERROR say:\n', error)
    );
// remove when cleaning code
// console.log(`process.env.SECRET_TOKEN`, process.env.TOKEN_SECRET)
// console.log(`process.env.MONGODB_URI`, process.env.MONGODB_URI)

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
app.post('/login', loginUser2, async (req, res) => {
    try {
        const user = req.user; // Access the validated user from `loginUser`

        // Send the successful login response
        res.status(200).json({
            userId: user._id, // MongoDB `_id`
            username: user.username,
            message: "Login successful",
        });
    } catch (error) {
        console.error("Error during login route handler:", error);
        res.status(500).json({ error: "An error occurred during login" });
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
//------leaderboard--------------------------------------
/*
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaderboard = await userServices.getLeaderboard();
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send('Error fetching leaderboard data.');
    }
});
*/
app.listen(process.env.PORT || port, () => {
    console.log('REST API is listening.')
})
