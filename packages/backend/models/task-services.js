import mongoose from 'mongoose';
import Task from './task.js'; // Assuming the task model is defined in './task.js'
import 'dotenv/config';
import userServices from './user-services.js'

mongoose.set('debug', true);

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
    )

// **Task Services**

// Get a single task by ID
function getTaskById(taskId) {
    return Task.findById(taskId);
}

// Add a new task
function addTask(task) {
    const newTask = new Task(task);
    console.log('adding task: ', task)
    const promise = newTask.save()
    return promise;
}

// Update an existing task
function updateTask(taskId, updates) {
    return Task.findByIdAndUpdate(taskId, updates, { new: true });
}

async function getTasksByUser(userId) {
    try {
        // Validate the userId
        if (!mongoose.isValidObjectId(userId)) {
            throw new Error(`Invalid userId format: ${userId}`);
        }

        // Find tasks using userId
        const tasks = await Task.find({ userId });
        return tasks;
    } catch (error) {
        console.error('Error in getTasksByUser:', error.message);
        throw error; // Propagate the error to the caller
    }
}

async function handleTaskCompletion(taskId, isCompleted) {
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }

        // Points calculation based on priority
        const priorityPoints = {
            low: 10,
            medium: 15,
            high: 25
        };

        // Get user's current stats
        const user = await userServices.findUserById(task.userId);
        const pointsEarned = priorityPoints[task.priority] || 10;

        // Calculate streak
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const lastCompletion = user.statistics?.lastTaskCompletion
            ? new Date(user.statistics.lastTaskCompletion) 
            : null;
        let newStreak = user.statistics?.currentStreak || 0;
        if (isCompleted) {
            if (lastCompletion) {
                // If completing a task
                const lastCompletionDate = new Date(
                    lastCompletion.getFullYear(),
                    lastCompletion.getMonth(),
                    lastCompletion.getDate()
                );
                
                // Calculate days between last completion and today
                const daysDiff = Math.floor((today - lastCompletionDate) / (1000 * 60 * 60 * 24));

                if (daysDiff === 0) {
                    // Completion before due date, maintain streak
                    newStreak += 1;
                } else {
                    // More than one day gap, reset streak
                    newStreak = 1;
                }
            } else {
                newStreak = 1; //First ever task
            }
            // Calculate multiplier based on streak
            const multiplier = 1 + (Math.min(newStreak, 20) * 0.1); // Max 3x multiplier
            const totalPointsEarned = Math.round(pointsEarned * multiplier);

            // Update user stats
            await userServices.updateUserStats(task.userId, {
                totalPoints: (user.statistics?.totalPoints || 0) + totalPointsEarned,
                tasksCompleted: (user.statistics?.tasksCompleted || 0) + (isCompleted ? 1 : -1),
                currentStreak: newStreak,
                lastTaskCompletion: now
            });

            // Update task
            return await Task.findByIdAndUpdate(
                taskId,
                { isCompleted: true,
                    pointsAwarded: totalPointsEarned
                },
                { new: true }
            );
        } else {
            // Task is being uncompleted
            // Subtract the exact points that were awarded
            await userServices.updateUserStats(task.userId, {
                totalPoints: (user.statistics?.totalPoints || 0) - (task.pointsAwarded || 0),
                tasksCompleted: (user.statistics?.tasksCompleted || 0) - 1,
                currentStreak: newStreak, // Maintain streak logic
                lastTaskCompletion: lastCompletion
            });

            // Reset the points awarded when uncompleting
            return await Task.findByIdAndUpdate(
                taskId,
                { 
                    isCompleted: false,
                    pointsAwarded: 0 
                },
                { new: true }
            );
        }
    } catch (error) {
        console.error('Error in handleTaskCompletion:', error.message);
        throw error;
    }
}

async function findByIdAndUpdate(taskId, updates) {
    if ('isCompleted' in updates) {
        return await handleTaskCompletion(taskId, updates.isCompleted);
    }
    return await Task.findByIdAndUpdate(taskId, updates, { new: true });}

// Delete a task
async function deleteTask(taskId) {
    try {
        // Validate taskId
        if (!mongoose.isValidObjectId(taskId)) {
            throw new Error(`Invalid taskId format: ${taskId}`);
        }

        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            throw new Error('Task not found');
        }
        return deletedTask;
    } catch (error) {
        console.error('Error in deleteTask:', error.message);
        throw error;
    }
}

export default {
    getTasksByUser,
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
    findByIdAndUpdate,
    handleTaskCompletion
};
