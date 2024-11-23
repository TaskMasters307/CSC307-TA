//backend/models/user-services.js
import mongoose from 'mongoose'
import userModel from './user.js'
import 'dotenv/config'

mongoose.set('debug', true)

mongoose
    .connect(
        'mongodb+srv://csc-307-ta:csc307ta@csc-307-ta.j0i3u.mongodb.net/user_list?retryWrites=true&w=majority&appName=CSC-307-TA',
    )
    .then(() => console.log('Connected to MongoDB'))
    
    .catch((error) =>
        console.log('cant connect to mongodb\nERROR say:\n', error)
    )
 
//async functions for getting userstats from mongodb
async function getUserStats(username) {
    return await userModel.findOne(
        { username: username },
        { stats: 1, _id: 0 }
    )
}

async function updateUserStats(username, statsUpdate) {
    return await userModel.findOneAndUpdate(
        { username: username },
        { $set: { stats: statsUpdate } },
        { new: true }
    )
}

async function getUserTasks(username) {
    const user = await userModel.findOne({ username }, { tasks: 1 })
    return user ? user.tasks : []
}

async function addUserTask(username, task) {
    const user = await userModel.findOneAndUpdate(
        { username },
        { $push: { tasks: task } },
        { new: true }
    )
    return user ? user.tasks[user.tasks.length - 1] : null
}

async function updateUserTask(username, taskId, updates) {
    const user = await userModel.findOneAndUpdate(
        { username, 'tasks._id': taskId },
        { $set: { 'tasks.$': updates } },
        { new: true }
    )
    return user ? user.tasks.id(taskId) : null
}

function getUsers(username, password) {
    let promise
    if (username === undefined && password === undefined) {
        promise = userModel.find()
    } else if (username && !password) {
        promise = findUserByName(username)
    } else if (password && !username) {
        promise = findUserByJob(password)
    } else if (password && username) {
        promise = findUserNameAndJob(username, password)
    }
    return promise
}

function findOneAccount(username, password) {
    if (username === undefined || password === undefined) {
        return null
    } else {
        return userModel.findOne({ username: username, password: password })
    }
}

function findUserNameAndJob(name, job) {
    return userModel.findOne({ name: name, job: job })
}
function findUserById(id) {
    return userModel.findById(id)
}

async function addUser(user) {
    try {
        // Add initial stats
        const userToAdd = new userModel({
            ...user,
            stats: {
                totalPoints: 0,
                tasksCompleted: 0,
                currentStreak: 0,
                pointMultiplier: 1.0,
                globalRank: 0
            },
            tasks: []
        });
        console.log('Attempting to save user:', userToAdd);     
        const savedUser = await userToAdd.save();
        console.log('User saved successfully:', savedUser);
        return savedUser;
    } catch (error) {
        console.error('Error in addUser:', error);
        throw error;
    }
}

function findUserByName(username) {
    return userModel.findOne({ username: username })
}

function findUserByJob(job) {
    return userModel.find({ job: job })
}

function deleteUser(id) {
    return userModel.findByIdAndDelete(id)
}

export default {
    getUserStats,
    updateUserStats,
    addUser,
    getUsers,
    findUserById,
    findUserByName,
    findUserByJob,
    deleteUser,
    findOneAccount,
}